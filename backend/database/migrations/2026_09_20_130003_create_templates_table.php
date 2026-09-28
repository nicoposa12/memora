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
        Schema::create('templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('category')->default('general'); // wedding, birthday, corporate, minimal
            $table->string('layout')->default('strip'); // strip, polaroid, single, grid
            $table->boolean('is_premium')->default(false);
            $table->string('thumbnail_url')->nullable();
            $table->string('frame_overlay_url')->nullable();
            $table->json('config_schema')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
