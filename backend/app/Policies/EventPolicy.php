<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Determine whether the user can view any events.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the event.
     */
    public function view(User $user, Event $event): bool
    {
        return $user->id === $event->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create events.
     */
    public function create(User $user): bool
    {
        return $user->isOrganizer() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the event.
     */
    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the event.
     * Only platform administrators are permitted to delete events.
     */
    public function delete(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can archive or restore the event.
     * Only platform administrators are permitted to archive events.
     */
    public function archive(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can regenerate the event's QR token.
     */
    public function regenerateQrToken(User $user, Event $event): bool
    {
        return $user->id === $event->user_id || $user->isAdmin();
    }
}

