'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Search, 
  Activity, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw, 
  ExternalLink, 
  Wifi, 
  Battery, 
  HardDrive,
  Eye,
  Plus
} from 'lucide-react';
import { getRealBooths, saveRealBooths, recordRealAuditLog, RealBoothRecord } from '@/lib/adminRecords';

export default function AdminBoothsPage() {
  const [booths, setBooths] = useState<RealBoothRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBooths(getRealBooths());
    setIsLoaded(true);
  }, []);

  const toggleBooth = (id: string) => {
    const updated = booths.map(b =>
      b.id === id ? { ...b, status: (b.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' } : b
    );
    setBooths(updated);
    saveRealBooths(updated);
    const toggled = updated.find(b => b.id === id);
    recordRealAuditLog(`Photobooth ${id} ${toggled?.status === 'active' ? 'resumed' : 'paused'}`, 'Administrator', 'warn');
  };

  const filteredBooths = booths.filter(b => 
    b.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = booths.filter(b => b.status === 'active').length;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Live Sessions
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            Photobooths
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal">
            See all photobooths running across events, check their camera status, and pause or resume them as needed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
            <span>{activeCount} active booth{activeCount === 1 ? '' : 's'}</span>
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      {booths.length > 0 && (
        <div className="flex items-center justify-between gap-4 bg-card border border-border/70 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, host, or booth ID..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/40 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
      )}

      {/* Kiosks Grid */}
      {filteredBooths.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-dashed border-border/80 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-medium">No active photobooths</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              There are no photobooths running right now. When an organizer opens a booth for their event, you will see it appear here.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/booth"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-all shadow-xs cursor-pointer font-medium"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Try a Demo Booth</span>
            </Link>
            <Link
              href="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs transition-all shadow-2xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create an Event</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBooths.map((b) => (
            <div 
              key={b.id}
              className="bg-card border border-border/70 rounded-2xl p-6 space-y-4 hover:border-primary/40 hover:shadow-sm transition-all shadow-xs"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">{b.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    b.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
                    {b.tier}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/e/${b.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors shadow-2xs"
                    title="Open live photobooth"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleBooth(b.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      b.status === 'active'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {b.status === 'active' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                    <span>{b.status === 'active' ? 'Pause' : 'Resume'}</span>
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h3 className="font-display text-2xl text-foreground font-medium">{b.eventName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{b.venue}</p>
                <p className="text-xs text-primary mt-1 font-medium">Host: {b.hostName}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-xs">
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Photos</span>
                  <strong className="text-foreground text-sm font-semibold">{b.photosTaken}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Speed</span>
                  <strong className="text-emerald-700 text-sm font-semibold">{b.cameraFps} fps</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Battery</span>
                  <strong className="text-foreground text-sm font-semibold">{b.battery || '100%'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-[10px] text-muted-foreground block">Device</span>
                  <strong className="text-foreground text-xs truncate block font-medium">{b.device || 'Kiosk'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
