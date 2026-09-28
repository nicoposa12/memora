/**
 * User Roles Architecture:
 * 1. Event Organizer ('organizer'): The person who creates and manages events, selects frames, generates QR codes, and purchases event passes.
 * 2. System Admin ('admin'): The owner/operator who manages users, events, payments, templates, flagged photos, and platform settings.
 * 
 * Note: Guests/Participants are 100% ACCOUNT-FREE! They do not have user accounts and access photobooths directly via event QR links.
 */
export type UserRole = 'organizer' | 'admin' | 'client' | 'customer' | 'host';
export type OrganizerPlan = 'free' | 'pro' | 'studio' | 'event';
export type ClientPlan = OrganizerPlan;
export type SubscriptionStatus = 'active' | 'past_due' | 'grace_period' | 'expired' | 'canceled';

export interface MemoraUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: OrganizerPlan;
  subscription_plan?: 'free' | 'studio';
  subscription_status?: SubscriptionStatus;
  subscription_expires_at?: string;
  subscription_grace_until?: string;
  studioName?: string;
  photosUsed?: number;
  maxPhotos?: number;
}

/**
 * Checks if the user is an Event Organizer
 */
export function isOrganizerRole(role?: string): boolean {
  return !role || role === 'organizer' || role === 'client' || role === 'customer' || role === 'host';
}

/**
 * Backwards compatibility alias for isOrganizerRole
 */
export const isClientRole = isOrganizerRole;

/**
 * Checks if the user is a System Admin (the platform operator who manages all)
 */
export function isAdminRole(role?: string): boolean {
  return role === 'admin' || role === 'superadmin';
}

/**
 * Clean display name for roles
 */
export function getRoleDisplayName(role?: string): string {
  if (isAdminRole(role)) return 'System Admin';
  return 'Event Organizer';
}
