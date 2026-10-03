'use client';

import { isAdminRole } from '@/types/user';

export interface RealBoothRecord {
  id: string;
  eventName: string;
  venue: string;
  hostName: string;
  slug: string;
  tier: string;
  photosTaken: number;
  cameraFps: number;
  status: 'active' | 'paused';
  camera: string;
  lastPing: string;
  device?: string;
  battery?: string;
}

export interface RealCustomerRecord {
  id: string;
  name: string;
  email: string;
  studioName: string;
  role: 'customer' | 'client' | 'organizer' | 'guest' | 'admin';
  tier: 'Free Trial' | 'Event Pass' | 'Studio Pro' | 'PRO' | 'STUDIO';
  activeEvents: number;
  totalPhotos: number;
  storageMb: number;
  status: 'active' | 'suspended';
  joinedDate: string;
  subscriptionExpiresAt?: string;
  subscriptionGraceUntil?: string;
  billingCycle?: 'monthly' | 'annual' | 'per_event' | 'none';
  renewalStatus?: 'active' | 'expiring_soon' | 'in_grace_period' | 'expired';
}

export interface RealFlaggedPhoto {
  id: string;
  eventName: string;
  eventSlug: string;
  organizerName: string;
  flagReason: string;
  reportedAt: string;
  photoUrl: string;
  status: 'pending' | 'resolved' | 'removed';
  severity: 'low' | 'medium' | 'high';
}

export interface RealTransaction {
  id: string;
  host: string;
  event: string;
  plan: string;
  amount: string;
  amountNum: number;
  date: string;
  status: string;
  method: string;
}

export interface RealAuditLog {
  id: string;
  event: string;
  actor: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warn' | 'alert' | 'auth';
}

const STORAGE_KEYS = {
  EVENTS: 'memora_events',
  USERS: 'memora_registered_users',
  TRANSACTIONS: 'memora_transactions',
  FLAGGED_PHOTOS: 'memora_flagged_photos',
  AUDIT_LOGS: 'memora_audit_logs',
  CAPTURED_PHOTOS: 'memora_captured_photos_count',
};

// --- EVENTS SANITIZATION ---
// NOTE: Strictly no sample records or seeded demo events. Real events only.
export function isSampleEvent(event: any): boolean {
  if (!event) return true;

  const id = String(event.id || '').toLowerCase().trim();
  const name = String(event.name || event.title || '').toLowerCase().trim();
  const slug = String(event.slug || '').toLowerCase().trim();
  const venue = String(event.location || event.venue || '').toLowerCase().trim();

  // 1. Explicit mock identifiers
  if (id.startsWith('sample-') || id.startsWith('mock-') || id.startsWith('demo-')) {
    return true;
  }

  // 2. Known sample event names from earlier mock states
  const sampleNameSubstrings = [
    'maria & juan',
    'maria and juan',
    'juan & maria',
    'juan and maria',
    "maria's wedding",
    "maria's birthday",
    'marias wedding',
    'marias birthday',
    'nicosnap studio gala',
    'nicosnap studio gala vip',
    'sample event',
    'demo event',
    'mock event',
  ];

  if (sampleNameSubstrings.some((kw) => name.includes(kw))) {
    return true;
  }

  // 3. Known sample slugs
  const sampleSlugs = [
    'maria-juan-wedding',
    'maria-juan-wedding-2026',
    'juan-maria-wedding',
    'marias-wedding',
    'marias-birthday',
    'marias-birthday-celebration',
    'nicosnap-studio-gala',
    'nicosnap-studio-gala-vip',
    'sample-event',
    'demo-event',
  ];

  if (sampleSlugs.some((s) => slug.includes(s))) {
    return true;
  }

  // 4. Known sample venues from demo presets
  if (
    venue.includes('the grand ballroom, manila') ||
    venue.includes('rooftop lounge, bgc') ||
    venue.includes('ayala museum, makati')
  ) {
    return true;
  }

  return false;
}

// --- EVENTS & BOOTHS ---
export function getRealBooths(): RealBoothRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) return [];
    const events = JSON.parse(raw);
    if (!Array.isArray(events)) return [];

    const realEvents = events.filter((e: any) => !isSampleEvent(e));
    if (realEvents.length !== events.length) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(realEvents));
    }

    return realEvents.map((e: any, idx: number) => ({
      id: e.id ? `KB-${e.id.toString().slice(-4)}` : `KB-100${idx + 1}`,
      eventName: e.name || 'Untitled Event',
      venue: e.location || 'Online / Hybrid Venue',
      hostName: e.organizerName || 'Event Host',
      slug: e.slug || 'event',
      tier: e.isPremium ? 'Event Pass' : 'Free Trial',
      photosTaken: e.photoCount || 0,
      cameraFps: 60,
      status: e.status === 'paused' ? 'paused' : 'active',
      camera: '1080p HD',
      lastPing: 'Just now',
      device: 'Web Client / Kiosk',
      battery: '100% (Plugged In)',
    }));
  } catch {
    return [];
  }
}

