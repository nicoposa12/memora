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
        Schema::create('photos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUuid('template_id')->nullable()->constrained('templates')->nullOnDelete();
            $table->string('file_path'); // R2 storage path
            $table->string('thumbnail_path')->nullable();
            $table->string('original_file_path')->nullable();
            $table->string('layout')->default('strip');
            $table->string('filter')->default('normal');
            $table->json('metadata')->nullable();
            $table->boolean('is_hidden')->default(false);
            $table->timestamps();

            $table->index('event_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
