'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Camera, 
  Download, 
  Clock, 
  Sliders, 
  Sparkles,
  ArrowUpRight,
  Plus,
  Calendar,
  Trash2
} from 'lucide-react';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { useModal } from '@/context/ModalContext';

interface EventRecord {
  id: string;
  name?: string;
  slug?: string;
  photosCount?: number;
  photoCount?: number;
  totalPhotos?: number;
  downloadCount?: number;
  activeGuests?: number;
  status?: string;
  date?: string;
}

interface PhotoRecord {
  id: string;
  eventName?: string;
  eventSlug?: string;
  imgUrl?: string;
  filterName?: string;
  capturedAt?: string;
  downloads?: number;
  type?: 'strip' | 'single';
}

interface ActivityLogItem {
  time: string;
  event: string;
  action: string;
  tag: string;
  badgeClass?: string;
}

function getActivityTag(action: string, defaultSeverity = 'INFO'): { tag: string; badgeClass: string } {
  const lower = action.toLowerCase();
  if (lower.includes('photo') || lower.includes('strip') || lower.includes('capture')) {
    return { 
      tag: 'CAPTURE', 
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
    };
  }
  if (lower.includes('event')) {
    return { 
      tag: 'EVENT', 
      badgeClass: 'bg-primary/10 text-primary border border-primary/20' 
    };
  }
  if (lower.includes('download')) {
    return { 
      tag: 'DOWNLOAD', 
      badgeClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' 
    };
  }
  if (lower.includes('scan') || lower.includes('qr')) {
    return { 
      tag: 'SCAN', 
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
    };
  }
  return { 
    tag: (defaultSeverity || 'INFO').toUpperCase(), 
    badgeClass: 'bg-secondary text-muted-foreground border border-border/60' 
  };
}

