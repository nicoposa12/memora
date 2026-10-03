import { isAdminRecord, isSampleEvent } from '@/lib/adminRecords';
export { isSampleEvent };

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_expires_at?: string;
  subscription_grace_until?: string;
  [key: string]: any;
}

/**
 * Retrieve currently logged-in user from localStorage.
 */
export function getCurrentUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('memora_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Check if the given event belongs to the specified user.
 * Administrators always have access to all real user events.
 */
export function isEventOwner(event: any, user: StoredUser | null): boolean {
  if (!event || isSampleEvent(event)) return false;
  if (!user) return false;

  // Administrators can view and manage all real events across the platform
  if (isAdminRecord(user)) {
    return true;
  }

  const currentEmail = String(user.email || '').toLowerCase().trim();
  const currentUserId = String(user.id || '').trim();
  const currentName = String(user.name || '').toLowerCase().trim();

  const eventEmail = String(event.organizerEmail || event.userEmail || '').toLowerCase().trim();
  const eventUserId = String(event.userId || '').trim();
  const eventOrganizerName = String(event.organizerName || '').toLowerCase().trim();

  // 1. Direct match on creator email
  if (eventEmail && currentEmail && eventEmail === currentEmail) {
    return true;
  }

  // 2. Direct match on user ID
  if (eventUserId && currentUserId && eventUserId === currentUserId) {
    return true;
  }

  // 3. Fallback for legacy events: match organizer name only if it's a specific personal/studio name
  const genericPlaceholders = ['organizer', 'event host', 'system admin', 'host', 'admin', 'administrator', ''];
  if (!eventEmail && !eventUserId && eventOrganizerName && currentName && !genericPlaceholders.includes(eventOrganizerName)) {
    return eventOrganizerName === currentName;
  }

  return false;
}

/**
 * Fetch all raw events stored in localStorage.
 * Automatically purges any legacy sample or demo events.
 */
export function getAllEvents(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('memora_events');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out all sample/mock events
    const realEvents = parsed.filter((e) => !isSampleEvent(e));

    // If any sample events were found in storage, scrub them immediately
    if (realEvents.length !== parsed.length) {
      localStorage.setItem('memora_events', JSON.stringify(realEvents));
    }

    return realEvents;
  } catch {
    return [];
  }
}

/**
 * Save raw events array back to localStorage.
 */
export function saveAllEvents(events: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = Array.isArray(events) ? events.filter((e) => !isSampleEvent(e)) : [];
    localStorage.setItem('memora_events', JSON.stringify(clean));
  } catch {}
}

/**
 * Get events filtered by the current user's ownership.
 * If user is an administrator, returns all real events.
 * If user is an organizer, only returns real events they own.
 */
export function getScopedEvents(user?: StoredUser | null): any[] {
  const activeUser = user !== undefined ? user : getCurrentUser();
  const allEvents = getAllEvents();
  if (!activeUser) return [];
  if (isAdminRecord(activeUser)) {
    return allEvents.filter((e) => !isSampleEvent(e));
  }
  return allEvents.filter((e) => !isSampleEvent(e) && isEventOwner(e, activeUser));
}

/**
 * Safely delete an event by ID from the global list without affecting other users' events.
 */
export function deleteStoredEvent(eventId: string | number): any[] {
  const allEvents = getAllEvents();
  const cleanId = String(eventId);
  const updated = allEvents.filter((e) => String(e.id) !== cleanId);
  saveAllEvents(updated);
  return updated;
}

/**
 * Safely update an event by ID in the global list.
 */
export function updateStoredEvent(updatedEvent: any): any[] {
  const allEvents = getAllEvents();
  const cleanId = String(updatedEvent.id);
  const updated = allEvents.map((e) => (String(e.id) === cleanId ? { ...e, ...updatedEvent } : e));
  saveAllEvents(updated);
  return updated;
}

export interface EventLimitStatus {
  allowed: boolean;
  maxEvents: number; // -1 for unlimited
  currentCount: number;
  planName: string;
  isProPass: boolean;
  isStudio: boolean;
  isAdmin: boolean;
  reason?: string;
  existingEventName?: string;
  existingEventSlug?: string;
  existingEventDate?: string;
  existingEventType?: string;
}

/**
 * Determine event creation eligibility and limits for a user based on their active plan.
 * - Administrators: Unlimited events
 * - STUDIO Monthly Subscribers: Unlimited events
 * - PRO Event Pass Holders: Maximum 1 event (Single Event Pass)
 * - Free / Trial Users: Maximum 1 event
 */
export function getUserEventLimitStatus(user?: StoredUser | null): EventLimitStatus {
  const activeUser = user !== undefined ? user : getCurrentUser();
  const scoped = getScopedEvents(activeUser);
  const count = scoped.length;

  if (!activeUser) {
    return {
      allowed: false,
      maxEvents: 0,
      currentCount: 0,
      planName: 'Guest',
      isProPass: false,
      isStudio: false,
      isAdmin: false,
      reason: 'Please log in to your account to create an event.',
    };
  }

  // 1. Administrators have full complimentary access and unlimited events
  if (isAdminRecord(activeUser)) {
    return {
      allowed: true,
      maxEvents: -1,
      currentCount: count,
      planName: 'Administrator',
      isProPass: false,
      isStudio: true,
      isAdmin: true,
    };
  }

  // 2. STUDIO Subscribers have unlimited concurrent events
  const isStudioActive =
    activeUser.subscription_plan === 'studio' &&
    (!activeUser.subscription_status ||
      activeUser.subscription_status === 'active' ||
      activeUser.subscription_status === 'past_due');

  if (isStudioActive) {
    return {
      allowed: true,
      maxEvents: -1,
      currentCount: count,
      planName: 'STUDIO Monthly',
      isProPass: false,
      isStudio: true,
      isAdmin: false,
    };
  }

  // 3. PRO Event Pass (Single Event Pass)
  const isPro = activeUser.plan === 'pro' || activeUser.subscription_plan === 'pro';
  if (isPro) {
    const maxEvents = 1;
    const allowed = count < maxEvents;
    const firstEvent = scoped[0];
    return {
      allowed,
      maxEvents,
      currentCount: count,
      planName: 'PRO Pass',
      isProPass: true,
      isStudio: false,
      isAdmin: false,
      existingEventName: firstEvent?.name || firstEvent?.title,
      existingEventSlug: firstEvent?.slug,
      existingEventDate: firstEvent?.date,
      existingEventType: firstEvent?.eventType,
      reason: !allowed
        ? `Your PRO Event Pass includes full coverage for 1 event. You currently have 1 active event ("${firstEvent?.name || 'Your Event'}"). Upgrade to STUDIO Monthly for unlimited concurrent events.`
        : undefined,
    };
  }

  // 4. Free / Trial account (includes 1 trial event)
  const maxEvents = 1;
  const allowed = count < maxEvents;
  const firstEvent = scoped[0];
  return {
    allowed,
    maxEvents,
    currentCount: count,
    planName: 'Free Trial',
    isProPass: false,
    isStudio: false,
    isAdmin: false,
    existingEventName: firstEvent?.name || firstEvent?.title,
    existingEventSlug: firstEvent?.slug,
    existingEventDate: firstEvent?.date,
    existingEventType: firstEvent?.eventType,
    reason: !allowed
      ? `Your Free Trial includes 1 event. You currently have 1 active event ("${firstEvent?.name || 'Your Event'}"). Upgrade to STUDIO Monthly for unlimited concurrent events.`
      : undefined,
  };
}
