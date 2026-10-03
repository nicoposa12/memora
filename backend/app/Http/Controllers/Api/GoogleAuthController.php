<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google OAuth consent screen.
     */
    public function redirect(Request $request)
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Google OAuth is not configured yet. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
                ], 503);
            }

            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Google OAuth credentials are not configured in the server environment.'));
        }

        $targetUrl = Socialite::driver('google')
            ->stateless()
            ->scopes(['openid', 'profile', 'email'])
            ->with(['prompt' => 'select_account'])
            ->redirect()
            ->getTargetUrl();

        if ($request->wantsJson()) {
            return response()->json(['url' => $targetUrl]);
        }

        return redirect()->away($targetUrl);
    }

    /**
     * Handle the callback returned by Google.
     */
    public function callback(Request $request)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        if ($request->has('error')) {
            $errorDescription = $request->input('error_description') ?: 'Google sign-in was cancelled.';
            return redirect()->away($frontendUrl . '/login?error=' . urlencode($errorDescription));
        }

        try {
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            AuditService::record(
                action: 'auth.google_failed',
                status: 'warning',
                payload: ['error' => $e->getMessage()],
                request: $request
            );

            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Failed to authenticate with Google. Please try again.'));
        }

        $email = $googleUser->getEmail();
        $googleId = (string) $googleUser->getId();
        $name = $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Memora User');
        $avatar = $googleUser->getAvatar();

        if (empty($email)) {
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Unable to retrieve an email address from your Google profile.'));
        }

        // Match existing user by google_id or email
        $user = User::where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            if ($user->subscription_status === 'suspended') {
                AuditService::record(
                    action: 'auth.google_blocked_suspended',
                    status: 'warning',
                    userId: $user->id,
                    payload: ['email' => $user->email],
                    request: $request
                );

                return redirect()->away($frontendUrl . '/login?error=' . urlencode('Your account has been suspended. Please contact support.'));
            }

            $modified = false;
            if (!$user->google_id) {
                $user->google_id = $googleId;
                $modified = true;
            }
            if (!$user->avatar && $avatar) {
                $user->avatar = $avatar;
                $modified = true;
            }
            if ($modified) {
                $user->save();
            }
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'password' => Hash::make(Str::random(32)),
                'role' => 'organizer',
            ]);
        }

        $token = $user->createToken('auth_token', ['role:' . $user->role])->plainTextToken;

        AuditService::record(
            action: 'auth.google_login',
            status: 'success',
            userId: $user->id,
            request: $request
        );

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'subscription_plan' => $user->subscription_plan,
            'subscription_status' => $user->subscription_status,
            'subscription_expires_at' => $user->subscription_expires_at,
            'subscription_grace_until' => $user->subscription_grace_until,
            'has_2fa' => $user->hasTwoFactorEnabled(),
        ];

        $callbackParams = http_build_query([
            'token' => $token,
            'user' => json_encode($userData),
        ]);

        return redirect()->away($frontendUrl . '/auth/callback?' . $callbackParams);
    }

    /**
     * Direct token exchange for Google Identity Services / One Tap (Frontend credential verification).
     */
    public function token(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
        ]);

        $credential = $request->input('credential');

        try {
            $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $credential,
            ]);

            if (!$response->successful()) {
                throw new \Exception('Invalid or expired Google credential.');
            }

            $payload = $response->json();
            $clientId = config('services.google.client_id');

            // Verify audience if client_id is set
            if (!empty($clientId) && isset($payload['aud']) && $payload['aud'] !== $clientId) {
                throw new \Exception('Token audience does not match configured Google Client ID.');
            }

            $email = $payload['email'] ?? null;
            $googleId = (string) ($payload['sub'] ?? '');
            $name = $payload['name'] ?? 'Memora User';
            $avatar = $payload['picture'] ?? null;

            if (empty($email) || empty($googleId)) {
                throw new \Exception('Missing required email or identity from Google profile.');
            }

            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                if ($user->subscription_status === 'suspended') {
                    AuditService::record(
                        action: 'auth.google_token_blocked_suspended',
                        status: 'warning',
                        userId: $user->id,
                        payload: ['email' => $user->email],
                        request: $request
                    );

                    return response()->json([
                        'message' => 'Your account has been suspended. Please contact support.',
                    ], 403);
                }

                $modified = false;
                if (!$user->google_id) {
                    $user->google_id = $googleId;
                    $modified = true;
                }
                if (!$user->avatar && $avatar) {
                    $user->avatar = $avatar;
                    $modified = true;
                }
                if ($modified) {
                    $user->save();
                }
            } else {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'password' => Hash::make(Str::random(32)),
                    'role' => 'organizer',
                ]);
            }

            $token = $user->createToken('auth_token', ['role:' . $user->role])->plainTextToken;

            AuditService::record(
                action: 'auth.google_login',
                status: 'success',
                userId: $user->id,
                request: $request
            );

            return response()->json([
                'message' => 'Signed in successfully with Google',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                    'subscription_plan' => $user->subscription_plan,
                    'subscription_status' => $user->subscription_status,
                    'subscription_expires_at' => $user->subscription_expires_at,
                    'subscription_grace_until' => $user->subscription_grace_until,
                    'has_2fa' => $user->hasTwoFactorEnabled(),
                ],
            ]);
        } catch (\Throwable $e) {
            AuditService::record(
                action: 'auth.google_failed',
                status: 'warning',
                payload: ['error' => $e->getMessage()],
                request: $request
            );

            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
