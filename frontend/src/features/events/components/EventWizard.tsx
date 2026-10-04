'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  QrCode,
  Crown,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrShareCard } from './QrShareCard';
import { generateEventSlug } from '@/lib/utils';
import { EventType, EVENT_TYPES_LIST } from '@/types';
import { isAdminRole } from '@/types/user';
import { apiClient } from '@/lib/api';
import { EventTypeSelectWithPreview } from './EventTypeSelectWithPreview';
import { getUserEventLimitStatus, EventLimitStatus, getCurrentUser } from '@/lib/userEvents';

export function EventWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hasStudioPlan, setHasStudioPlan] = useState<boolean>(false);
  const [limitStatus, setLimitStatus] = useState<EventLimitStatus | null>(null);
  const [isCheckingLimit, setIsCheckingLimit] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const u = getCurrentUser();
      const status = getUserEventLimitStatus(u);
      setLimitStatus(status);
      setIsCheckingLimit(false);

      if (u) {
        const isAdmin = isAdminRole(u.role) || u.role === 'admin';
        const isStudio = u.subscription_plan === 'studio' && (u.subscription_status === 'active' || u.subscription_status === 'past_due');
        const isPro = u.plan === 'pro' || u.subscription_plan === 'pro';

        if (isAdmin || isStudio) {
          setHasStudioPlan(true);
        }
        if (isAdmin || isStudio || isPro) {
          setFormData(prev => ({ ...prev, watermark: false, maxPhotosPerGuest: 9999 }));
        }
      }
    } catch {
      setIsCheckingLimit(false);
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    eventType: 'wedding' as EventType,
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '23:00',
    venueName: '',
    location: '',
    description: '',
    primaryColor: '#e6c687',
    secondaryColor: '#faf6ee',
    countdown: 3,
    maxPhotosPerGuest: 10,
    enableGallery: true,
    watermark: true,
    templateLayout: 'strip',
  });

  const [nameError, setNameError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (nameError) setNameError(null);
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateEventSlug(name),
    }));
  };

  const steps = [
    { num: 1, label: 'Details & Venue', icon: Calendar },
    { num: 2, label: 'Live Booth & QR', icon: QrCode },
  ];

  const handlePublishEvent = async () => {
    const cleanName = (formData.name || '').trim();
    if (!cleanName) {
      setNameError('Please provide an event name to publish your booth.');
      const nameInput = document.getElementById('event-name-input');
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInput.focus();
      }
      return;
    }

    try {
      const freshStatus = getUserEventLimitStatus();
      if (!freshStatus.allowed) {
        setLimitStatus(freshStatus);
        return;
      }

      setIsPublishing(true);
      setPublishError(null);

      let userPlan = 'free';
      let isPremium = false;
      let organizerEmail = '';
      let userId = '';
      let organizerName = 'Organizer';

      const storedUser = localStorage.getItem('memora_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.email) organizerEmail = u.email;
        if (u.id) userId = u.id;
        if (u.name) organizerName = u.name;
        const isAdmin = isAdminRole(u.role) || u.role === 'admin';
        if (isAdmin || (u.subscription_plan === 'studio' && (u.subscription_status === 'active' || u.subscription_status === 'past_due'))) {
          userPlan = 'studio';
          isPremium = true;
        } else if (u.plan === 'pro' || u.subscription_plan === 'pro') {
          userPlan = 'pro';
          isPremium = true;
        }
      }

      const venueName = (formData.venueName || '').trim();
      const location = (formData.location || '').trim();
      const venueDisplay = venueName
        ? (location ? `${venueName} • ${location}` : venueName)
        : (location || 'Private Venue');

      // Persist event directly to backend database if token exists
      let createdEventData: any = null;
      const token = typeof window !== 'undefined' ? localStorage.getItem('memora_token') : null;

      if (token) {
        try {
          const res = await apiClient.post('/events', {
            name: cleanName,
            slug: formData.slug || generateEventSlug(cleanName),
            event_type: formData.eventType,
            event_date: formData.date || new Date().toISOString().split('T')[0],
            location: venueDisplay,
            description: (formData.description || '').trim(),
            primary_color: formData.primaryColor || '#e6c687',
            secondary_color: formData.secondaryColor || '#faf6ee',
            countdown_seconds: formData.countdown ?? 3,
            enable_gallery: formData.enableGallery ?? true,
          });

          if (res.data?.event) {
            createdEventData = res.data.event;
          }
        } catch (apiErr: any) {
          console.error('API event creation failed:', apiErr);
          const errDetail = apiErr?.response?.data?.message || apiErr?.message || 'Unable to store event in the database. Please try again.';
          setPublishError(errDetail);
          setIsPublishing(false);
          return;
        }
      }

      const raw = localStorage.getItem('memora_events');
      const list = raw ? JSON.parse(raw) : [];

      const newEvent = {
        id: createdEventData?.id || Date.now().toString(),
        name: createdEventData?.name || cleanName,
        slug: createdEventData?.slug || formData.slug || generateEventSlug(cleanName),
        eventType: createdEventData?.event_type || formData.eventType,
        date: createdEventData?.event_date || formData.date || new Date().toISOString().split('T')[0],
        startTime: formData.startTime || '18:00',
        endTime: formData.endTime || '23:00',
        venueName: venueName,
        location: createdEventData?.location || venueDisplay,
        description: (formData.description || '').trim(),
        organizerName: organizerName,
        organizerEmail: organizerEmail,
        userId: userId,
        status: createdEventData?.status || 'active',
        plan: createdEventData?.plan || userPlan,
        isPremium: createdEventData?.is_premium ?? isPremium,
        photoCount: 0,
        primaryColor: createdEventData?.settings?.primary_color || formData.primaryColor || '#e6c687',
        secondaryColor: createdEventData?.settings?.secondary_color || formData.secondaryColor || '#faf6ee',
        countdown: createdEventData?.settings?.countdown_seconds ?? (formData.countdown ?? 3),
        templateLayout: formData.templateLayout || 'strip',
        enableGallery: createdEventData?.settings?.enable_gallery ?? (formData.enableGallery ?? true),
        watermark: (createdEventData?.is_premium ?? isPremium) ? false : (formData.watermark ?? true),
        maxPhotosPerGuest: (createdEventData?.is_premium ?? isPremium) ? 9999 : (formData.maxPhotosPerGuest || 10),
      };

      // Update form data slug if the server assigned an adjusted unique slug
      if (createdEventData?.slug) {
        setFormData(prev => ({ ...prev, slug: createdEventData.slug }));
      }

      const filtered = list.filter((e: any) => e.id !== newEvent.id && e.slug !== newEvent.slug);
      filtered.unshift(newEvent);
      localStorage.setItem('memora_events', JSON.stringify(filtered));

      try {
        const { recordRealAuditLog } = require('@/lib/adminRecords');
        recordRealAuditLog('Event Created: ' + newEvent.name + ' [plan: ' + userPlan + ']', 'Event Organizer', 'info');
      } catch {}

      try {
        const { broadcastRealtime } = require('@/lib/realtime');
        broadcastRealtime('EVENT_CREATED', {
          id: newEvent.id,
          name: newEvent.name,
          slug: newEvent.slug,
        });
        broadcastRealtime('ACTIVITY_LOGGED', {
          event: 'Event Published: ' + newEvent.name,
          actor: 'Event Organizer',
          severity: 'info',
        });
      } catch {}

      setIsPublishing(false);
      setCurrentStep(2);
    } catch (err: any) {
      console.error('Failed to publish event:', err);
      setPublishError(err?.message || 'Failed to publish event. Please try again.');
      setIsPublishing(false);
    }
  };

  if (!isCheckingLimit && limitStatus && !limitStatus.allowed) {
    if (limitStatus.currentCount === 0) {
      return (
        <div className="w-full max-w-3xl mx-auto py-8 px-4 selection:bg-primary/20 selection:text-primary animate-in fade-in duration-300">
          <div className="text-center space-y-3 mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
              CHOOSE A PLAN TO CREATE YOUR EVENT
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
              Memora photobooth experiences require an active event pass or workspace subscription. Select the option that best fits your event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRO Single Event Pass */}
            <div className="bg-card rounded-3xl p-6 sm:p-7 border border-border/80 shadow-xs flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-normal text-foreground">
                    PRO EVENT PASS
                  </h3>
                  <p className="text-xs text-muted-foreground font-light">
                    Single event pass for weddings, birthdays, and parties.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="font-display text-3xl text-foreground font-light">₱1,499</span>
                  <span className="text-xs font-mono text-muted-foreground ml-2">/ event</span>
                </div>

                <ul className="space-y-2.5 pt-3 text-xs text-muted-foreground border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>1 dedicated event photobooth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Unlimited guest photos & downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>No Memora watermark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Instant QR code venue sharing</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/checkout/pro"
                className="w-full py-3 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-[0.14em] font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Select PRO Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* STUDIO Workspace */}
            <div className="bg-card rounded-3xl p-6 sm:p-7 border border-border/80 shadow-xs flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-normal text-foreground">
                    STUDIO WORKSPACE
                  </h3>
                  <p className="text-xs text-muted-foreground font-light">
                    Monthly subscription for event organizers and agencies.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="font-display text-3xl text-foreground font-light">₱4,999</span>
                  <span className="text-xs font-mono text-muted-foreground ml-2">/ month</span>
                </div>

                <ul className="space-y-2.5 pt-3 text-xs text-muted-foreground border-t border-border/60">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Unlimited concurrent events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Custom studio watermark & logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Team & multi-operator access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Priority photo processing & vault</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/checkout/studio"
                className="w-full py-3 px-5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-mono text-xs uppercase tracking-[0.14em] font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Start Studio Subscription</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/dashboard/events"
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to events
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto py-8 px-4 selection:bg-primary/20 selection:text-primary">
        <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border/80 shadow-xs ring-1 ring-border/30 text-foreground text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mx-auto shadow-2xs">
            <Crown className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-semibold inline-block">
              {limitStatus.planName} • 1 Event Limit Reached
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
              Event Limit Reached
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
              {limitStatus.isProPass
                ? 'Your PRO Event Pass includes full coverage for 1 event. You currently have an active event in your workspace.'
                : (limitStatus.reason || 'You have reached the maximum number of events permitted for your plan.')}
            </p>
          </div>

          {/* Active Event Preview */}
          {limitStatus.existingEventName && (
            <div className="p-4 sm:p-5 rounded-2xl bg-secondary/50 border border-border/70 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Active Event in Workspace
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-semibold uppercase">
                  1 of 1 Pass Used
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h4 className="font-display text-xl text-foreground font-medium">
                    {limitStatus.existingEventName}
                  </h4>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {limitStatus.existingEventDate ? `Date: ${limitStatus.existingEventDate} • ` : ''}PRO Pass Active • Unlimited Photos • Zero Watermark
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard/events"
                    className="px-4 py-2 rounded-full bg-card hover:bg-secondary border border-border text-xs font-mono uppercase tracking-wider text-foreground transition-all cursor-pointer shadow-2xs"
                  >
                    Manage Event
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Card */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-left space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider">
                Need to host multiple concurrent events?
              </h4>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Upgrade to <strong>STUDIO Monthly (₱4,999/mo)</strong> to run unlimited concurrent photobooth events, upload custom studio logos, and invite team members.
            </p>
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <Link
                href="/checkout/studio"
                className="flex-1 py-2.5 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono uppercase tracking-[0.14em] font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Studio (Unlimited Events)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/events"
                className="py-2.5 px-5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground text-xs font-mono uppercase tracking-[0.14em] transition-all text-center"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 selection:bg-primary/20 selection:text-primary">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 relative max-w-xs mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10" />
        {steps.map((step) => {
          const isPassed = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <div key={step.num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isPassed
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/20 font-bold'
                    : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span className={`text-[11px] font-mono uppercase tracking-wider mt-2 ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Container */}
      <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border/80 shadow-xs ring-1 ring-border/30 text-foreground">
        {/* STEP 1: Details & Venue Schedule */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-primary/10 text-primary border border-primary/20">
                Step 1 of 2
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">
                Event & Venue Details
              </h2>
              <p className="text-xs text-muted-foreground font-light">
                Provide your event information, schedule, and venue location.
              </p>
            </div>

            {hasStudioPlan && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Studio Plan Active
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Covered by your Studio plan. Standard event fees waived (₱0).
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-widest shrink-0">
                  ₱0 Waived
                </span>
              </div>
            )}

            <div className="space-y-5">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Event Name *
                </label>
                <input
                  id="event-name-input"
                  type="text"
                  placeholder="e.g. Garcia Wedding 2026"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm shadow-2xs font-sans transition-all ${
                    nameError
                      ? 'border-rose-500 ring-2 ring-rose-500/20 focus:border-rose-500'
                      : 'border-border/70 focus:border-primary focus:ring-1 focus:ring-primary'
                  }`}
                  required
                />
                {nameError && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">{nameError}</p>
                )}
              </div>

              {/* Public Event URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Public Event URL
                </label>
                <div className="flex items-center px-4 py-3 rounded-xl bg-secondary/40 border border-border/60 text-muted-foreground text-xs font-mono">
                  <span>memora.app/e/</span>
                  <span className="text-primary font-semibold">{formData.slug || 'your-event-slug'}</span>
                </div>
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Event Type
                  </label>
                  <EventTypeSelectWithPreview
                    value={formData.eventType}
                    onChange={(newType) => setFormData((prev) => ({ ...prev, eventType: newType }))}
                    hasStudioPlan={hasStudioPlan || limitStatus?.isProPass}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-light">
                    {EVENT_TYPES_LIST.find((e) => e.id === formData.eventType)?.description || 'Photobooth event configuration'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/70 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* Schedule (Hours) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border/60 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold block">
                  Event Schedule & Hours
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary/30 border border-border/60 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold block">
                  Venue & Location
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Glasshouse Manila"
                      value={formData.venueName}
                      onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Address / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bonifacio Global City, Taguig"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/70 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Description / Instructions */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Event Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional notes or instructions for guests and booth operators..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm shadow-2xs font-sans resize-none"
                />
              </div>
            </div>

            {publishError && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center justify-between">
                <span>{publishError}</span>
                <button
                  type="button"
                  onClick={() => setPublishError(null)}
                  className="ml-3 text-destructive/70 hover:text-destructive font-mono text-xs uppercase cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-border/60">
              <Link
                href="/dashboard/events"
                className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Cancel
              </Link>
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublishEvent}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{isPublishing ? 'Publishing Event...' : 'Publish & Get QR Code'}</span>
                <Sparkles className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Live Booth & QR Code */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1 text-center">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                Ready for Guests
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">
                Event Published
              </h2>
              <p className="text-xs text-muted-foreground font-light max-w-md mx-auto">
                Your photobooth is active. Guests can scan the QR code to capture and view photos.
              </p>
            </div>

            <QrShareCard
              eventName={formData.name || 'New Event'}
              eventSlug={formData.slug || generateEventSlug(formData.name || 'event')}
            />

            {/* Summary Details */}
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-muted-foreground text-[11px]">
                <span>Date & Schedule</span>
                <span className="text-foreground font-medium">
                  {formData.date} • {formData.startTime} – {formData.endTime}
                </span>
              </div>
              {(formData.venueName || formData.location) && (
                <div className="flex items-center justify-between font-mono text-muted-foreground text-[11px]">
                  <span>Venue</span>
                  <span className="text-foreground font-medium truncate max-w-[190px]">
                    {formData.venueName
                      ? `${formData.venueName}${formData.location ? ` (${formData.location})` : ''}`
                      : formData.location}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/events"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs uppercase tracking-wider transition-all text-center"
              >
                Go to Events Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    slug: '',
                    eventType: 'wedding' as EventType,
                    date: new Date().toISOString().split('T')[0],
                    startTime: '18:00',
                    endTime: '23:00',
                    venueName: '',
                    location: '',
                    description: '',
                    primaryColor: '#e6c687',
                    secondaryColor: '#faf6ee',
                    countdown: 3,
                    maxPhotosPerGuest: hasStudioPlan ? 9999 : 10,
                    enableGallery: true,
                    watermark: !hasStudioPlan,
                    templateLayout: 'strip',
                  });
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-card hover:bg-secondary/60 border border-border text-foreground font-mono text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Create Another Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