export function saveRealBooths(booths: RealBoothRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const events = booths.map((b) => ({
      id: b.id.replace('KB-', ''),
      name: b.eventName,
      location: b.venue,
      organizerName: b.hostName,
      slug: b.slug,
      isPremium: b.tier.includes('Event Pass') || b.tier.includes('Pro'),
      photoCount: b.photosTaken,
      status: b.status,
    }));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch {}
}

// Determines administrator access. Based strictly on the account role issued by the backend,
// never on email or display name (anyone can register an email containing "admin").
export function isAdminRecord(u: any): boolean {
  if (!u) return false;
  const role = String(u.role || '').toLowerCase().trim();
  return isAdminRole(role) || role === 'administrator';
}

// Ledger-only helper: hides transactions whose payer label marks them as admin-issued.
// Not used for access control.
export function isAdminHostName(host?: string): boolean {
  const name = String(host || '').toLowerCase().trim();
  return name === 'admin' || name === 'administrator' || name.startsWith('admin');
}

// --- USERS / ORGANIZERS ---
// NOTE: Strictly no sample records or seeded demo data. Real customer accounts only.
export const SAMPLE_USER_IDS = new Set(['USR-8921', 'USR-6412', 'USR-5289', 'USR-3190']);
export const SAMPLE_USER_EMAILS = new Set([
  'sofia@valderamaphoto.com',
  'marcus@luminaevents.com',
  'camille@vividbooths.ph',
  'elena@novaphotobooth.co',
]);

export function isSampleCustomer(u: any): boolean {
  if (!u) return false;
  const id = String(u.id || '').toUpperCase().trim();
  const email = String(u.email || '').toLowerCase().trim();
  const name = String(u.name || '').toLowerCase().trim();
  if (SAMPLE_USER_IDS.has(id)) return true;
  if (SAMPLE_USER_EMAILS.has(email)) return true;
  if (
    name.includes('sofia valderama') ||
    name.includes('marcus chen') ||
    name.includes('camille santos') ||
    name.includes('elena gomez')
  ) {
    return true;
  }
  return false;
}

// NOTE: Strictly empty. Never seed mock/sample user data.
export const DEFAULT_INITIAL_CUSTOMERS: RealCustomerRecord[] = [];

export function getRealCustomers(): RealCustomerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const list: RealCustomerRecord[] = [];
    
    // Check registered accounts store
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (rawUsers) {
      const parsed = JSON.parse(rawUsers);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strictly filter out administrators and any legacy sample demo records
        const nonSamples = parsed.filter((u: any) => !isAdminRecord(u) && !isSampleCustomer(u));
        
        // If sample records were detected in localStorage, scrub them immediately
        if (nonSamples.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(nonSamples));
        }

        list.push(
          ...nonSamples.map((u: any) => {
            if (
              !u.subscriptionExpiresAt &&
              (u.tier === 'Event Pass' || u.tier === 'PRO' || u.tier === 'Studio Pro' || u.tier === 'STUDIO')
            ) {
              const d = new Date();
              d.setDate(d.getDate() + 30);
              return {
                ...u,
                subscriptionExpiresAt: d.toISOString().split('T')[0],
                billingCycle: (u.billingCycle || (u.tier?.includes('Studio') ? 'monthly' : 'per_event')) as 'monthly' | 'annual' | 'per_event' | 'none',
                renewalStatus: (u.renewalStatus || 'active') as 'active' | 'expiring_soon' | 'in_grace_period' | 'expired',
              };
            }
            return u;
          })
        );
      }
    }

    // Check active session user (strictly exclude administrators and sample demo users)
    const rawCurrentUser = localStorage.getItem('memora_user');
    if (rawCurrentUser) {
      const current = JSON.parse(rawCurrentUser);
      if (!isAdminRecord(current) && !isSampleCustomer(current) && current.email) {
        const exists = list.some(u => u.email?.toLowerCase() === current.email?.toLowerCase());
        if (!exists) {
          list.push({
            id: current.id || 'CST-001',
            name: current.name || 'Active Organizer',
            email: current.email,
            studioName: current.studioName || `${current.name || 'Organizer'}'s Studio`,
            role: current.role || 'organizer',
            tier: current.plan === 'pro' 
              ? 'Studio Pro' 
              : current.plan === 'event' 
              ? 'Event Pass' 
              : 'Free Trial',
            activeEvents: getRealBooths().length,
            totalPhotos: current.photosUsed || 0,
            storageMb: (current.photosUsed || 0) * 5,
            status: 'active',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            subscriptionExpiresAt: current.plan === 'pro' || current.plan === 'event' ? '2026-10-28' : undefined,
            billingCycle: current.plan === 'pro' ? 'monthly' : current.plan === 'event' ? 'per_event' : 'none',
            renewalStatus: 'active',
          });
        }
      }
    }

    // Filter out any admin accounts and sample records from customer list
    return list.filter(u => !isAdminRecord(u) && !isSampleCustomer(u));
  } catch {
    return [];
  }
}

