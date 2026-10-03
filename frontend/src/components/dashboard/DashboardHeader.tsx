'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  ExternalLink, 
  Plus, 
  Camera,
  Clock
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { RealtimeStatusBadge, useRealtime } from '@/context/RealtimeContext';
import { getScopedEvents } from '@/lib/userEvents';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [liveBoothHref, setLiveBoothHref] = useState<string>('/dashboard/booths');

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    try {
      const events = getScopedEvents();
      if (Array.isArray(events) && events.length > 0 && events[0].slug) {
        setLiveBoothHref(`/e/${events[0].slug}`);
      } else {
        setLiveBoothHref('/dashboard/booths');
      }
    } catch {}

    return () => clearInterval(timer);
  }, []);

  // Update live booth link in real time if events are created or updated
  useRealtime(['EVENT_CREATED', 'EVENT_DELETED', 'EVENT_UPDATED'], () => {
    try {
      const events = getScopedEvents();
      if (Array.isArray(events) && events.length > 0 && events[0].slug) {
        setLiveBoothHref(`/e/${events[0].slug}`);
      } else {
        setLiveBoothHref('/dashboard/booths');
      }
    } catch {}
  });

  const getBreadcrumbTitle = () => {
    switch (pathname) {
      case '/dashboard/events':
        return 'Events';
      case '/dashboard/templates':
        return 'Templates';
      case '/dashboard/booths':
        return 'Photobooths';
      case '/dashboard/gallery':
        return 'Gallery';
      case '/dashboard/qr-studio':
        return 'QR Codes';
      case '/dashboard/storage':
        return 'Storage';
      case '/dashboard/analytics':
        return 'Analytics';
      case '/dashboard/settings':
        return 'Settings';
      case '/dashboard/billing':
        return 'Billing & Plan';
      case '/dashboard/events/create':
        return 'Create Event';
      default:
        return 'Overview';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-18 bg-card/85 backdrop-blur-xl border-b border-border/60 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none cursor-pointer"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand indicator */}
        <Link href="/" className="flex lg:hidden items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" title="Return to homepage">
          <Logo className="w-5 h-5 text-primary" />
          <span className="font-display text-xl text-foreground">Memora</span>
        </Link>

        {/* Desktop Dynamic Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs text-muted-foreground">
          <Link href="/dashboard" className="font-mono uppercase tracking-[0.2em] text-primary hover:underline">
            Studio
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium tracking-wide">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search Bar */}
        <div className="hidden md:flex items-center relative w-48 lg:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search events, QR, photos..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono shadow-2xs"
          />
        </div>

        {/* Realtime Date & Time */}
        {currentTime && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/60 text-xs text-muted-foreground shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground/90">
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono font-medium text-foreground tracking-tight">
              {formatTime(currentTime)}
            </span>
          </div>
        )}

        {/* Test Live Booth Quick Link */}
        <Link 
          href={liveBoothHref} 
          target={liveBoothHref.startsWith('/e/') ? '_blank' : undefined}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/60 transition-all shadow-2xs"
        >
          <Camera className="w-3.5 h-3.5 text-primary" />
          <span>Live Booth</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>
      </div>
    </header>
  );
}
