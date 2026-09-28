<?php

namespace App\Providers;

use App\Models\Event;
use App\Models\Photo;
use App\Policies\EventPolicy;
use App\Policies\PhotoPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Force HTTPS in Production or if configured
        if (app()->environment('production') || config('app.force_https')) {
            URL::forceScheme('https');
        }

        // 2. Policy Bindings
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Photo::class, PhotoPolicy::class);

        // 3. Named Rate Limiters
        $this->configureRateLimiting();
    }

    /**
     * Configure application rate limiters for security.
     */
    protected function configureRateLimiting(): void
    {
        // Strict rate limiter for authentication (brute-force defense: 5 attempts/min)
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function () {
                return response()->json([
                    'message' => 'Too many authentication attempts. Please try again in 60 seconds.',
                ], 429);
            });
        });

        // Photo upload rate limiter (prevents storage flooding: 10 uploads/min per IP/event)
        RateLimiter::for('uploads', function (Request $request) {
            $key = $request->ip() . '_' . ($request->route('slug') ?? 'general');
            return Limit::perMinute(10)->by($key)->response(function () {
                return response()->json([
                    'message' => 'Upload rate limit exceeded. Please wait a moment before capturing more photos.',
                ], 429);
            });
        });

        // Webhook rate limiter (30 requests/min per IP)
        RateLimiter::for('webhooks', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        // General API rate limiter (60 requests/min)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
