'use client';

import React, { use, useState, useEffect } from 'react';
import { MemoraBooth } from '@/features/booth/components/MemoraBooth';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GuestPhotoboothPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [eventName, setEventName] = useState(() => 
    slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
  const [eventSubtitle, setEventSubtitle] = useState('Photobooth Experience');
  const [eventType, setEventType] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_events');
      if (stored) {
        const events = JSON.parse(stored);
        if (Array.isArray(events)) {
          const match = events.find((e: any) => e.slug === slug || e.id === slug);
          if (match) {
            if (match.name || match.title) {
              setEventName(match.name || match.title);
            }
            if (match.date) {
              setEventSubtitle(`Event • ${match.date}`);
            }
            if (match.eventType) {
              setEventType(match.eventType);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
    }
  }, [slug]);

  return (
    <main>
      <MemoraBooth
        eventName={eventName}
        eventSubtitle={eventSubtitle}
        eventType={eventType}
        exitHref={`/e/${slug}/gallery`}
      />
    </main>
  );
}

