'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Share2, 
  Trash2, 
  Filter, 
  Image as ImageIcon, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Camera, 
  X,
  Eye,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';
import { useModal } from '@/context/ModalContext';
import { getScopedEvents, getCurrentUser } from '@/lib/userEvents';
import { isAdminRecord } from '@/lib/adminRecords';

interface PhotoItem {
  id: string;
  eventName: string;
  eventSlug: string;
  imgUrl: string;
  type: 'strip' | 'single';
  filterName: string;
  capturedAt: string;
  downloads: number;
}

export default function MasterGalleryPage() {
  const { confirm: confirmModal, alert: alertModal } = useModal();
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [viewType, setViewType] = useState<'all' | 'strip' | 'single'>('all');
  const [activePhotoModal, setActivePhotoModal] = useState<PhotoItem | null>(null);
  const [copied, setCopied] = useState(false);

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [eventsList, setEventsList] = useState<{ name: string; slug: string }[]>([]);

  const loadGalleryData = React.useCallback(() => {
    try {
      const u = getCurrentUser();
      const isAdmin = isAdminRecord(u);
      const userScoped = getScopedEvents(u);

      const scopedList = Array.isArray(userScoped)
        ? userScoped.map((e: any) => ({
            name: e.name || 'Custom Event',
            slug: e.slug || 'event',
          }))
        : [];
      setEventsList(scopedList);

      const allowedSlugs = new Set(scopedList.map(e => e.slug.toLowerCase()));

      const storedPhotos = localStorage.getItem('memora_gallery_photos');
      if (storedPhotos) {
        const parsedP = JSON.parse(storedPhotos);
        if (Array.isArray(parsedP)) {
          const sampleSlugs = new Set(['maria-juan-wedding', 'maria-juan-wedding-2026', 'juan-maria-wedding', 'marias-wedding', 'marias-birthday', 'marias-birthday-celebration', 'nicosnap-studio-gala', 'nicosnap-studio-gala-vip', 'sample-event']);
          const cleanPhotos = parsedP.filter((p: any) => {
            const slug = (p.eventSlug || '').toLowerCase();
            const name = (p.eventName || '').toLowerCase();
            if (sampleSlugs.has(slug)) return false;
            if (name.includes('maria') || name.includes('nicosnap studio gala')) return false;
            return true;
          });
          if (cleanPhotos.length !== parsedP.length) {
            localStorage.setItem('memora_gallery_photos', JSON.stringify(cleanPhotos));
          }

          if (isAdmin) {
            setPhotos(cleanPhotos);
          } else {
            setPhotos(cleanPhotos.filter((p: any) => allowedSlugs.has((p.eventSlug || '').toLowerCase())));
          }
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // Realtime subscription: auto-refresh gallery when photos are snapped or deleted
  useRealtime(['PHOTO_CAPTURED', 'PHOTO_DELETED', 'EVENT_CREATED'], () => {
    loadGalleryData();
  });

  const filteredPhotos = photos.filter((p) => {
    const matchesEvent = selectedEvent === 'all' || p.eventSlug === selectedEvent;
    const matchesType = viewType === 'all' || p.type === viewType;
    return matchesEvent && matchesType;
  });

  const handleDeletePhoto = async (id: string) => {
    const confirmed = await confirmModal({
      title: 'Delete Photo',
      description: 'Are you sure you want to delete this memory? It will be permanently removed from all live galleries.',
      confirmText: 'Delete Photo',
      cancelText: 'Keep Photo',
      variant: 'danger',
      eyebrow: 'DELETION CONFIRMATION',
    });
    if (confirmed) {
      const next = photos.filter(p => p.id !== id);
      setPhotos(next);
      localStorage.setItem('memora_gallery_photos', JSON.stringify(next));
      setActivePhotoModal(null);
      broadcastRealtime('PHOTO_DELETED', { id });
    }
  };

  const handleCopyLink = () => {
    if (!activePhotoModal) return;
    navigator.clipboard.writeText(window.location.origin + activePhotoModal.imgUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Gallery
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            View and download all guest photos, single shots, and photo strips captured across your events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {eventsList.length > 0 && (
            <Link 
              href={selectedEvent !== 'all' ? `/e/${selectedEvent}/gallery` : `/e/${eventsList[0].slug}/gallery`} 
              target="_blank"
            >
              <button className="px-5 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-white dark:bg-card text-foreground text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Public Gallery View</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </button>
            </Link>
          )}
          <button 
            onClick={async () => {
              if (photos.length === 0) {
                await alertModal({
                  title: 'No Photos Available',
                  description: 'There are no captured photos available to download yet. Create an event and launch a booth to start capturing memories.',
                  buttonText: 'Understood',
                  variant: 'info',
                  eyebrow: 'EXPORT NOTICE',
                });
              } else {
                await alertModal({
                  title: 'Batch Export Ready',
                  description: `Exporting ${photos.length} captured memories into an uncompressed high-resolution ZIP archive.`,
                  buttonText: 'Download Archive',
                  variant: 'success',
                  eyebrow: 'ZIP DOWNLOAD',
                });
              }
            }}
            className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-card border border-border/80 p-4 rounded-3xl shadow-xs ring-1 ring-border/20">
        {/* Event Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Event:</span>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs cursor-pointer"
          >
            <option value="all">All Events ({photos.length} Photos)</option>
            {eventsList.map((evt) => (
              <option key={evt.slug} value={evt.slug}>{evt.name}</option>
            ))}
          </select>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-full border border-border/60">
          <button
            onClick={() => setViewType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewType === 'all' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Photos
          </button>
          <button
            onClick={() => setViewType('strip')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewType === 'strip' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Photo Strips
          </button>
          <button
            onClick={() => setViewType('single')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewType === 'single' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Single Photos
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-white dark:bg-card p-16 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-light">No Photos Yet</h3>
            <p className="text-xs text-muted-foreground font-mono max-w-md mx-auto">
              Photos and strips captured during your events will appear here in real time.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoModal(photo)}
              className="group relative bg-white dark:bg-card border border-border/80 hover:border-foreground/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md ring-1 ring-border/20 flex flex-col justify-between"
            >
              {/* Visual Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#121214] flex items-center justify-center p-3">
                <img 
                  src={photo.imgUrl} 
                  alt={photo.filterName}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>View Full Size</span>
                  </span>
                </div>
              </div>

              {/* Photo Card Info */}
              <div className="p-4 border-t border-border/60 bg-white dark:bg-card">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="font-semibold text-primary">{photo.filterName}</span>
                  <span>{photo.capturedAt}</span>
                </div>
                <p className="text-xs font-medium text-foreground truncate">
                  {photo.eventName}
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/70 mt-2">
                  <span>{photo.type === 'strip' ? 'PHOTO STRIP' : 'SINGLE PHOTO'}</span>
                  <span>{photo.downloads} DOWNLOADS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Photo Inspection Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-white dark:bg-card border border-border/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ring-1 ring-border/30">
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white text-foreground flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Photo View */}
            <div className="md:w-1/2 bg-[#121214] p-6 flex items-center justify-center min-h-[350px]">
              <img 
                src={activePhotoModal.imgUrl} 
                alt={activePhotoModal.filterName}
                className="max-h-[460px] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Right Details & Moderation */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary font-medium">
                  Photo Details
                </span>
                <h3 className="font-display text-2xl text-foreground font-light mt-1">
                  {activePhotoModal.eventName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Captured {activePhotoModal.capturedAt}
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-muted-foreground border-y border-border/60 py-4">
                  <div className="flex justify-between font-mono">
                    <span>Filter:</span>
                    <strong className="text-foreground font-semibold">{activePhotoModal.filterName}</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Resolution:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">High Resolution</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Downloads:</span>
                    <strong className="text-foreground font-semibold">{activePhotoModal.downloads} times</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Cloud Storage:</span>
                    <strong className="text-primary font-medium">Synced to Cloud</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a 
                  href={activePhotoModal.imgUrl} 
                  download 
                  target="_blank"
                  className="w-full py-3 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Photo</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border/70 text-xs font-mono uppercase tracking-wider text-foreground flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-primary" />}
                    <span>{copied ? 'Copied' : 'Share Link'}</span>
                  </button>

                  <button
                    onClick={() => handleDeletePhoto(activePhotoModal.id)}
                    className="p-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer shadow-2xs"
                    title="Delete / Moderate Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
