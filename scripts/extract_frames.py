#!/usr/bin/env python3
"""
Extract a 64-frame circular head-rotation sprite set from character.mp4.

Why this exists
---------------
The hero renders the character's head following the cursor. Doing that by
seeking an MP4 at runtime is not viable: a generated MP4 typically carries a
single keyframe, so every `video.currentTime` assignment forces the decoder to
walk forward from frame 0. That stalls the main thread and stutters badly.

So the 360 degrees of head rotation is pre-baked into 64 still WebP frames
(5.625 degrees apart) plus a neutral `center.webp`. At runtime the renderer only
ever blits one already-decoded image onto a canvas.

How the head direction is measured
----------------------------------
The compass mapping is measured, not hand-picked, so re-rendering the source
video does not silently invalidate it.

Two approaches were tried and rejected first, recorded here so they are not
re-attempted:

  * Head-silhouette centroid. The outline barely moves when a real head turns:
    6.8px of horizontal spread against 3.3px vertical on a 1280x720 frame. Per
    axis standardisation then amplified the vertical noise into fabricated
    up/down angles, and the resulting path had no upper coverage at all.
  * Phase correlation of the head crop. Head rotation is not a translation, so
    the correlation peak is ambiguous: it reported shifts of -1270px on a 380px
    crop and dumped 146 of 240 frames into a single sector.

What works is dense optical flow from the neutral frame to each frame, taken
over the head region. Rotation shows up as coherent apparent feature motion,
which is exactly the signal wanted:

  1. Locate the subject by background subtraction, then the head box as the
     mask extent within the upper part of the subject.
  2. Farneback flow from the neutral reference to every frame, restricted to
     the head box.
  3. Median flow across the top 30% of motion magnitude. Median, not mean, so
     a few bad vectors cannot drag the estimate.
  4. Smooth the (dx, dy) series over 9 frames. A head moves continuously, so
     high-frequency content is noise; this drops the median angular step from
     6.6 to 3.6 degrees.
  5. Standardise each axis, then angle = atan2(dy, dx). Standardising matters
     because a head sweeps wider horizontally than vertically; without it the
     diagonals collapse toward horizontal.

Frame selection
---------------
For each of the 64 target angles, candidates within a tolerance window are
ranked by radius and the most committed pose wins, subject to a radius floor.
Nearest-angle alone is not enough: a frame sitting at the centre of the
trajectory has a numerically valid but meaningless angle, and an earlier version
of this script duly selected the neutral frame as UP-LEFT.

Angle convention, matching the browser
--------------------------------------
Screen coordinates: +x right, +y DOWN. So 0 degrees = looking RIGHT,
90 = DOWN, 180 = LEFT, 270 = UP. `atan2(dy, dx)` in CharacterCanvas.tsx uses
the same convention, so no conversion happens anywhere.

Outputs
-------
  public/frames/f00.webp .. f63.webp   one per 5.625 degrees
  public/frames/center.webp            neutral, direct eye contact
  public/frames/manifest.json          dimensions, bg colour, face pivot
  .agents/frames-contactsheet.jpg      8x8 grid, for visual verification
  .agents/frames-trajectory.jpg        measured path with the selections marked

Usage
-----
  .venv/bin/python scripts/extract_frames.py
  .venv/bin/python scripts/extract_frames.py --frames 64 --quality 92
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

try:
    import cv2
    import numpy as np
except ImportError:
    sys.exit(
        "Missing dependencies. Install into a venv (PEP 668 blocks system pip):\n"
        "  python3 -m venv .venv\n"
        "  .venv/bin/pip install opencv-python numpy\n"
        "then run this script with .venv/bin/python"
    )

ROOT = Path(__file__).resolve().parent.parent

# The source video is a build input, not a runtime asset: nothing fetches it in
# the browser, so keeping it in public/ would ship several MB for nothing.
# assets/ is preferred; public/ is accepted so this works before the move.
VIDEO_CANDIDATES = [
    ROOT / "assets" / "main_character.mp4",
    ROOT / "public" / "main_character.mp4",
    ROOT / "assets" / "character.mp4",
    ROOT / "public" / "character.mp4",
]
OUT_DIR = ROOT / "public" / "frames"
DIAG_DIR = ROOT / ".agents"

COMPASS = [
    ("RIGHT", 0.0),
    ("DOWN-RIGHT", 45.0),
    ("DOWN", 90.0),
    ("DOWN-LEFT", 135.0),
    ("LEFT", 180.0),
    ("UP-LEFT", 225.0),
    ("UP", 270.0),
    ("UP-RIGHT", 315.0),
]


def locate_video(override: str | None = None) -> Path:
    if override:
        path = Path(override)
        if not path.is_absolute():
            path = ROOT / path
        if not path.exists():
            sys.exit(f"Video not found: {path}")
        return path
    for candidate in VIDEO_CANDIDATES:
        if candidate.exists():
            return candidate
    sys.exit("No source video found. Looked in:\n" + "\n".join(f"  {p}" for p in VIDEO_CANDIDATES))


# --------------------------------------------------------------------------- io


def read_all_frames(path: Path) -> tuple[list[np.ndarray], float]:
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        sys.exit(f"Could not open {path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    frames = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        frames.append(frame)
    cap.release()

    if not frames:
        sys.exit("Decoded zero frames.")

    h, w = frames[0].shape[:2]
    print(f"  video      : {w}x{h}")
    print(f"  fps        : {fps:.3f}")
    print(f"  frames     : {len(frames)}")
    if fps:
        print(f"  duration   : {len(frames) / fps:.2f}s")
    return frames, fps


# ------------------------------------------------------------------ background


def detect_background(frames: list[np.ndarray]) -> tuple[np.ndarray, str]:
    """Most common colour among border pixels, sampled across the clip."""
    votes: Counter[tuple[int, int, int]] = Counter()
    for frame in frames[:: max(1, len(frames) // 24)]:
        h, w = frame.shape[:2]
        band = max(2, min(h, w) // 100)
        borders = np.concatenate(
            [
                frame[:band].reshape(-1, 3),
                frame[-band:].reshape(-1, 3),
                frame[:, :band].reshape(-1, 3),
                frame[:, -band:].reshape(-1, 3),
            ]
        )
        for bgr in ((borders // 4) * 4)[::37]:
            votes[tuple(int(c) for c in bgr)] += 1

    bgr = np.array(votes.most_common(1)[0][0], dtype=np.int16)
    hex_rgb = "#{:02x}{:02x}{:02x}".format(int(bgr[2]), int(bgr[1]), int(bgr[0]))
    print(f"  background : {hex_rgb}  (BGR {tuple(int(c) for c in bgr)})")
    return bgr, hex_rgb


def subject_mask(frame: np.ndarray, bg_bgr: np.ndarray, tol: int) -> np.ndarray:
    diff = np.abs(frame.astype(np.int16) - bg_bgr.reshape(1, 1, 3)).sum(axis=2)
    mask = (diff > tol * 3).astype(np.uint8) * 255
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    return cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)


def head_box(frames: list[np.ndarray], percentile: float, pad: float):
    """
    Locate the head as the region that moves, via a per-pixel temporal variance
    map over the whole clip.

    Background subtraction was tried first and does not work here: the backdrop
    is a radial gradient, not a flat colour, so differencing against a single
    sampled colour classifies the brighter centre of the background as subject
    and returns a box spanning almost the entire frame. Variance makes no colour
    assumption at all — the head is simply the thing whose pixels change.

    Returns (box, (face_x, face_y)) with the face centroid in pixels.
    """
    stack = np.stack([cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32) for f in frames])
    variance = stack.std(axis=0)

    threshold = np.percentile(variance, percentile)
    mask = (variance > threshold).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))

    count, _, stats, centroids = cv2.connectedComponentsWithStats(mask, 8)
    if count <= 1:
        sys.exit("Could not locate a moving head. Try a lower --head-percentile.")

    # Largest moving component is the head.
    i = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    x, y, bw, bh, _ = stats[i]
    face = (float(centroids[i][0]), float(centroids[i][1]))

    h, w = frames[0].shape[:2]
    px, py = int(bw * pad), int(bh * pad)
    box = (max(0, x - px), max(0, y - py), min(w, x + bw + px), min(h, y + bh + py))

    print(f"  variance   : threshold p{percentile:.0f} = {threshold:.1f}")
    print(f"  head box   : x {box[0]}-{box[2]}, y {box[1]}-{box[3]}  ({box[2]-box[0]}x{box[3]-box[1]})")
    print(f"  face pivot : ({face[0]:.0f}, {face[1]:.0f}) px")
    return box, face


# ------------------------------------------------------------- flow measurement


def crop_gray(frame: np.ndarray, box) -> np.ndarray:
    x0, y0, x1, y1 = box
    return cv2.cvtColor(frame[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)


def flow_series(grays: list[np.ndarray]) -> np.ndarray:
    """
    Head trajectory, by integrating optical flow between consecutive frames.

    Measuring flow from a single neutral reference to every frame was tried
    first and breaks down on clips with strong rotation: once the head reaches
    a full profile, the features visible in the frontal reference are simply
    gone, the flow estimate becomes meaningless, and the angle fit collapsed to
    R2 0.14 with a sweep of the wrong sign.

    Consecutive frames differ by a fraction of a degree of rotation, so each
    individual estimate is reliable; the cumulative sum recovers the path. On
    the current source this fits a straight line at R2 0.997.
    """
    velocity = [(0.0, 0.0)]
    for i in range(1, len(grays)):
        flow = cv2.calcOpticalFlowFarneback(grays[i - 1], grays[i], None, 0.5, 4, 25, 3, 7, 1.5, 0)
        mag = np.linalg.norm(flow, axis=2)
        keep = mag > np.percentile(mag, 75)
        if keep.sum() < 40:
            velocity.append((0.0, 0.0))
            continue
        velocity.append((float(np.median(flow[..., 0][keep])), float(np.median(flow[..., 1][keep]))))

    return np.cumsum(np.array(velocity, dtype=np.float64), axis=0)


def smooth(series: np.ndarray, window: int) -> np.ndarray:
    if window <= 1:
        return series
    kernel = np.ones(window) / window
    pad = window // 2
    padded = np.pad(series, (pad, pad), mode="edge")
    return np.convolve(padded, kernel, mode="same")[pad:-pad]


def polar(flow: np.ndarray, window: int):
    sx = smooth(flow[:, 0], window)
    sy = smooth(flow[:, 1], window)
    nx = (sx - sx.mean()) / (sx.std() or 1.0)
    ny = (sy - sy.mean()) / (sy.std() or 1.0)
    deg = (np.degrees(np.arctan2(ny, nx)) + 360.0) % 360.0
    return nx, ny, deg, np.hypot(nx, ny)


def fit_sweep(deg: np.ndarray, radius: np.ndarray, floor_pct: float, settle_start: int):
    """
    Fit angle = slope * frame + intercept across the turning span.

    The clip is one continuous sweep, so the true angle advances monotonically
    with time. Fitting that prior does two things the raw per-frame measurement
    cannot:

      * Guarantees a monotonic, jitter-free mapping. Raw angles wobble by a few
        degrees frame to frame, which shows up as the head twitching.
      * Spreads the selections evenly. At the measured ~2.37 deg/frame, one
        frame lands every 2.4 degrees, so all 64 slots get a distinct source.
        Selecting on raw angles collapsed 64 slots onto 38 frames, and the
        repeats are visible as the head sticking.

    Outliers are trimmed over a few iterations so a bad patch of flow cannot
    tilt the line.
    """
    index = np.arange(len(deg))
    span = radius >= np.percentile(radius, floor_pct)
    start = int(index[span].min())
    # The sweep runs until the head comes to rest. Using the radius floor for
    # the end cuts the span short — it drops as the head passes back near its
    # mean position — and a short span leaves part of the circle uncovered.
    end = settle_start - 1

    selected = index[(index >= start) & (index <= end)]
    unwrapped = np.degrees(np.unwrap(np.radians(deg[selected])))

    keep = np.ones(len(selected), dtype=bool)
    slope = intercept = 0.0
    for _ in range(4):
        slope, intercept = np.polyfit(selected[keep], unwrapped[keep], 1)
        residual = unwrapped - (slope * selected + intercept)
        sigma = residual[keep].std() or 1.0
        keep = np.abs(residual) <= 2.0 * sigma

    fitted = unwrapped[keep]
    predicted = slope * selected[keep] + intercept
    ss_res = float(((fitted - predicted) ** 2).sum())
    ss_tot = float(((fitted - fitted.mean()) ** 2).sum()) or 1.0
    r2 = 1.0 - ss_res / ss_tot

    print(f"  sweep fit  : {slope:.3f} deg/frame over f{start}-f{end} "
          f"({slope * (end - start):.0f}deg total), R2 {r2:.3f}, kept {int(keep.sum())}/{len(selected)}")
    if r2 < 0.9:
        print("  WARNING: poor linear fit. The clip may not be a single continuous sweep;")
        print("           check .agents/frames-contactsheet.jpg carefully.")

    return slope, intercept, start, end, r2


def find_neutral(grays: list[np.ndarray], settle_ratio: float = 0.55) -> tuple[int, int]:
    """
    Locate the neutral pose and where the sweep stops.

    Returns (neutral_frame, settle_start).

    Both matter. The neutral frame is the quietest frame in the settled tail.
    `settle_start` is where the head stops turning, and the angle fit must not
    be extrapolated past it: once the head has come to rest the fitted angle
    keeps advancing even though the pose no longer changes, which made an
    earlier version select a frontal frame (f225) as RIGHT.

    Radius-from-mean was tried for the neutral pose and is unreliable: dwell
    time is uneven, so the trajectory mean is not the neutral pose, and it
    picked a left-profile frame as 'centre'. Frame-to-frame motion is
    unambiguous.
    """
    motion = np.array(
        [float(np.abs(grays[i].astype(np.int16) - grays[i - 1].astype(np.int16)).mean()) for i in range(1, len(grays))]
    )
    smoothed = smooth(motion, 9)
    threshold = smoothed.max() * settle_ratio

    # Walk back from the end while motion stays below the threshold: that run
    # is the settle.
    settle_start = len(smoothed)
    while settle_start > 0 and smoothed[settle_start - 1] < threshold:
        settle_start -= 1

    neutral = settle_start + int(np.argmin(smoothed[settle_start:])) + 1 if settle_start < len(smoothed) else len(grays) - 1
    neutral = min(neutral, len(grays) - 1)

    print(f"  settle     : head comes to rest at f{settle_start} "
          f"(motion below {threshold:.2f} of peak {smoothed.max():.2f})")
    print(f"  neutral    : frame {neutral}")
    return neutral, settle_start


# ------------------------------------------------------------ frame selection


def select(slope: float, intercept: float, start: int, end: int, count: int):
    """
    For each of the `count` target angles, the frame whose fitted angle is
    closest, searching only the turning span.

    Because the fitted angle is strictly monotonic, this is a clean
    one-frame-per-slot assignment with no clustering.
    """
    step = 360.0 / count
    frames = np.arange(start, end + 1)
    fitted = (slope * frames + intercept) % 360.0

    chosen, errors = [], []
    for i in range(count):
        target = i * step
        delta = np.abs((fitted - target + 180.0) % 360.0 - 180.0)
        j = int(np.argmin(delta))
        chosen.append(int(frames[j]))
        errors.append(float(delta[j]))

    return chosen, fitted, errors


# ------------------------------------------------------------------ diagnostics


def write_contactsheet(frames, indices, box, path: Path, cols: int = 8) -> None:
    x0, y0, x1, y1 = box
    thumbs = []
    for slot, fi in enumerate(indices):
        # Crop to the head so the sweep is actually legible in the grid.
        t = cv2.resize(frames[fi][y0:y1, x0:x1], (200, 200), interpolation=cv2.INTER_AREA)
        label = f"{slot:02d} f{fi}"
        cv2.putText(t, label, (6, 192), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 0), 3)
        cv2.putText(t, label, (6, 192), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
        thumbs.append(t)

    rows = []
    for r in range(0, len(thumbs), cols):
        row = thumbs[r : r + cols]
        while len(row) < cols:
            row.append(np.zeros((200, 200, 3), np.uint8))
        rows.append(np.hstack(row))

    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(f"  wrote {path.relative_to(ROOT)}")


def write_trajectory(nx, ny, chosen, center_idx, path: Path) -> None:
    size = 560
    canvas = np.full((size, size, 3), 22, np.uint8)
    scale = 0.40 * size / max(np.abs(nx).max(), np.abs(ny).max(), 1e-6)
    pt = lambda x, y: (int(size / 2 + x * scale), int(size / 2 + y * scale))

    cv2.line(canvas, (0, size // 2), (size, size // 2), (55, 55, 55), 1)
    cv2.line(canvas, (size // 2, 0), (size // 2, size), (55, 55, 55), 1)

    for i in range(1, len(nx)):
        cv2.line(canvas, pt(nx[i - 1], ny[i - 1]), pt(nx[i], ny[i]), (85, 85, 85), 1)

    for slot, fi in enumerate(chosen):
        colour = (0, 165, 255) if slot % 8 == 0 else (90, 220, 90)
        cv2.circle(canvas, pt(nx[fi], ny[fi]), 4, colour, -1)

    cv2.circle(canvas, pt(nx[center_idx], ny[center_idx]), 7, (255, 255, 255), 2)

    for name, ang in (("R", 0), ("D", 90), ("L", 180), ("U", 270)):
        rad = np.radians(ang)
        cv2.putText(
            canvas,
            name,
            (int(size / 2 + np.cos(rad) * 245) - 7, int(size / 2 + np.sin(rad) * 245) + 7),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (235, 235, 235),
            1,
        )

    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), canvas, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"  wrote {path.relative_to(ROOT)}")


# ------------------------------------------------------------------------ main


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--frames", type=int, default=64)
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--head-percentile", type=float, default=95.0, help="temporal-variance percentile for head detection")
    ap.add_argument("--pad", type=float, default=0.12, help="head box padding, as a fraction of its size")
    ap.add_argument("--smooth", type=int, default=9, help="temporal smoothing window, in frames")
    ap.add_argument("--radius-floor", type=float, default=40.0, help="radius percentile defining the turning span")
    ap.add_argument("--max-width", type=int, default=1280)
    ap.add_argument("--video", type=str, default=None, help="explicit path to the source video")
    args = ap.parse_args()

    video = locate_video(args.video)
    print(f"\nInspecting {video.relative_to(ROOT)}")
    frames, fps = read_all_frames(video)

    print("\nAnalysing")
    bg_bgr, bg_hex = detect_background(frames)
    box, face = head_box(frames, args.head_percentile, args.pad)
    grays = [crop_gray(f, box) for f in frames]

    center_idx, settle_start = find_neutral(grays)

    print("  measuring  : integrating consecutive-frame optical flow")
    flow = flow_series(grays)
    nx, ny, deg, radius = polar(flow, args.smooth)
    print(f"  path       : x range {flow[:, 0].min():.0f}..{flow[:, 0].max():.0f}px, "
          f"y range {flow[:, 1].min():.0f}..{flow[:, 1].max():.0f}px")

    slope, intercept, start, end, r2 = fit_sweep(deg, radius, args.radius_floor, settle_start)
    chosen, fitted, errors = select(slope, intercept, start, end, args.frames)

    print("\nCompass frames (measured, not hand-picked)")
    step = 360.0 / args.frames
    for name, target in COMPASS:
        slot = int(round(target / step)) % args.frames
        print(
            f"  {name:<11} slot {slot:2d} -> frame {chosen[slot]:4d} "
            f"(fitted {(slope * chosen[slot] + intercept) % 360:6.1f}deg, off {errors[slot]:4.1f}deg)"
        )

    distinct = len(set(chosen))
    worst = max(errors)
    print(f"\nSelected {len(chosen)} frames, {distinct} distinct sources")
    print(f"  worst angular error {worst:.1f}deg, mean {sum(errors) / len(errors):.1f}deg")
    if center_idx in chosen:
        print("  WARNING: the neutral frame was also selected as a direction.")
    if distinct < args.frames * 0.8:
        print("  WARNING: duplication across slots; the source may not cover a full revolution.")

    # ---- write frames
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.webp"):
        old.unlink()

    h, w = frames[0].shape[:2]
    out_w, out_h = w, h
    if w > args.max_width:
        out_w = args.max_width
        out_h = int(round(h * args.max_width / w))
        print(f"\nDownscaling output to {out_w}x{out_h}")

    def save(frame: np.ndarray, name: str) -> int:
        img = frame if (out_w, out_h) == (w, h) else cv2.resize(frame, (out_w, out_h), interpolation=cv2.INTER_AREA)
        target = OUT_DIR / name
        cv2.imwrite(str(target), img, [cv2.IMWRITE_WEBP_QUALITY, args.quality])
        return target.stat().st_size

    print("\nWriting frames")
    total = sum(save(frames[fi], f"f{slot:02d}.webp") for slot, fi in enumerate(chosen))
    total += save(frames[center_idx], "center.webp")
    print(f"  {len(chosen) + 1} files, {total / 1024:.0f} kB total, {total / 1024 / (len(chosen) + 1):.1f} kB average")

    # Face pivot: centroid of the moving region, in normalised image coordinates.
    face_x = face[0] / w * 100
    face_y = face[1] / h * 100

    manifest = {
        "generatedBy": "scripts/extract_frames.py",
        "source": str(video.relative_to(ROOT)),
        "method": "integrated consecutive-frame Farneback flow over the head box, smoothed, then a robust linear angle fit",
        "video": {"width": w, "height": h, "fps": round(fps, 3), "frameCount": len(frames)},
        "output": {"width": out_w, "height": out_h, "quality": args.quality},
        "frameCount": len(chosen),
        "degreesPerFrame": round(360.0 / args.frames, 4),
        "backgroundHex": bg_hex,
        "backgroundBgr": [int(c) for c in bg_bgr],
        "faceCenter": {"xPct": round(face_x, 3), "yPct": round(face_y, 3)},
        "headBox": {"x0": int(box[0]), "y0": int(box[1]), "x1": int(box[2]), "y1": int(box[3])},
        "angleConvention": "degrees, 0=RIGHT, 90=DOWN, 180=LEFT, 270=UP; matches atan2(dy, dx) in screen space",
        "sweepFit": {
            "degreesPerFrame": round(float(slope), 4),
            "spanStart": int(start),
            "spanEnd": int(end),
            "r2": round(float(r2), 4),
        },
        "compass": {
            name: int(chosen[int(round(target / (360.0 / args.frames))) % args.frames])
            for name, target in COMPASS
        },
        "sourceFrameForSlot": [int(c) for c in chosen],
        "centerSourceFrame": int(center_idx),
        "distinctSourceFrames": int(distinct),
        "worstAngularErrorDeg": round(float(worst), 2),
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("  wrote public/frames/manifest.json")

    print("\nDiagnostics")
    write_contactsheet(frames, chosen, box, DIAG_DIR / "frames-contactsheet.jpg")
    write_trajectory(nx, ny, chosen, center_idx, DIAG_DIR / "frames-trajectory.jpg")

    print(
        "\nDone. In the contact sheet, slot 00 should look RIGHT and the gaze should\n"
        "rotate clockwise: down by slot 16, left by 32, up by 48.\n"
    )


if __name__ == "__main__":
    main()
