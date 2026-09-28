<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Payment;
use App\Models\Photo;
use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /**
     * Test 1: Authentication Rate Limiting.
     */
    public function test_auth_rate_limiting_protects_against_brute_force(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/auth/login', [
                'email' => 'victim@example.com',
                'password' => 'wrong-password',
            ]);
            $this->assertContains($response->status(), [422, 200]);
        }

        // 6th attempt should be blocked by throttle:auth (429)
        $rateLimitedResponse = $this->postJson('/api/auth/login', [
            'email' => 'victim@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertEquals(429, $rateLimitedResponse->status());
        $rateLimitedResponse->assertJsonFragment([
            'message' => 'Too many authentication attempts. Please try again in 60 seconds.',
        ]);
    }

    /**
     * Test 2: Event Ownership & IDOR Protection.
     */
    public function test_organizer_cannot_view_or_modify_another_organizers_event(): void
    {
        $organizerA = User::factory()->create(['role' => 'organizer']);
        $organizerB = User::factory()->create(['role' => 'organizer']);

        $eventA = Event::create([
            'user_id' => $organizerA->id,
            'name' => 'Event A',
            'slug' => 'event-a',
            'event_type' => 'wedding',
            'status' => 'active',
        ]);

        // Organizer B attempts to view Organizer A's event
        $viewResponse = $this->actingAs($organizerB)
            ->getJson("/api/events/{$eventA->id}");
        $viewResponse->assertStatus(403);

        // Organizer B attempts to update Organizer A's event
        $updateResponse = $this->actingAs($organizerB)
            ->putJson("/api/events/{$eventA->id}", [
                'name' => 'Hacked Event Name',
            ]);
        $updateResponse->assertStatus(403);

        // Organizer B attempts to delete Organizer A's event
        $deleteResponse = $this->actingAs($organizerB)
            ->deleteJson("/api/events/{$eventA->id}");
        $deleteResponse->assertStatus(403);

        // Organizer A can view their own event
        $ownerResponse = $this->actingAs($organizerA)
            ->getJson("/api/events/{$eventA->id}");
        $ownerResponse->assertStatus(200);
    }

    /**
     * Test 3: Backend Authorization & Role-Based Access Control (RBAC).
     */
    public function test_rbac_restricts_admin_routes_from_regular_organizers(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $admin = User::factory()->create(['role' => 'admin']);

        // Organizer attempting to access audit logs
        $organizerResponse = $this->actingAs($organizer)
            ->getJson('/api/admin/audit-logs');
        $organizerResponse->assertStatus(403);

        // Admin accessing audit logs
        $adminResponse = $this->actingAs($admin)
            ->getJson('/api/admin/audit-logs');
        $adminResponse->assertStatus(200);
    }

    /**
     * Test 4: Secure QR / Event Token Verification.
     */
    public function test_guest_endpoints_require_valid_qr_token_when_enabled(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::create([
            'user_id' => $organizer->id,
            'name' => 'Secure Gala',
            'slug' => 'secure-gala',
            'qr_token' => 'pass-token-12345',
            'require_qr_token' => true,
            'event_type' => 'party',
            'status' => 'active',
        ]);

        // Access without token
        $noTokenResponse = $this->getJson('/api/events/secure-gala');
        $noTokenResponse->assertStatus(403);

        // Access with invalid token
        $badTokenResponse = $this->getJson('/api/events/secure-gala?token=invalid-token');
        $badTokenResponse->assertStatus(403);

        // Access with valid token query parameter
        $validTokenResponse = $this->getJson('/api/events/secure-gala?token=pass-token-12345');
        $validTokenResponse->assertStatus(200);

        // Access with valid token header
        $headerTokenResponse = $this->getJson('/api/events/secure-gala', [
            'X-Event-Token' => 'pass-token-12345',
        ]);
        $headerTokenResponse->assertStatus(200);
    }

    /**
     * Test 5: Secure File Uploads & Magic Byte Inspection.
     */
    public function test_unsafe_executable_disguised_as_image_is_blocked(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::create([
            'user_id' => $organizer->id,
            'name' => 'Upload Test Event',
            'slug' => 'upload-test-event',
            'qr_token' => 'token-upload',
            'require_qr_token' => true,
            'event_type' => 'party',
            'status' => 'active',
        ]);

        // Fake image: PHP script with image/jpeg MIME type
        $fakeScript = UploadedFile::fake()->createWithContent(
            'malicious.jpg',
            '<?php phpinfo(); ?>'
        );

        $response = $this->postJson('/api/events/upload-test-event/photos', [
            'image' => $fakeScript,
            'token' => 'token-upload',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['image']);
    }

    /**
     * Test 6: Valid JPEG Image Upload Passes.
     */
    public function test_valid_image_upload_passes_magic_byte_and_size_checks(): void
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::create([
            'user_id' => $organizer->id,
            'name' => 'Valid Upload Event',
            'slug' => 'valid-upload-event',
            'qr_token' => 'token-valid',
            'require_qr_token' => true,
            'event_type' => 'party',
            'status' => 'active',
        ]);

        $realImage = UploadedFile::fake()->image('photo.jpg', 600, 600);

        $response = $this->postJson('/api/events/valid-upload-event/photos', [
            'image' => $realImage,
            'token' => 'token-valid',
            'layout' => 'strip',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('photos', [
            'event_id' => $event->id,
            'layout' => 'strip',
        ]);
    }

    /**
     * Test 7: Payment Webhook Verification & Replay Protection.
     */
    public function test_payment_webhook_verification_and_idempotency(): void
    {
        $secret = 'test_webhook_secret_key_123';
        Config::set('services.payment.webhook_secret', $secret);

        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::create([
            'user_id' => $organizer->id,
            'name' => 'Premium Event Test',
            'slug' => 'premium-event-test',
            'event_type' => 'corporate',
            'is_premium' => false,
            'status' => 'active',
        ]);

        // 1. Unauthenticated webhook request without secret header
        $unauthResponse = $this->postJson('/api/webhooks/payment', [
            'id' => 'xendit_inv_1001',
            'status' => 'PAID',
        ]);
        $unauthResponse->assertStatus(401);

        // 2. Valid authenticated webhook request
        $validResponse = $this->postJson('/api/webhooks/payment', [
            'id' => 'xendit_inv_1001',
            'event_id' => $event->id,
            'amount' => 1499,
            'currency' => 'PHP',
            'status' => 'PAID',
            'payment_method' => 'gcash',
        ], [
            'X-CALLBACK-TOKEN' => $secret,
        ]);

        $validResponse->assertStatus(200);
        $this->assertTrue($event->fresh()->is_premium);

        // 3. Replay attack / Idempotent duplicate delivery
        $duplicateResponse = $this->postJson('/api/webhooks/payment', [
            'id' => 'xendit_inv_1001',
            'event_id' => $event->id,
            'status' => 'PAID',
        ], [
            'X-CALLBACK-TOKEN' => $secret,
        ]);

        $duplicateResponse->assertStatus(200);
        $duplicateResponse->assertJsonFragment(['status' => 'idempotent']);
    }

    /**
     * Test 8: Security Headers Middleware.
     */
    public function test_security_headers_are_attached_to_all_responses(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
    }

    /**
     * Test 9: RFC 6238 TOTP Two-Factor Authentication.
     */
    public function test_two_factor_totp_service(): void
    {
        $totp = new TwoFactorService();
        $secret = $totp->generateSecretKey();

        $this->assertEquals(16, strlen($secret));

        $interval = (int) floor(time() / 30);
        $validCode = $totp->calculateCode($secret, $interval);

        $this->assertEquals(6, strlen($validCode));
        $this->assertTrue($totp->verifyCode($secret, $validCode));
        $this->assertFalse($totp->verifyCode($secret, '000000'));
    }

    /**
     * Test 10: PRO Per-Event vs STUDIO Workspace Subscription Lifecycle.
     */
    public function test_pro_event_and_studio_subscription_lifecycle(): void
    {
        // 1. Regular organizer creates Event 1 and Event 2
        $organizer = User::factory()->create(['role' => 'organizer']);
        
        $event1 = Event::create([
            'user_id' => $organizer->id,
            'name' => "Maria's Wedding",
            'slug' => 'marias-wedding',
            'event_type' => 'wedding',
            'plan' => 'free',
            'is_premium' => false,
        ]);

        $event2 = Event::create([
            'user_id' => $organizer->id,
            'name' => "Maria's Birthday",
            'slug' => 'marias-birthday',
            'event_type' => 'birthday',
            'plan' => 'free',
            'is_premium' => false,
        ]);

        // Event 1 pays ₱1,499 for PRO
        $event1->update(['is_premium' => true, 'plan' => 'pro']);

        // Event 1 is PRO, Event 2 remains FREE
        $this->assertTrue($event1->fresh()->isPremium());
        $this->assertEquals('pro', $event1->fresh()->plan);
        $this->assertFalse($event2->fresh()->isPremium());
        $this->assertEquals('free', $event2->fresh()->plan);

        // 2. Studio Subscriber: ₱4,999/month covers all workspace events
        $studioOrganizer = User::factory()->create([
            'role' => 'organizer',
            'subscription_plan' => 'studio',
            'subscription_status' => 'active',
            'subscription_expires_at' => now()->addDays(30),
            'subscription_grace_until' => now()->addDays(37),
        ]);

        $this->assertTrue($studioOrganizer->hasActiveStudio());

        // 3. Studio Expiration & Grace Period: Events must NOT be deleted
        $studioOrganizer->update([
            'subscription_status' => 'past_due',
            'subscription_expires_at' => now()->subDay(),
            'subscription_grace_until' => now()->addDays(6), // Within 7-day grace period
        ]);

        $this->assertTrue($studioOrganizer->isStudioInGracePeriod());
        $this->assertTrue($studioOrganizer->hasActiveStudio()); // Grace period keeps access active

        // Fully expired after grace period
        $studioOrganizer->update([
            'subscription_status' => 'expired',
            'subscription_grace_until' => now()->subDay(),
        ]);

        $this->assertFalse($studioOrganizer->hasActiveStudio());
        $this->assertTrue($studioOrganizer->isStudioExpired());
    }
}