export default function AnalyticsPage() {
  const { confirm: confirmModal } = useModal();
  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'all'>('today');
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLogItem[]>([]);

  const loadAnalyticsData = React.useCallback(() => {
    try {
      const storedEvents = localStorage.getItem('memora_events');
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed)) {
          setEvents(parsed);
        }
      }

      const storedPhotos = localStorage.getItem('memora_gallery_photos');
      if (storedPhotos) {
        const parsedP = JSON.parse(storedPhotos);
        if (Array.isArray(parsedP)) {
          setPhotos(parsedP);
        }
      }

      // Sanitize and accurately load event activity logs:
      // Strip out legacy dummy test logs, mock transactions, and payment receipts (which belong in billing/admin, not event activity)
      const storedAudit = localStorage.getItem('memora_audit_logs');
      if (storedAudit) {
        const parsed = JSON.parse(storedAudit);
        if (Array.isArray(parsed)) {
          const validLogs = parsed.filter((l: any) => {
            const ev = (l.event || '').toLowerCase();
            const actor = (l.actor || '').toLowerCase();
            const isPayment = ev.includes('payment recorded') || ev.includes('subscription') || ev.includes('pass') || ev.includes('₱');
            const isDummy = ev.includes('awwaw') || actor.includes('nicoposa') || ev.includes('admin complimentary') || ev.includes('edge network cache');
            return !isPayment && !isDummy;
          });

          // Permanently save sanitized logs to localStorage to clear legacy test data
          localStorage.setItem('memora_audit_logs', JSON.stringify(validLogs));

          setRecentActivity(validLogs.slice(0, 10).map((l: any) => {
            const { tag, badgeClass } = getActivityTag(l.event || '', l.severity);
            return {
              time: l.timestamp || 'Recently',
              event: l.actor || 'Event Host',
              action: l.event || 'Activity logged',
              tag,
              badgeClass,
            };
          }));
        }
      }

      // Also clean up any legacy dummy transactions from localStorage
      const storedTx = localStorage.getItem('memora_transactions');
      if (storedTx) {
        const parsedTx = JSON.parse(storedTx);
        if (Array.isArray(parsedTx)) {
          const cleanTx = parsedTx.filter((t: any) => {
            const host = (t.host || '').toLowerCase();
            const plan = (t.plan || '').toLowerCase();
            return !host.includes('nicoposa') && !plan.includes('admin complimentary') && t.amountNum !== 0;
          });
          localStorage.setItem('memora_transactions', JSON.stringify(cleanTx));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Realtime subscription: dynamically update photo counts, metrics, and activity stream on live events
  useRealtime(
    ['PHOTO_CAPTURED', 'PHOTO_DOWNLOADED', 'PHOTO_DELETED', 'EVENT_CREATED', 'EVENT_UPDATED', 'ACTIVITY_LOGGED'],
    (msg) => {
      loadAnalyticsData();

      if (msg.type === 'PHOTO_CAPTURED' && msg.payload) {
        const item: ActivityLogItem = {
          time: 'Just now',
          event: 'Photobooth Kiosk',
          action: `Photo captured at ${msg.payload.eventName || 'Live Event'}`,
          tag: 'CAPTURE',
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        };
        setRecentActivity((prev) => [item, ...prev.slice(0, 9)]);
      } else if (msg.type === 'EVENT_CREATED' && msg.payload) {
        const item: ActivityLogItem = {
          time: 'Just now',
          event: 'Event Host',
          action: `Event Published: ${msg.payload.name || 'New Event'}`,
          tag: 'EVENT',
          badgeClass: 'bg-primary/10 text-primary border border-primary/20',
        };
        setRecentActivity((prev) => [item, ...prev.slice(0, 9)]);
      }
    }
  );

  const handleClearActivity = async () => {
    const confirmed = await confirmModal({
      title: 'Clear Event Activity',
      description: 'Are you sure you want to clear all event activity logs? This will reset the live stream feed.',
      confirmText: 'Clear Logs',
      cancelText: 'Keep Logs',
      variant: 'danger',
      eyebrow: 'ACTIVITY LOG RESET',
    });
    if (confirmed) {
      try {
        localStorage.removeItem('memora_audit_logs');
        localStorage.setItem('memora_audit_logs', JSON.stringify([]));
      } catch {}
      setRecentActivity([]);
    }
  };

  // Compute accurate metrics from active events & photos
  const totalEvents = events.length;
  const totalPhotos = photos.length > 0 
    ? photos.length 
    : events.reduce((sum, e) => sum + (e.photosCount || e.photoCount || e.totalPhotos || 0), 0);

  const totalDownloads = photos.reduce((sum, p) => sum + (p.downloads || 0), 0) + 
    events.reduce((sum, e) => sum + (e.downloadCount || 0), 0);

  const totalGuests = events.reduce((sum, e) => sum + (e.activeGuests || 0), 0);

  // Total QR scans: accurate sum from events/guests or recorded scans
  const recordedScans = events.reduce((sum, e) => sum + ((e as any).qrScans || (e as any).scanCount || e.activeGuests || 0), 0);
  const totalQrScans = recordedScans > 0 ? recordedScans : (totalEvents === 0 && totalPhotos === 0 ? 0 : totalGuests);

  const scanConversion = totalQrScans > 0 
    ? Math.min(100, Math.round((totalPhotos / totalQrScans) * 100)) 
    : 0;

  const avgPhotosPerSession = (totalEvents > 0 && totalPhotos > 0) 
    ? (totalPhotos / totalEvents).toFixed(1) 
    : '0';

  const downloadRate = totalPhotos > 0 
    ? Math.min(100, Math.round((totalDownloads / totalPhotos) * 100)) 
    : 0;

  // Filter Popularity: accurately calculated from photos
  const filterCounts: Record<string, number> = {};
  photos.forEach(p => {
    const name = p.filterName || 'Standard Filter';
    filterCounts[name] = (filterCounts[name] || 0) + 1;
  });

  const filterPopularity = Object.entries(filterCounts).map(([name, count]) => {
    const shareNum = totalPhotos > 0 ? Math.round((count / totalPhotos) * 100) : 0;
    return {
      name,
      share: `${shareNum}%`,
      shareNum,
      count: `${count} ${count === 1 ? 'photo' : 'photos'}`,
    };
  }).sort((a, b) => b.shareNum - a.shareNum);

  // Hourly Activity: accurately grouped if photos exist
  const hourBuckets: Record<string, number> = {
    '6:00 PM': 0,
    '7:00 PM': 0,
    '8:00 PM': 0,
    '9:00 PM': 0,
    '10:00 PM': 0,
    '11:00 PM': 0,
  };

  let hasHourlyData = false;
  photos.forEach(p => {
    if (p.capturedAt) {
      hasHourlyData = true;
      const lower = p.capturedAt.toLowerCase();
      if (lower.includes('6:') || lower.includes('18:')) hourBuckets['6:00 PM']++;
      else if (lower.includes('7:') || lower.includes('19:')) hourBuckets['7:00 PM']++;
      else if (lower.includes('8:') || lower.includes('20:')) hourBuckets['8:00 PM']++;
      else if (lower.includes('9:') || lower.includes('21:')) hourBuckets['9:00 PM']++;
      else if (lower.includes('10:') || lower.includes('22:')) hourBuckets['10:00 PM']++;
      else hourBuckets['11:00 PM']++;
    }
  });

  const maxHourlyCount = Math.max(...Object.values(hourBuckets), 1);
  const hourlyData = Object.entries(hourBuckets).map(([hour, count]) => ({
    hour,
    count,
    height: hasHourlyData && count > 0 ? `${Math.max(15, Math.round((count / maxHourlyCount) * 100))}%` : '8%',
    peak: hasHourlyData && count > 0 && count === maxHourlyCount,
  }));

  const peakHour = hourlyData.find(h => h.peak);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Event Analytics
            </span>
            <span className="text-muted-foreground/30">•</span>
            <RealtimeStatusBadge />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Event Analytics & Guest Insights
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Track guest scans, peak photo-taking hours, and popular photo styles across your events.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/60">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              timeRange === 'today' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              timeRange === '7days' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              timeRange === 'all' 
                ? 'bg-foreground text-background font-medium shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Lifetime
          </button>
        </div>
      </div>

      {/* 4 Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total QR Scans */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Total QR Scans</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 font-light tracking-tight">
            {totalQrScans}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1.5 flex items-center gap-1 font-medium">
            {totalQrScans > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {totalQrScans} scans recorded
              </span>
            ) : (
              'Ready for guest scans'
            )}
          </p>
        </div>

        {/* Scan Conversion */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Scan Conversion</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 font-light tracking-tight">
            {scanConversion}%
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1.5 font-medium">
            {scanConversion > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">Guests who snapped photos</span>
            ) : (
              'Awaiting first photo capture'
            )}
          </p>
        </div>

        {/* Avg Photos / Session */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Avg Photos / Event</span>
            <div className="p-2 rounded-2xl bg-secondary text-primary border border-border/60">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 font-light tracking-tight">
            {avgPhotosPerSession}
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1.5 font-medium">
            {totalPhotos > 0 ? `${totalPhotos} photos captured` : '0 photos taken so far'}
          </p>
        </div>

        {/* Download Rate */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Download Rate</span>
            <div className="p-2 rounded-2xl bg-secondary text-emerald-600 dark:text-emerald-400 border border-border/60">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display text-foreground mt-3 font-light tracking-tight">
            {downloadRate}%
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1.5 font-medium">
            {totalDownloads > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">{totalDownloads} guest downloads</span>
            ) : (
              'No downloads yet'
            )}
          </p>
        </div>
      </div>

      {/* Hourly Activity Bar Chart & Filter Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Peak Shooting Hours Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl text-foreground font-light">Photos Taken by Hour</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-light">
                  Photo activity throughout the event
                </p>
              </div>
              {hasHourlyData && peakHour && (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 font-semibold">
                  Peak: {peakHour.hour}
                </span>
              )}
            </div>

            {/* Visual Bar Graph or Empty State */}
            {hasHourlyData ? (
              <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-52 border-b border-border/60">
                {hourlyData.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono text-muted-foreground mb-2 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      {bar.count}
                    </span>
                    <div 
                      className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                        bar.peak 
                          ? 'bg-foreground text-background shadow-md' 
                          : 'bg-secondary hover:bg-secondary/70 border border-border/60'
                      }`}
                      style={{ height: bar.height }}
                    />
                    <span className="text-[9px] font-mono uppercase text-muted-foreground mt-3 whitespace-nowrap">
                      {bar.hour.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground border border-border/60">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground font-light">No Hourly Activity Yet</h4>
                  <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto mt-1 leading-relaxed">
                    Photos captured by guests in live photobooths will plot here by hour in real time.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-4 border-t border-border/60">
            <span>Real-time photo timestamps</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {totalPhotos > 0 ? 'Live Capture Active' : 'Waiting for Captures'}
            </span>
          </div>
        </div>

        {/* Filter Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20 flex flex-col justify-between">
          <div>
            <div>
              <h3 className="font-display text-2xl text-foreground font-light">Popular Filters</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-light">
                Most selected photo filters by guests
              </p>
            </div>

            {filterPopularity.length > 0 ? (
              <div className="space-y-4 pt-4">
                {filterPopularity.map((f, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-foreground font-medium">{f.name}</span>
                      <span className="text-primary font-bold">{f.share} ({f.count})</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border/40">
                      <div 
                        className={`h-full ${idx === 0 ? 'bg-foreground' : 'bg-primary'} rounded-full`} 
                        style={{ width: f.share }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground border border-border/60">
                  <Sliders className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-display text-xl text-foreground font-light">No Filter Data Recorded</h4>
                  <p className="text-xs text-muted-foreground font-mono max-w-xs mx-auto mt-1 leading-relaxed">
                    Filter popularity will rank here automatically once guests start taking photos.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Guest Device Profile:</span>
            <span className="text-foreground font-semibold">
              {totalPhotos > 0 || totalEvents > 0 ? 'Mobile Web & Kiosk Sessions' : 'No sessions recorded yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Stream Activity Table */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs ring-1 ring-border/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-foreground font-light">Recent Event Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">
              Live guest captures, downloads, and photobooth interactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              {recentActivity.length} {recentActivity.length === 1 ? 'record' : 'records'}
            </span>
            {recentActivity.length > 0 && (
              <button
                type="button"
                onClick={handleClearActivity}
                className="px-3 py-1 rounded-full bg-secondary/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/60 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Clear all activity logs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-muted-foreground font-mono">No live activity recorded yet.</p>
            <p className="text-[11px] text-muted-foreground/60 font-mono">
              Photobooth captures, guest downloads, and QR scans will stream here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentActivity.map((log, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] shrink-0 font-semibold ${log.badgeClass || 'bg-secondary text-primary border border-border/60'}`}>
                    {log.tag}
                  </span>
                  <span className="text-foreground font-medium truncate">{log.action}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground shrink-0 text-[11px]">
                  <span className="hidden sm:inline opacity-80">{log.event}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
