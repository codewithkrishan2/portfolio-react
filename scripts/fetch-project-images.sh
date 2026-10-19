#!/usr/bin/env bash
# Downloads the three Unsplash project-card images into .tmp-img so that
# optimize-images.mjs can convert them and the site can serve them locally
# instead of hotlinking Unsplash on the critical render path.
#
# These are placeholder visuals. Swap them for real screenshots once the
# projects are deployable.
#
# Photo credits (Unsplash License): see public/img/projects/CREDITS.txt
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .tmp-img

curl -sL -o .tmp-img/proj-portfolio.jpg \
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1600&auto=format&fit=crop"
curl -sL -o .tmp-img/proj-codereview.jpg \
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"
curl -sL -o .tmp-img/proj-blog.jpg \
  "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=1600&auto=format&fit=crop"

echo "Downloaded $(ls .tmp-img | wc -l) project images to .tmp-img/"
