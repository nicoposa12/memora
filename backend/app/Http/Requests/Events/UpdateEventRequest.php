<?php

namespace App\Http\Requests\Events;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        $event = $this->route('event');
        return $this->user()->can('update', $event);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => ['sometimes', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/i'],
            'event_type' => ['sometimes', 'string', 'in:school,beach,party,wedding,birthday,graduation,corporate,debut,anniversary,other'],
            'event_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'in:draft,active,completed,archived'],
            'require_qr_token' => ['sometimes', 'boolean'],
            'settings' => ['sometimes', 'array'],
            'settings.countdown_seconds' => ['nullable', 'integer', 'min:0', 'max:10'],
            'settings.primary_color' => ['nullable', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'settings.secondary_color' => ['nullable', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'settings.enable_gallery' => ['nullable', 'boolean'],
            'settings.is_public_gallery' => ['nullable', 'boolean'],
            'settings.watermark_enabled' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $user = $this->user();
            $event = $this->route('event');

            if ($this->has('status') && $user) {
                $newStatus = $this->input('status');
                $isArchiving = $newStatus === 'archived';
                $isRestoring = $event && $event->status === 'archived' && $newStatus !== 'archived';

                if (($isArchiving || $isRestoring) && !$user->isAdmin()) {
                    $validator->errors()->add('status', 'Only administrators are authorized to archive or restore events.');
                }
            }
        });
    }
}
