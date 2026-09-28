<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TwoFactorController extends Controller
{
    protected TwoFactorService $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Initialize 2FA setup for Admin: generate secret and QR code URI.
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        $secret = $this->twoFactorService->generateSecretKey();
        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes();

        // Temporarily store secret until confirmed
        $user->two_factor_secret = $secret;
        $user->two_factor_recovery_codes = $recoveryCodes;
        $user->two_factor_confirmed_at = null;
        $user->save();

        $qrUri = $this->twoFactorService->getQrCodeUri('Memora Admin', $user->email, $secret);

        return response()->json([
            'secret' => $secret,
            'qr_uri' => $qrUri,
            'recovery_codes' => $recoveryCodes,
            'message' => 'Scan the QR code with your authenticator app and enter the 6-digit code to confirm.',
        ]);
    }

    /**
     * Confirm 2FA setup with a valid OTP code.
     */
    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if (empty($user->two_factor_secret)) {
            return response()->json(['message' => 'Please initiate 2FA setup first.'], 400);
        }

        if (!$this->twoFactorService->verifyCode($user->two_factor_secret, $validated['code'])) {
            AuditService::record(
                action: 'admin.2fa_confirmation_failed',
                status: 'warning',
                userId: $user->id,
                request: $request
            );

            throw ValidationException::withMessages([
                'code' => 'The provided two-factor authentication code is invalid.',
            ]);
        }

        $user->two_factor_confirmed_at = now();
        $user->save();

        AuditService::record(
            action: 'admin.2fa_enabled',
            status: 'success',
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'message' => 'Two-factor authentication has been successfully confirmed and enabled.',
            'two_factor_enabled' => true,
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password you entered is incorrect.',
            ]);
        }

        $validCode = $this->twoFactorService->verifyCode((string) $user->two_factor_secret, $validated['code']);
        $validRecovery = is_array($user->two_factor_recovery_codes) && in_array($validated['code'], $user->two_factor_recovery_codes, true);

        if (!$validCode && !$validRecovery) {
            AuditService::record(
                action: 'admin.2fa_disable_failed',
                status: 'danger',
                userId: $user->id,
                request: $request
            );

            throw ValidationException::withMessages([
                'code' => 'Invalid two-factor authentication code or recovery code.',
            ]);
        }

        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        AuditService::record(
            action: 'admin.2fa_disabled',
            status: 'warning',
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'message' => 'Two-factor authentication has been disabled.',
            'two_factor_enabled' => false,
        ]);
    }
}
