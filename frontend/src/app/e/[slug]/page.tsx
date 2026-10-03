'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { subscribeRealtime } from '@/lib/realtime';

const MemoraBooth = dynamic(
  () => import('@/features/booth/components/MemoraBooth').then((mod) => mod.MemoraBooth),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-cream/60 uppercase tracking-widest">
            Preparing photobooth…
          </p>
        </div>
      </div>
    ),
  }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findStoredEvent(slug: string) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('memora_events');
    if (!raw) return null;
    const events = JSON.parse(raw);
    if (!Array.isArray(events)) return null;
    const cleanSlug = slug.toLowerCase().trim();
    return (
      events.find((e: any) => {
        const s = (e.slug || '').toLowerCase().trim();
        const id = String(e.id || '').toLowerCase().trim();
        const nameSlug = (e.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        return s === cleanSlug || id === cleanSlug || nameSlug === cleanSlug;
      }) || null
    );
  } catch {
    return null;
  }
}

export default function GuestPhotoboothPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [eventData, setEventData] = useState<any>(() => findStoredEvent(slug));

  const refreshEvent = useCallback(() => {
    const stored = findStoredEvent(slug);
    if (stored) {
      setEventData(stored);
      return;
    }

    // Secondary fetch from backend API if not in local storage
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/events/${slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.event) {
            setEventData(data.event);
          }
        })
        .catch(() => {});
    } catch {}
  }, [slug]);

  useEffect(() => {
    refreshEvent();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'memora_events') {
        refreshEvent();
      }
    };
    window.addEventListener('storage', onStorage);

    const unsubCreated = subscribeRealtime('EVENT_CREATED', () => refreshEvent());
    const unsubUpdated = subscribeRealtime('EVENT_UPDATED', () => refreshEvent());

    return () => {
      window.removeEventListener('storage', onStorage);
      unsubCreated();
      unsubUpdated();
    };
  }, [refreshEvent]);

  const eventName = eventData?.name || eventData?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const eventSubtitle = eventData?.date ? `Event • ${eventData.date}` : (eventData?.location || 'Photobooth Experience');
  const eventType = eventData?.eventType;

    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('memora_user') : null;
    let isUserStudio = false;
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        isUserStudio = (u.subscription_plan === 'studio' || u.plan === 'studio') && (u.subscription_status === 'active' || u.subscription_status === 'past_due' || !u.subscription_status);
      } catch {}
    }

    const resolvedPlan = isUserStudio ? 'studio' : eventData?.plan;

    return (
      <main>
        <MemoraBooth
          eventName={eventName}
          eventSubtitle={eventSubtitle}
          eventType={eventType}
          eventSlug={slug}
          eventPlan={resolvedPlan}
          isPremiumEvent={eventData?.isPremium || resolvedPlan === 'studio'}
          eventLayout={eventData?.templateLayout}
          eventCountdown={eventData?.countdown}
          eventPrimaryColor={eventData?.primaryColor}
          eventSecondaryColor={eventData?.secondaryColor}
          exitHref={`/e/${slug}/gallery`}
        />
      </main>
    );
}
