<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_returns_error_when_unconfigured(): void
    {
        Config::set('services.google.client_id', null);
        Config::set('services.google.client_secret', null);

        $response = $this->getJson('/api/auth/google/redirect');

        $response->assertStatus(503)
            ->assertJsonStructure(['message']);
    }

    public function test_google_redirect_returns_target_url_when_configured(): void
    {
        Config::set('services.google.client_id', 'test-client-id.apps.googleusercontent.com');
        Config::set('services.google.client_secret', 'test-client-secret');

        $response = $this->getJson('/api/auth/google/redirect');

        $response->assertStatus(200)
            ->assertJsonStructure(['url']);

        $this->assertStringContainsString('accounts.google.com', $response->json('url'));
        $this->assertStringContainsString('test-client-id', $response->json('url'));
    }

    public function test_google_token_exchange_validates_required_credential(): void
    {
        $response = $this->postJson('/api/auth/google/token', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['credential']);
    }

    public function test_google_token_exchange_creates_new_user_and_token(): void
    {
        Config::set('services.google.client_id', 'test-client-id');

        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
                'aud' => 'test-client-id',
                'sub' => 'google-user-12345',
                'email' => 'sarah@example.com',
                'name' => 'Sarah Connor',
                'picture' => 'https://lh3.googleusercontent.com/photo.jpg',
            ], 200),
        ]);

        $response = $this->postJson('/api/auth/google/token', [
            'credential' => 'valid-mock-jwt-credential',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role', 'avatar'],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'sarah@example.com',
            'google_id' => 'google-user-12345',
            'role' => 'organizer',
        ]);
    }

    public function test_google_token_exchange_links_existing_user(): void
    {
        Config::set('services.google.client_id', 'test-client-id');

        $existingUser = User::create([
            'name' => 'Sarah Existing',
            'email' => 'sarah@example.com',
            'password' => bcrypt('password123456'),
            'role' => 'organizer',
        ]);

        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
                'aud' => 'test-client-id',
                'sub' => 'google-user-99999',
                'email' => 'sarah@example.com',
                'name' => 'Sarah Connor',
                'picture' => 'https://lh3.googleusercontent.com/avatar.jpg',
            ], 200),
        ]);

        $response = $this->postJson('/api/auth/google/token', [
            'credential' => 'valid-mock-jwt-credential',
        ]);

        $response->assertStatus(200);

        $existingUser->refresh();
        $this->assertEquals('google-user-99999', $existingUser->google_id);
    }
}