export function saveRealCustomers(customers: RealCustomerRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = customers.filter(u => !isAdminRecord(u) && !isSampleCustomer(u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(clean));
  } catch {}
}

export function createRealCustomer(record: Omit<RealCustomerRecord, 'id' | 'joinedDate'> & { id?: string }): RealCustomerRecord {
  const current = getRealCustomers();
  let expiresAt = record.subscriptionExpiresAt;
  if (!expiresAt && (record.tier === 'Event Pass' || record.tier === 'PRO' || record.tier === 'Studio Pro' || record.tier === 'STUDIO')) {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    expiresAt = d.toISOString().split('T')[0];
  }

  const newCustomer: RealCustomerRecord = {
    id: record.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    activeEvents: record.activeEvents ?? 0,
    totalPhotos: record.totalPhotos ?? 0,
    storageMb: record.storageMb ?? 0,
    status: record.status || 'active',
    name: record.name,
    email: record.email,
    studioName: record.studioName || `${record.name}'s Studio`,
    role: record.role || 'organizer',
    tier: record.tier || 'Studio Pro',
    subscriptionExpiresAt: expiresAt,
    subscriptionGraceUntil: record.subscriptionGraceUntil,
    billingCycle: record.billingCycle || (record.tier === 'Studio Pro' ? 'monthly' : record.tier === 'Event Pass' ? 'per_event' : 'none'),
    renewalStatus: record.renewalStatus || 'active',
  };
  current.unshift(newCustomer);
  saveRealCustomers(current);
  return newCustomer;
}

/**
 * Synchronize or register an active user into real customer records.
 */
export function createOrUpdateCustomerFromUser(user: any): RealCustomerRecord | null {
  if (!user || isAdminRecord(user) || !user.email) return null;
  const current = getRealCustomers();
  const existingIndex = current.findIndex(c => c.email.toLowerCase() === user.email.toLowerCase());

  const tier = user.subscription_plan === 'studio' 
    ? 'Studio Pro' 
    : user.subscription_plan === 'pro' || user.plan === 'pro' 
    ? 'Event Pass' 
    : 'Free Trial';

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      name: user.name || current[existingIndex].name,
      role: user.role || current[existingIndex].role,
      tier: tier,
      status: user.subscription_status === 'suspended' ? 'suspended' : 'active',
      subscriptionExpiresAt: user.subscription_expires_at || current[existingIndex].subscriptionExpiresAt,
      subscriptionGraceUntil: user.subscription_grace_until || current[existingIndex].subscriptionGraceUntil,
    };
    saveRealCustomers(current);
    return current[existingIndex];
  } else {
    const newCustomer: RealCustomerRecord = {
      id: user.id ? `USR-${user.id}` : `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: user.name || 'Organizer',
      email: user.email,
      studioName: `${user.name || 'Organizer'}'s Studio`,
      role: user.role || 'organizer',
      tier: tier,
      activeEvents: 0,
      totalPhotos: 0,
      storageMb: 0,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subscriptionExpiresAt: user.subscription_expires_at,
      subscriptionGraceUntil: user.subscription_grace_until,
      billingCycle: tier === 'Studio Pro' ? 'monthly' : tier === 'Event Pass' ? 'per_event' : 'none',
      renewalStatus: 'active',
    };
    current.unshift(newCustomer);
    saveRealCustomers(current);
    return newCustomer;
  }
}

/**
 * Fetch registered users directly from backend PostgreSQL database.
 */
