'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Plus, 
  Search, 
  QrCode, 
  ExternalLink, 
  Trash2, 
  Archive, 
  Edit3, 
  Check, 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Crown,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { QrShareCard } from '@/features/events/components/QrShareCard';
import { isAdminRole } from '@/types/user';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';
import { useModal } from '@/context/ModalContext';
import { getEventEmoji, getEventLabel, EVENT_TYPES_LIST } from '@/types';

interface PhotoboothEvent {
  id: string;
  name: string;
  slug: string;
  date: string;
  venue: string;
  themeColor: string;
  status: 'active' | 'archived' | 'draft';
  plan: 'free' | 'pro' | 'studio';
  eventType?: string;
  price?: string;
  paymentStatus?: 'PAID' | 'UNPAID';
  photosCount: number;
  activeGuests: number;
  allowGuestUploads: boolean;
  publicGallery: boolean;
}

export default function EventOrganizerEventsPage() {
  const { confirm: confirmModal } = useModal();
  const [studioPlan, setStudioPlan] = useState<'free' | 'studio'>('free');
  const [studioStatus, setStudioStatus] = useState<string>('active');
  const [studioGraceUntil, setStudioGraceUntil] = useState<string>('');

  const [events, setEvents] = useState<PhotoboothEvent[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrEvent, setSelectedQrEvent] = useState<{ name: string; slug: string } | null>(null);
  const [editingEvent, setEditingEvent] = useState<PhotoboothEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpgradingId, setIsUpgradingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadEventsData = React.useCallback(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        const adminUser = isAdminRole(u.role) || u.email?.toLowerCase().includes('admin') || u.role === 'admin';
        setIsAdmin(adminUser);
        if (adminUser || u.subscription_plan === 'studio') {
          setStudioPlan('studio');
          setStudioStatus('active');
        } else {
          if (u.subscription_plan === 'studio') setStudioPlan('studio');
          if (u.subscription_status) setStudioStatus(u.subscription_status);
          if (u.subscription_grace_until) setStudioGraceUntil(u.subscription_grace_until);
        }
      }

      const storedEvents = localStorage.getItem('memora_events');
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: PhotoboothEvent[] = parsed.map((e: any, idx: number) => ({
            id: e.id || `EVT-USR-${idx}`,
            name: e.name || 'Custom Event',
            slug: e.slug || 'custom-event',
            date: e.date || 'Upcoming',
            venue: e.location || 'Private Venue',
            eventType: e.eventType || 'wedding',
            themeColor: e.primaryColor || '#d8b86a',
            status: e.status || 'active',
            plan: e.plan || (e.isPremium ? 'pro' : 'free'),
            price: e.plan === 'pro' || e.isPremium ? '₱1,499' : '₱0',
            paymentStatus: e.plan === 'pro' || e.isPremium ? 'PAID' : 'UNPAID',
            photosCount: e.photoCount || e.photosCount || 0,
            activeGuests: e.activeGuests || 0,
            allowGuestUploads: true,
            publicGallery: true,
          }));
          setEvents(mapped);
        } else {
          setEvents([]);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  // Realtime subscription: auto-refresh events list and photo counts dynamically
  useRealtime(
    ['EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_DELETED', 'PHOTO_CAPTURED', 'USER_UPDATED'],
    () => {
      loadEventsData();
    }
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpgradeEventToPro = (event: PhotoboothEvent) => {
    setIsUpgradingId(event.id);
    setTimeout(() => {
      setEvents(prev => {
        const next = prev.map(e =>
          e.id === event.id
            ? { ...e, plan: 'pro' as const, price: isAdmin ? '₱0 (Admin)' : '₱1,499', paymentStatus: 'PAID' as const }
            : e
        );
        try {
          const storedEvents = localStorage.getItem('memora_events');
          if (storedEvents) {
            const rawList = JSON.parse(storedEvents);
            const updatedRaw = rawList.map((item: any) =>
              item.id === event.id || item.slug === event.slug
                ? { ...item, plan: 'pro', isPremium: true, price: isAdmin ? '₱0 (Admin)' : '₱1,499', paymentStatus: 'PAID' }
                : item
            );
            localStorage.setItem('memora_events', JSON.stringify(updatedRaw));
          }
        } catch {}
        return next;
      });

      // Record transaction in admin ledger
      try {
        const { recordRealTransaction } = require('@/lib/adminRecords');
        recordRealTransaction({
          host: 'System Admin',
          event: event.name,
          plan: isAdmin ? 'PRO Event Pass (Admin Complimentary - ₱0)' : 'PRO Event Pass (₱1,499)',
          amount: isAdmin ? '₱0.00' : '₱1,499.00',
          amountNum: isAdmin ? 0 : 1499,
          status: 'Paid',
          method: isAdmin ? 'Admin Complimentary Grant' : 'GCash Instant',
        });
        broadcastRealtime('EVENT_UPDATED', { id: event.id, plan: 'pro' });
      } catch {}

      setIsUpgradingId(null);
      showToast(
        isAdmin 
          ? `Success! "${event.name}" upgraded to PRO (₱0 Free Admin Grant). Unlimited photos & zero watermark active!`
          : `Success! "${event.name}" upgraded to PRO (₱1,499). Unlimited photos & zero watermark active!`
      );
    }, 300);
  };

  const handleToggleArchive = (id: string) => {
    setEvents(prev => {
      const next = prev.map(e =>
        e.id === id
          ? { ...e, status: (e.status === 'active' ? 'archived' : 'active') as 'active' | 'archived' }
          : e
      );
      try {
        localStorage.setItem('memora_events', JSON.stringify(next));
      } catch {}
      broadcastRealtime('EVENT_UPDATED', { id });
      return next;
    });
    showToast('Event status updated.');
  };

  const handleDeleteEvent = async (id: string) => {
    const targetEvent = events.find(e => e.id === id);
    const confirmed = await confirmModal({
      title: 'Delete Event',
      description: `Are you sure you want to delete "${targetEvent?.name || 'this event'}"? This action cannot be undone and will permanently remove all associated guest photos and photostrips.`,
      confirmText: 'Delete Event',
      cancelText: 'Keep Event',
      variant: 'danger',
      eyebrow: 'DELETION CONFIRMATION',
    });

    if (confirmed) {
      setEvents(prev => {
        const next = prev.filter(e => e.id !== id);
        try {
          localStorage.setItem('memora_events', JSON.stringify(next));
        } catch {}
        broadcastRealtime('EVENT_DELETED', { id });
        return next;
      });
      showToast('Event permanently deleted.');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setEvents(prev => {
      const next = prev.map(item => item.id === editingEvent.id ? editingEvent : item);
      try {
        localStorage.setItem('memora_events', JSON.stringify(next));
      } catch {}
      broadcastRealtime('EVENT_UPDATED', editingEvent);
      return next;
    });
    setEditingEvent(null);
    showToast(`Updated "${editingEvent.name}" settings.`);
  };

  const isStudioActive = studioPlan === 'studio' && studioStatus === 'active';
  const isStudioGrace = studioPlan === 'studio' && studioStatus === 'past_due';
  const isStudioExpired = studioStatus === 'expired';

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Events
            </span>
            <span className="text-muted-foreground/30">•</span>
            <RealtimeStatusBadge />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Photobooth Events
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-light max-w-2xl leading-relaxed">
            {isAdmin 
              ? 'Admin Account: All events and photobooths are free (₱0) with unlimited photos and no watermark.'
              : 'Manage your photobooth events, customize event details, and launch live booths.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/billing"
            className="px-5 py-2.5 rounded-full bg-card hover:bg-secondary border border-border/80 text-xs font-mono uppercase tracking-[0.14em] text-foreground transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Pricing & Billing</span>
          </Link>

          <Link
            href="/dashboard/events/create"
            className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* Studio Workspace Status / Grace Period Banners */}
      {isStudioActive && !isAdmin && (
        <div className="p-4 sm:p-5 rounded-3xl bg-secondary/40 border border-border/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                Studio Plan Active (₱4,999/mo)
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                All events in your workspace include premium features and watermark-free downloads.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-foreground text-background font-semibold shrink-0 shadow-2xs">
            Unlimited Active
          </span>
        </div>
      )}

      {isStudioGrace && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Studio Subscription Past Due:</strong> 7-Day Grace Period Active until {studioGraceUntil || 'soon'}. All existing events & photos remain 100% accessible.
            </span>
          </div>
          <Link
            href="/dashboard/billing"
            className="px-4 py-1.5 rounded-full bg-amber-500 text-white font-mono font-bold text-[11px] uppercase tracking-wider hover:bg-amber-600 transition-colors shrink-0 shadow-2xs"
          >
            Renew Studio (₱4,999)
          </Link>
        </div>
      )}

      {isStudioExpired && (
        <div className="p-4 sm:p-5 rounded-3xl bg-secondary/60 border border-border text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>
              <strong>Studio Subscription Expired (Retention Mode):</strong> Existing events remain viewable and downloadable. Renew to create new premium photobooths.
            </span>
          </div>
          <Link
            href="/dashboard/billing"
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-mono font-medium text-[11px] uppercase tracking-wider hover:bg-foreground/90 transition-colors shrink-0 shadow-2xs"
          >
            Reactivate Studio (₱4,999)
          </Link>
        </div>
      )}

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 text-xs font-mono flex items-center gap-2 animate-in fade-in shadow-2xs">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Bar Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-card border border-border/80 p-4 rounded-3xl shadow-xs ring-1 ring-border/20">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Maria's Wedding, BGC, Manila..."
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
          />
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          Showing <strong className="text-foreground">{filteredEvents.length}</strong> events managed by you
        </div>
      </div>

      {/* Events Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-white dark:bg-card p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-light">No Events Created Yet</h3>
            <p className="text-xs text-muted-foreground font-mono max-w-md mx-auto">
              Create your first photobooth event to generate a venue QR code, customize branding, and start capturing guest photos.
            </p>
          </div>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:bg-foreground/90 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isStudioCovered = isStudioActive;
          const isProPaid = event.plan === 'pro' || isStudioCovered;

          return (
            <div
              key={event.id}
              className="bg-white dark:bg-card border border-border/70 hover:border-zinc-400/80 dark:hover:border-zinc-600 rounded-3xl p-6 sm:p-7 space-y-5 transition-all flex flex-col justify-between group shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-border/20 text-foreground"
            >
              {/* Top row */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Status badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                      event.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-secondary text-muted-foreground border border-border/60'
                    }`}>
                      {event.status}
                    </span>

                    {/* Plan Entitlement Badge */}
                    {isStudioCovered ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-purple-50 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" />
                        <span>STUDIO</span>
                      </span>
                    ) : event.plan === 'pro' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-foreground text-background shadow-2xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-primary" />
                        <span>PRO • {isAdmin ? '₱0 (Admin)' : '₱1,499'}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-secondary text-muted-foreground border border-border/60">
                        FREE • 50 PHOTOS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full shadow-2xs ring-1 ring-border/50" style={{ backgroundColor: event.themeColor }} title="Branding Theme Color" />
                    <span className="text-[11px] font-mono text-muted-foreground">{event.date}</span>
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-[26px] font-light text-foreground group-hover:text-primary transition-colors leading-tight mt-3">
                  {event.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 font-mono flex items-center gap-1.5 truncate">
                  <span>{getEventEmoji(event.eventType)}</span>
                  <span>{event.venue}</span>
                  {event.eventType && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary text-foreground/80 border border-border/50 uppercase tracking-wider">
                      {event.eventType}
                    </span>
                  )}
                </p>

                {/* Plan Privileges Summary */}
                <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground space-y-1">
                  {isProPaid ? (
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Unlimited photos • No watermark • HD</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Includes Memora watermark</span>
                      <button
                        type="button"
                        disabled={isUpgradingId === event.id}
                        onClick={() => handleUpgradeEventToPro(event)}
                        className="px-3 py-1 rounded-full bg-secondary hover:bg-foreground hover:text-background text-foreground border border-border/80 font-mono text-[10px] uppercase font-semibold transition-all cursor-pointer"
                      >
                        {isUpgradingId === event.id ? 'Upgrading...' : isAdmin ? 'Upgrade to Pro (Free)' : 'Upgrade PRO (₱1,499)'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Stats Box */}
              <div className="grid grid-cols-2 gap-2 bg-secondary/35 border border-border/60 rounded-2xl p-3.5 text-center">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-0.5">Guest Photos</span>
                  <span className="font-display text-2xl text-foreground font-light">{event.photosCount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-0.5">Active Guests</span>
                  <span className="font-display text-2xl text-primary font-normal">{event.activeGuests}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                {/* Primary Launch & QR Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedQrEvent({ name: event.name, slug: event.slug })}
                    className="py-2.5 px-3 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 text-xs font-mono uppercase tracking-wider text-foreground hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs font-medium"
                  >
                    <QrCode className="w-3.5 h-3.5 text-primary" />
                    <span>QR Code</span>
                  </button>

                  <Link
                    href={`/e/${event.slug}`}
                    target="_blank"
                    className="py-2.5 px-3 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer font-medium"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Booth</span>
                  </Link>
                </div>

                {/* Upgrade to PRO CTA if not Pro or Studio */}
                {!isProPaid && (
                  <Link
                    href={`/checkout/pro?name=${encodeURIComponent(event.name)}&date=${encodeURIComponent(event.date)}&type=${encodeURIComponent(event.slug)}`}
                    className="w-full py-2.5 px-4 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAdmin ? 'Upgrade to Pro (Free)' : 'Upgrade to PRO (₱1,499)'}</span>
                  </Link>
                )}

                {/* Edit / Gallery / Delete Controls */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <Link
                    href="/dashboard/gallery"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>View Gallery</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(event)}
                      className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      title="Customize Theme & Settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleArchive(event.id)}
                      className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-amber-600 hover:bg-secondary transition-colors cursor-pointer"
                      title={event.status === 'active' ? 'Archive Event' : 'Unarchive Event'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* QR Code Modal for Event Venue Display */}
      {selectedQrEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm">
            <button
              type="button"
              onClick={() => setSelectedQrEvent(null)}
              className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full bg-white dark:bg-card border border-border/80 shadow-md text-foreground hover:text-primary flex items-center justify-center text-xs font-mono transition-transform hover:scale-110 cursor-pointer"
              aria-label="Close Modal"
            >
              ✕
            </button>
            <QrShareCard
              eventName={selectedQrEvent.name}
              eventSlug={selectedQrEvent.slug}
            />
          </div>
        </div>
      )}

      {/* Edit Event Customization Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl text-foreground relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-display text-2xl font-light text-foreground">Customize Event</h3>
              <button 
                onClick={() => setEditingEvent(null)}
                className="w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">Event Name</label>
                <input
                  type="text"
                  required
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/70 rounded-xl text-foreground font-sans focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">Venue Location</label>
                <input
                  type="text"
                  required
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/70 rounded-xl text-foreground font-sans focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">Event Type</label>
                <select
                  value={editingEvent.eventType || 'other'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, eventType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/70 rounded-xl text-foreground font-sans focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground shadow-2xs cursor-pointer"
                >
                  {EVENT_TYPES_LIST.map((et) => (
                    <option key={et.id} value={et.id} className="bg-card text-foreground">
                      {et.emoji} {et.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">Event Date</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/70 rounded-xl text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1 font-medium">Branding Color</label>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={editingEvent.themeColor}
                      onChange={(e) => setEditingEvent({ ...editingEvent, themeColor: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-border/70 bg-transparent cursor-pointer p-0.5"
                    />
                    <span className="text-muted-foreground uppercase">{editingEvent.themeColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-foreground">Allow Account-Free Guest Uploads</span>
                  <input
                    type="checkbox"
                    checked={editingEvent.allowGuestUploads}
                    onChange={(e) => setEditingEvent({ ...editingEvent, allowGuestUploads: e.target.checked })}
                    className="accent-foreground w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-foreground">Public Live Gallery Link</span>
                  <input
                    type="checkbox"
                    checked={editingEvent.publicGallery}
                    onChange={(e) => setEditingEvent({ ...editingEvent, publicGallery: e.target.checked })}
                    className="accent-foreground w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.15em] rounded-full transition-all shadow-xs cursor-pointer"
              >
                Save Event Settings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
