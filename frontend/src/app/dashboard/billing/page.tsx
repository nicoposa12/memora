'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  CreditCard,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ClientPlan, SubscriptionStatus, isAdminRole } from '@/types/user';
import { broadcastRealtime } from '@/lib/realtime';
import { usePlans } from '@/lib/plans';
import { apiClient } from '@/lib/api';

export default function BillingPage() {
  const { plans } = usePlans();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ClientPlan>('free');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>('active');
  const [subExpiresAt, setSubExpiresAt] = useState<string>('');
  const [subGraceUntil, setSubGraceUntil] = useState<string>('');

  useEffect(() => {
    // 1. Load initial cached state from localStorage if available
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const adminUser = isAdminRole(parsed.role) || parsed.role === 'admin';
        setIsAdmin(adminUser);

        if (adminUser) {
          setCurrentPlan('studio');
          setSubStatus('active');
          setSubExpiresAt('Permanent Admin Access');
          setSubGraceUntil('Permanent');
        } else {
          const hasStudio = parsed.subscription_plan === 'studio' && (parsed.subscription_status === 'active' || parsed.subscription_status === 'past_due');
          const hasPro = parsed.subscription_plan === 'pro';
          setCurrentPlan(hasStudio ? 'studio' : hasPro ? 'pro' : 'free');
          if (parsed.subscription_status) setSubStatus(parsed.subscription_status);
          if (parsed.subscription_expires_at) setSubExpiresAt(parsed.subscription_expires_at);
          if (parsed.subscription_grace_until) setSubGraceUntil(parsed.subscription_grace_until);
        }
      }
    } catch {}

    // 2. Fetch authenticated user profile from backend to ensure state cannot be bypassed via localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('memora_token')) {
      apiClient.get('/auth/me')
        .then((res) => {
          const me = res.data?.user;
          if (!me) return;

          const adminUser = isAdminRole(me.role) || me.role === 'admin';
          setIsAdmin(adminUser);

          const hasStudio = me.subscription_plan === 'studio' && (me.subscription_status === 'active' || me.subscription_status === 'past_due');
          const hasPro = me.subscription_plan === 'pro';
          const verifiedPlan: ClientPlan = adminUser ? 'studio' : hasStudio ? 'studio' : hasPro ? 'pro' : 'free';

          setCurrentPlan(verifiedPlan);
          if (me.subscription_status) setSubStatus(me.subscription_status);
          if (me.subscription_expires_at) setSubExpiresAt(me.subscription_expires_at);
          if (me.subscription_grace_until) setSubGraceUntil(me.subscription_grace_until);

          // Synchronize verified backend state to localStorage to purge any manipulated state
          try {
            const raw = localStorage.getItem('memora_user');
            const currentObj = raw ? JSON.parse(raw) : {};
            const updated = {
              ...currentObj,
              id: me.id,
              name: me.name,
              email: me.email,
              role: me.role,
              subscription_plan: me.subscription_plan,
              subscription_status: me.subscription_status,
              subscription_expires_at: me.subscription_expires_at,
              subscription_grace_until: me.subscription_grace_until,
              plan: verifiedPlan,
            };
            localStorage.setItem('memora_user', JSON.stringify(updated));
            broadcastRealtime('USER_UPDATED', { plan: verifiedPlan });
          } catch {}
        })
        .catch(() => {});
    }
  }, []);

  const isStudioActive = currentPlan === 'studio' && subStatus === 'active';
  const isStudioGrace = currentPlan === 'studio' && subStatus === 'past_due';
  const isStudioExpired = subStatus === 'expired';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary font-medium">
            Pricing & Plans
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Passes & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Preview the booth free. An active event pass or studio subscription is required to run events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <span className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 ${
              isStudioActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : isStudioGrace
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : currentPlan === 'pro'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-secondary text-muted-foreground border border-border/60'
            }`}>
              {isStudioActive && <Crown className="w-3.5 h-3.5 text-primary" />}
              {isStudioGrace && <Clock className="w-3.5 h-3.5 text-amber-500" />}
              {currentPlan === 'pro' && <Sparkles className="w-3.5 h-3.5 text-primary" />}
              {currentPlan === 'free' && <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />}
              <span>
                {isStudioActive 
                  ? 'STUDIO Member' 
                  : isStudioGrace 
                  ? 'STUDIO (Grace Period)' 
                  : currentPlan === 'pro' 
                  ? 'PRO Event Active' 
                  : 'Free Account'}
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

      {/* Grace Period / Past Due Alert Banner (Non-Admin Only) */}
      {!isAdmin && isStudioGrace && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs space-y-2 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Studio Subscription Past Due • Grace Period Active</span>
          </div>
          <p className="text-foreground/80 leading-relaxed font-sans">
            Your Studio subscription expired on <strong>{subExpiresAt}</strong>. You have a grace period until <strong>{subGraceUntil}</strong> to renew. 
            All existing events and guest photos remain safely preserved and accessible.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/checkout/studio"
              className="py-2 px-5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-mono font-medium text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-2xs inline-block"
            >
              Renew Studio (₱4,999/mo)
            </Link>
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
            your existing events and galleries remain preserved and accessible. New event creation is restricted until renewed.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/checkout/studio"
              className="py-2 px-5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-mono font-medium text-[11px] uppercase tracking-wider transition-colors cursor-pointer shadow-2xs inline-block"
            >
              Reactivate Studio (₱4,999/mo)
            </Link>
          </div>
        </div>
      )}

      {/* 3 PRICING CARDS */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-sm text-muted-foreground font-light">
            Preview the booth free. Select an event pass or monthly studio subscription to host events.
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
                  {isAdmin ? 'Included' : (currentPlan === 'free' ? 'Current Plan' : plans.free.badge)}
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
            <div className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-[#261f1d]/20 text-[#261f1d]/60 bg-[#261f1d]/5 select-none font-mono">
              {currentPlan === 'free' ? 'Current Account Plan' : 'Included with Account'}
            </div>
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
            <Link
              href="/checkout/pro"
              className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] bg-[#f05a28] text-white hover:opacity-95 transition-opacity shadow-lg shadow-[#f05a28]/25 font-bold cursor-pointer font-mono"
            >
              {isAdmin ? 'Upgrade An Event (₱0 Admin Access)' : `Upgrade An Event (${plans.pro.priceDisplay})`}
            </Link>
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
            {isStudioActive ? (
              <div className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-[#261f1d]/20 text-[#261f1d]/60 bg-[#261f1d]/5 select-none font-mono">
                Studio Active
              </div>
            ) : (
              <Link
                href="/checkout/studio"
                className="mt-9 block w-full rounded-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] border border-[#261f1d]/20 hover:bg-[#261f1d]/5 text-[#261f1d] transition-colors cursor-pointer font-semibold font-mono"
              >
                {isAdmin 
                  ? 'Subscribe Studio (₱0 Admin Access)' 
                  : `Subscribe Studio (${plans.studio.priceDisplay}/mo)`}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
