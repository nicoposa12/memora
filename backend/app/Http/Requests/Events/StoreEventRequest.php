<?php

namespace App\Http\Requests\Events;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isOrganizer() || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:100', 'regex:/^[a-z0-9-]+$/i', 'unique:events,slug'],
            'event_type' => ['required', 'string', 'in:wedding,birthday,corporate,graduation,party,anniversary,other'],
            'event_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'require_qr_token' => ['nullable', 'boolean'],
            'primary_color' => ['nullable', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'secondary_color' => ['nullable', 'string', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'countdown_seconds' => ['nullable', 'integer', 'min:1', 'max:10'],
            'enable_gallery' => ['nullable', 'boolean'],
        ];
    }
}
