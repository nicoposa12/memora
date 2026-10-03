<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    /**
     * Step 1-3: Create checkout session for PRO Single Event (₱1,499).
     */
    public function createProCheckout(Request $request)
    {
        $validated = $request->validate([
            'event_id' => ['nullable', 'string'],
            'name' => ['required_without:event_id', 'string', 'max:150'],
            'event_date' => ['nullable', 'date'],
            'event_type' => ['nullable', 'string', 'in:wedding,birthday,corporate,graduation,party,anniversary,other'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user, $request) {
            $event = null;

            if (!empty($validated['event_id'])) {
                $event = Event::findOrFail($validated['event_id']);
            } else {
                $slug = Str::slug($validated['name']) . '-' . Str::random(5);
                while (Event::where('slug', $slug)->exists()) {
                    $slug = Str::slug($validated['name']) . '-' . Str::random(5);
                }

                $event = Event::create([
                    'user_id' => $user?->id,
                    'name' => $validated['name'],
                    'slug' => $slug,
                    'qr_token' => Str::random(40),
                    'require_qr_token' => true,
                    'event_type' => $validated['event_type'] ?? 'wedding',
                    'event_date' => $validated['event_date'] ?? now()->addDays(30),
                    'location' => $validated['location'] ?? 'Venue',
                    'status' => 'active',
                    'plan' => 'free',
                    'is_premium' => false,
                ]);

                // Create default event settings
                $event->settings()->create([
                    'countdown_seconds' => 3,
                    'primary_color' => '#d8b86a',
                    'secondary_color' => '#faf7f2',
                    'enable_gallery' => true,
                    'watermark_enabled' => false, // Pro default
                ]);
            }

            $invoiceId = 'INV-PRO-' . strtoupper(Str::random(10));

            $payment = Payment::create([
                'user_id' => $user?->id,
                'event_id' => $event->id,
                'xendit_invoice_id' => $invoiceId,
                'amount' => 1499.00,
                'currency' => 'PHP',
                'status' => 'pending',
                'payment_method' => 'xendit_checkout',
                'payment_details' => [
                    'plan' => 'pro',
                    'item' => 'PRO Single Event Pass (₱1,499)',
                    'event_name' => $event->name,
                ],
            ]);

            return response()->json([
                'status' => 'success',
                'invoice_id' => $invoiceId,
                'amount' => 1499.00,
                'currency' => 'PHP',
                'event' => $event->load('settings'),
                'payment_id' => $payment->id,
                'checkout_url' => "https://checkout.xendit.co/web/{$invoiceId}",
            ]);
        });
    }

    /**
     * Create checkout session for STUDIO Workspace Subscription (₱4,999/mo).
     */
    public function createStudioCheckout(Request $request)
    {
        $user = $request->user();
        $invoiceId = 'INV-STUDIO-' . strtoupper(Str::random(10));

        $payment = Payment::create([
            'user_id' => $user?->id,
            'xendit_invoice_id' => $invoiceId,
            'amount' => 4999.00,
            'currency' => 'PHP',
            'status' => 'pending',
            'payment_method' => 'xendit_subscription',
            'payment_details' => [
                'plan' => 'studio',
                'cycle' => 'monthly',
                'item' => 'STUDIO Workspace Subscription (₱4,999/mo)',
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'invoice_id' => $invoiceId,
            'amount' => 4999.00,
            'currency' => 'PHP',
            'payment_id' => $payment->id,
            'checkout_url' => "https://checkout.xendit.co/v2/subscriptions/{$invoiceId}",
        ]);
    }

    /**
     * Step 3 -> Step 4: Confirm payment completion and unlock entitlement.
     */
    public function confirmPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => ['nullable', 'string'],
            'invoice_id' => ['nullable', 'string'],
            'event_id' => ['nullable', 'string'],
            'plan_type' => ['nullable', 'string', 'in:pro,studio'],
            'payment_method' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $payment = null;

            if (!empty($validated['payment_id'])) {
                $payment = Payment::find($validated['payment_id']);
            } elseif (!empty($validated['invoice_id'])) {
                $payment = Payment::where('xendit_invoice_id', $validated['invoice_id'])->first();
            }

            $user = $request->user() ?? ($payment ? User::find($payment->user_id) : null);

            // Plan confirmation security: non-admins must have a valid payment record
            if (!$payment && !$user?->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'A valid transaction record or invoice is required to activate this plan.',
                ], 403);
            }

            // Ensure non-admins can only confirm their own payments
            if ($payment && $user && !$user->isAdmin() && $payment->user_id && $payment->user_id != $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized payment transaction.',
                ], 403);
            }

            $planType = $validated['plan_type'] ?? ($payment?->amount >= 4000 ? 'studio' : 'pro');
            $eventId = $validated['event_id'] ?? $payment?->event_id;

            if ($payment) {
                $payment->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                    'payment_method' => $validated['payment_method'] ?? $payment->payment_method ?? 'GCash',
                ]);
            }

            $event = null;
            // Unlock Pro Event
            if ($planType === 'pro' && $eventId) {
                $event = Event::find($eventId);
                if ($event) {
                    $event->update([
                        'plan' => 'pro',
                        'is_premium' => true,
                    ]);
                }
            }

            // Unlock Studio Workspace
            if ($planType === 'studio' && $user) {
                $user->update([
                    'subscription_plan' => 'studio',
                    'subscription_status' => 'active',
                    'subscription_expires_at' => now()->addDays(30),
                    'subscription_grace_until' => now()->addDays(37),
                ]);
            }

            AuditService::record(
                action: 'payment.confirmed',
                status: 'success',
                eventId: $eventId,
                payload: [
                    'plan_type' => $planType,
                    'event_id' => $eventId,
                    'invoice_id' => $payment?->xendit_invoice_id ?? $validated['invoice_id'] ?? null,
                ],
                request: $request
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Payment verified and entitlement successfully unlocked.',
                'event' => $event?->load('settings'),
                'user' => $user,
            ]);
        });
    }
}
