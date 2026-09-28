'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Palette, 
  Sliders, 
  Layout, 
  QrCode,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrShareCard } from './QrShareCard';
import { generateEventSlug } from '@/lib/utils';
import { EventType, EVENT_TYPES_LIST } from '@/types';
import { isAdminRole } from '@/types/user';

export function EventWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hasStudioPlan, setHasStudioPlan] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('memora_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        const isAdmin = isAdminRole(u.role) || u.email?.toLowerCase().includes('admin') || u.role === 'admin';
        if (isAdmin || (u.subscription_plan === 'studio' && (u.subscription_status === 'active' || u.subscription_status === 'past_due'))) {
          setHasStudioPlan(true);
          setFormData(prev => ({ ...prev, watermark: false, maxPhotosPerGuest: 9999 }));
        }
      }
    } catch {}
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    eventType: 'wedding' as EventType,
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    primaryColor: '#e6c687',
    secondaryColor: '#faf6ee',
    countdown: 3,
    maxPhotosPerGuest: 10,
    enableGallery: true,
    watermark: true,
    templateLayout: 'strip',
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateEventSlug(name),
    }));
  };

  const steps = [
    { num: 1, label: 'Info', icon: Calendar },
    { num: 2, label: 'Branding', icon: Palette },
    { num: 3, label: 'Booth Rules', icon: Sliders },
    { num: 4, label: 'Template', icon: Layout },
    { num: 5, label: 'Publish', icon: QrCode },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 selection:bg-primary/20 selection:text-primary">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 relative">
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
              <span className={`text-[11px] font-mono uppercase tracking-wider mt-2 hidden sm:block ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Container */}
      <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border/80 shadow-xs ring-1 ring-border/30 text-foreground">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-primary/10 text-primary border border-primary/20">
                Step 1 of 5
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">Event Details</h2>
              <p className="text-xs text-muted-foreground font-light">Give your celebration a memorable name and date.</p>
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
                      Covered by your Studio plan. The standard ₱1,499 event fee is waived (₱0).
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-widest shrink-0">
                  ₱0 Waived
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Garcia Wedding 2026"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm shadow-2xs font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Public Event URL
                </label>
                <div className="flex items-center px-4 py-3 rounded-xl bg-secondary/40 border border-border/60 text-muted-foreground text-xs font-mono">
                  <span>memora.app/e/</span>
                  <span className="text-primary font-semibold">{formData.slug || 'your-event-slug'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Event Type
                    </label>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 font-semibold">
                      {hasStudioPlan ? 'STUDIO COVERAGE' : 'PRO & STUDIO READY'}
                    </span>
                  </div>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as EventType }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/70 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                  >
                    {EVENT_TYPES_LIST.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.emoji} {evt.label} {evt.tier === 'pro_studio' ? '• Pro & Studio' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-light">
                    {EVENT_TYPES_LIST.find(e => e.id === formData.eventType)?.description || 'Photobooth event configuration'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/70 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!formData.name.trim()}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Branding</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Branding */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-primary/10 text-primary border border-primary/20">
                Step 2 of 5
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">Event Palette</h2>
              <p className="text-xs text-muted-foreground font-light">Match the photobooth colors to your event theme.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-12 rounded-xl bg-transparent border border-border cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-foreground uppercase">{formData.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Secondary Tone
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-12 rounded-xl bg-transparent border border-border cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-foreground uppercase">{formData.secondaryColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next: Booth Rules</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Photobooth Rules */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-primary/10 text-primary border border-primary/20">
                Step 3 of 5
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">Photobooth Rules</h2>
              <p className="text-xs text-muted-foreground font-light">Control guest limits and countdown timer.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Shutter Countdown
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 3, 5, 10].map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, countdown: seconds }))}
                      className={`py-3 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                        formData.countdown === seconds
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                          : 'bg-secondary/50 border-border/70 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {seconds === 0 ? 'Off (Instant)' : `${seconds}s`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Live Event Gallery</h4>
                  <p className="text-xs text-muted-foreground">Allow guests to view photos taken by other attendees.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableGallery}
                  onChange={(e) => setFormData(prev => ({ ...prev, enableGallery: e.target.checked }))}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next: Select Template</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Template */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-primary/10 text-primary border border-primary/20">
                Step 4 of 5
              </span>
              <h2 className="font-display text-3xl font-light text-foreground tracking-tight mt-2">Photo Strip Template</h2>
              <p className="text-xs text-muted-foreground font-light">Choose the primary frame layout for your guests.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'strip', name: 'Classic 3-Photo Strip', desc: 'Vertical photo strip with elegant text' },
                { id: 'filmstrip', name: '35mm Filmstrip', desc: 'Vintage film strip with sprocket borders' },
                { id: 'polaroid', name: 'Vintage Polaroid', desc: 'Square photo with generous matte border' },
                { id: 'single', name: 'Landscape 4:3', desc: 'Full-bleed portrait with subtle subtitle overlay' },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setFormData(prev => ({ ...prev, templateLayout: t.id }))}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    formData.templateLayout === t.id
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-secondary/40 border-border/70 hover:border-border'
                  }`}
                >
                  <h4 className="font-display text-lg text-foreground mb-1 font-medium">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <button 
                type="button"
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('memora_events');
                    const list = raw ? JSON.parse(raw) : [];
                    let userPlan = 'free';
                    let isPremium = false;
                    const storedUser = localStorage.getItem('memora_user');
                    if (storedUser) {
                      const u = JSON.parse(storedUser);
                      const isAdmin = isAdminRole(u.role) || u.email?.toLowerCase().includes('admin') || u.role === 'admin';
                      if (isAdmin || (u.subscription_plan === 'studio' && (u.subscription_status === 'active' || u.subscription_status === 'past_due'))) {
                        userPlan = 'studio';
                        isPremium = true;
                      }
                    }

                    const newEvent = {
                      id: Date.now().toString(),
                      name: formData.name || 'New Event',
                      slug: formData.slug || generateEventSlug(formData.name || 'event'),
                      eventType: formData.eventType,
                      date: formData.date,
                      location: formData.location || 'Private Venue',
                      organizerName: 'Organizer',
                      status: 'active',
                      plan: userPlan,
                      isPremium: isPremium,
                      photoCount: 0,
                    };
                    list.unshift(newEvent);
                    localStorage.setItem('memora_events', JSON.stringify(list));
                    const { recordRealAuditLog } = require('@/lib/adminRecords');
                    recordRealAuditLog('Event Created: ' + newEvent.name + ' [plan: ' + userPlan + ']', 'Event Organizer', 'info');
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
                  setCurrentStep(5);
                }}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Publish Event</span>
                <Sparkles className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Publish & QR Code */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <QrShareCard
              eventName={formData.name || 'Sample Event'}
              eventSlug={formData.slug || 'sample-event'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
