<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'qr_token',
        'require_qr_token',
        'event_type',
        'event_date',
        'description',
        'location',
        'status',
        'plan',
        'is_premium',
        'cover_image_url',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_premium' => 'boolean',
        'require_qr_token' => 'boolean',
    ];

    protected $appends = [
        'effective_plan',
    ];

    public function getEffectivePlanAttribute(): string
    {
        if ($this->plan === 'pro' || $this->is_premium) {
            return 'pro';
        }

        if ($this->relationLoaded('user') && $this->user?->hasActiveStudio()) {
            return 'studio';
        }

        return $this->plan ?? 'free';
    }

    public function isPremium(): bool
    {
        return $this->is_premium 
            || $this->plan === 'pro' 
            || ($this->user && $this->user->hasActiveStudio());
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->qr_token)) {
                $event->qr_token = \Illuminate\Support\Str::random(40);
            }
        });
    }

    public function regenerateQrToken(): string
    {
        $this->qr_token = \Illuminate\Support\Str::random(40);
        $this->save();
        return $this->qr_token;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function settings()
    {
        return $this->hasOne(EventSetting::class);
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
