'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Cursor-tracking character head, rendered to a 2D canvas.
 *
 * Design constraints this implementation is built around:
 *
 * 1. No CSS 3D transforms anywhere. No `perspective`, `rotateX` or `rotateY`
 *    on the canvas or any ancestor. The page and the character's body stay
 *    perfectly still; the only thing that moves is which pre-rendered head
 *    frame is on screen.
 *
 * 2. The MP4 is never touched at runtime. Generated MP4s carry a single
 *    keyframe, so `video.currentTime = x` makes the decoder walk forward from
 *    frame 0 every time — which stalls the main thread — and `video.play()`
 *    gives uncontrolled playback. Frames are pre-extracted to WebP by
 *    scripts/extract_frames.py and simply blitted here.
 *
 * 3. Exactly one frame is drawn per paint, at full opacity. Cross-fading two
 *    adjacent frames would overlay two faces at partial alpha and read as
 *    ghosting, so the canvas is cleared and a single image is drawn.
 *
 * 4. Pointer position lives in a ref and is consumed by a requestAnimationFrame
 *    loop. No React state updates per mousemove, so no re-render storm.
 */

type Manifest = {
  frameCount: number
  degreesPerFrame: number
  backgroundHex: string
  faceCenter: { xPct: number; yPct: number }
  output: { width: number; height: number }
}

/** Response factor for the angular easing. ~0.26 settles in roughly 35ms at 60fps. */
const RESPONSE = 0.26

/** Cursor inside this fraction of the smaller viewport axis => direct eye contact. */
const DEADZONE_FRACTION = 0.12

