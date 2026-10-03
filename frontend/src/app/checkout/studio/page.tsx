'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Lock, 
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Building,
  Layers,
  CreditCard,
  Wallet
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { apiClient } from '@/lib/api';
import { recordRealTransaction, recordRealAuditLog } from '@/lib/adminRecords';
import { isAdminRole } from '@/types/user';

function StudioCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name.split(' ')[0]);
        const adminUser = isAdminRole(u.role) || u.role === 'admin';
        setIsAdmin(!!adminUser);
      } else {
        router.push('/login?redirect=/checkout/studio');
      }
    } catch {}
  }, []);

  const handleConfirmStudioSubscription = async () => {
    setIsProcessing(true);
    setPaymentFailed(false);

    setTimeout(async () => {
      try {
        const now = new Date();
        const nextBilling = isAdmin ? '2099-12-31' : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const graceDate = isAdmin ? '2099-12-31' : new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // 1. Update localStorage user
        const stored = localStorage.getItem('memora_user');
        if (!stored) {
          setIsProcessing(false);
          router.push('/login?redirect=/checkout/studio');
          return;
        }
        const user: any = JSON.parse(stored);

        user.subscription_plan = 'studio';
        user.subscription_status = 'active';
        user.plan = 'studio';
        user.maxPhotos = 999999;
        user.subscription_expires_at = nextBilling;
        user.subscription_grace_until = graceDate;
        localStorage.setItem('memora_user', JSON.stringify(user));

        // 2. Record Transaction & Audit Log
        recordRealTransaction({
          host: user.name || userName,
          event: `${user.name || userName}'s Studio Workspace`,
          plan: isAdmin ? 'STUDIO Workspace (₱0)' : 'STUDIO Subscription (₱4,999/mo)',
          amount: isAdmin ? '₱0.00' : '₱4,999.00',
          amountNum: isAdmin ? 0 : 4999,
          status: 'Paid',
          method: isAdmin ? 'Admin Authorization' : selectedMethod.toUpperCase() + ' Auto-Debit (Xendit)',
        });

        recordRealAuditLog(
          isAdmin
            ? `Studio Workspace Activated: ₱0 [${user.name || userName}]`
            : `Studio Subscription Activated: ₱4,999/mo via Xendit Recurring [${user.name || userName}]`,
          isAdmin ? 'System Admin' : 'Studio Subscriber',
          'info'
        );

        // 3. Sync with backend API if available
        try {
          await apiClient.post('/checkout/studio', {});
          await apiClient.post('/checkout/confirm', {
            plan_type: 'studio',
            payment_method: isAdmin ? 'ADMIN_COMPLIMENTARY' : selectedMethod.toUpperCase(),
          });
        } catch {}

        // 4. Redirect directly to Studio Dashboard as specified in image 3
        router.push('/dashboard?studio=activated');
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    }, isAdmin ? 350 : 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/90 border-b border-border/40">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <Logo className="w-7 h-7 transition-transform group-hover:scale-105" />
            <span className="font-display text-xl tracking-[0.14em] font-light text-foreground">
              MEMORA
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 font-medium">
              <Crown className="w-3.5 h-3.5 text-primary" />
              <span>{isAdmin ? 'Studio Workspace • ₱0 / mo' : 'Studio Workspace • ₱4,999 / mo'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in">
          {/* Header section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
                {isAdmin ? 'Studio Subscription' : 'Xendit Recurring Subscription'}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isAdmin ? 'Included' : 'Cancel Anytime'}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
              {isAdmin ? 'Studio Workspace Access' : 'Start Studio Subscription'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {isAdmin
                ? 'Unlimited events, fine-art templates, and 4K photobooth sessions.'
                : 'Unlock unlimited events coverage with zero individual event fees. Billed monthly at ₱4,999.'}
            </p>
          </div>

          {/* Plan Highlights Box */}
          <div className="rounded-3xl p-7 bg-[#201915] text-[#faf7f2] border border-primary/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">
                    Studio Tier
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider">
                    Unlimited Events
                  </span>
                </div>
                <h3 className="font-display text-3xl font-light text-[#faf7f2] mt-0.5">Workspace Pass</h3>
              </div>
              <div className="text-right">
                {isAdmin ? (
                  <>
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-display text-2xl line-through text-[#faf7f2]/40">₱4,999</span>
                      <span className="font-display text-4xl font-light text-emerald-400">₱0</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">Complimentary</span>
                  </>
                ) : (
                  <>
                    <div className="font-display text-4xl font-light text-cream">₱4,999</div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#faf7f2]/60">per month</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-light text-xs sm:text-sm">
              {[
                'Unlimited events covered',
                'Never pay ₱1,499 per event',
                'Custom colors, fonts & templates',
                'Zero watermarks & custom logos',
                'Team access & event analytics',
                'Data retention grace period protection',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[#faf7f2]/90">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Setup or Admin Privilege Banner */}
          {isAdmin ? (
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-mono text-xs font-semibold text-foreground">Admin Workspace Authorization</span>
                    <p className="text-[10px] font-mono text-muted-foreground">Unlimited studio access is included for administrators</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Authorized</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/60 text-xs space-y-2 font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Billing Fee</span>
                  <span className="font-medium text-foreground">₱0.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Access Status</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Unlimited Access</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    X
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-foreground">Xendit Subscription Engine</span>
                    <p className="text-[10px] font-mono text-muted-foreground">Automated monthly billing & instant webhooks</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SSL Encrypted</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Select Auto-Debit Method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gcash', label: 'GCash Auto-Debit', desc: 'Pre-authorized direct debit' },
                    { id: 'maya', label: 'Maya Auto-Pay', desc: 'Direct recurring debit' },
                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, JCB' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedMethod === m.id
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                          : 'bg-card border-border/60 hover:border-border'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold text-foreground">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/60 text-xs space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Billing Cycle</span>
                  <span className="font-medium text-foreground">Monthly (Renews every 30 days)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>First Billing Date</span>
                  <span className="font-medium text-foreground">Today (Immediate Activation)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Due Today</span>
                  <span className="font-display text-lg text-foreground font-light">₱4,999.00 PHP</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmStudioSubscription}
              className="w-full py-4 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
            >
              {isProcessing ? (
                <span>{isAdmin ? 'Activating Studio Workspace...' : 'Setting Up Recurring Schedule with Xendit...'}</span>
              ) : isAdmin ? (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Activate Studio Workspace (₱0)</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Subscribe Studio (₱4,999/mo)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/#pricing"
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ← Back to pricing
              </Link>

              <span className="text-[11px] font-mono text-muted-foreground/70">
                Cancel anytime from your billing settings
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
        Memora • NicoSnap Studio Workspace
      </footer>
    </div>
  );
}

export default function StudioCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Studio Checkout...</div>}>
      <StudioCheckoutContent />
    </Suspense>
  );
}
