<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('qr_token', 64)->nullable()->after('slug')->index();
            $table->boolean('require_qr_token')->default(true)->after('qr_token');
        });

        // Backfill existing events with cryptographically random tokens
        $events = DB::table('events')->whereNull('qr_token')->get();
        foreach ($events as $event) {
            DB::table('events')
                ->where('id', $event->id)
                ->update(['qr_token' => Str::random(40)]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['qr_token']);
            $table->dropColumn(['qr_token', 'require_qr_token']);
        });
    }
};
