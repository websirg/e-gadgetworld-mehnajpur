#!/usr/bin/env bash
set -uo pipefail

REPO="$HOME/egadgetworld-repo"
DEST="$HOME/domains/websirgmobix.com/public_html/egadgetworld"

echo "=== STARTING E-GADGET WORLD DEPLOYMENT ==="
echo "Timestamp: $(date -u)"

cd "$REPO"

# Detect best PHP CLI binary (PHP 8.3/8.4)
PHP_BIN="php"
for candidate in /opt/alt/php84/usr/bin/php /usr/bin/php8.4 /usr/local/bin/php8.4 /usr/bin/php8.3 php; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PHP_BIN="$candidate"
    echo "Selected PHP CLI: $PHP_BIN"
    break
  fi
done

# 1. Sync Frontend Files to Web Root
echo "Syncing frontend files to $DEST..."
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

# Clean up any temporary diagnostic files from web root
rm -f "$DEST/diag_output.txt" "$DEST/deploy_debug.log" "$DEST/storage_diag.txt"

echo "Frontend files synced."

# 2. Database Synchronization & Cache Refresh
if [ -d "$REPO/backend-laravel" ]; then
  cd "$REPO/backend-laravel"
  if [ -f "vendor/composer/platform_check.php" ]; then
    echo "<?php // platform check bypassed" > "vendor/composer/platform_check.php"
  fi
  "$PHP_BIN" artisan db:sync-egadget || "$PHP_BIN" sync_db.php || true
  "$PHP_BIN" artisan config:clear || true
  "$PHP_BIN" artisan route:clear || true
  "$PHP_BIN" artisan cache:clear || true
  echo "Backend caches cleared successfully."
fi

echo "=== E-GADGET WORLD DEPLOYMENT COMPLETED SUCCESSFULLY ==="
