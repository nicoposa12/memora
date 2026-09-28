import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EventWizard } from '@/features/events/components/EventWizard';

export default function CreateEventPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-primary font-medium">
          New Experience Setup
        </span>
      </div>

      <div className="flex items-center justify-center pt-2">
        <EventWizard />
      </div>
    </div>
  );
}
