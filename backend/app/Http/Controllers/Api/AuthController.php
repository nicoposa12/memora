<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'organizer', // Default to organizer
        ]);

        $token = $user->createToken('auth_token', ['role:' . $user->role])->plainTextToken;

        AuditService::record(
            action: 'auth.register',
            status: 'success',
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'has_2fa' => $user->hasTwoFactorEnabled(),
            ],
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            AuditService::record(
                action: 'auth.login_failed',
                status: 'warning',
                payload: ['email' => $validated['email']],
                request: $request
            );

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token', ['role:' . $user->role])->plainTextToken;

        AuditService::record(
            action: 'auth.login',
            status: 'success',
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'has_2fa' => $user->hasTwoFactorEnabled(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();

            AuditService::record(
                action: 'auth.logout',
                status: 'info',
                userId: $user->id,
                request: $request
            );
        }

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'has_2fa' => $user->hasTwoFactorEnabled(),
            ],
        ]);
    }
}
