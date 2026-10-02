'use client';

import dynamic from 'next/dynamic';

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

export function BoothClient() {
  return <MemoraBooth eventName="Memora Booth" eventSubtitle="Try it now" exitHref="/" />;
}
