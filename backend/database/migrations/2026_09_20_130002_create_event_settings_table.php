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
        Schema::create('event_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->integer('countdown_seconds')->default(3);
            $table->integer('max_photos_per_guest')->default(15);
            $table->boolean('enable_gallery')->default(true);
            $table->boolean('is_public_gallery')->default(true);
            $table->boolean('enable_stickers')->default(true);
            $table->boolean('enable_filters')->default(true);
            $table->boolean('watermark_enabled')->default(true);
            $table->string('primary_color')->default('#8b5cf6');
            $table->string('secondary_color')->default('#ec4899');
            $table->string('logo_url')->nullable();
            $table->string('custom_heading')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_settings');
    }
};
