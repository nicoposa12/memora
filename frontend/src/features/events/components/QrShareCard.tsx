'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Printer, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface QrShareCardProps {
  eventName: string;
  eventSlug: string;
  qrToken?: string;
  baseUrl?: string;
}

export function QrShareCard({
  eventName,
  eventSlug,
  qrToken,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://memora.app',
}: QrShareCardProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  const eventUrl = qrToken 
    ? `${baseUrl}/e/${eventSlug}?token=${encodeURIComponent(qrToken)}` 
    : `${baseUrl}/e/${eventSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadQr = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 50, 50, 500, 500);

        const a = document.createElement('a');
        a.download = `memora-qr-${eventSlug}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-card rounded-3xl p-6 sm:p-7 border border-border/80 shadow-2xl text-center space-y-5 text-foreground ring-1 ring-border/20">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Event Live & Ready
        </span>
        <h3 className="font-display text-2xl sm:text-[26px] font-light text-foreground tracking-tight mt-2 leading-tight">
          {eventName}
        </h3>
        <p className="text-xs text-muted-foreground font-light">
          Scan with your phone camera to launch photobooth
        </p>
      </div>

      {/* QR Code Container with High-Contrast White Background */}
      <div
        ref={qrRef}
        className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center border border-border/80 ring-4 ring-secondary/50"
      >
        <QRCodeSVG
          value={eventUrl}
          size={190}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: '/favicon.ico',
            x: undefined,
            y: undefined,
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>

      {/* URL Display */}
      <div className="bg-secondary/50 px-3.5 py-2 rounded-xl border border-border/70 flex items-center justify-between gap-2 text-xs font-mono shadow-2xs">
        <span className="text-muted-foreground truncate">{eventUrl}</span>
        <button
          onClick={handleCopyLink}
          className="p-1 hover:bg-secondary rounded-lg text-foreground transition-colors cursor-pointer shrink-0"
          title="Copy Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadQr}
          className="w-full py-2.5 px-4 rounded-full bg-foreground text-background hover:bg-foreground/90 font-mono text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR</span>
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-2.5 px-4 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 text-foreground font-mono text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Sign</span>
        </button>
      </div>

      <div>
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
        >
          <span>Open photobooth in new tab</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
