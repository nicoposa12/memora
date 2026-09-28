<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventSetting extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'event_id',
        'countdown_seconds',
        'max_photos_per_guest',
        'enable_gallery',
        'is_public_gallery',
        'enable_stickers',
        'enable_filters',
        'watermark_enabled',
        'primary_color',
        'secondary_color',
        'logo_url',
        'custom_heading',
    ];

    protected $casts = [
        'enable_gallery' => 'boolean',
        'is_public_gallery' => 'boolean',
        'enable_stickers' => 'boolean',
        'enable_filters' => 'boolean',
        'watermark_enabled' => 'boolean',
        'countdown_seconds' => 'integer',
        'max_photos_per_guest' => 'integer',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
