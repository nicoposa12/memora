'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft, Download, Share2, Sparkles, Eye, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRealtime } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PhotoItem {
  id: string;
  title?: string;
  src: string;
  date?: string;
  eventId?: string;
}

export default function EventGalleryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [eventName, setEventName] = useState(() => 
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const loadPhotos = useCallback(() => {
    try {
      // Load event info
      const storedEvents = localStorage.getItem('memora_events');
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        if (Array.isArray(events)) {
          const match = events.find((e: any) => e.slug === slug || e.id === slug);
          if (match && (match.name || match.title)) {
            setEventName(match.name || match.title);
          }
        }
      }

      // Load gallery photos
      const storedPhotos = localStorage.getItem('memora_gallery_photos');
      if (storedPhotos) {
        const parsed = JSON.parse(storedPhotos);
        if (Array.isArray(parsed)) {
          const matched = parsed
            .filter((p: any) => !p.eventId || p.eventId === slug || p.eventSlug === slug || p.eventName === eventName)
            .map((p: any) => ({
              id: p.id || Math.random().toString(),
              title: p.guestTag || p.title || 'Guest Snapshot',
              src: p.imgUrl || p.url || p.src,
              date: p.capturedAt || p.timestamp || 'Recently',
              eventId: p.eventId || p.eventSlug,
            }));
          setPhotos(matched);
        }
      }
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    }
  }, [slug, eventName]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Realtime subscription: live stream new photobooth snaps directly into the guest gallery
  useRealtime(['PHOTO_CAPTURED', 'PHOTO_DELETED'], () => {
    loadPhotos();
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between glass sticky top-0 z-40">
        <Link
          href={`/e/${slug}`}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Booth</span>
        </Link>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h1 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{eventName} Gallery</h1>
        </div>

        <Link href={`/e/${slug}`}>
          <Button variant="glow" size="sm">
            <Camera className="w-3.5 h-3.5 mr-1" />
            Take Photo
          </Button>
        </Link>
      </header>

      {/* Main Gallery Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="gradient">Live Memories</Badge>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Realtime Sync
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Event Photo Stream</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Photos captured by guests appear here in real time without refreshing.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-semibold">{photos.length} memories captured</span>
        </div>

        {/* Masonry / Grid layout */}
        {photos.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-lg">
              <Camera className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">No Memories Captured Yet</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Photos taken at the booth terminal will appear here in real time. Be the first guest to strike a pose!
              </p>
            </div>
            <div className="pt-2">
              <Link href={`/e/${slug}`}>
                <Button variant="glow" size="sm">
                  <Camera className="w-4 h-4 mr-1.5" />
                  Launch Photo Booth
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo.src)}
                className="relative group aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer shadow-lg hover:border-pink-500/50 transition-all hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.title || 'Event Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-xs font-bold text-white">{photo.title}</span>
                  <span className="text-[10px] text-pink-300">{photo.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Preview */}
        {activePhoto && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-w-2xl max-h-[85vh] flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto}
                alt="Selected Memory"
                className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl object-contain"
              />

              <div className="mt-4 flex gap-3">
                <a href={activePhoto} download target="_blank" rel="noopener noreferrer">
                  <Button variant="glow" size="sm">
                    <Download className="w-4 h-4 mr-1.5" />
                    Download Full Resolution
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
