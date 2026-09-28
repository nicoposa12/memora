<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Photos\StorePhotoRequest;
use App\Models\Event;
use App\Models\Photo;
use App\Services\AuditService;
use App\Services\PhotoUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    protected PhotoUploadService $uploadService;

    public function __construct(PhotoUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    /**
     * Store a photo captured by a guest for a specific event.
     */
    public function store(StorePhotoRequest $request, string $slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        // Event status validation
        if ($event->status !== 'active') {
            return response()->json([
                'message' => 'This event photobooth is no longer accepting photos.',
            ], 403);
        }

        // Secure QR / Event Token verification
        if ($event->require_qr_token) {
            $token = $request->input('token') ?? $request->header('X-Event-Token') ?? $request->query('token');

            if (!$token || !hash_equals((string) $event->qr_token, (string) $token)) {
                AuditService::record(
                    action: 'guest.unauthorized_photo_upload_attempt',
                    status: 'warning',
                    eventId: $event->id,
                    payload: ['slug' => $slug],
                    request: $request
                );

                return response()->json([
                    'message' => 'Invalid or missing photobooth QR pass. Photo upload rejected.',
                ], 403);
            }
        }

        $validated = $request->validated();
        $disk = config('filesystems.default') === 'r2' ? 'r2' : 'public';

        // Secure Upload Inspection & Storage
        $uploadResult = $this->uploadService->storeImage(
            $request->hasFile('image') ? $request->file('image') : $validated['image'],
            $event->id,
            $disk
        );

        $photo = $event->photos()->create([
            'file_path' => $uploadResult['path'],
            'layout' => $validated['layout'] ?? 'strip',
            'filter' => $validated['filter'] ?? 'normal',
            'metadata' => array_merge($validated['metadata'] ?? [], [
                'mime' => $uploadResult['mime'],
                'size' => $uploadResult['size'],
            ]),
            'is_hidden' => false,
        ]);

        AuditService::record(
            action: 'photo.captured',
            status: 'info',
            eventId: $event->id,
            payload: ['photo_id' => $photo->id, 'layout' => $photo->layout],
            request: $request
        );

        return response()->json([
            'message' => 'Photo saved successfully',
            'photo' => [
                'id' => $photo->id,
                'url' => $this->getPhotoUrl($photo->file_path, $disk),
                'created_at' => $photo->created_at,
            ],
        ], 201);
    }

    /**
     * Get photo stream for the event gallery.
     */
    public function index(Request $request, string $slug)
    {
        $event = Event::where('slug', $slug)
            ->with('settings')
            ->firstOrFail();

        // Check if gallery is enabled
        if ($event->settings && !$event->settings->enable_gallery) {
            return response()->json(['message' => 'Gallery is disabled for this event.'], 403);
        }

        // If gallery is not public, require the valid event QR token
        if ($event->settings && !$event->settings->is_public_gallery && $event->require_qr_token) {
            $token = $request->query('token') ?? $request->header('X-Event-Token');
            if (!$token || !hash_equals((string) $event->qr_token, (string) $token)) {
                return response()->json(['message' => 'Pass verification required to view private gallery.'], 403);
            }
        }

        $photos = $event->photos()
            ->where('is_hidden', false)
            ->orderBy('created_at', 'desc')
            ->paginate(24);

        $disk = config('filesystems.default') === 'r2' ? 'r2' : 'public';

        $photos->getCollection()->transform(function ($photo) use ($disk) {
            return [
                'id' => $photo->id,
                'url' => $this->getPhotoUrl($photo->file_path, $disk),
                'layout' => $photo->layout,
                'filter' => $photo->filter,
                'created_at' => $photo->created_at->diffForHumans(),
            ];
        });

        return response()->json($photos);
    }

    /**
     * Delete a photo (organizer/admin only).
     */
    public function destroy(Request $request, Photo $photo)
    {
        Gate::authorize('delete', $photo);

        $disk = config('filesystems.default') === 'r2' ? 'r2' : 'public';
        if ($photo->file_path && Storage::disk($disk)->exists($photo->file_path)) {
            Storage::disk($disk)->delete($photo->file_path);
        }

        AuditService::record(
            action: 'photo.deleted',
            status: 'warning',
            eventId: $photo->event_id,
            payload: ['photo_id' => $photo->id],
            request: $request
        );

        $photo->delete();

        return response()->json([
            'message' => 'Photo removed successfully',
        ]);
    }

    /**
     * Generate secure URL for photo (temporary signed URL if on R2/S3).
     */
    private function getPhotoUrl(string $path, string $disk): string
    {
        if ($disk === 'r2' || $disk === 's3') {
            try {
                // Return presigned URL valid for 60 minutes
                return Storage::disk($disk)->temporaryUrl($path, now()->addMinutes(60));
            } catch (\Throwable) {
                return Storage::disk($disk)->url($path);
            }
        }

        return Storage::disk($disk)->url($path);
    }
}
