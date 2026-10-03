<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserAdminController extends Controller
{
    /**
     * Display a listing of registered users from PostgreSQL database.
     */
    public function index(Request $request)
    {
        $users = User::withCount('events')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'role' => ['nullable', 'string', 'in:admin,organizer,client'],
            'subscription_plan' => ['nullable', 'string', 'in:none,free,pro,studio'],
            'subscription_status' => ['nullable', 'string', 'in:active,past_due,grace_period,expired,suspended'],
        ]);

        $plan = $validated['subscription_plan'] ?? 'none';
        $expiresAt = in_array($plan, ['pro', 'studio']) ? now()->addDays(30) : null;
        $graceUntil = in_array($plan, ['pro', 'studio']) ? now()->addDays(37) : null;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt(Str::random(24)),
            'role' => $validated['role'] ?? 'organizer',
            'subscription_plan' => $plan,
            'subscription_status' => $validated['subscription_status'] ?? 'active',
            'subscription_expires_at' => $expiresAt,
            'subscription_grace_until' => $graceUntil,
        ]);

        AuditService::record(
            action: 'admin.user_created',
            status: 'success',
            payload: ['user_id' => $user->id, 'email' => $user->email],
            request: $request
        );

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->loadCount('events'),
        ], 201);
    }

    /**
     * Update an existing user's subscription, role, or status.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'in:admin,organizer,client'],
            'subscription_plan' => ['nullable', 'string', 'in:none,free,pro,studio'],
            'subscription_status' => ['nullable', 'string', 'in:active,past_due,grace_period,expired,suspended'],
            'subscription_expires_at' => ['nullable', 'date'],
            'subscription_grace_until' => ['nullable', 'date'],
        ]);

        $user->update(array_filter($validated, fn($v) => !is_null($v)));

        // Revoke active sessions immediately if account is suspended
        if (($validated['subscription_status'] ?? '') === 'suspended') {
            $user->tokens()->delete();
        }

        AuditService::record(
            action: 'admin.user_updated',
            status: 'success',
            payload: ['user_id' => $user->id, 'updates' => $validated],
            request: $request
        );

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->loadCount('events'),
        ]);
    }

    /**
     * Delete a user account (excluding the active admin).
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete your own admin account.'], 403);
        }

        $userId = $user->id;
        $userEmail = $user->email;

        // Revoke all active sessions immediately upon account deletion
        $user->tokens()->delete();
        $user->delete();

        AuditService::record(
            action: 'admin.user_deleted',
            status: 'success',
            payload: ['user_id' => $userId, 'email' => $userEmail],
            request: $request
        );

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
