<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuditService
{
    /**
     * Record an audit event into audit_logs and log channel.
     */
    public static function record(
        string $action,
        string $status = 'info',
        ?int $userId = null,
        ?string $eventId = null,
        ?array $payload = null,
        ?Request $request = null
    ): AuditLog {
        $req = $request ?? (app()->bound('request') ? request() : null);
        $ip = $req ? $req->ip() : null;
        $ua = $req ? substr((string) $req->userAgent(), 0, 500) : null;

        // Strip sensitive keys from payload if present
        if ($payload) {
            unset($payload['password'], $payload['password_confirmation'], $payload['two_factor_secret']);
        }

        try {
            $log = AuditLog::create([
                'user_id' => $userId ?? ($req?->user()?->id),
                'event_id' => $eventId,
                'action' => $action,
                'status' => $status,
                'ip_address' => $ip,
                'user_agent' => $ua,
                'payload' => $payload,
                'created_at' => now(),
            ]);

            // If warning or danger, also log to standard application security log
            if (in_array($status, ['warning', 'danger'])) {
                Log::channel('single')->warning("[SECURITY AUDIT] {$action} [{$status}]", [
                    'user_id' => $log->user_id,
                    'event_id' => $eventId,
                    'ip' => $ip,
                    'payload' => $payload,
                ]);
            }

            return $log;
        } catch (\Throwable $e) {
            // Fail safe: Never crash user requests if audit logging encounters an issue
            Log::error('Failed to write audit log: ' . $e->getMessage());
            return new AuditLog();
        }
    }
}
