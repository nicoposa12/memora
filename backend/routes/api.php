<?php

use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Admin\TwoFactorController;
use App\Http\Controllers\Api\Admin\UserAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\PaymentWebhookController;
use App\Http\Controllers\Api\PhotoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// System Health Monitoring
Route::get('/health', [HealthController::class, 'check']);

// Public Authentication (Rate limited to prevent brute-force attacks)
Route::middleware('throttle:auth')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Google OAuth Endpoints
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
    Route::post('/auth/google/token', [GoogleAuthController::class, 'token']);
});

// Verified Payment Webhook (Xendit / Payment provider callbacks)
Route::post('/webhooks/payment', [PaymentWebhookController::class, 'handle'])
    ->middleware('throttle:webhooks');

// Protected Authenticated Endpoints (Sanctum)
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // Current user & session
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Event Management (Organizer / Admin)
    Route::apiResource('events', EventController::class)->whereUuid('event');
    Route::post('/events/{event}/regenerate-qr-token', [EventController::class, 'regenerateQrToken'])
        ->whereUuid('event');

    // Photo Moderation (Organizer / Admin)
    Route::delete('/photos/{photo}', [PhotoController::class, 'destroy'])
        ->whereUuid('photo');

    // Checkout & Entitlement Endpoints (PRO Event Pass & STUDIO Workspace)
    Route::post('/checkout/pro', [CheckoutController::class, 'createProCheckout']);
    Route::post('/checkout/studio', [CheckoutController::class, 'createStudioCheckout']);
    Route::post('/checkout/confirm', [CheckoutController::class, 'confirmPayment']);

    // Platform Admin Only Endpoints (RBAC protected)
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/users', [UserAdminController::class, 'index']);
        Route::post('/users', [UserAdminController::class, 'store']);
        Route::put('/users/{user}', [UserAdminController::class, 'update']);
        Route::delete('/users/{user}', [UserAdminController::class, 'destroy']);
        Route::post('/2fa/setup', [TwoFactorController::class, 'setup']);
        Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm']);
        Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
    });
});

// Guest Photobooth & Gallery Endpoints (Protected by QR Token & Rate Limiting)
Route::middleware('throttle:api')->group(function () {
    Route::get('/events/{slug}', [EventController::class, 'getBySlug']);
    Route::get('/events/{slug}/photos', [PhotoController::class, 'index']);
});
Route::post('/events/{slug}/photos', [PhotoController::class, 'store'])
    ->middleware('throttle:uploads');
