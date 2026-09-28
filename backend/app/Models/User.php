<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'subscription_plan',
        'subscription_status',
        'subscription_expires_at',
        'subscription_grace_until',
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOrganizer(): bool
    {
        return $this->role === 'organizer';
    }

    public function hasTwoFactorEnabled(): bool
    {
        return !empty($this->two_factor_secret) && !is_null($this->two_factor_confirmed_at);
    }

    /**
     * Check if user has an active Studio subscription (or is currently within grace period).
     */
    public function hasActiveStudio(): bool
    {
        if ($this->subscription_plan !== 'studio') {
            return false;
        }

        if ($this->subscription_status === 'active') {
            return is_null($this->subscription_expires_at) || $this->subscription_expires_at->isFuture();
        }

        // Within 7-day grace period after expiration
        if (in_array($this->subscription_status, ['past_due', 'grace_period', 'expired']) && $this->subscription_grace_until) {
            return $this->subscription_grace_until->isFuture();
        }

        return false;
    }

    /**
     * Check if user is past expiration but within the 3-7 day grace period.
     */
    public function isStudioInGracePeriod(): bool
    {
        return $this->subscription_plan === 'studio'
            && in_array($this->subscription_status, ['past_due', 'grace_period', 'expired'])
            && $this->subscription_grace_until
            && $this->subscription_grace_until->isFuture();
    }

    /**
     * Check if user's Studio subscription is completely expired.
     */
    public function isStudioExpired(): bool
    {
        if ($this->subscription_plan !== 'studio') {
            return false;
        }

        if ($this->subscription_status === 'expired') {
            return is_null($this->subscription_grace_until) || $this->subscription_grace_until->isPast();
        }

        return false;
    }

    /**
     * Can user create new premium events? Only active Studio users.
     */
    public function canCreatePremiumEvent(): bool
    {
        return $this->hasActiveStudio();
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'two_factor_secret' => 'encrypted',
            'two_factor_recovery_codes' => 'encrypted:array',
            'subscription_expires_at' => 'datetime',
            'subscription_grace_until' => 'datetime',
        ];
    }
}
