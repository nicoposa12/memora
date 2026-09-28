'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { ClientPlan, SubscriptionStatus, isAdminRole } from '@/types/user';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';
import { usePlans } from '@/lib/plans';

export default function BillingPage() {
  const { plans } = usePlans();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ClientPlan>('free');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>('active');
  const [subExpiresAt, setSubExpiresAt] = useState<string>('2026-10-24');
  const [subGraceUntil, setSubGraceUntil] = useState<string>('2026-10-31');
  const [customerName, setCustomerName] = useState('Organizer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const adminUser = isAdminRole(parsed.role) || parsed.email?.toLowerCase().includes('admin') || parsed.role === 'admin';
        setIsAdmin(adminUser);
        if (parsed.name) setCustomerName(parsed.name);

        if (adminUser) {
          // Admin accounts have permanent master access: all plans free & unlimited
          setCurrentPlan('studio');
          setSubStatus('active');
          setSubExpiresAt('Permanent Admin Access');
          setSubGraceUntil('Permanent');
          parsed.plan = 'studio';
          parsed.subscription_plan = 'studio';
          parsed.subscription_status = 'active';
          parsed.maxPhotos = 999999;
          parsed.photosUsed = 0;
          localStorage.setItem('memora_user', JSON.stringify(parsed));
        } else {
          if (parsed.plan) setCurrentPlan(parsed.plan === 'event' ? 'pro' : parsed.plan);
          if (parsed.subscription_status) setSubStatus(parsed.subscription_status);
          if (parsed.subscription_expires_at) setSubExpiresAt(parsed.subscription_expires_at);
          if (parsed.subscription_grace_until) setSubGraceUntil(parsed.subscription_grace_until);
        }
      }
    } catch {}
  }, []);

  const handlePurchase = (targetPlan: 'pro' | 'studio') => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('memora_user');
        const user = stored ? JSON.parse(stored) : { name: customerName, email: 'admin@memora.studio', role: 'admin' };
        
        user.plan = targetPlan;
        user.subscription_plan = targetPlan === 'studio' ? 'studio' : 'free';
        user.subscription_status = 'active';
        user.photosUsed = 0;
        user.maxPhotos = 999999;
        
        const now = new Date();
        const expDate = isAdmin ? 'Permanent Admin Access' : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const graceDate = isAdmin ? 'Permanent' : new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        user.subscription_expires_at = expDate;
        user.subscription_grace_until = graceDate;

        localStorage.setItem('memora_user', JSON.stringify(user));
        setCurrentPlan(targetPlan);
        setSubStatus('active');
        setSubExpiresAt(expDate);
        setSubGraceUntil(graceDate);

        // Record transaction in administrative ledger
        try {
          const { recordRealTransaction } = require('@/lib/adminRecords');
          recordRealTransaction({
            host: user.name || customerName,
            event: targetPlan === 'pro' ? 'Single Event Pass (PRO)' : `${user.name || customerName}'s Studio Workspace`,
            plan: isAdmin 
              ? (targetPlan === 'pro' ? 'PRO Event Pass (Admin Complimentary - ₱0)' : 'STUDIO Subscription (Admin Complimentary - ₱0)')
              : (targetPlan === 'pro' ? 'PRO Event Pass (₱1,499)' : 'STUDIO Subscription (₱4,999/mo)'),
            amount: isAdmin ? '₱0.00' : (targetPlan === 'pro' ? '₱1,499.00' : '₱4,999.00'),
            amountNum: isAdmin ? 0 : (targetPlan === 'pro' ? 1499 : 4999),
            status: 'Paid',
            method: isAdmin ? 'Admin Complimentary Grant' : 'GCash / Maya Instant',
          });
          broadcastRealtime('USER_UPDATED', { plan: targetPlan });
        } catch {}

        setToastSuccess(
          isAdmin
            ? (targetPlan === 'pro'
                ? 'Admin Access Applied: PRO Event Pass activated at ₱0.'
                : 'Admin Access Applied: STUDIO Workspace activated at ₱0.')
            : (targetPlan === 'pro'
                ? 'Success! PRO Event Pass (₱1,499) activated. Unlimited photos and zero watermarks for this event!'
                : 'Success! STUDIO Subscription (₱4,999/mo) activated. All events in your workspace are now covered with zero watermarks!')
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, isAdmin ? 200 : 600);
  };

  const handleResetToTrial = () => {
    try {
      const stored = localStorage.getItem('memora_user');
      const user = stored ? JSON.parse(stored) : { name: customerName, email: 'customer@memora.ph' };
      user.plan = 'free';
      user.subscription_plan = 'free';
      user.subscription_status = 'active';
      localStorage.setItem('memora_user', JSON.stringify(user));
      setCurrentPlan('free');
      setSubStatus('active');
      broadcastRealtime('USER_UPDATED', { plan: 'free' });
      setToastSuccess('Switched to Free plan (₱0).');
    } catch {}
  };

  const isStudioActive = currentPlan === 'studio' && subStatus === 'active';
  const isStudioGrace = currentPlan === 'studio' && subStatus === 'past_due';
  const isStudioExpired = subStatus === 'expired';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary font-medium">
            Pricing & Plan
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Pricing, Passes & Billing
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Try the booth free. Pay only when you run a real event.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RealtimeStatusBadge />
          {!isAdmin && (
            <span className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 ${
              isStudioActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : isStudioGrace
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : currentPlan === 'pro' || currentPlan === 'event'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary text-muted-foreground border border-border/60'
            }`}>
              {isStudioActive && <Crown className="w-3.5 h-3.5 text-primary" />}
              {isStudioGrace && <Clock className="w-3.5 h-3.5 text-amber-500" />}
              {(currentPlan === 'pro' || currentPlan === 'event') && <Sparkles className="w-3.5 h-3.5 text-primary" />}
              {currentPlan === 'free' && <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />}
              <span>
                {isStudioActive 
                  ? 'STUDIO Member (Active)' 
                  : isStudioGrace 
                  ? 'STUDIO (Grace Period)' 
                  : (currentPlan === 'pro' || currentPlan === 'event') 
                  ? 'PRO Event Active' 
                  : 'Free Trial (₱0)'}
              </span>
            </span>
          )}
          {isAdmin && (
            <Link
              href="/admin/plans"
              className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-all shadow-2xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Manage Plan Features</span>
            </Link>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {toastSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastSuccess}</span>
          </div>
          <button 
            onClick={() => setToastSuccess(null)}
            className="text-emerald-400/60 hover:text-emerald-300 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grace Period / Past Due Alert Banner (Non-Admin Only) */}
      {!isAdmin && isStudioGrace && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs space-y-2 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Studio Subscription Past Due • 7-Day Grace Period Active</span>
          </div>
          <p className="text-foreground/80 leading-relaxed font-sans">
            Your Studio subscription expired on <strong>{subExpiresAt}</strong>. You have a grace period until <strong>{subGraceUntil}</strong> to renew. 
            <span className="text-amber-700 dark:text-amber-300 font-semibold ml-1">
              Important: All existing events and guest photos are never deleted and remain 100% accessible.
            </span>
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => handlePurchase('studio')}
              className="py-2 px-5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-mono font-medium text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              Renew Studio (₱4,999/mo)
            </button>
          </div>
        </div>
      )}

      {/* Studio Expired View-Only Banner (Non-Admin Only) */}
      {!isAdmin && isStudioExpired && (
        <div className="p-5 rounded-2xl bg-secondary/60 border border-border/80 text-foreground text-xs space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider font-bold text-foreground">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>Studio Subscription Expired • Retention Safe Mode</span>
          </div>
          <p className="text-muted-foreground leading-relaxed font-sans">
            Your subscription has expired. As part of our data retention policy, 
            <strong className="text-foreground"> your existing events, guest photos, and galleries remain safely preserved, viewable, and downloadable.</strong>
            New premium event creation is restricted until renewed.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => handlePurchase('studio')}
              className="py-2 px-5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-mono font-medium text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              Reactivate Studio (₱4,999/mo)
            </button>
          </div>
        </div>
      )}

      {/* 3 PRICING CARDS */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-sm text-muted-foreground font-light">
            Try the booth free. Pay only when you run a real event.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Card 1: FREE */}
          <div className="rounded-3xl p-8 bg-[#faf7f2] text-[#261f1d] ring-1 ring-[#261f1d]/12 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#261f1d]/60 font-medium">
                  {plans.free.eyebrow}
                </p>
                <span className="rounded-full bg-[#261f1d]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#261f1d] font-semibold">
                  {isAdmin ? 'Included' : (currentPlan === 'free' ? 'Current' : plans.free.badge)}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#261f1d]">
                {plans.free.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#261f1d]/60 mt-1">
                {plans.free.period}
              </p>
              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.free.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className={feat.highlight ? 'text-[#261f1d] font-medium' : 'text-[#261f1d]/80'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={handleResetToTrial}
              className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-[#261f1d]/20 hover:bg-[#261f1d]/5 text-[#261f1d] transition-colors cursor-pointer"
            >
              {isAdmin ? 'Reset to Trial (₱0)' : currentPlan === 'free' ? 'Try The Booth (₱0 Active)' : 'Reset To Trial (₱0)'}
            </button>
          </div>

          {/* Card 2: PRO (Featured Luxury Dark Card) */}
          <div className="rounded-3xl p-8 bg-[#201915] text-[#faf7f2] shadow-2xl flex flex-col justify-between relative border border-[#f05a28]/25 ring-1 ring-[#f05a28]/20">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#f05a28] font-medium">
                  {plans.pro.eyebrow}
                </p>
                <span className="rounded-full bg-[#f05a28]/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f05a28] font-semibold">
                  {plans.pro.badge}
                </span>
              </div>

              <div>
                <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#faf7f2]">
                  {isAdmin ? '₱0' : plans.pro.priceDisplay}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#faf7f2]/60 mt-1">
                  {plans.pro.period}
                </p>
              </div>

              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.pro.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className={feat.highlight ? 'text-white font-medium' : 'text-[#faf7f2]/90'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePurchase('pro')}
              className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] bg-[#f05a28] text-white hover:opacity-95 transition-opacity shadow-lg shadow-[#f05a28]/25 font-bold cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? 'Activating...' : isAdmin ? 'Upgrade An Event (₱0 Admin Access)' : `Upgrade An Event (${plans.pro.priceDisplay})`}
            </button>
          </div>

          {/* Card 3: STUDIO Workspace */}
          <div className="rounded-3xl p-8 bg-[#faf7f2] text-[#261f1d] ring-1 ring-[#261f1d]/12 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#261f1d]/60 font-medium">
                  {plans.studio.eyebrow}
                </p>
                <span className="rounded-full bg-[#261f1d]/5 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#261f1d] font-semibold">
                  {plans.studio.badge}
                </span>
              </div>

              <div>
                <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#261f1d]">
                  {isAdmin ? '₱0' : plans.studio.priceDisplay}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#261f1d]/60 mt-1">
                  {plans.studio.period}
                </p>
              </div>

              <ul className="mt-8 space-y-3 text-sm font-light">
                {plans.studio.features.map((feat) => (
                  <li key={feat.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className={feat.highlight ? 'text-[#261f1d] font-medium' : 'text-[#261f1d]/80'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePurchase('studio')}
              className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-[#261f1d]/20 hover:bg-[#261f1d]/5 text-[#261f1d] transition-colors cursor-pointer disabled:opacity-60 font-semibold"
            >
              {isAdmin 
                ? 'Subscribe Studio (₱0 Admin Access)' 
                : isStudioActive 
                ? 'Studio Active (Renews Soon)' 
                : `Subscribe Studio (${plans.studio.priceDisplay}/mo)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
