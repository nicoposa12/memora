<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreEventRequest;
use App\Http\Requests\Events\UpdateEventRequest;
use App\Models\Event;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * List events for the authenticated organizer.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = $user->isAdmin() ? Event::query() : $user->events();

        $events = $query
            ->with('settings')
            ->withCount('photos')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($events);
    }

    /**
     * Create a new event with default settings.
     */
    public function store(StoreEventRequest $request)
    {
        $user = $request->user();

        // Enforce plan requirement: Administrators and Active Studio subscribers have unlimited events.
        // Free / Trial organizers can create up to 1 event.
        if (!$user->isAdmin() && !$user->hasActiveStudio() && $user->events()->count() >= 1) {
            return response()->json([
                'message' => 'An active PRO Event Pass or STUDIO Subscription is required to create additional events.',
                'upgrade_required' => true,
            ], 403);
        }

        $validated = $request->validated();

        $slug = !empty($validated['slug']) 
            ? Str::slug($validated['slug']) 
            : Str::slug($validated['name']) . '-' . Str::random(5);

        // Ensure unique slug
        while (Event::where('slug', $slug)->exists()) {
            $slug = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        $event = DB::transaction(function () use ($request, $user, $validated, $slug) {
            $hasStudio = $user->hasActiveStudio() || $user->isAdmin();

            $createdEvent = $user->events()->create([
                'name' => $validated['name'],
                'slug' => $slug,
                'qr_token' => Str::random(40),
                'require_qr_token' => $validated['require_qr_token'] ?? true,
                'event_type' => $validated['event_type'],
                'event_date' => $validated['event_date'] ?? null,
                'description' => $validated['description'] ?? null,
                'location' => $validated['location'] ?? null,
                'status' => 'active',
                'plan' => $hasStudio ? 'studio' : 'free',
                'is_premium' => $hasStudio,
            ]);

            // Create default settings
            $createdEvent->settings()->create([
                'countdown_seconds' => $validated['countdown_seconds'] ?? 3,
                'primary_color' => $validated['primary_color'] ?? '#e6c687',
                'secondary_color' => $validated['secondary_color'] ?? '#faf6ee',
                'enable_gallery' => $validated['enable_gallery'] ?? true,
                'watermark_enabled' => !$hasStudio,
            ]);

            return $createdEvent;
        });

        AuditService::record(
            action: 'event.created',
            status: 'success',
            eventId: $event->id,
            payload: ['name' => $event->name, 'slug' => $event->slug],
            request: $request
        );

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event->load('settings'),
        ], 201);
    }

    /**
     * Public endpoint for guests scanning the QR code: /api/events/{slug}
     */
    public function getBySlug(Request $request, string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('status', 'active')
            ->with('settings')
            ->firstOrFail();

        // Secure QR / Event token verification
        if ($event->require_qr_token) {
            $providedToken = $request->query('token') ?? $request->header('X-Event-Token');

            if (!$providedToken || !hash_equals((string) $event->qr_token, (string) $providedToken)) {
                AuditService::record(
                    action: 'guest.invalid_qr_token_access',
                    status: 'warning',
                    eventId: $event->id,
                    payload: ['slug' => $slug],
                    request: $request
                );

                return response()->json([
                    'message' => 'Invalid or expired photobooth QR pass. Please scan the organizer event QR code again.',
                ], 403);
            }
        }

        return response()->json([
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
                'event_type' => $event->event_type,
                'event_date' => $event->event_date,
                'is_premium' => $event->is_premium,
                'settings' => $event->settings,
            ],
        ]);
    }

    /**
     * Show event details for organizer.
     */
    public function show(Request $request, Event $event)
    {
        Gate::authorize('view', $event);

        return response()->json([
            'event' => $event->load(['settings', 'photos' => function ($q) {
                $q->latest()->take(20);
            }]),
        ]);
    }

    /**
     * Update event and settings.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        Gate::authorize('update', $event);

        $validated = $request->validated();

        $event->update($validated);

        if (!empty($validated['settings'])) {
            $event->settings()->updateOrCreate(
                ['event_id' => $event->id],
                $validated['settings']
            );
        }

        AuditService::record(
            action: 'event.updated',
            status: 'info',
            eventId: $event->id,
            payload: ['updated_fields' => array_keys($validated)],
            request: $request
        );

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event->load('settings'),
        ]);
    }

    /**
     * Delete event.
     */
    public function destroy(Request $request, Event $event)
    {
        Gate::authorize('delete', $event);

        AuditService::record(
            action: 'event.deleted',
            status: 'warning',
            eventId: $event->id,
            payload: ['name' => $event->name],
            request: $request
        );

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    /**
     * Regenerate event QR token to immediately revoke a compromised pass.
     */
    public function regenerateQrToken(Request $request, Event $event)
    {
        Gate::authorize('regenerateQrToken', $event);

        $newToken = $event->regenerateQrToken();

        AuditService::record(
            action: 'event.qr_token_regenerated',
            status: 'info',
            eventId: $event->id,
            request: $request
        );

        return response()->json([
            'message' => 'Event QR code pass regenerated successfully.',
            'qr_token' => $newToken,
        ]);
    }
}
