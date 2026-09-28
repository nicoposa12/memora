<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'event_id',
        'template_id',
        'file_path',
        'thumbnail_path',
        'original_file_path',
        'layout',
        'filter',
        'metadata',
        'is_hidden',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_hidden' => 'boolean',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }
}
