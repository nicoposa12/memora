'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, 
  Printer, 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  ExternalLink,
  Camera,
  QrCode
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function QrStudioPage() {
  const [eventsList, setEventsList] = useState<{ name: string; slug: string }[]>([]);
  const [eventName, setEventName] = useState('My Photobooth Event');
  const [eventSlug, setEventSlug] = useState('my-event');
  const [theme, setTheme] = useState<'noir' | 'champagne' | 'minimal'>('noir');
  const [format, setFormat] = useState<'tent' | 'frame' | 'coaster'>('tent');
  const [headline, setHeadline] = useState('Capture The Memories');
  const [subtext, setSubtext] = useState('Point your camera to join the live studio photobooth. No download required.');
  const [tableNumber, setTableNumber] = useState('Table 01');
  const [copied, setCopied] = useState(false);

  const persistQrConfig = (updates: Partial<{
    eventName: string;
    eventSlug: string;
    theme: 'noir' | 'champagne' | 'minimal';
    format: 'tent' | 'frame' | 'coaster';
    headline: string;
    subtext: string;
    tableNumber: string;
  }>) => {
    try {
      const current = {
        eventName,
        eventSlug,
        theme,
        format,
        headline,
        subtext,
        tableNumber,
        ...updates,
      };
      localStorage.setItem('memora_qr_studio_config', JSON.stringify(current));
    } catch {}
  };

  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('memora_qr_studio_config');
      if (storedConfig) {
        const c = JSON.parse(storedConfig);
        if (c.theme) setTheme(c.theme);
        if (c.format) setFormat(c.format);
        if (c.headline) setHeadline(c.headline);
        if (c.subtext) setSubtext(c.subtext);
        if (c.tableNumber) setTableNumber(c.tableNumber);
        if (c.eventName) setEventName(c.eventName);
        if (c.eventSlug) setEventSlug(c.eventSlug);
      }
      const stored = localStorage.getItem('memora_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map((e: any) => ({
            name: e.name || 'Custom Event',
            slug: e.slug || 'custom-event',
          }));
          setEventsList(list);
          if (!storedConfig) {
            setEventName(list[0].name);
            setEventSlug(list[0].slug);
          }
        }
      }
    } catch {}
  }, []);

  const printRef = useRef<HTMLDivElement | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const qrUrl = `${baseUrl}/e/${eventSlug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Theme styles
  const themeStyles = {
    noir: {
      bg: 'bg-[#0a0c10]',
      border: 'border-[#d8b86a]/30',
      text: 'text-[#f5f3ef]',
      accent: 'text-[#d8b86a]',
      sub: 'text-[#9b9ca3]',
      qrFg: '#ffffff',
      qrBg: '#0a0c10',
      tag: 'border-[#d8b86a]/40 bg-[#d8b86a]/10 text-[#d8b86a]',
    },
    champagne: {
      bg: 'bg-[#faf6ee]',
      border: 'border-[#c5ad8d]',
      text: 'text-[#1a1712]',
      accent: 'text-[#96752d]',
      sub: 'text-[#786a58]',
      qrFg: '#1a1712',
      qrBg: '#faf6ee',
      tag: 'border-[#96752d]/30 bg-[#96752d]/10 text-[#96752d]',
    },
    minimal: {
      bg: 'bg-white',
      border: 'border-zinc-300',
      text: 'text-zinc-950',
      accent: 'text-zinc-900',
      sub: 'text-zinc-500',
      qrFg: '#09090b',
      qrBg: '#ffffff',
      tag: 'border-zinc-300 bg-zinc-100 text-zinc-900',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
            Print & QR Signage
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Table Signs & QR Codes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
            Create printable table cards, signs, and QR displays for your event guests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-white dark:bg-card text-foreground text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
            <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Signs (PDF)</span>
          </button>
        </div>
      </div>

      {/* Workspace: 2-Column (Controls on Left, Live Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Select Event */}
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
            <h3 className="font-display text-2xl text-foreground font-light">Sign Settings</h3>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Active Event
              </label>
              <select
                value={eventSlug}
                onChange={(e) => {
                  setEventSlug(e.target.value);
                  const found = eventsList.find(evt => evt.slug === e.target.value);
                  if (found) {
                    setEventName(found.name);
                    persistQrConfig({ eventSlug: e.target.value, eventName: found.name });
                  } else {
                    persistQrConfig({ eventSlug: e.target.value });
                  }
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all cursor-pointer"
              >
                {eventsList.length > 0 ? (
                  eventsList.map((evt) => (
                    <option key={evt.slug} value={evt.slug}>{evt.name}</option>
                  ))
                ) : (
                  <option value="my-event">My Photobooth Event</option>
                )}
              </select>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Card Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('noir');
                    persistQrConfig({ theme: 'noir' });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    theme === 'noir' 
                      ? 'bg-[#0a0c10] border-border text-white shadow-md' 
                      : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-xs font-semibold">Classic Dark</span>
                  <span className="block text-[8px] font-mono text-primary mt-0.5">Dark & Gold</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('champagne');
                    persistQrConfig({ theme: 'champagne' });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    theme === 'champagne' 
                      ? 'bg-[#faf6ee] border-[#c5ad8d] text-[#1a1712] shadow-md font-bold' 
                      : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-xs font-semibold">Champagne</span>
                  <span className="block text-[8px] font-mono text-[#96752d] mt-0.5">Warm Linen</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('minimal');
                    persistQrConfig({ theme: 'minimal' });
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    theme === 'minimal' 
                      ? 'bg-white border-zinc-900 text-black shadow-md font-bold' 
                      : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="block text-xs font-semibold">Clean Minimal</span>
                  <span className="block text-[8px] font-mono text-zinc-600 mt-0.5">Clean Mono</span>
                </button>
              </div>
            </div>

            {/* Format Selector */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Sign Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormat('tent');
                    persistQrConfig({ format: 'tent' });
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    format === 'tent' ? 'border-foreground bg-foreground text-background font-medium shadow-xs' : 'border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  A6 Tent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormat('frame');
                    persistQrConfig({ format: 'frame' });
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    format === 'frame' ? 'border-foreground bg-foreground text-background font-medium shadow-xs' : 'border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  5x7 Frame
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormat('coaster');
                    persistQrConfig({ format: 'coaster' });
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    format === 'coaster' ? 'border-foreground bg-foreground text-background font-medium shadow-xs' : 'border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Coaster
                </button>
              </div>
            </div>

            {/* Custom Texts */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  persistQrConfig({ headline: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Table Number or Location
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => {
                  setTableNumber(e.target.value);
                  persistQrConfig({ tableNumber: e.target.value });
                }}
                placeholder="e.g. Table 04 or Cocktail Bar"
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                Subtitle / Instructions
              </label>
              <textarea
                rows={2}
                value={subtext}
                onChange={(e) => {
                  setSubtext(e.target.value);
                  persistQrConfig({ subtext: e.target.value });
                }}
                className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live Physical Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Print Preview
            </span>
          </div>

          {/* The Physical Card Mockup */}
          <div 
            ref={printRef}
            className={`w-full max-w-sm rounded-3xl p-8 sm:p-10 border shadow-2xl transition-all duration-300 relative flex flex-col items-center text-center ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text}`}
          >
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2 mb-6">
              <Logo className={`w-5 h-5 ${currentTheme.accent}`} />
              <span className="font-editorial-italic text-2xl tracking-wide">
                Memora
              </span>
            </div>

            {/* Table Badge */}
            {tableNumber && (
              <span className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.25em] mb-4 border ${currentTheme.tag}`}>
                {tableNumber}
              </span>
            )}

            {/* Headline */}
            <h2 className="font-editorial text-3xl sm:text-4xl leading-tight tracking-tight mb-3">
              {headline}
            </h2>

            <p className={`text-xs max-w-xs leading-relaxed mb-6 font-normal ${currentTheme.sub}`}>
              {subtext}
            </p>

            {/* QR Code Container with High Precision Styling */}
            <div className="p-4 rounded-2xl bg-white shadow-xl border border-black/10 my-2">
              <QRCodeSVG
                value={qrUrl}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>

            {/* Event Footnote */}
            <div className={`mt-6 pt-4 border-t w-full text-[9px] font-mono uppercase tracking-[0.2em] ${currentTheme.sub}`}>
              <p className="font-semibold text-xs">{eventName}</p>
              <p className="mt-1 opacity-75">NO APP REQUIRED • SCAN WITH CAMERA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
