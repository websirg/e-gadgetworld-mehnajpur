#!/usr/bin/env bash
set -uo pipefail

REPO="$HOME/egadgetworld-repo"
DEST="$HOME/domains/websirgmobix.com/public_html/egadgetworld"
LOG_FILE="$DEST/deploy_debug.log"

exec > >(tee "$LOG_FILE") 2>&1

echo "=== STARTING E-GADGET WORLD DEPLOYMENT ==="
echo "Timestamp: $(date -u)"
echo "Current directory: $(pwd)"
echo "User: $(whoami)"

cd "$REPO"

# Find PHP 8.2+
PHP_BIN="php"
for candidate in php /usr/bin/php8.3 /usr/bin/php8.2 /opt/alt/php82/usr/bin/php /opt/alt/php83/usr/bin/php; do
  if command -v "$candidate" >/dev/null 2>&1; then
    VER=$("$candidate" -r 'echo PHP_VERSION;' 2>/dev/null || true)
    echo "Found PHP candidate: $candidate (version: $VER)"
    if "$candidate" -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);' 2>/dev/null; then
      PHP_BIN="$candidate"
      echo "Selected PHP binary: $PHP_BIN ($VER)"
      break
    fi
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

# Clean up stale diagnostic files
rm -f "$DEST/storage_diag.txt"

echo "Frontend files synced."

# 2. Database Synchronization & Cache Refresh
if [ -d "$REPO/backend-laravel" ]; then
  echo "Executing database synchronization in $REPO/backend-laravel..."
  cd "$REPO/backend-laravel"
  
  echo "Running db:sync-egadget with $PHP_BIN..."
  if ! "$PHP_BIN" artisan db:sync-egadget; then
    echo "artisan db:sync-egadget failed, attempting fallback with sync_db.php..."
    "$PHP_BIN" sync_db.php || true
  fi

  "$PHP_BIN" artisan config:clear || true
  "$PHP_BIN" artisan route:clear || true
  "$PHP_BIN" artisan cache:clear || true
  echo "Backend caches cleared successfully."
fi

if [ -d "$HOME/domains/websirgmobix.com/public_html/backend-laravel" ]; then
  cd "$HOME/domains/websirgmobix.com/public_html/backend-laravel"
  "$PHP_BIN" artisan config:clear || true
  "$PHP_BIN" artisan route:clear || true
  "$PHP_BIN" artisan cache:clear || true
fi

echo "=== E-GADGET WORLD DEPLOYMENT COMPLETED SUCCESSFULLY ==="
