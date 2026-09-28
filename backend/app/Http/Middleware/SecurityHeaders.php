<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and append modern defensive security headers.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // MIME sniffing prevention
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Clickjacking protection (allow sameorigin for booth embedding)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Cross-Site Scripting filter
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Privacy-preserving referrer policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Camera permissions policy (vital for photobooth)
        $response->headers->set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');

        // Content Security Policy
        $csp = "default-src 'self'; "
             . "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
             . "style-src 'self' 'unsafe-inline' https:; "
             . "img-src 'self' data: blob: https:; "
             . "font-src 'self' https: data:; "
             . "connect-src 'self' https:;";
        $response->headers->set('Content-Security-Policy', $csp);

        // HSTS (HTTP Strict Transport Security) - enforce when on HTTPS or production
        if ($request->isSecure() || app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
}
