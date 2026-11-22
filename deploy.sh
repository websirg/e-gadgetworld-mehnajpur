#!/usr/bin/env bash
set -euo pipefail

REPO="$HOME/egadgetworld-repo"
DEST="$HOME/domains/websirgmobix.com/public_html/egadgetworld"

echo "Starting EGadget World deployment..."

cd "$REPO"
test -f "$REPO/index.html"
test -d "$DEST"

# 1. Sync Frontend Files to Web Root
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

# Clean up diagnostic files from web root if present
rm -f "$DEST/storage_diag.txt"

echo "EGadget World frontend deployment completed."

# 2. Database Synchronization & Cache Refresh
if [ -d "$REPO/backend-laravel" ]; then
  echo "Executing database synchronization on Hostinger..."
  cd "$REPO/backend-laravel"
  php artisan db:sync-egadget || php sync_db.php
  php artisan config:clear || true
  php artisan route:clear || true
  php artisan cache:clear || true
  echo "Backend caches cleared successfully."
fi

if [ -d "$HOME/domains/websirgmobix.com/public_html/backend-laravel" ]; then
  cd "$HOME/domains/websirgmobix.com/public_html/backend-laravel"
  php artisan config:clear || true
  php artisan route:clear || true
  php artisan cache:clear || true
fi

echo "=== E-GADGET WORLD DEPLOYMENT COMPLETED SUCCESSFULLY ==="
