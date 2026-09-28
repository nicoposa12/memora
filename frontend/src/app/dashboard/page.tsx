'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Sparkles, 
  Camera, 
  QrCode, 
  Calendar, 
  Download, 
  Image as ImageIcon, 
  ExternalLink,
  HardDrive, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Search,
  SlidersHorizontal,
  FolderOpen,
  ArrowRight,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatEventDate } from '@/lib/utils';
import { QrShareCard } from '@/features/events/components/QrShareCard';
import { isAdminRole } from '@/types/user';

import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';

export default function DashboardPage() {
  const [selectedQrEvent, setSelectedQrEvent] = useState<{ name: string; slug: string } | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('Welcome');
  const [isStudioPlan, setIsStudioPlan] = useState(false);
  const [studioStatus, setStudioStatus] = useState('active');
  const [nextBillingDate, setNextBillingDate] = useState('Complimentary Access (₱0)');
  const [events, setEvents] = useState<any[]>([]);

  const loadDashboardData = React.useCallback(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name.split(' ')[0]);
        else if (u.email) setUserName(u.email.split('@')[0]);
        else setUserName('Admin');

        const isAdmin = isAdminRole(u.role) || u.email?.toLowerCase().includes('admin') || u.role === 'admin';
        if (isAdmin || u.subscription_plan === 'studio' || u.plan === 'studio') {
          setIsStudioPlan(true);
        }
        if (u.subscription_status) setStudioStatus(u.subscription_status);
        if (isAdmin) {
          setNextBillingDate('Complimentary Admin Access (₱0)');
        } else if (u.subscription_expires_at) {
          try {
            const d = new Date(u.subscription_expires_at);
            setNextBillingDate(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
          } catch {}
        }
      }

      // Check URL query param for instant studio view activation
      if (typeof window !== 'undefined' && window.location.search.includes('studio=')) {
        setIsStudioPlan(true);
      }

      const storedEvents = localStorage.getItem('memora_events');
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed.map((m: any, idx: number) => ({
            id: m.id || `${idx + 1}`,
            name: m.name || 'Custom Event',
            slug: m.slug || 'custom-event',
            eventType: m.eventType || 'wedding',
            date: m.date || 'Upcoming',
            status: m.status || 'active',
            isPremium: m.isPremium || m.plan === 'pro' || m.plan === 'studio',
            photoCount: m.photoCount || 0,
            downloadCount: m.downloadCount || 0,
            location: m.location || 'Private Venue',
          })));
        } else {
          setEvents([]);
        }
      }
    } catch {}

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Realtime subscription: auto-refresh metrics and event cards instantly
  useRealtime(
    ['PHOTO_CAPTURED', 'EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_DELETED', 'USER_UPDATED'],
    () => {
      loadDashboardData();
    }
  );

  const totalPhotos = events.reduce((acc, curr) => acc + (curr.photoCount || 0), 0);
  const storageGb = ((totalPhotos * 3.5) / 1024).toFixed(1);

  const filteredEvents = events.filter((e) => {
    const matchesTab = filterTab === 'all' || e.status === filterTab;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-9 max-w-7xl mx-auto">
      {/* Minimalist Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Overview
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <RealtimeStatusBadge />
            {isStudioPlan && (
              <>
                <span className="text-muted-foreground/30">•</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase font-semibold">
                  Studio Active
                </span>
              </>
            )}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight">
            {greeting}, <span className="font-display italic font-normal text-primary">{userName || 'Admin'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl font-light leading-relaxed">
            Manage your photobooths, view guest photos in real time, and generate QR codes for your events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {events.length > 0 ? (
            <Link href={`/e/${events[0].slug}`} target="_blank">
              <button className="px-5 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-card text-foreground text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span>Launch Booth</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>
            </Link>
          ) : null}

          <Link href="/dashboard/events/create">
            <button className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs font-mono uppercase tracking-[0.14em] font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Event</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1 */}
        <div className="bg-card hover:border-primary/40 border border-border/80 rounded-3xl p-5 sm:p-6 transition-all shadow-xs ring-1 ring-border/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-[0.2em]">Active Booths</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 tracking-tight font-light">
            {events.filter((e) => e.status === 'active').length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for guest scans</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card hover:border-primary/40 border border-border/80 rounded-3xl p-5 sm:p-6 transition-all shadow-xs ring-1 ring-border/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-[0.2em]">Photos Captured</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 tracking-tight font-light">
            {totalPhotos}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Captured across events</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card hover:border-primary/40 border border-border/80 rounded-3xl p-5 sm:p-6 transition-all shadow-xs ring-1 ring-border/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-[0.2em]">Guest Downloads</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 tracking-tight font-light">
            {events.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            <span>Guest downloads</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card hover:border-primary/40 border border-border/80 rounded-3xl p-5 sm:p-6 transition-all shadow-xs ring-1 ring-border/30 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-[0.2em]">Cloud Storage</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 tracking-tight font-light">
            {totalPhotos > 0 ? `${(totalPhotos * 3.5).toFixed(1)} MB` : '0 MB'}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground mt-2">
            <span>Secure Cloudflare R2</span>
          </div>
        </div>
      </div>

      {/* Events List Section */}
      <div className="space-y-6 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground font-light">
              Events & Photobooths
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Launch live booths or view event photo galleries
            </p>
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter events..."
                className="pl-8 pr-3 py-1.5 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-40 sm:w-48 font-mono shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
              {(['all', 'active', 'draft'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    filterTab === tab
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card hover:border-primary/40 border border-border/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xs hover:shadow-md ring-1 ring-border/30 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      event.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25'
                        : 'bg-secondary text-muted-foreground border border-border/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${event.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                      <span>{event.status}</span>
                    </span>

                    {event.isPremium ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-semibold">
                        PRO STUDIO
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-secondary text-muted-foreground border border-border/60 font-semibold">
                        FREE TRIAL
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                    ID: #{event.id}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-[26px] font-light text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatEventDate(event.date)}
                    </span>
                    <span>•</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 py-3.5 px-4 rounded-2xl bg-secondary/40 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[9px] font-mono uppercase tracking-[0.18em]">
                    Photos Taken
                  </span>
                  <strong className="text-xl font-display text-foreground mt-0.5 block font-light">
                    {event.photoCount}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] font-mono uppercase tracking-[0.18em]">
                    Guest Downloads
                  </span>
                  <strong className="text-xl font-display text-foreground mt-0.5 block font-light">
                    {event.downloadCount}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedQrEvent({ name: event.name, slug: event.slug })}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-secondary/70 hover:bg-secondary text-foreground hover:text-primary border border-border/80 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-primary" />
                  <span>QR Code</span>
                </button>

                <Link href={`/e/${event.slug}/gallery`} className="flex-1">
                  <button className="w-full py-2.5 px-3 rounded-xl bg-secondary/70 hover:bg-secondary text-foreground hover:text-primary border border-border/80 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Gallery</span>
                  </button>
                </Link>

                <Link href={`/e/${event.slug}`} target="_blank" title="Launch Live Booth">
                  <button className="p-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 transition-all cursor-pointer shadow-2xs">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl bg-card border border-dashed border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl text-foreground font-light">
                {events.length === 0 ? 'No Events Created Yet' : 'No matching events found'}
              </h3>
              <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto">
                {events.length === 0 
                  ? 'Create your first photobooth event to generate a venue QR code and start capturing photos.'
                  : 'Try adjusting your search query or active filter tab.'}
              </p>
            </div>
            {events.length === 0 ? (
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            ) : (
              <button
                onClick={() => { setFilterTab('all'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-full bg-secondary text-xs font-mono uppercase tracking-wider text-foreground hover:bg-secondary/80 border border-border/60 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal Display */}
      {selectedQrEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm">
            <button
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
    </div>
  );
}
