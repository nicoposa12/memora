<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin Account
        User::updateOrCreate(
            ['email' => 'admin@memora.studio'],
            [
                'name' => 'System Administrator',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'role' => 'admin',
                'subscription_plan' => 'pro',
                'subscription_status' => 'active',
            ]
        );

        // Organizer Account
        User::updateOrCreate(
            ['email' => 'organizer@memora.studio'],
            [
                'name' => 'Studio Organizer',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'organizer',
                'subscription_plan' => 'pro',
                'subscription_status' => 'active',
            ]
        );
    }
}
