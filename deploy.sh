#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/egadgetworld-repo"
DEST="$HOME/domains/websirgmobix.com/public_html/egadgetworld"

echo "Starting EGadget World frontend deployment..."

cd "$REPO"
test -f "$REPO/index.html"
test -d "$DEST"

rsync -av \
  --exclude='.env' \
  --exclude='.htaccess' \
  --exclude='api/' \
  --exclude='backend-laravel/' \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='.gitignore' \
  --exclude='README.md' \
  --exclude='netlify.toml' \
  --exclude='deploy.sh' \
  "$REPO/" "$DEST/"

echo "EGadget World frontend deployment completed."
