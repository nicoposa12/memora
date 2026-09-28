'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Mail, 
  ShieldCheck, 
  Globe, 
  Camera, 
  Sliders, 
  Check, 
  Sparkles,
  Lock,
  Eye,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [studioName, setStudioName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [watermarkText, setWatermarkText] = useState('MEMORA PHOTOBOOTH');
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [countdown, setCountdown] = useState('3');
  const [mirrorCamera, setMirrorCamera] = useState(true);
  const [flashSound, setFlashSound] = useState(true);
  const [pinProtected, setPinProtected] = useState(false);
  const [hostPin, setHostPin] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('memora_studio_settings');
      if (storedSettings) {
        const s = JSON.parse(storedSettings);
        if (s.studioName) setStudioName(s.studioName);
        if (s.hostEmail) setHostEmail(s.hostEmail);
        if (s.customDomain) setCustomDomain(s.customDomain);
        if (s.watermarkText) setWatermarkText(s.watermarkText);
        if (s.watermarkEnabled !== undefined) setWatermarkEnabled(s.watermarkEnabled);
        if (s.countdown) setCountdown(s.countdown);
        if (s.hostPin) setHostPin(s.hostPin);
        if (s.mirrorCamera !== undefined) setMirrorCamera(s.mirrorCamera);
        if (s.flashSound !== undefined) setFlashSound(s.flashSound);
        if (s.pinProtected !== undefined) setPinProtected(s.pinProtected);
        return;
      }

      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setStudioName(`${u.name}'s Studio`);
        if (u.email) setHostEmail(u.email);
      }
    } catch {}
  }, []);

  const persistSettings = (updates: Partial<{
    studioName: string;
    hostEmail: string;
    customDomain: string;
    watermarkText: string;
    watermarkEnabled: boolean;
    countdown: string;
    mirrorCamera: boolean;
    flashSound: boolean;
    pinProtected: boolean;
    hostPin: string;
  }>) => {
    try {
      const current = {
        studioName,
        hostEmail,
        customDomain,
        watermarkText,
        watermarkEnabled,
        countdown,
        mirrorCamera,
        flashSound,
        pinProtected,
        hostPin,
        ...updates,
      };
      localStorage.setItem('memora_studio_settings', JSON.stringify(current));
    } catch {}
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    persistSettings({});
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
            Settings
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Settings & Branding
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Set your studio name, contact info, booth camera countdown, and host PIN.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 text-xs font-mono flex items-center gap-1.5 animate-in fade-in shadow-2xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Settings saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Studio Identity */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-display text-2xl text-foreground font-light">Studio Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Studio Name
              </label>
              <input
                type="text"
                value={studioName}
                placeholder="e.g. Memories Studio"
                onChange={(e) => {
                  setStudioName(e.target.value);
                  persistSettings({ studioName: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Contact Email
              </label>
              <input
                type="email"
                value={hostEmail}
                placeholder="e.g. host@yourstudio.com"
                onChange={(e) => {
                  setHostEmail(e.target.value);
                  persistSettings({ hostEmail: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Photobooth Terminal Defaults */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <Camera className="w-4 h-4 text-primary" />
            <h2 className="font-display text-2xl text-foreground font-light">Camera & Photobooth Defaults</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Countdown Timer
              </label>
              <select
                value={countdown}
                onChange={(e) => {
                  setCountdown(e.target.value);
                  persistSettings({ countdown: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all cursor-pointer"
              >
                <option value="3">3 Seconds (Fast)</option>
                <option value="5">5 Seconds (Standard)</option>
                <option value="10">10 Seconds (Groups)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Camera Viewfinder
              </label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/60">
                <span className="text-xs text-foreground font-medium">Mirror Front Camera</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !mirrorCamera;
                    setMirrorCamera(nextVal);
                    persistSettings({ mirrorCamera: nextVal });
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    mirrorCamera ? 'bg-primary' : 'bg-secondary border border-border'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    mirrorCamera ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <span className="text-xs font-semibold text-foreground block">Camera Shutter Sound</span>
              <span className="text-[11px] text-muted-foreground font-light">Plays a camera shutter sound when a photo is taken</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !flashSound;
                setFlashSound(nextVal);
                persistSettings({ flashSound: nextVal });
              }}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                flashSound ? 'bg-primary' : 'bg-secondary border border-border'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                flashSound ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Section 3: White-Label Domain & Security */}
        <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ring-1 ring-border/20">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-display text-2xl text-foreground font-light">Custom Subdomain & Host PIN</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                  Custom Subdomain (Pro)
                </label>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> CNAME Configured
                </span>
              </div>
              <input
                type="text"
                value={customDomain}
                placeholder="e.g. booth.yourstudio.com"
                onChange={(e) => {
                  setCustomDomain(e.target.value);
                  persistSettings({ customDomain: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
              <p className="text-[10px] text-muted-foreground font-mono mt-1">
                Point your DNS CNAME record to: <code className="text-primary font-semibold">cname.memora.studio</code>
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div>
                <span className="text-xs font-semibold text-foreground block">Host PIN Code</span>
                <span className="text-[11px] text-muted-foreground font-light">Prevents guests from exiting the booth or changing settings</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  maxLength={4}
                  value={hostPin}
                  placeholder="PIN"
                  onChange={(e) => {
                    setHostPin(e.target.value);
                    persistSettings({ hostPin: e.target.value });
                  }}
                  className="w-24 bg-white dark:bg-card border border-border/80 rounded-xl px-3 py-2 text-center font-mono text-base tracking-widest text-foreground font-bold shadow-2xs placeholder:text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
