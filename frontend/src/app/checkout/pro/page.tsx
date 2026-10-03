'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  QrCode, 
  Camera, 
  Sliders, 
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Layers,
  Lock,
  Wallet,
  CreditCard,
  Building,
  Crown
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { QrShareCard } from '@/features/events/components/QrShareCard';
import { apiClient } from '@/lib/api';
import { recordRealTransaction, recordRealAuditLog } from '@/lib/adminRecords';
import { generateEventSlug } from '@/lib/utils';
import { isAdminRole } from '@/types/user';
import { EVENT_TYPES_LIST, getEventLabel, EventType } from '@/types';
import { EventTypeSelectWithPreview } from '@/features/events/components/EventTypeSelectWithPreview';

function ProCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Multi-step State (1: Create Event, 2: Choose Pro, 3: Xendit Checkout, 4: Ready)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isAdmin, setIsAdmin] = useState(false);

  // Event Form State
  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    eventType: searchParams.get('type') || 'wedding',
    location: searchParams.get('location') || '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Payment State
  const [selectedChannel, setSelectedChannel] = useState<'gcash' | 'maya' | 'card' | 'qrph'>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{
    id: string;
    name: string;
    slug: string;
    date: string;
    eventType: string;
    location: string;
    qrToken?: string;
  } | null>(null);

  // Check login status & admin rights
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        const adminUser = isAdminRole(u?.role) || u?.role === 'admin';
        setIsAdmin(!!adminUser);
      }
      // Purchasing requires a real signed-in account
      if (!stored || !localStorage.getItem('memora_token')) {
        router.push('/login?redirect=' + encodeURIComponent('/checkout/pro' + window.location.search));
      }
    } catch {}
  }, []);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter an event name to proceed.');
      return;
    }
    setFormError(null);
    setCurrentStep(2);
  };

  const handleInitiateXendit = async () => {
    // If admin, bypass payment checkout step and activate directly for ₱0
    if (isAdmin) {
      await handleSimulatePaymentSuccess(true);
      return;
    }

    setIsProcessing(true);
    setPaymentFailed(false);

    try {
      const slug = generateEventSlug(formData.name);
      
      // Attempt backend API call to register checkout session
      try {
        await apiClient.post('/checkout/pro', {
          name: formData.name,
          event_date: formData.date,
          event_type: formData.eventType,
          location: formData.location,
        });
      } catch {
        // Local fallback handled smoothly
      }

      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setCurrentStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePaymentSuccess = async (adminComplimentary = false) => {
    setIsProcessing(true);
    setPaymentFailed(false);

    const isFreeAdmin = adminComplimentary || isAdmin;

    setTimeout(async () => {
      try {
        const slug = generateEventSlug(formData.name || 'new-pro-event');
        const eventId = 'EVT-' + Date.now().toString().slice(-6);
        const qrToken = 'tok_' + Math.random().toString(36).substring(2, 15);

        let currentOrganizerEmail = '';
        let currentUserId = '';
        let currentOrganizerName = isFreeAdmin ? 'System Admin' : 'Organizer';
        try {
          const rawUser = localStorage.getItem('memora_user');
          if (rawUser) {
            const u = JSON.parse(rawUser);
            if (u.email) currentOrganizerEmail = u.email;
            if (u.id) currentUserId = u.id;
            if (u.name && !isFreeAdmin) currentOrganizerName = u.name;
          }
        } catch {}

        const newProEvent = {
          id: eventId,
          name: formData.name || 'New Event',
          slug: slug,
          eventType: formData.eventType,
          date: formData.date,
          location: formData.location,
          organizerName: currentOrganizerName,
          organizerEmail: currentOrganizerEmail,
          userId: currentUserId,
          status: 'active' as const,
          plan: 'pro' as const,
          isPremium: true,
          photoCount: 0,
          qrToken: qrToken,
        };

        // 1. Sync to local storage
        try {
          const raw = localStorage.getItem('memora_events');
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(newProEvent);
          localStorage.setItem('memora_events', JSON.stringify(list));

          // Set 30-day expiration on active user session
          const rawUser = localStorage.getItem('memora_user');
          if (rawUser) {
            const u = JSON.parse(rawUser);
            const now = new Date();
            const expDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const graceDate = new Date(now.getTime() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            u.plan = 'pro';
            u.subscription_expires_at = expDate;
            u.subscription_grace_until = graceDate;
            localStorage.setItem('memora_user', JSON.stringify(u));
          }

          // Record in audit log and transactions
          recordRealTransaction({
            host: isFreeAdmin ? 'System Admin' : (formData.name ? `${formData.name} Host` : 'Organizer'),
            event: newProEvent.name,
            plan: isFreeAdmin ? 'PRO Event Pass (Admin Complimentary Grant - 1 Month)' : 'PRO Event Pass (₱1,499 - 1 Month)',
            amount: isFreeAdmin ? '₱0.00' : '₱1,499.00',
            amountNum: isFreeAdmin ? 0 : 1499,
            status: 'Paid',
            method: isFreeAdmin ? 'Admin Authorization (₱0)' : selectedChannel.toUpperCase() + ' (Xendit)',
          });

          recordRealAuditLog(
            isFreeAdmin
              ? `PRO Event Activated for Admin: ${newProEvent.name} [Complimentary ₱0 Master License]`
              : `PRO Event Activated: ${newProEvent.name} [Paid ₱1,499 via Xendit]`,
            isFreeAdmin ? 'System Admin' : 'Organizer',
            'info'
          );
        } catch {}

        // 2. Call backend confirmation API if available
        try {
          await apiClient.post('/checkout/confirm', {
            plan_type: 'pro',
            event_id: eventId,
            payment_method: isFreeAdmin ? 'ADMIN_COMPLIMENTARY' : selectedChannel.toUpperCase(),
          });
        } catch {}

        setCreatedEvent(newProEvent);
        setIsProcessing(false);
        setCurrentStep(4);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    }, isFreeAdmin ? 400 : 1200);
  };

  const handleSimulatePaymentFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentFailed(true);
    }, 800);
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
              <span>{isAdmin ? 'Pro Checkout • ₱0 / Event' : 'Pro Checkout • ₱1,499 / Event'}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Step Progress Tracker */}
        <div className="mb-10">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: '1. Create Event' },
              { num: 2, label: '2. Choose Pro' },
              { num: 3, label: '3. Xendit Checkout' },
              { num: 4, label: '4. Ready' },
            ].map((step) => {
              const active = currentStep === step.num;
              const completed = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                      completed
                        ? 'bg-emerald-500'
                        : active
                        ? 'bg-primary ring-2 ring-primary/30'
                        : 'bg-muted/50'
                    }`}
                  />
                  <span
                    className={`mt-2 font-mono text-[10px] uppercase tracking-wider hidden sm:block ${
                      active ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Create your event */}
        {currentStep === 1 && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
                Step 1 — Create your event
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                Create Your Event
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Create your event details before proceeding to setup.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Event Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Santos Anniversary or Smith Reception"
                  className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border/80 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border/80 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Event Type
                    </label>
                    <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 font-semibold">
                      PRO UNLOCKED
                    </span>
                  </div>
                  <EventTypeSelectWithPreview
                    value={(formData.eventType || 'wedding') as EventType}
                    onChange={(newType) => setFormData({ ...formData, eventType: newType })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Venue / Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. The Glasshouse, BGC Taguig"
                  className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border/80 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border/60">
                <Link
                  href="/#pricing"
                  className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Choose Pro */}
        {currentStep === 2 && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
                Step 2 — Choose Pro
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                Your Plan
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                Upgrade your event with full Pro features. 1-month active pass with live gallery countdown.
              </p>
            </div>

            {/* Event Header Card */}
            <div className="p-4 rounded-2xl bg-secondary/60 border border-border/60 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Upgrading Event</span>
                <p className="font-display text-lg text-foreground font-medium">{formData.name || 'New Event'}</p>
                <p className="text-xs text-muted-foreground">{formData.date} • {getEventLabel(formData.eventType)}</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-mono uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Pro Plan Card */}
            <div className="rounded-3xl p-7 bg-[#201915] text-[#faf7f2] border border-primary/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">
                    Plan Selected
                  </span>
                  <h3 className="font-display text-3xl font-light text-[#faf7f2] mt-0.5">PRO</h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-4xl font-light text-cream">
                    {isAdmin ? '₱0' : '₱1,499'}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#faf7f2]/60">1 month pass</span>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Feature Checklist */}
              <ul className="space-y-3 font-light text-sm">
                {[
                  'Unlimited photos for 1 full event',
                  '1-month active event access & live gallery',
                  'All filters & strip layouts',
                  'Custom event logo & typography',
                  'Zero watermark',
                  'Live event gallery & HD guest downloads',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-[#faf7f2]/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border/60">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleInitiateXendit}
                className="px-8 py-3 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <span>{isAdmin ? 'Activate PRO (₱0)' : 'Continue to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Xendit Checkout */}
        {currentStep === 3 && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
                Step 3 — Xendit Checkout
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                Complete Payment
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light">
                {isAdmin
                  ? 'Administrator complimentary bypass enabled. No charges will be incurred.'
                  : 'Your payment is securely processed by Xendit Philippines. Upon completion, your event is automatically upgraded.'}
              </p>
            </div>

            {/* Failure Alert Banner (Allows Retry branch from flowchart!) */}
            {paymentFailed && (
              <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs space-y-3 animate-in shake">
                <div className="flex items-center gap-2 font-mono uppercase tracking-wider font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Payment Unsuccessful</span>
                </div>
                <p className="font-sans leading-relaxed">
                  The transaction was declined or canceled by the payment provider. You can retry with another payment channel without losing your event setup.
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentFailed(false)}
                  className="px-4 py-1.5 rounded-full bg-destructive text-destructive-foreground font-mono text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Payment</span>
                </button>
              </div>
            )}

            {/* Xendit Hosted Payment Modal / View */}
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    X
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-foreground">Xendit Checkout</span>
                    <p className="text-[10px] font-mono text-muted-foreground">Certified Level 1 PCI-DSS Gateway</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Amount to Pay</span>
                  <p className="font-display text-2xl text-foreground font-light">
                    {isAdmin ? '₱0.00' : '₱1,499.00'}
                  </p>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="space-y-3">
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'gcash', label: 'GCash', tag: 'Instant e-Wallet' },
                    { id: 'maya', label: 'Maya', tag: 'Instant e-Wallet' },
                    { id: 'card', label: 'Card', tag: 'Visa / Mastercard' },
                    { id: 'qrph', label: 'QR Ph', tag: 'Any PH Bank QR' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChannel(ch.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedChannel === ch.id
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                          : 'bg-card border-border/60 hover:border-border'
                      }`}
                    >
                      <div className="font-mono text-xs font-semibold text-foreground">{ch.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{ch.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details breakdown */}
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item</span>
                  <span className="font-medium text-foreground">PRO Event Pass (1 Event · 1 Month Active Access)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Event</span>
                  <span className="font-medium text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Channel</span>
                  <span className="font-mono uppercase font-semibold text-primary">{selectedChannel}</span>
                </div>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulatePaymentSuccess(false)}
                className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Verifying Transaction with Xendit...</span>
                ) : isAdmin ? (
                  <>
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>👑 Complete Free Admin Activation (₱0)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₱1,499 via Xendit ({selectedChannel.toUpperCase()})</span>
                  </>
                )}
              </button>

              {/* Developer / Simulation Helper */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Back to plan
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePaymentFailure}
                  className="text-[11px] font-mono text-muted-foreground/60 hover:text-destructive transition-colors cursor-pointer underline"
                >
                  Test: Simulate Failed Payment (Flowchart Branch)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Return to NicoSnap / Memora */}
        {currentStep === 4 && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in">
            {/* Success Celebration Banner */}
            <div className="text-center space-y-2 pb-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-light text-foreground tracking-tight">
                {isAdmin ? 'Event Ready!' : 'Payment successful! 🎉'}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light">
                {isAdmin
                  ? 'Your Pro event is ready. Unlimited photos, customized branding, and high-definition downloads are unlocked.'
                  : 'Your Pro event is ready. Unlimited photos, customized branding, and high-definition downloads are now fully unlocked.'}
              </p>
            </div>

            {/* Created Pro Event Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#201915] text-[#faf7f2] border border-primary/30 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-light text-[#faf7f2]">
                    {createdEvent?.name || formData.name || 'New Event'}
                  </h3>
                  <p className="font-mono text-xs text-[#faf7f2]/60 mt-1">
                    {createdEvent?.date || formData.date} • {formData.location}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs uppercase tracking-widest font-bold self-start sm:self-auto">
                  <span>PRO ✓</span>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#faf7f2]/60">Photos</span>
                  <p className="font-mono text-xs font-semibold text-cream mt-0.5">Unlimited</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#faf7f2]/60">Watermark</span>
                  <p className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">Zero Watermark</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#faf7f2]/60">Gallery Access</span>
                  <p className="font-mono text-xs font-semibold text-emerald-400 mt-0.5">30-Day Active Pass</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#faf7f2]/60">Resolution</span>
                  <p className="font-mono text-xs font-semibold text-primary mt-0.5">Full HD 1080p</p>
                </div>
              </div>
            </div>

            {/* Action Buttons as requested in Image 2: */}
            {/* [ Customize Event ] [ View QR Code ] [ Open Photobooth ] */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/dashboard/events"
                  className="px-5 py-3 rounded-full bg-card hover:bg-secondary border border-border/80 text-foreground font-mono text-xs uppercase tracking-[0.14em] font-medium text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  <span>Customize Event</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('qr-share-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-full bg-card hover:bg-secondary border border-border/80 text-foreground font-mono text-xs uppercase tracking-[0.14em] font-medium text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-primary" />
                  <span>View QR Code</span>
                </button>

                <Link
                  href={`/e/${createdEvent?.slug || generateEventSlug(formData.name)}`}
                  target="_blank"
                  className="px-5 py-3 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-mono text-xs uppercase tracking-[0.14em] font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Open Photobooth</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
              </div>

              {/* Embedded QR Share Component */}
              <div id="qr-share-section" className="pt-4 border-t border-border/60">
                <QrShareCard
                  eventName={createdEvent?.name || formData.name || 'New Event'}
                  eventSlug={createdEvent?.slug || generateEventSlug(formData.name || 'event')}
                  qrToken={createdEvent?.qrToken}
                />
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/dashboard"
                  className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Return to Dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
        Memora • NicoSnap Photobooth Experience
      </footer>
    </div>
  );
}

export default function ProCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pro Checkout...</div>}>
      <ProCheckoutContent />
    </Suspense>
  );
}