/** Shortest-path interpolation between two angles in degrees. */
function lerpAngle(from: number, to: number, factor: number): number {
  const delta = ((to - from + 540) % 360) - 180
  return from + delta * factor
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'sync'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

export default function CharacterCanvas({
  className = '',
  onReady,
  onError,
}: {
  className?: string
  /** Called once the neutral frame is painted, with the detected background hex. */
  onReady?: (backgroundHex: string) => void
  /** Called if the frames are missing or fail to load. */
  onError?: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [background, setBackground] = useState<string>('#0c0c1d')
  const [failed, setFailed] = useState(false)

  // Mutable render state, deliberately outside React.
  const pointer = useRef<{ x: number; y: number; seen: boolean }>({ x: 0, y: 0, seen: false })
  const angle = useRef(0)
  const lastDrawn = useRef<{ index: number; center: boolean; w: number; h: number }>({
    index: -1,
    center: false,
    w: 0,
    h: 0,
  })

  useEffect(() => {
    let cancelled = false
    let raf = 0
    let frames: HTMLImageElement[] = []
    let centerFrame: HTMLImageElement | null = null
    let manifest: Manifest | null = null
    let observer: ResizeObserver | null = null

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches

    async function start() {
      const res = await fetch('/frames/manifest.json', { cache: 'force-cache' })
      if (!res.ok) throw new Error(`manifest.json ${res.status}`)
      manifest = (await res.json()) as Manifest
      if (cancelled) return

      setBackground(manifest.backgroundHex)

      const names = Array.from(
        { length: manifest.frameCount },
        (_, i) => `/frames/f${String(i).padStart(2, '0')}.webp`
      )

      // Neutral frame first: it is what shows before the pointer is seen, on
      // touch devices, and under reduced-motion. It is also the LCP candidate,
      // so nothing else may compete with it.
      centerFrame = await loadImage('/frames/center.webp')
      if (cancelled) return
      draw()
      onReady?.(manifest.backgroundHex)

      // Tracking needs all 64 frames, which is ~3 MB. Fetching them straight
      // away makes them contend with the rest of first paint for bandwidth and
      // decode time, and LCP is a ranking signal. They are deferred until the
      // browser reports itself idle instead; until then the neutral frame is
      // already on screen, so there is nothing visibly missing.
      await whenIdle()
      if (cancelled) return

      if (reducedMotion || coarsePointer) return

      frames = await Promise.all(names.map(loadImage))
      if (cancelled) return

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      raf = requestAnimationFrame(tick)
    }

    /** requestIdleCallback where available, with a timeout fallback for Safari. */
    function whenIdle(): Promise<void> {
      return new Promise((resolve) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => resolve(), { timeout: 2500 })
        } else {
          setTimeout(resolve, 1200)
        }
      })
    }

    function onPointerMove(event: PointerEvent) {
      pointer.current = { x: event.clientX, y: event.clientY, seen: true }
    }

    /** Cover-fit geometry: where the source image actually lands on the canvas. */
    function coverRect(canvasW: number, canvasH: number) {
      const iw = manifest!.output.width
      const ih = manifest!.output.height
      const scale = Math.max(canvasW / iw, canvasH / ih)
      const w = iw * scale
      const h = ih * scale
      return { x: (canvasW - w) / 2, y: (canvasH - h) / 2, w, h }
    }

    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        lastDrawn.current.index = -1 // force a repaint at the new size
      }
    }

    function draw(index = -1, useCenter = true) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d', { alpha: false })
      if (!canvas || !ctx || !manifest) return

      const image = useCenter ? centerFrame : frames[index]
      if (!image) return

      const prev = lastDrawn.current
      if (prev.index === index && prev.center === useCenter && prev.w === canvas.width && prev.h === canvas.height) {
        return // nothing changed; skip the blit
      }

      const rect = coverRect(canvas.width, canvas.height)

      // Opaque fill rather than clearRect: the frames are letterboxed by cover
      // only on one axis, and this guarantees no stale pixels and no alpha
      // accumulation between draws.
      ctx.fillStyle = manifest.backgroundHex
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalAlpha = 1 // exactly one frame, fully opaque — never blended
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h)

      // Written only when the drawn frame actually changes, which is the same
      // condition that gates the blit above. Lets tests assert which frame is
      // on screen instead of eyeballing a screenshot.
      canvas.dataset.frame = useCenter ? 'center' : String(index)

      lastDrawn.current = { index, center: useCenter, w: canvas.width, h: canvas.height }
    }

    function tick() {
      const canvas = canvasRef.current
      if (!canvas || !manifest) {
        raf = requestAnimationFrame(tick)
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = coverRect(canvas.width, canvas.height)
      const faceX = (rect.x + (manifest.faceCenter.xPct / 100) * rect.w) / dpr
      const faceY = (rect.y + (manifest.faceCenter.yPct / 100) * rect.h) / dpr

      const { x, y, seen } = pointer.current

      if (!seen) {
        draw(-1, true)
        raf = requestAnimationFrame(tick)
        return
      }

      const dx = x - faceX
      const dy = y - faceY
      const distance = Math.hypot(dx, dy)
      const deadzone = Math.min(window.innerWidth, window.innerHeight) * DEADZONE_FRACTION

      if (distance < deadzone) {
        // Eye contact. Keep easing the angle underneath so leaving the deadzone
        // resumes from the right heading instead of snapping.
        draw(-1, true)
        raf = requestAnimationFrame(tick)
        return
      }

      // Screen space: +x right, +y down. 0deg = RIGHT, 90deg = DOWN.
      // extract_frames.py uses the identical convention, so no conversion.
      const target = (Math.atan2(dy, dx) * 180) / Math.PI
      angle.current = lerpAngle(angle.current, target, RESPONSE)

      const normalised = ((angle.current % 360) + 360) % 360
      const index = Math.round(normalised / manifest.degreesPerFrame) % manifest.frameCount

      draw(index, false)
      raf = requestAnimationFrame(tick)
    }

    resize()
    observer = new ResizeObserver(() => {
      resize()
      // Repaint immediately so a resize is never left showing a stale frame.
      const prev = lastDrawn.current
      draw(prev.index, prev.center)
    })
    if (canvasRef.current) observer.observe(canvasRef.current)

    start().catch((error: unknown) => {
      // Missing frames are an expected state before scripts/extract_frames.py
      // has been run, so this is a warning rather than an uncaught throw. The
      // hero renders its fallback and all copy stays visible.
      console.warn(
        '[CharacterCanvas] character frames unavailable, falling back to a static hero.',
        'Run `npm run extract:frames` to generate public/frames/.',
        error
      )
      if (!cancelled) {
        setFailed(true)
        onError?.()
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: background,
        // Guard against inherited filters or transforms affecting crispness.
        imageRendering: 'auto',
        // Hint the compositor without introducing a 3D transform.
        willChange: 'contents',
        opacity: failed ? 0 : 1,
      }}
    />
  )
}
