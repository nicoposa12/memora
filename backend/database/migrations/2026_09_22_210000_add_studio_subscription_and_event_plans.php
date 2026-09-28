<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('subscription_plan')->default('none')->after('role'); // none, studio
            $table->string('subscription_status')->default('none')->after('subscription_plan'); // none, active, past_due, expired
            $table->timestamp('subscription_expires_at')->nullable()->after('subscription_status');
            $table->timestamp('subscription_grace_until')->nullable()->after('subscription_expires_at');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->string('plan')->default('free')->after('status'); // free, pro, studio
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'subscription_plan',
                'subscription_status',
                'subscription_expires_at',
                'subscription_grace_until',
            ]);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('plan');
        });
    }
};
