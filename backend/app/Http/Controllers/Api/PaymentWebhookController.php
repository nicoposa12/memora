<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle incoming payment webhooks from Xendit / Payment providers.
     */
    public function handle(Request $request)
    {
        $expectedToken = config('services.payment.webhook_secret', env('PAYMENT_WEBHOOK_SECRET'));
        $receivedToken = $request->header('x-callback-token') ?? $request->header('X-CALLBACK-TOKEN');

        // Signature / Callback Token Verification
        if (empty($expectedToken) || empty($receivedToken) || !hash_equals((string) $expectedToken, (string) $receivedToken)) {
            AuditService::record(
                action: 'payment.webhook_invalid_signature',
                status: 'danger',
                payload: [
                    'ip' => $request->ip(),
                    'has_token' => !empty($receivedToken),
                ],
                request: $request
            );

            return response()->json([
                'message' => 'Unauthorized: Invalid payment webhook token.',
            ], 401);
        }

        $payload = $request->all();
        $invoiceId = $payload['id'] ?? $payload['external_id'] ?? $payload['xendit_invoice_id'] ?? null;
        $status = strtoupper($payload['status'] ?? '');

        if (!$invoiceId) {
            return response()->json(['message' => 'Missing transaction identifier.'], 422);
        }

        // Replay Attack & Idempotency Check
        $existingPayment = Payment::where('xendit_invoice_id', $invoiceId)->first();
        if ($existingPayment && $existingPayment->status === 'completed') {
            return response()->json([
                'status' => 'idempotent',
                'message' => 'Webhook already processed.',
            ], 200);
        }

        if (in_array($status, ['PAID', 'COMPLETED', 'SETTLED', 'SUCCESS'], true)) {
            DB::transaction(function () use ($existingPayment, $invoiceId, $payload) {
                $eventId = $payload['event_id'] ?? $existingPayment?->event_id ?? null;
                $amount = $payload['paid_amount'] ?? $payload['amount'] ?? ($existingPayment?->amount ?? 0);

                if ($existingPayment) {
                    $existingPayment->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                        'payment_details' => $payload,
                    ]);
                    $payment = $existingPayment;
                } else {
                    $payment = Payment::create([
                        'xendit_invoice_id' => $invoiceId,
                        'event_id' => $eventId,
                        'amount' => $amount,
                        'currency' => $payload['currency'] ?? 'PHP',
                        'status' => 'completed',
                        'payment_method' => $payload['payment_method'] ?? 'ewallet',
                        'payment_details' => $payload,
                        'completed_at' => now(),
                    ]);
                }

                // 1. PRO Single Event Entitlement (₱1,499 / event)
                if ($payment->event_id) {
                    $event = Event::find($payment->event_id);
                    if ($event) {
                        $event->update([
                            'is_premium' => true,
                            'plan' => 'pro',
                        ]);
                    }
                }

                // 2. STUDIO Workspace Subscription (₱4,999 / month)
                $planType = $payload['plan_type'] ?? ($amount >= 4999 ? 'studio' : null);
                $userId = $payload['user_id'] ?? $existingPayment?->user_id ?? $payment->user_id;
                if ($userId && ($planType === 'studio' || (!$payment->event_id && $amount >= 4000))) {
                    $user = \App\Models\User::find($userId);
                    if ($user) {
                        $user->update([
                            'subscription_plan' => 'studio',
                            'subscription_status' => 'active',
                            'subscription_expires_at' => now()->addDays(30),
                            'subscription_grace_until' => now()->addDays(37), // 7-day grace period before restricting
                        ]);
                    }
                }

                AuditService::record(
                    action: 'payment.webhook_completed',
                    status: 'success',
                    eventId: $payment->event_id,
                    payload: [
                        'invoice_id' => $invoiceId,
                        'amount' => $amount,
                        'payment_id' => $payment->id,
                        'plan_type' => $planType ?? ($payment->event_id ? 'pro_event' : 'standard'),
                    ]
                );
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Payment recorded and entitlements applied successfully.',
            ], 200);
        }

        return response()->json([
            'status' => 'ignored',
            'message' => "Webhook received with unhandled status: {$status}",
        ], 200);
    }
}
