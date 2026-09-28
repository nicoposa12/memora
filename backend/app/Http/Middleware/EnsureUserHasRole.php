<?php

namespace App\Http\Middleware;

use App\Services\AuditService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (!in_array($user->role, $roles, true)) {
            AuditService::record(
                action: 'authorization.forbidden_role_access',
                status: 'warning',
                userId: $user->id,
                payload: [
                    'user_role' => $user->role,
                    'required_roles' => $roles,
                    'path' => $request->path(),
                    'method' => $request->method(),
                ],
                request: $request
            );

            return response()->json([
                'message' => 'Access denied. You do not have the required permissions for this resource.',
            ], 403);
        }

        return $next($request);
    }
}
