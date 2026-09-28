<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PhotoUploadService
{
    private const MAX_BYTES = 10485760; // 10MB limit

    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    /**
     * Inspect, sanitize, and store an uploaded or base64 image into private storage.
     *
     * @param  UploadedFile|string  $imageInput
     * @param  string  $eventId
     * @param  string  $disk
     * @return array{path: string, mime: string, size: int}
     *
     * @throws ValidationException
     */
    public function storeImage(mixed $imageInput, string $eventId, string $disk = 'public'): array
    {
        $binaryData = '';
        $detectedMime = '';

        if ($imageInput instanceof UploadedFile) {
            if (!$imageInput->isValid()) {
                throw ValidationException::withMessages(['image' => 'The uploaded file is invalid or corrupted.']);
            }

            if ($imageInput->getSize() > self::MAX_BYTES) {
                throw ValidationException::withMessages(['image' => 'Image exceeds the maximum allowed size of 10MB.']);
            }

            $binaryData = file_get_contents($imageInput->getRealPath());
        } elseif (is_string($imageInput)) {
            // Base64 Data URL decoding
            if (preg_match('/^data:image\/(\w+);base64,/', $imageInput)) {
                $base64Content = substr($imageInput, strpos($imageInput, ',') + 1);
                $binaryData = base64_decode($base64Content, true);

                if ($binaryData === false) {
                    throw ValidationException::withMessages(['image' => 'Failed to decode base64 image data.']);
                }

                if (strlen($binaryData) > self::MAX_BYTES) {
                    throw ValidationException::withMessages(['image' => 'Image exceeds the maximum allowed size of 10MB.']);
                }
            } else {
                throw ValidationException::withMessages(['image' => 'Invalid image format. Expected valid upload or data URI.']);
            }
        } else {
            throw ValidationException::withMessages(['image' => 'Invalid image input provided.']);
        }

        // Magic bytes & server-side MIME verification using finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->buffer($binaryData);

        if (!array_key_exists($detectedMime, self::ALLOWED_MIMES)) {
            AuditService::record(
                action: 'security.unsafe_file_upload_blocked',
                status: 'danger',
                payload: [
                    'detected_mime' => $detectedMime,
                    'event_id' => $eventId,
                    'size' => strlen($binaryData),
                ]
            );

            throw ValidationException::withMessages([
                'image' => 'Security check failed: File must be a valid JPEG, PNG, or WebP image.',
            ]);
        }

        // Magic Header Byte Verification
        if (!$this->verifyMagicBytes($binaryData, $detectedMime)) {
            AuditService::record(
                action: 'security.magic_bytes_mismatch_blocked',
                status: 'danger',
                payload: [
                    'detected_mime' => $detectedMime,
                    'event_id' => $eventId,
                ]
            );

            throw ValidationException::withMessages([
                'image' => 'File header signatures do not match the expected image type.',
            ]);
        }

        // Strict extension mapping from validated MIME (discard client extension)
        $extension = self::ALLOWED_MIMES[$detectedMime];
        $uuidFilename = Str::uuid()->toString() . '.' . $extension;
        $storagePath = 'events/' . $eventId . '/photos/' . $uuidFilename;

        // Store file safely
        Storage::disk($disk)->put($storagePath, $binaryData, [
            'visibility' => 'private',
            'mimetype' => $detectedMime,
        ]);

        return [
            'path' => $storagePath,
            'mime' => $detectedMime,
            'size' => strlen($binaryData),
        ];
    }

    /**
     * Verify strict file signatures.
     */
    private function verifyMagicBytes(string $data, string $mime): bool
    {
        $len = strlen($data);
        if ($len < 12) {
            return false;
        }

        switch ($mime) {
            case 'image/jpeg':
                // JPEG starts with FF D8 FF
                return substr($data, 0, 3) === "\xFF\xD8\xFF";

            case 'image/png':
                // PNG signature: 89 50 4E 47 0D 0A 1A 0A
                return substr($data, 0, 8) === "\x89PNG\x0D\x0A\x1A\x0A";

            case 'image/webp':
                // WEBP starts with 'RIFF' and contains 'WEBP' at offset 8
                return substr($data, 0, 4) === 'RIFF' && substr($data, 8, 4) === 'WEBP';

            default:
                return false;
        }
    }
}
