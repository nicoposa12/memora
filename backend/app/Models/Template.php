<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'category',
        'layout',
        'is_premium',
        'thumbnail_url',
        'frame_overlay_url',
        'config_schema',
        'is_active',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
        'is_active' => 'boolean',
        'config_schema' => 'array',
    ];

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}
