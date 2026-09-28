<?php

namespace App\Http\Requests\Photos;

use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required'], // String (base64) or UploadedFile, strictly verified in PhotoUploadService
            'layout' => ['nullable', 'string', 'in:strip,grid,single,polaroid'],
            'filter' => ['nullable', 'string', 'in:normal,vintage,bw,sepia,cyberpunk,noir,retro,warm,cool'],
            'metadata' => ['nullable', 'array'],
            'token' => ['nullable', 'string', 'max:100'],
            // Honeypot field for bot mitigation
            '_hp_website' => ['nullable', 'prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            '_hp_website.prohibited' => 'Bot activity detected.',
        ];
    }
}
