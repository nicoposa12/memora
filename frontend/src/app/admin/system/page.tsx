'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  HardDrive, 
  RefreshCw, 
  Terminal, 
  Check, 
  Globe, 
  Activity 
} from 'lucide-react';
import { 
  getRealAuditLogs, 
  recordRealAuditLog, 
  getRealTotalPhotos, 
  getRealBooths, 
  RealAuditLog 
} from '@/lib/adminRecords';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';

export default function AdminSystemAuditPage() {
  const [cacheFlushed, setCacheFlushed] = useState(false);
  const [logs, setLogs] = useState<RealAuditLog[]>([]);
  const [photosCount, setPhotosCount] = useState(0);
  const [activeBooths, setActiveBooths] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSystemData = React.useCallback(() => {
    setLogs(getRealAuditLogs());
    setPhotosCount(getRealTotalPhotos());
    const booths = getRealBooths();
    setActiveBooths(booths.filter(b => b.status === 'active').length);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  // Realtime subscription: live stream system logs and node stats
  useRealtime(['ACTIVITY_LOGGED', 'PHOTO_CAPTURED', 'BOOTH_STATUS_CHANGED', 'EVENT_CREATED'], () => {
    loadSystemData();
  });

  const handleFlushCache = () => {
    setCacheFlushed(true);
    recordRealAuditLog('Cleared edge network cache', 'Administrator', 'info');
    broadcastRealtime('ACTIVITY_LOGGED', { event: 'Cleared edge network cache', actor: 'Administrator', severity: 'info' });
    setLogs(getRealAuditLogs());
    setTimeout(() => setCacheFlushed(false), 3000);
  };

  const storageUsedMb = photosCount * 4.5;
  const storageDisplay = storageUsedMb >= 1024 
    ? `${(storageUsedMb / 1024).toFixed(2)} GB` 
    : `${Math.round(storageUsedMb)} MB`;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Infrastructure
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            System & Logs
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal">
            Check server health, cloud storage usage, and recent system actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleFlushCache}
            className="px-4 py-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground hover:text-primary transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {cacheFlushed && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in shadow-2xs font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Edge cache has been cleared successfully across all locations.</span>
        </div>
      )}

      {/* Nodes Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-xs hover:border-primary/40 transition-all">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Global Network</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-foreground font-display">280+ Locations</div>
          <p className="text-xs text-emerald-700 font-medium">All systems operational</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-xs hover:border-primary/40 transition-all">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Storage Used</span>
            <HardDrive className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-display">{storageDisplay} of 10 TB</div>
          <p className="text-xs text-muted-foreground">{photosCount.toLocaleString()} photos stored</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-xs hover:border-primary/40 transition-all">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Active Photobooths</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-foreground font-display">{activeBooths} live booth{activeBooths === 1 ? '' : 's'}</div>
          <p className="text-xs text-emerald-700 font-medium">Connected and streaming</p>
        </div>
      </div>

      {/* Live Security Audit Log */}
      <div className="bg-card border border-border/70 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="font-display text-xl text-foreground font-medium">Recent Activity</h3>
          </div>
          <span className="text-xs text-muted-foreground">Live activity feed</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            No system actions or security incidents recorded yet.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {logs.map((log) => (
              <div 
                key={log.id}
                className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-primary/30 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.severity === 'alert' ? 'bg-rose-500 animate-ping' : log.severity === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <span className="text-foreground font-medium block">{log.event}</span>
                    <span className="text-xs text-muted-foreground">By: {log.actor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border/60 text-muted-foreground font-mono">
                    {log.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
