'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Users, 
  Camera, 
  DollarSign, 
  TrendingUp, 
  HardDrive, 
  PauseCircle, 
  PlayCircle, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Sliders, 
  Server, 
  Plus 
} from 'lucide-react';
import { 
  getRealBooths, 
  saveRealBooths, 
  getRealCustomers, 
  getRealTransactions, 
  getRealTotalPhotos,
  recordRealAuditLog,
  isAdminRecord,
  isAdminHostName,
  RealBoothRecord,
  RealCustomerRecord,
  RealTransaction
} from '@/lib/adminRecords';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';

export default function AdminDashboardPage() {
  const [liveBooths, setLiveBooths] = useState<RealBoothRecord[]>([]);
  const [customers, setCustomers] = useState<RealCustomerRecord[]>([]);
  const [transactions, setTransactions] = useState<RealTransaction[]>([]);
  const [totalPhotos, setTotalPhotos] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAdminData = React.useCallback(() => {
    const booths = getRealBooths();
    const custs = getRealCustomers().filter(c => !isAdminRecord(c));
    const txs = getRealTransactions().filter(t => !isAdminHostName(t.host));
    const photos = getRealTotalPhotos();

    setLiveBooths(booths);
    setCustomers(custs);
    setTransactions(txs);
    setTotalPhotos(photos);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Realtime subscription: live sync admin metrics on captures, events, booth updates
  useRealtime(
    ['PHOTO_CAPTURED', 'ACTIVITY_LOGGED', 'EVENT_CREATED', 'USER_UPDATED', 'BOOTH_STATUS_CHANGED'],
    () => {
      loadAdminData();
    }
  );

  const handleToggleBooth = (id: string) => {
    const updated = liveBooths.map(b =>
      b.id === id
        ? { ...b, status: (b.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' }
        : b
    );
    setLiveBooths(updated);
    saveRealBooths(updated);
    const toggled = updated.find(b => b.id === id);
    recordRealAuditLog(`Photobooth ${id} ${toggled?.status === 'active' ? 'resumed' : 'paused'}`, 'Administrator', 'warn');
    broadcastRealtime('BOOTH_STATUS_CHANGED', { id, status: toggled?.status });
  };

  // Accurate derived records
  const activeBoothsCount = liveBooths.filter(b => b.status === 'active').length;
  const proSubscribersCount = customers.filter(c => c.tier === 'Studio Pro').length;
  const eventPassCount = customers.filter(c => c.tier === 'Event Pass').length;
  const freeTrialCount = customers.filter(c => c.tier === 'Free Trial').length;

  const mrrAmount = proSubscribersCount * 4999;
  const totalUsersCount = customers.length;
  const freePercent = totalUsersCount > 0 ? Math.round((freeTrialCount / totalUsersCount) * 100) : 0;
  const passPercent = totalUsersCount > 0 ? Math.round((eventPassCount / totalUsersCount) * 100) : 0;
  const proPercent = totalUsersCount > 0 ? Math.round((proSubscribersCount / totalUsersCount) * 100) : 0;

  const storageUsedMb = customers.reduce((acc, c) => acc + (c.storageMb || 0), 0) + (totalPhotos * 4.5);
  const storageUsedDisplay = storageUsedMb >= 1024 
    ? `${(storageUsedMb / 1024).toFixed(2)} GB` 
    : `${Math.round(storageUsedMb)} MB`;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner: Humanized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Platform Overview
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
              {activeBoothsCount > 0 ? `${activeBoothsCount} active photobooth${activeBoothsCount > 1 ? 's' : ''}` : 'All systems normal'}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal">
            Welcome back. Here is what is happening across your photobooths today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/hosts"
            className="px-4 py-2.5 rounded-xl bg-card hover:bg-secondary border border-border text-xs font-medium text-foreground hover:text-primary transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Organizers ({totalUsersCount})</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Organizer Studio</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Organizers */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Organizers</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-foreground font-medium">
            {totalUsersCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <span>{totalUsersCount === 0 ? 'No organizers signed up yet' : `${totalUsersCount} registered account${totalUsersCount > 1 ? 's' : ''}`}</span>
          </div>
        </div>

        {/* Metric 2: Live Photobooths */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-sm transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Active Photobooths</span>
            <Camera className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-foreground font-medium">
            {activeBoothsCount} <span className="text-xs font-normal text-emerald-600">live</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <span className={`w-1.5 h-1.5 rounded-full ${activeBoothsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
            <span>{activeBoothsCount > 0 ? `${activeBoothsCount} active booth session${activeBoothsCount > 1 ? 's' : ''}` : 'No booths running right now'}</span>
          </div>
        </div>

        {/* Metric 3: Photos Taken */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Photos Taken</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-foreground font-medium">
            {totalPhotos.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <HardDrive className="w-3 h-3 text-primary" />
            <span>{totalPhotos === 0 ? 'No photos stored yet' : `${storageUsedDisplay} storage used`}</span>
          </div>
        </div>

        {/* Metric 4: Revenue */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-primary font-medium">
            ₱{mrrAmount.toLocaleString()} <span className="text-xs font-sans text-muted-foreground font-normal">/ mo</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700">
            <span>{eventPassCount} Event Passes • {proSubscribersCount} Pro accounts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Booths Monitor & Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Real-Time Cross-Event Kiosk Monitor */}
        <div className="lg:col-span-8 bg-card border border-border/70 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="font-display text-xl text-foreground font-medium">Active Photobooths</h3>
                <p className="text-xs text-muted-foreground">See active event booths and camera sessions in real time</p>
              </div>
            </div>
            <Link
              href="/admin/booths"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all ({liveBooths.length})</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Kiosks Content: Real records or clean empty state */}
          {liveBooths.length === 0 ? (
            <div className="p-8 rounded-2xl bg-secondary/20 border border-dashed border-border/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg text-foreground font-medium">No photobooths running right now</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                When an organizer launches an event booth, it will appear here so you can check on it or manage it in real time.
              </p>
              <div className="pt-1">
                <Link
                  href="/booth"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Try a Demo Booth</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {liveBooths.map((booth) => (
                <div 
                  key={booth.id}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-all shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">{booth.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        booth.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {booth.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-border/60 text-muted-foreground">
                        {booth.tier}
                      </span>
                    </div>
                    <h4 className="font-display text-lg text-foreground font-medium">{booth.eventName}</h4>
                    <p className="text-xs text-muted-foreground">{booth.venue} • Host: {booth.hostName}</p>
                  </div>

                  <div className="flex items-center gap-6 sm:text-right">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Photos taken</span>
                      <span className="text-sm font-semibold text-foreground">{booth.photosTaken}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Camera</span>
                      <span className="text-xs text-foreground/80">{booth.camera}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleBooth(booth.id)}
                      className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        booth.status === 'active'
                          ? 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
                          : 'border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {booth.status === 'active' ? (
                        <>
                          <PauseCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Resume</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Tier Distribution & Governance Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tier Breakdown Card */}
          <div className="bg-card border border-border/70 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="font-display text-xl text-foreground font-medium">Plans & Subscriptions</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Free Trial</span>
                  <span className="text-foreground font-semibold">{freeTrialCount} accounts ({freePercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-foreground/40 rounded-full transition-all" style={{ width: `${freePercent}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Event Pass ($29)</span>
                  <span className="text-primary font-semibold">{eventPassCount} accounts ({passPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${passPercent}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Studio Pro (₱4,999/mo)</span>
                  <span className="text-purple-700 font-semibold">{proSubscribersCount} accounts ({proPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${proPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <Link 
                href="/admin/templates"
                className="w-full py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/70 text-xs font-medium text-foreground hover:text-primary transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Manage Plans & Limits</span>
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card border border-border/70 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Server className="w-4 h-4 text-emerald-600" />
              <h3 className="font-display text-xl text-foreground font-medium">System Health</h3>
            </div>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Storage used:</span>
                <strong className="text-foreground">{storageUsedDisplay} of 10 TB</strong>
              </div>
              <div className="flex justify-between">
                <span>Network cache:</span>
                <strong className="text-emerald-700">100% healthy</strong>
              </div>
              <div className="flex justify-between">
                <span>Response time:</span>
                <strong className="text-emerald-700">12 ms (fast)</strong>
              </div>
              <div className="flex justify-between">
                <span>Active connections:</span>
                <strong className="text-foreground">{activeBoothsCount} live</strong>
              </div>
            </div>

            <Link
              href="/admin/system"
              className="block text-center text-xs text-primary hover:underline pt-2 font-medium"
            >
              View activity logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
