<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Account credentials are read from the environment and are never hardcoded.
     * An account is skipped when its email or password is not set.
     */
    public function run(): void
    {
        $this->seedAccount(
            email: env('SEED_ADMIN_EMAIL'),
            password: env('SEED_ADMIN_PASSWORD'),
            name: 'System Administrator',
            role: 'admin',
        );

        $this->seedAccount(
            email: env('SEED_ORGANIZER_EMAIL'),
            password: env('SEED_ORGANIZER_PASSWORD'),
            name: 'Studio Organizer',
            role: 'organizer',
        );
    }

    private function seedAccount(?string $email, ?string $password, string $name, string $role): void
    {
        if (blank($email) || blank($password)) {
            $this->command?->warn("Skipping {$role} account: set SEED_" . strtoupper($role) . '_EMAIL and SEED_' . strtoupper($role) . '_PASSWORD in .env.');
            return;
        }

        if (strlen($password) < 12) {
            $this->command?->error("Skipping {$role} account: password must be at least 12 characters.");
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => $role,
                'subscription_plan' => 'pro',
                'subscription_status' => 'active',
            ]
        );
    }
}
