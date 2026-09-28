<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->letters()->numbers(),
            ],
            // Honeypot field for bot mitigation
            '_hp_website' => ['nullable', 'prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            '_hp_website.prohibited' => 'Bot activity detected.',
            'password.min' => 'Password must be at least 8 characters and contain letters and numbers.',
        ];
    }
}
