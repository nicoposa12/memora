<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    /**
     * Determine whether the user can delete the photo.
     */
    public function delete(User $user, Photo $photo): bool
    {
        return $user->id === $photo->event->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can moderate/hide the photo.
     */
    public function moderate(User $user, Photo $photo): bool
    {
        return $user->id === $photo->event->user_id || $user->isAdmin();
    }
}
