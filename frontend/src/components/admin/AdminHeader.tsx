'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  ExternalLink,
  Clock,
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case '/admin/users':
        return 'Manage Users';
      case '/admin/hosts':
        return 'Organizers';
      case '/admin/booths':
        return 'Photobooths';
      case '/admin/moderation':
        return 'Moderation';
      case '/admin/revenue':
        return 'Revenue';
      case '/admin/plans':
        return 'Plans & Features';
      case '/admin/templates':
        return 'Templates';
      case '/admin/system':
        return 'System & Logs';
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
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus:outline-none cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Page Title */}
        <div className="flex items-center min-w-0">
          <h1 className="text-foreground font-semibold tracking-tight truncate text-sm sm:text-base">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Search, Realtime Clock & Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="hidden md:flex items-center relative w-56 lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search organizers, events, booths..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs"
          />
        </div>

        {/* Realtime Date & Time */}
        {currentTime && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/60 text-xs text-muted-foreground shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground/90">
              <span className="hidden xl:inline">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short' })},{' '}
              </span>
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono font-medium text-foreground tracking-tight">
              {formatTime(currentTime)}
            </span>
          </div>
        )}

        {/* Quick Return to Host View */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:text-primary bg-secondary/60 hover:bg-secondary border border-border/70 transition-all shadow-xs"
        >
          <span>Open Studio</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </Link>
      </div>
    </header>
  );
}

