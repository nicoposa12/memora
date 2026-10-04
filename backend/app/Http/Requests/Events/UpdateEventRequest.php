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
}