export async function fetchBackendCustomers(): Promise<RealCustomerRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const { apiClient } = require('@/lib/api');
    const res = await apiClient.get('/admin/users');
    const users: any[] = res.data?.users || [];
    if (!Array.isArray(users)) return getRealCustomers();

    const current = getRealCustomers();
    const mapped: RealCustomerRecord[] = users
      .filter((u) => !isAdminRecord(u) && !isSampleCustomer(u))
      .map((u) => {
        const existing = current.find((c) => c.email.toLowerCase() === u.email.toLowerCase());
        const tier = u.subscription_plan === 'studio' 
          ? 'Studio Pro' 
          : u.subscription_plan === 'pro' 
          ? 'Event Pass' 
          : 'Free Trial';

        const joinedDate = u.created_at
          ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : (existing?.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

        return {
          id: `USR-${u.id}`,
          name: u.name,
          email: u.email,
          studioName: existing?.studioName || `${u.name}'s Studio`,
          role: u.role || 'organizer',
          tier: tier,
          activeEvents: u.events_count ?? existing?.activeEvents ?? 0,
          totalPhotos: existing?.totalPhotos ?? 0,
          storageMb: existing?.storageMb ?? 0,
          status: (u.subscription_status === 'suspended' ? 'suspended' : 'active') as 'active' | 'suspended',
          joinedDate: joinedDate,
          subscriptionExpiresAt: u.subscription_expires_at || existing?.subscriptionExpiresAt,
          subscriptionGraceUntil: u.subscription_grace_until || existing?.subscriptionGraceUntil,
          billingCycle: (tier === 'Studio Pro' ? 'monthly' : tier === 'Event Pass' ? 'per_event' : 'none') as any,
          renewalStatus: (u.subscription_status || 'active') as any,
        };
      });

    // Also preserve any unique local users
    for (const c of current) {
      if (!mapped.some((m) => m.email.toLowerCase() === c.email.toLowerCase())) {
        mapped.push(c);
      }
    }

    saveRealCustomers(mapped);
    return mapped;
  } catch (err) {
    return getRealCustomers();
  }
}

export function updateRealCustomer(id: string, updates: Partial<RealCustomerRecord>): RealCustomerRecord | null {
  const current = getRealCustomers();
  const index = current.findIndex(c => c.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveRealCustomers(current);

  // Sync if this user is the active logged in session
  if (typeof window !== 'undefined') {
    try {
      const rawUser = localStorage.getItem('memora_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed.email && parsed.email.toLowerCase() === current[index].email.toLowerCase()) {
          const updatedPlan = current[index].tier === 'Studio Pro' 
            ? 'pro' 
            : current[index].tier === 'Event Pass' 
            ? 'event' 
            : 'free';
          localStorage.setItem('memora_user', JSON.stringify({
            ...parsed,
            name: current[index].name,
            plan: updatedPlan,
            status: current[index].status,
          }));
        }
      }
    } catch {}
  }

  return current[index];
}

export function deleteRealCustomer(id: string): boolean {
  const current = getRealCustomers();
  const filtered = current.filter(c => c.id !== id);
  if (filtered.length === current.length) return false;
  saveRealCustomers(filtered);
  return true;
}

// --- FLAGGED PHOTOS (MODERATION) ---
export function getRealFlaggedPhotos(): RealFlaggedPhoto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLAGGED_PHOTOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRealFlaggedPhotos(photos: RealFlaggedPhoto[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FLAGGED_PHOTOS, JSON.stringify(photos));
  } catch {}
}

// --- TRANSACTIONS & REVENUE ---
export function getRealTransactions(): RealTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Strictly exclude any transactions from administrators
    return parsed.filter(t => !isAdminHostName(t.host));
  } catch {
    return [];
  }
}

export function recordRealTransaction(tx: Omit<RealTransaction, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return;
  try {
    // If the active session user is an administrator, do not record revenue or transactions
    const rawCurrentUser = localStorage.getItem('memora_user');
    if (rawCurrentUser) {
      const current = JSON.parse(rawCurrentUser);
      if (isAdminRecord(current)) {
        return;
      }
    }

    // Also do not record if host indicates admin
    if (isAdminHostName(tx.host)) {
      return;
    }

    const current = getRealTransactions();
    const newTx: RealTransaction = {
      ...tx,
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
    };
    current.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(current));
  } catch {}
}

// --- AUDIT LOGS ---
export function getRealAuditLogs(): RealAuditLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearRealAuditLogs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  } catch {}
}

export function clearRealTransactions(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  } catch {}
}

export function recordRealAuditLog(event: string, actor = 'System Admin', severity: RealAuditLog['severity'] = 'info'): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRealAuditLogs();
    const newLog: RealAuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      event,
      actor,
      ip: 'Client Local',
      timestamp: 'Just now',
      severity,
    };
    current.unshift(newLog);
    // Keep last 50
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(current.slice(0, 50)));
  } catch {}
}

// --- TOTAL PHOTOS COUNT ---
export function getRealTotalPhotos(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const count = localStorage.getItem(STORAGE_KEYS.CAPTURED_PHOTOS);
    if (count) return parseInt(count, 10) || 0;
    
    // Or sum up from booths
    const booths = getRealBooths();
    return booths.reduce((acc, b) => acc + (b.photosTaken || 0), 0);
  } catch {
    return 0;
  }
}

export function incrementRealPhotos(amount = 1): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getRealTotalPhotos();
    localStorage.setItem(STORAGE_KEYS.CAPTURED_PHOTOS, (current + amount).toString());
  } catch {}
}
