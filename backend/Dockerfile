# Multi-stage Dockerfile for Laravel 11 Backend API

# 1. Composer dependencies stage
FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock ./
# --no-scripts prevents composer from running artisan package:discover before app files exist
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs \
    --no-scripts

# 2. Production runtime stage
FROM php:8.2-cli-alpine AS runtime
WORKDIR /var/www/html

# Install mlocati's install-php-extensions helper for fast, precompiled extension installation
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install required system tools and PHP extensions
RUN apk add --no-cache curl \
    && install-php-extensions pdo_pgsql pgsql bcmath zip opcache pcntl

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy vendor dependencies from builder stage
COPY --from=vendor /app/vendor ./vendor

# Copy application codebase
COPY . .

# Set up entrypoint script and directory permissions
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/up || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
