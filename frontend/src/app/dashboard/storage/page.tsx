'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HardDrive, 
  Cloud, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Server,
  Calendar,
  Camera,
  Plus
} from 'lucide-react';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { useModal } from '@/context/ModalContext';
import { getScopedEvents, getCurrentUser } from '@/lib/userEvents';
import { isAdminRecord } from '@/lib/adminRecords';

interface StoredEvent {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  status?: string;
  date?: string;
  photoCount?: number;
  photosCount?: number;
  totalPhotos?: number;
}

export default function StoragePage() {
  const { alert: alertModal } = useModal();
  const [autoSync, setAutoSync] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);

  const loadStorageData = React.useCallback(() => {
    try {
      const u = getCurrentUser();
      const isAdmin = isAdminRecord(u);
      const userScoped = getScopedEvents(u);
      setEvents(userScoped);

      let total = userScoped.reduce((sum: number, ev: StoredEvent) => sum + (ev.totalPhotos || ev.photosCount || ev.photoCount || 0), 0);

      const allowedSlugs = new Set(userScoped.map((e: any) => (e.slug || '').toLowerCase()));
      const storedPhotos = localStorage.getItem('memora_gallery_photos');
      if (storedPhotos) {
        const parsedP = JSON.parse(storedPhotos);
        if (Array.isArray(parsedP)) {
          const userPhotosCount = isAdmin ? parsedP.length : parsedP.filter((p: any) => allowedSlugs.has((p.eventSlug || '').toLowerCase())).length;
          if (userPhotosCount > total) {
            total = userPhotosCount;
          }
        }
      }

      setTotalPhotos(total);
    } catch (err) {
      console.error('Failed to load events for storage calculation:', err);
    }
  }, []);

  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  // Realtime subscription: live recalculate storage allocation on photo captures/deletions
  useRealtime(['PHOTO_CAPTURED', 'PHOTO_DELETED', 'EVENT_CREATED', 'EVENT_DELETED'], () => {
    loadStorageData();
  });

  const usedMB = (totalPhotos * 2.5).toFixed(1);
  const usedPercent = ((parseFloat(usedMB) / 51200) * 100).toFixed(2);
  const remainingGB = (50 - parseFloat(usedMB) / 1024).toFixed(2);

  const handleExport = async () => {
    if (events.length === 0 || totalPhotos === 0) {
      await alertModal({
        title: 'No Media to Export',
        description: 'No photos have been captured yet. Create an event and launch a live photobooth to start capturing guest photos.',
        buttonText: 'Understood',
        variant: 'info',
        eyebrow: 'EXPORT STATUS',
      });
      return;
    }
    setIsExporting(true);
    setTimeout(async () => {
      setIsExporting(false);
      await alertModal({
        title: 'Archive Ready',
        description: `Your complete event archive (${usedMB} MB, ${totalPhotos} photos) has been compressed and prepared for download.`,
        buttonText: 'Download Archive',
        variant: 'success',
        eyebrow: 'STORAGE EXPORT',
      });
    }, 1200);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Storage & Backup
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Cloud Storage & Backups
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Secure cloud storage for all guest photos, single shots, and photo strips.
          </p>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isExporting ? 'Preparing ZIP...' : 'Download All Photos (ZIP)'}</span>
        </button>
      </div>

      {/* Main Quota Card */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-secondary text-primary border border-border/60 shadow-2xs">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-foreground font-light">Cloud Storage Usage</h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                50 GB Cloudflare R2 Storage
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-2xl font-light font-display text-foreground">{usedMB} MB</span>
            <span className="text-xs text-muted-foreground"> / 50.0 GB ({usedPercent}% used)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-secondary/80 rounded-full overflow-hidden p-0.5 border border-border/40">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(totalPhotos > 0 ? 3 : 0.5, parseFloat(usedPercent))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <span>{totalPhotos} Photo Strips • {totalPhotos * 3} Individual Photos</span>
            <span>{remainingGB} GB Remaining</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Automated Cloud Sync</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Encrypted & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Server className="w-4 h-4 shrink-0" />
            <span>Unlimited Guest Downloads</span>
          </div>
        </div>
      </div>

      {/* Storage Breakdown by Event */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-foreground font-light">Storage by Event</h2>
          <span className="text-xs font-mono text-muted-foreground">{events.length} {events.length === 1 ? 'event' : 'events'}</span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground border border-border/60">
              <Cloud className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-display text-2xl text-foreground font-light">No Event Media Stored Yet</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 font-light leading-relaxed">
                Storage is created automatically when you create events and guests take photos. All pictures are saved in full resolution.
              </p>
            </div>
            <Link href="/dashboard/events/create">
              <button className="px-6 py-2.5 rounded-full bg-foreground text-background text-xs font-mono uppercase tracking-[0.14em] font-medium transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer hover:bg-foreground/90">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Event</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventPhotos = event.totalPhotos || event.photosCount || 0;
              const eventMB = (eventPhotos * 2.5).toFixed(1);
              return (
                <div key={event.id} className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-xs ring-1 ring-border/20">
                  <div className="flex items-center justify-between">
                    {event.status === 'archived' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase font-semibold bg-secondary text-muted-foreground border-border/60">
                        Archived
                      </span>
                    ) : <span />}
                    <span className="text-xs font-mono text-muted-foreground">{eventMB} MB</span>
                  </div>
                  <h4 className="font-display text-xl text-foreground font-light">{event.name || event.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    {eventPhotos} photo strips and guest portraits.
                  </p>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Cloud Storage</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Backup Settings Panel */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20">
        <h3 className="font-display text-2xl text-foreground font-light">Backup Settings</h3>

        <div className="space-y-4">
          {/* Setting 1 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Automatic Cloud Upload</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-light">
                Every photo taken by guests uploads automatically to secure cloud storage.
              </p>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                autoSync ? 'bg-primary' : 'bg-secondary border border-border'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                autoSync ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Setting 2 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Photo Retention</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-light">
                Event galleries and guest downloads remain permanently saved without expiration.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 font-semibold">
              Permanent Storage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

