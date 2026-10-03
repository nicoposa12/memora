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

# Ensure public storage symlink exists
if [ ! -L public/storage ]; then
    php artisan storage:link || true
fi

# Run database migrations if requested
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force --no-interaction
fi

# Ensure production administrator account exists if credentials are provided in environment
if [ -n "$SEED_ADMIN_EMAIL" ] && [ -n "$SEED_ADMIN_PASSWORD" ]; then
    echo "Ensuring production administrator account exists..."
    php artisan tinker --execute="App\Models\User::updateOrCreate(['email' => getenv('SEED_ADMIN_EMAIL') ?: env('SEED_ADMIN_EMAIL')], ['name' => 'System Administrator', 'password' => bcrypt(getenv('SEED_ADMIN_PASSWORD') ?: env('SEED_ADMIN_PASSWORD')), 'role' => 'admin', 'subscription_plan' => 'studio', 'subscription_status' => 'active']);" || true
fi

# Cache configuration & routes in production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache || true
    php artisan route:cache || true
fi

PORT="${PORT:-8000}"
echo "Starting Laravel server on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port="$PORT"
