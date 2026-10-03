'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  QrCode, 
  Settings, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sliders, 
  CheckCircle2, 
  Maximize2,
  Calendar,
  Layers,
  Eye
} from 'lucide-react';
import { QrShareCard } from '@/features/events/components/QrShareCard';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';
import { getScopedEvents } from '@/lib/userEvents';

interface BoothItem {
  id: string;
  name: string;
  slug: string;
  status: 'live' | 'ready' | 'draft';
  date: string;
  activeGuests: number;
  totalCaptures: number;
  defaultFilter: string;
  countdownSeconds: number;
  soundEnabled: boolean;
  watermark: boolean;
}

export default function ActiveBoothsPage() {
  const [booths, setBooths] = useState<BoothItem[]>([]);

  const loadBooths = React.useCallback(() => {
    try {
      const storedPrefs = JSON.parse(localStorage.getItem('memora_booth_preferences') || '{}');
      const userScoped = getScopedEvents();
      if (Array.isArray(userScoped) && userScoped.length > 0) {
        setBooths(userScoped.map((e: any, idx: number) => {
          const bId = e.id || `${idx + 1}`;
          const pref = storedPrefs[bId] || {};
          return {
            id: bId,
            name: e.name || 'Custom Event',
            slug: e.slug || 'custom-event',
            status: e.status === 'draft' ? 'draft' : 'live',
            date: e.date || 'Upcoming',
            activeGuests: 0,
            totalCaptures: e.photoCount || e.photosCount || 0,
            defaultFilter: 'Vogue Noir (B&W)',
            countdownSeconds: pref.countdownSeconds ?? 3,
            soundEnabled: pref.soundEnabled ?? true,
            watermark: !e.isPremium && e.plan !== 'pro' && e.plan !== 'studio',
          };
        }));
      } else {
        setBooths([]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadBooths();
  }, [loadBooths]);

  // Realtime subscription: live update photo captures and booth status
  useRealtime(
    ['PHOTO_CAPTURED', 'EVENT_CREATED', 'EVENT_DELETED', 'EVENT_UPDATED', 'BOOTH_STATUS_CHANGED'],
    () => {
      loadBooths();
    }
  );

  const [selectedQrEvent, setSelectedQrEvent] = useState<{ name: string; slug: string } | null>(null);

  const toggleSound = (id: string) => {
    setBooths(prev => {
      const next = prev.map(b => b.id === id ? { ...b, soundEnabled: !b.soundEnabled } : b);
      try {
        const storedPrefs = JSON.parse(localStorage.getItem('memora_booth_preferences') || '{}');
        const target = next.find(b => b.id === id);
        if (target) {
          storedPrefs[id] = { soundEnabled: target.soundEnabled, countdownSeconds: target.countdownSeconds };
          localStorage.setItem('memora_booth_preferences', JSON.stringify(storedPrefs));
        }
      } catch {}
      return next;
    });
  };

  const cycleCountdown = (id: string) => {
    setBooths(prev => {
      const next = prev.map(b => {
        if (b.id !== id) return b;
        const nextSec = b.countdownSeconds === 3 ? 5 : b.countdownSeconds === 5 ? 10 : 3;
        return { ...b, countdownSeconds: nextSec };
      });
      try {
        const storedPrefs = JSON.parse(localStorage.getItem('memora_booth_preferences') || '{}');
        const target = next.find(b => b.id === id);
        if (target) {
          storedPrefs[id] = { soundEnabled: target.soundEnabled, countdownSeconds: target.countdownSeconds };
          localStorage.setItem('memora_booth_preferences', JSON.stringify(storedPrefs));
        }
      } catch {}
      return next;
    });
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Photobooths
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Photobooths & Kiosks
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Manage your camera booths, adjust countdown timers, and launch full-screen guest photobooths.
          </p>
        </div>

        <Link href="/dashboard/events/create">
          <button className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Booth</span>
          </button>
        </Link>
      </div>

      {/* Live Booth Cards */}
      {booths.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-white dark:bg-card p-16 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-light">No Active Photobooths</h3>
            <p className="text-xs text-muted-foreground font-mono max-w-md mx-auto">
              Launch a live photobooth station for any of your events to start capturing guest photos in real time.
            </p>
          </div>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:bg-foreground/90 transition-all cursor-pointer shadow-xs"
          >
            <span>View Events</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {booths.map((booth) => (
          <div 
            key={booth.id}
            className="bg-white dark:bg-card border border-border/80 hover:border-foreground/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xs hover:shadow-md ring-1 ring-border/20 relative group"
          >
            {/* Top Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {booth.status !== 'live' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-secondary text-foreground border border-border/80">
                      <span>{booth.status.toUpperCase()}</span>
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wider">
                  № 0{booth.id}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-foreground font-light group-hover:text-primary transition-colors">
                {booth.name}
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{booth.date}</span>
                <span>•</span>
                <span>/e/{booth.slug}</span>
              </p>
            </div>

            {/* Quick Runtime Controls Bar */}
            <div className="bg-secondary/40 border border-border/60 rounded-2xl p-4 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center justify-between">
                <span>Booth Settings</span>
                <span className="text-primary font-medium">Auto-Saved</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Countdown Button */}
                <button
                  onClick={() => cycleCountdown(booth.id)}
                  className="p-3 rounded-xl bg-white dark:bg-card hover:bg-secondary/80 border border-border/70 text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-muted-foreground">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>Countdown</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground mt-1 block">
                    {booth.countdownSeconds} Seconds
                  </span>
                </button>

                {/* Shutter Sound Button */}
                <button
                  onClick={() => toggleSound(booth.id)}
                  className="p-3 rounded-xl bg-white dark:bg-card hover:bg-secondary/80 border border-border/70 text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-muted-foreground">
                    {booth.soundEnabled ? (
                      <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <VolumeX className="w-3 h-3 text-rose-500" />
                    )}
                    <span>Shutter Sound</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground mt-1 block">
                    {booth.soundEnabled ? 'Enabled' : 'Muted'}
                  </span>
                </button>

                {/* Film Stock Preset */}
                <div className="p-3 rounded-xl bg-white dark:bg-card border border-border/70 text-left shadow-2xs">
                  <div className="flex items-center gap-1 text-[9px] font-mono uppercase text-muted-foreground">
                    <Sliders className="w-3 h-3 text-primary" />
                    <span>Default Filter</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground mt-1 block truncate">
                    {booth.defaultFilter}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link href={`/e/${booth.slug}`} target="_blank" className="flex-1 min-w-[140px]">
                <button className="w-full py-3 px-4 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Launch Live Booth</span>
                </button>
              </Link>

              <button
                onClick={() => setSelectedQrEvent({ name: booth.name, slug: booth.slug })}
                className="py-3 px-4 rounded-full bg-secondary/70 hover:bg-secondary text-foreground hover:text-primary border border-border/80 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 text-primary" />
                <span>QR Code</span>
              </button>

              <Link href={`/e/${booth.slug}/gallery`}>
                <button className="py-3 px-4 rounded-full bg-secondary/70 hover:bg-secondary text-foreground hover:text-primary border border-border/80 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>Gallery</span>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* QR Modal */}
      {selectedQrEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
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
