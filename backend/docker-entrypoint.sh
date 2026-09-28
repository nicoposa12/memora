#!/bin/sh
set -e

# Ensure storage & bootstrap/cache directories exist and have proper permissions
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

chmod -R 775 storage bootstrap/cache

# Remove any stale package cache from host
rm -f bootstrap/cache/*.php

# Discover packages since --no-scripts was used during composer build
php artisan package:discover --ansi || true

# Run database migrations if requested
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force --no-interaction
fi

# Cache configuration & routes in production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
fi

echo "Starting Laravel server on port 8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
