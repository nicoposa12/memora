'use client';

import { Play, SkipBack, SkipForward, Music } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. STICKER SVG ICONS                                                       */
/* -------------------------------------------------------------------------- */

export function StrawberrySticker({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 44) / 40}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Die-cut white border */}
      <path
        d="M20 43 C6 33 2 17 9 10 C14 4 26 4 31 10 C38 17 34 33 20 43 Z"
        fill="#ffffff"
        stroke="#fda4af"
        strokeWidth="1.5"
      />
      {/* Strawberry Berry Body */}
      <path
        d="M20 41 C7.5 31.5 4 18 10 11.5 C14.5 6 25.5 6 30 11.5 C36 18 32.5 31.5 20 41 Z"
        fill="#e11d48"
      />
      {/* Specular Highlight */}
      <path
        d="M12 14 C10 18 11 25 14 28"
        stroke="#fda4af"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Seeds */}
      <circle cx="15" cy="18" r="1.1" fill="#fef08a" />
      <circle cx="25" cy="18" r="1.1" fill="#fef08a" />
      <circle cx="20" cy="24" r="1.1" fill="#fef08a" />
      <circle cx="14" cy="30" r="1.1" fill="#fef08a" />
      <circle cx="26" cy="30" r="1.1" fill="#fef08a" />
      <circle cx="20" cy="35" r="1.1" fill="#fef08a" />
      {/* Calyx Leaves */}
      <path
        d="M20 12 C17 3 11 5 9 8 C11 11 15 12 20 12 C25 12 29 11 31 8 C29 5 23 3 20 12 Z"
        fill="#22c55e"
        stroke="#15803d"
        strokeWidth="0.8"
      />
      {/* Stem */}
      <path
        d="M20 7 C20 2 22 0.5 23 0"
        stroke="#15803d"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RibbonBowSticker({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 32) / 44}
      viewBox="0 0 44 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* White die-cut outline */}
      <path
        d="M22 13 C14 3 2 7 6 18 C10 24 18 17 22 15 C26 17 34 24 38 18 C42 7 30 3 22 13 Z"
        fill="#ffffff"
        stroke="#fca5a5"
        strokeWidth="2.5"
      />
      {/* Left Loop */}
      <path
        d="M22 13 C14 3 3 7 7 17 C11 23 18 16 22 14 Z"
        fill="#e11d48"
        stroke="#9f1239"
        strokeWidth="1"
      />
      {/* Right Loop */}
      <path
        d="M22 13 C30 3 41 7 37 17 C33 23 26 16 22 14 Z"
        fill="#e11d48"
        stroke="#9f1239"
        strokeWidth="1"
      />
      {/* Left Tail */}
      <path
        d="M19 15 C15 23 11 28 8 30 C13 29 17 27 21 19 Z"
        fill="#be123c"
      />
      {/* Right Tail */}
      <path
        d="M25 15 C29 23 33 28 36 30 C31 29 27 27 23 19 Z"
        fill="#be123c"
      />
      {/* Center Ribbon Knot */}
      <ellipse
        cx="22"
        cy="14"
        rx="3.5"
        ry="3.5"
        fill="#f43f5e"
        stroke="#9f1239"
        strokeWidth="1"
      />
    </svg>
  );
}

export function CherriesSticker({ size = 30, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Die-cut outline */}
      <circle cx="11" cy="25" r="8" fill="#ffffff" />
      <circle cx="24" cy="24" r="8" fill="#ffffff" />
      <path d="M26 3 C22 10 12 16 11 23 M26 3 C25 12 25 18 24 23" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
      {/* Stems */}
      <path d="M26 4 C22 10 12 16 11 23" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 4 C25 12 25 18 24 23" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M26 4 C31 3 34 7 32 10 C29 11 26 8 26 4 Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
      {/* Left Cherry */}
      <circle cx="11" cy="25" r="6.8" fill="#e11d48" stroke="#9f1239" strokeWidth="1" />
      <circle cx="9" cy="22.5" r="1.8" fill="#fda4af" opacity="0.85" />
      {/* Right Cherry */}
      <circle cx="24" cy="24" r="6.8" fill="#e11d48" stroke="#9f1239" strokeWidth="1" />
      <circle cx="22" cy="21.5" r="1.8" fill="#fda4af" opacity="0.85" />
    </svg>
  );
}

export function PastelStarSticker({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Cyan Doodle Glow Outline */}
      <polygon
        points="18,2 22.5,12.5 34,13.5 25.5,21.5 28,33 18,27 8,33 10.5,21.5 2,13.5 13.5,12.5"
        fill="#fef08a"
        stroke="#38bdf8"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Soft Pastel Lemon Core */}
      <polygon
        points="18,4.5 21.8,13 31,14 24,20.5 26,30 18,25 10,30 12,20.5 5,14 14.2,13"
        fill="#fef9c3"
      />
      <circle cx="18" cy="18" r="2.2" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export function ToyCameraSticker({ size = 38, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 38) / 44}
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Upward Looping Strap */}
      <path
        d="M10 14 C5 1 20 -1 31 3 C37 6 36 12 29 14"
        stroke="#7c3aed"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Camera Body White Fill + Purple Outline */}
      <rect x="4" y="12" width="36" height="23" rx="5" fill="#ffffff" stroke="#7c3aed" strokeWidth="2.2" />
      {/* Top Flash Button */}
      <rect x="12" y="8" width="8" height="4" rx="2" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.6" />
      {/* Viewfinder detail */}
      <rect x="30" y="15" width="5" height="4" rx="1.5" fill="#fef08a" stroke="#7c3aed" strokeWidth="1.4" />
      {/* Outer Lens */}
      <circle cx="18" cy="23.5" r="7.5" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
      {/* Smiley Face inside Lens */}
      <circle cx="15.5" cy="22" r="0.9" fill="#7c3aed" />
      <circle cx="20.5" cy="22" r="0.9" fill="#7c3aed" />
      <path d="M15.5 25 Q18 27.5 20.5 25" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Body Decorative Sparkles */}
      <circle cx="33" cy="28" r="1.2" fill="#a855f7" />
    </svg>
  );
}

export function FloatingHairHearts({ className = '' }: { className?: string }) {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className={className}>
      <path
        d="M7 6 C5 2.5 1.5 3.5 1.5 7 C1.5 10.5 7 13.5 7 13.5 C7 13.5 12.5 10.5 12.5 7 C12.5 3.5 9 2.5 7 6 Z"
        fill="#ec4899"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
      <path
        d="M17 3.5 C15.5 1 12.5 2 12.5 5 C12.5 8 17 10 17 10 C17 10 21.5 8 21.5 5 C21.5 2 18.5 1 17 3.5 Z"
        fill="#f43f5e"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
      <path
        d="M26 6 C24.5 3.5 21.5 4.5 21.5 7.5 C21.5 10.5 26 12.5 26 12.5 C26 12.5 30.5 10.5 30.5 7.5 C30.5 4.5 27.5 3.5 26 6 Z"
        fill="#fb7185"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function RedRoseSticker({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* White die-cut outline */}
      <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#fda4af" strokeWidth="1.5" />
      {/* Outer Rose Petals */}
      <circle cx="16" cy="16" r="11" fill="#e11d48" />
      <path
        d="M16 6 C12 6 8 10 9 15 C10 20 14 24 16 26 C18 24 22 20 23 15 C24 10 20 6 16 6 Z"
        fill="#be123c"
      />
      {/* Inner Petal Swirls */}
      <circle cx="16" cy="15" r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="0.8" />
      <circle cx="15.5" cy="14.5" r="3.2" fill="#9f1239" />
      <circle cx="15.5" cy="14" r="1.5" fill="#f43f5e" />
      {/* Green Leaf Accent */}
      <path
        d="M6 21 C6 18 10 18 11 20 C11 23 8 24 6 21 Z"
        fill="#22c55e"
        stroke="#15803d"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. DESIGNER TEMPLATE TOP HEADERS                                           */
/* -------------------------------------------------------------------------- */

export function CrimsonRomanceHeader() {
  return (
    <div className="w-full text-center pb-2 pt-0.5 mb-1.5 select-none relative z-20">
      <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold">
        <span>✦</span>
        <span>L&apos;AMOUR TOUJOURS</span>
        <span>✦</span>
      </div>
      <h3
        className="font-serif text-xs sm:text-sm font-normal tracking-[0.2em] uppercase text-white mt-0.5 drop-shadow-sm"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        CRIMSON ROMANCE
      </h3>
      <div className="flex items-center justify-center gap-2 mt-1 px-4 opacity-80">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
        <span className="text-[6.5px] font-serif italic text-rose-200 tracking-widest font-normal">
          Editorial Duo Diptych
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      </div>
    </div>
  );
}

export function GinghamStrawberryHeader() {
  return (
    <div className="w-full flex items-center justify-between px-1.5 pt-0.5 pb-1 mb-1 select-none relative z-20">
      <div className="flex items-center gap-1.5">
        <StrawberrySticker size={26} className="transform -rotate-6 drop-shadow-xs" />
        <div className="px-2 py-0.5 rounded-full bg-white/95 border border-rose-200 shadow-xs">
          <span
            className="font-serif italic font-bold text-[10px] text-rose-600 tracking-wide leading-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Sweet Strawberry
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[7px] font-mono tracking-wider text-rose-600 uppercase font-semibold bg-white/90 px-2 py-0.5 rounded-full border border-rose-200/80 shadow-2xs">
        <span>🍓 PICNIC ERA</span>
      </div>
    </div>
  );
}

export function HaruCandyStripesHeader() {
  return (
    <div className="w-full flex items-center justify-between px-1.5 pt-0.5 pb-1 mb-1 select-none relative z-20">
      <PastelStarSticker size={28} className="transform rotate-12 drop-shadow-xs" />
      <div className="px-2.5 py-0.5 rounded-full bg-white/95 border border-sky-200 shadow-xs flex items-center gap-1">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-sky-800 uppercase">
          ★ SEOUL HARU PHOTO ★
        </span>
      </div>
      <ToyCameraSticker size={32} className="transform -rotate-6 drop-shadow-xs" />
    </div>
  );
}

export function MusicPlayerTopHeader({
  side = 'SIDE A',
  format = 'STEREO // 48kHz',
}: {
  side?: string;
  format?: string;
}) {
  return (
    <div className="w-full text-center pb-2 pt-0.5 mb-1.5 select-none">
      <div className="flex items-center justify-between px-1 text-[7px] font-mono tracking-widest text-white/50 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-white/30 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-rose-400" />
          </span>
          <span className="text-white/85 font-semibold tracking-[0.2em]">ORIGINAL SOUNDTRACK</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-[6px] tracking-wider text-white/70">
            {format}
          </span>
          <span className="text-rose-400 font-semibold">{side}</span>
        </div>
      </div>

      {/* Audio Frequency Hairline Divider */}
      <div className="flex items-center gap-1.5 mt-2 opacity-40 px-1">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/40" />
        <div className="flex items-center gap-[2px]">
          <span className="w-0.5 h-2 bg-white/70 rounded-full" />
          <span className="w-0.5 h-3 bg-rose-400 rounded-full" />
          <span className="w-0.5 h-1.5 bg-white/70 rounded-full" />
          <span className="w-0.5 h-3.5 bg-purple-400 rounded-full" />
          <span className="w-0.5 h-2 bg-white/70 rounded-full" />
        </div>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/40" />
      </div>
    </div>
  );
}

export function MusicPlayerWidget({
  title = 'Original Soundtrack',
  subtitle = 'Memora Sound Archive',
  isLight = false,
}: {
  title?: string;
  subtitle?: string;
  isLight?: boolean;
}) {
  return (
    <div className="w-full relative rounded-xl bg-[#101116] border border-white/10 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] select-none">
      {/* Track Row: Minimalist Vinyl Thumbnail + Metadata */}
      <div className="flex items-center gap-2.5">
        {/* Minimalist Vinyl Square Disc */}
        <div className="relative w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          <div className="absolute inset-1 rounded-full border border-white/[0.08]" />
          <div className="w-3.5 h-3.5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
            <Music className="w-1.5 h-1.5 text-white/75" />
          </div>
        </div>

        {/* Track Title & Subtitle */}
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[11px] font-medium text-white truncate leading-tight tracking-tight">
            {title}
          </p>
          <p className="text-[8px] font-mono text-white/45 truncate tracking-wider mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Progress Bar & Timestamps */}
      <div className="mt-2.5 space-y-1">
        <div className="w-full h-[2.5px] rounded-full bg-white/12 relative overflow-hidden">
          <div
            className="h-full rounded-full bg-white/90"
            style={{ width: '42%' }}
          />
        </div>
        <div className="flex items-center justify-between text-[7px] font-mono text-white/40 tracking-wider">
          <span>01:28</span>
          <span>03:45</span>
        </div>
      </div>

      {/* Essential Playback Controls */}
      <div className="mt-1 flex items-center justify-center gap-6 text-white/80">
        <button
          type="button"
          aria-label="Previous track"
          className="text-white/50 hover:text-white transition-colors"
        >
          <SkipBack className="w-3.5 h-3.5 fill-current" />
        </button>
        <button
          type="button"
          aria-label="Play track"
          className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform"
        >
          <Play className="w-3 h-3 fill-black text-black ml-0.5" />
        </button>
        <button
          type="button"
          aria-label="Next track"
          className="text-white/50 hover:text-white transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Minimal Typographic Footer */}
      <div className="mt-2 pt-1.5 border-t border-white/[0.08] text-center">
        <span className="font-mono text-[6.5px] uppercase tracking-[0.22em] text-white/30">
          Memora Audio Archive
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. CRIMSON ROMANCE FOOTER                                                  */
/* -------------------------------------------------------------------------- */

export function CrimsonRomanceFooter({ date = '02 / 14 / 2026' }: { date?: string }) {
  return (
    <div className="w-full text-center py-2 space-y-1 select-none">
      <div className="flex items-center justify-center gap-2">
        <span className="h-px w-6 bg-white/25" />
        <span className="font-serif italic text-[11px] text-rose-300">✦</span>
        <span className="h-px w-6 bg-white/25" />
      </div>
      <div className="font-serif leading-none tracking-wide text-white">
        <div className="text-xs sm:text-sm font-light tracking-[0.2em] uppercase">
          <span>YOU </span>
          <span className="font-serif italic font-normal text-rose-200 lowercase">and </span>
          <span>ME</span>
        </div>
        <div
          className="text-lg sm:text-xl font-normal tracking-[0.14em] font-serif italic text-white mt-1 drop-shadow-sm"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          FOREVER
        </div>
      </div>
      <p className="font-mono text-[7px] tracking-[0.28em] text-white/70 uppercase pt-0.5">
        {date}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. GINGHAM STRAWBERRY FOOTER                                               */
/* -------------------------------------------------------------------------- */

export function GinghamStrawberryFooter() {
  return (
    <div className="w-full text-center py-1.5 flex flex-col items-center justify-center relative select-none">
      <div className="px-5 py-1 rounded-full bg-white shadow-md border-2 border-rose-100 transform -rotate-2">
        <span
          className="font-serif italic font-bold text-base text-rose-600 tracking-wide drop-shadow-2xs"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Sweet
        </span>
      </div>
      <p className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-rose-800/80 mt-1 font-semibold">
        MEMORA PHOTO ARCHIVE
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. HARU PASTEL CANDY STRIPES FOOTER                                        */
/* -------------------------------------------------------------------------- */

export function HaruCandyStripesFooter() {
  return (
    <div className="w-full text-center pt-1 pb-1.5 flex flex-col items-center justify-center relative select-none z-10">
      {/* Puffy Saranghaeyo Header */}
      <span className="text-[9px] font-extrabold text-[#f43f5e] tracking-wider font-sans drop-shadow-2xs">
        Saranghaeyo
      </span>

      {/* 사랑해요 with White Puffy Halo Outline & Double Hearts */}
      <div className="flex items-center justify-center gap-1.5 -mt-0.5 relative">
        <svg width="126" height="34" viewBox="0 0 126 34" className="overflow-visible select-none">
          <defs>
            <linearGradient id="haruBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <filter id="puffyWhiteSticker" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="1" />
              <feDropShadow dx="0" dy="-1.5" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="1" />
              <feDropShadow dx="1.5" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="1" />
              <feDropShadow dx="-1.5" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="1" />
            </filter>
          </defs>
          <text
            x="50%"
            y="26"
            textAnchor="middle"
            fontSize="26"
            fontWeight="900"
            fontFamily="'Malgun Gothic', 'Apple SD Gothic Neo', 'Pretendard', sans-serif"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinejoin="round"
            paintOrder="stroke fill"
            fill="url(#haruBlueGrad)"
            filter="url(#puffyWhiteSticker)"
            letterSpacing="1"
          >
            사랑해요
          </text>
        </svg>

        {/* Hand-drawn double hearts beside hangul */}
        <div className="flex flex-col -space-y-1 shrink-0 -ml-1">
          <svg width="16" height="20" viewBox="0 0 20 24" fill="none">
            <path
              d="M13 3 C10 0 6 2 6 6 C6 10 13 13 13 13 C13 13 20 10 20 6 C20 2 16 0 13 3 Z"
              fill="#f43f5e"
              stroke="#0f172a"
              strokeWidth="1.2"
              transform="rotate(12 13 6)"
            />
            <path
              d="M6 14 C4 12 1 13 1 16 C1 19 6 21 6 21 C6 21 11 19 11 16 C11 13 8 12 6 14 Z"
              fill="#fda4af"
              stroke="#0f172a"
              strokeWidth="1.1"
              transform="rotate(-8 6 16)"
            />
          </svg>
        </div>
      </div>

      {/* Lavender Marker Squiggle Wave */}
      <div className="w-20 h-3.5 mt-0.5">
        <svg viewBox="0 0 80 14" fill="none" className="w-full h-full">
          <path
            d="M4 7 Q14 0 24 7 T44 7 T64 7 T76 7"
            stroke="#c084fc"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. VINTAGE ARCHIVAL DUO / POSTCARD WIDGETS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Top-right archival postal cancellation seal & vintage postage stamp
 */
export function VintagePostmarkStamp({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 relative select-none ${className}`}>
      {/* Container for stamp and postmark cancel lines */}
      <div className="flex items-center gap-2">
        {/* Vintage Postage Stamp (with serrated border) */}
        <div className="relative w-12 h-14 bg-[#fffdf8] border border-[#3d2b1f]/30 rounded-[1px] p-1 flex flex-col items-center justify-between shadow-xs transform rotate-2">
          {/* Inner hairline border */}
          <div className="w-full h-full border border-dashed border-[#8c735d]/50 p-1 flex flex-col items-center justify-between">
            <span className="text-[5.5px] font-mono tracking-widest text-[#3d2b1f]/80 uppercase">
              POSTAGE
            </span>
            {/* Engraved laurel / star motif */}
            <div className="my-auto text-[#8c735d]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
                <path d="M12 7 L12 17 M7 12 L17 12" />
                <circle cx="12" cy="12" r="3" fill="#8c735d" fillOpacity="0.25" />
              </svg>
            </div>
            <div className="w-full flex items-center justify-between text-[6px] font-serif font-bold text-[#3d2b1f]">
              <span>25¢</span>
              <span className="text-[5px] font-mono">USA</span>
            </div>
          </div>
        </div>

        {/* Circular Postal Postmark Seal with Wavy Cancellation Lines */}
        <div className="flex items-center -ml-3 z-10 opacity-75">
          {/* Circular postal postmark */}
          <div className="w-13 h-13 rounded-full border border-[#3d2b1f]/60 p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-dashed border-[#3d2b1f]/40 flex flex-col items-center justify-center text-center">
              <span className="text-[4.5px] font-mono tracking-tighter text-[#3d2b1f] uppercase font-bold">
                MEMORA
              </span>
              <span className="text-[6.5px] font-serif font-bold text-[#3d2b1f] my-[0.5px]">
                ARCHIVE
              </span>
              <span className="text-[4px] font-mono text-[#8c735d]">
                EST. 2026
              </span>
            </div>
          </div>

          {/* Wavy Postal Cancellation Bars */}
          <div className="flex flex-col gap-1 -ml-1">
            <svg width="24" height="28" viewBox="0 0 28 32" fill="none" stroke="#3d2b1f" strokeWidth="0.8" opacity="0.7">
              <path d="M0 4 Q7 0 14 4 T28 4" />
              <path d="M0 11 Q7 7 14 11 T28 11" />
              <path d="M0 18 Q7 14 14 18 T28 18" />
              <path d="M0 25 Q7 21 14 25 T28 25" />
            </svg>
          </div>
        </div>
      </div>

      {/* Archival Issue Label */}
      <div className="mt-1.5 flex items-center gap-1.5 text-[6px] font-mono tracking-[0.2em] text-[#8c735d] uppercase">
        <span className="h-px w-3 bg-[#3d2b1f]/20" />
        <span>№ 01 • ORIGINAL PRINT</span>
        <span className="h-px w-3 bg-[#3d2b1f]/20" />
      </div>
    </div>
  );
}

/**
 * Bottom-left archival editorial typography & custom user note
 */
export function VintageEditorialNote({
  caption,
  className = '',
}: {
  caption?: string;
  className?: string;
}) {
  const displayQuote = caption && caption.trim()
    ? caption.trim()
    : 'Captured moments preserved in silver and light.';

  return (
    <div className={`flex flex-col items-center justify-center p-2 text-center select-none ${className}`}>
      {/* Decorative letterpress diamond rule */}
      <div className="flex items-center justify-center gap-1.5 w-full mb-1 text-[#8c735d]/60">
        <div className="h-px flex-1 bg-[#3d2b1f]/25" />
        <span className="text-[7px] leading-none">◇</span>
        <div className="h-px flex-1 bg-[#3d2b1f]/25" />
      </div>

      {/* Main Archival Heading */}
      <h4 className="font-serif text-[10px] font-bold tracking-[0.2em] uppercase text-[#2c1e14] leading-tight">
        Memora Photo Archive
      </h4>

      {/* Editorial Quotation / Custom Caption */}
      <p className="font-serif italic text-[8.5px] leading-snug text-[#4a3728] mt-1 max-w-[130px] line-clamp-2">
        “{displayQuote}”
      </p>

      {/* Archival Series Badge */}
      <div className="mt-1.5 pt-1 border-t border-[#3d2b1f]/20 flex items-center gap-2 text-[5.5px] font-mono tracking-widest text-[#8c735d] uppercase">
        <span>SERIES 24</span>
        <span>•</span>
        <span>KEEPSAKE</span>
      </div>
    </div>
  );
}

/**
 * Vintage Card Header for full vertical strips or card top
 */
export function VintagePostcardHeader() {
  return (
    <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 border-[#3d2b1f]/25 select-none">
      <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.25em] text-[#8c735d]">
        <span>✦</span>
        <span className="font-bold text-[#3d2b1f]">ARCHIVAL POSTCARD</span>
        <span>✦</span>
      </div>
      <h3 className="font-serif text-xs font-bold tracking-[0.18em] uppercase mt-0.5 text-[#2c1e14]">
        MEMORA VINTAGE PRESS
      </h3>
      <p className="text-[6.5px] font-mono tracking-widest opacity-80 mt-0.5 text-[#5c4033]">
        Original Silver Halide • Carte de Visite
      </p>
    </div>
  );
}

/**
 * Vintage Card Footer for strip bottoms
 */
export function VintagePostcardFooter() {
  return (
    <div className="w-full pt-1.5 border-t border-[#3d2b1f]/25 flex flex-col items-center justify-center text-center select-none">
      <div className="flex items-center justify-center gap-2 text-[6px] font-mono tracking-[0.25em] text-[#8c735d] uppercase">
        <span>EST. 2026</span>
        <span>— ◆ —</span>
        <span>PRINTED ARCHIVE</span>
      </div>
      <span className="font-serif text-[7.5px] tracking-[0.2em] font-medium text-[#2c1e14] uppercase mt-0.5">
        MEMORA
      </span>
    </div>
  );
}

/**
 * Vintage Admission Ticket Stub ("72411 It's a Beautiful Life")
 */
export function VintageTicketStub({ className = '', number = '72411' }: { className?: string; number?: string }) {
  return (
    <div
      className={`relative inline-flex items-center bg-[#df8f97] text-[#5a151f] rounded-[2px] border border-[#c4777a] shadow-xs px-2.5 py-1 select-none overflow-hidden ${className}`}
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.08) 100%)',
      }}
    >
      {/* Left perforated notch */}
      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#f6efe3] border border-[#c4777a]" />
      {/* Right perforated notch */}
      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#f6efe3] border border-[#c4777a]" />

      <div className="flex items-center gap-1.5 pl-1 pr-1">
        <span className="font-mono text-[7px] font-bold tracking-tighter opacity-80 border-r border-[#5a151f]/30 pr-1 py-0.5 [writing-mode:vertical-rl] rotate-180">
          {number}
        </span>
        <div className="flex flex-col text-left leading-[1.05]">
          <span className="font-serif italic font-bold text-[8px] tracking-wide text-[#4a0d16]">
            It&apos;s a
          </span>
          <span className="font-serif font-black text-[9px] uppercase tracking-wider text-[#3d0910]">
            Beautiful
          </span>
          <span className="font-serif italic font-bold text-[8px] tracking-widest text-[#4a0d16]">
            Life
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Handwritten Cursive Calligraphy Ribbon ("You are my love")
 */
export function VintageCalligraphyLove({
  text = 'You are my love',
  className = '',
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
      {/* Left Flourish Swash */}
      <svg width="26" height="10" viewBox="0 0 28 12" fill="none" stroke="#2c1e14" strokeWidth="1.1" strokeLinecap="round" className="opacity-80">
        <path d="M2 8 Q 8 2, 16 6 T 26 5" />
      </svg>
      {/* Cursive Calligraphy text */}
      <span
        className="font-serif italic text-[11px] sm:text-[12px] text-[#2c1e14] tracking-wide font-normal px-0.5"
        style={{
          fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
          textShadow: '0 0.5px 1px rgba(255,255,255,0.7)',
        }}
      >
        {text}
      </span>
      {/* Right Flourish Swash */}
      <svg width="26" height="10" viewBox="0 0 28 12" fill="none" stroke="#2c1e14" strokeWidth="1.1" strokeLinecap="round" className="opacity-80">
        <path d="M2 5 Q 12 6, 20 2 T 26 8" />
      </svg>
    </div>
  );
}

/**
 * Detailed Vintage Copperplate Etched Butterfly
 */
export function VintageEtchedButterfly({ className = '', size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 40 34"
      fill="none"
      stroke="#2c1e14"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Upper Left Wing */}
      <path d="M20 14 C17 6, 8 2, 2 6 C-1 9, 1 18, 12 19 C16 19, 18 17, 20 14 Z" fill="#fffdfa" fillOpacity="0.5" />
      <path d="M8 8 C11 11, 14 14, 18 15" strokeDasharray="1 1" opacity="0.6" />
      <path d="M5 12 C9 14, 13 16, 17 16" strokeDasharray="1 1" opacity="0.6" />

      {/* Upper Right Wing */}
      <path d="M20 14 C23 6, 32 2, 38 6 C41 9, 39 18, 28 19 C24 19, 22 17, 20 14 Z" fill="#fffdfa" fillOpacity="0.5" />
      <path d="M32 8 C29 11, 26 14, 22 15" strokeDasharray="1 1" opacity="0.6" />
      <path d="M35 12 C31 14, 27 16, 23 16" strokeDasharray="1 1" opacity="0.6" />

      {/* Lower Left Wing */}
      <path d="M19 16 C16 19, 8 23, 7 28 C6 31, 12 33, 16 26 C18 22, 19 18, 19 16 Z" fill="#fffdfa" fillOpacity="0.5" />
      {/* Lower Right Wing */}
      <path d="M21 16 C24 19, 32 23, 33 28 C34 31, 28 33, 24 26 C22 22, 21 18, 21 16 Z" fill="#fffdfa" fillOpacity="0.5" />

      {/* Butterfly Body & Antennae */}
      <ellipse cx="20" cy="18" rx="1.3" ry="7" fill="#2c1e14" />
      <circle cx="20" cy="10" r="1.4" fill="#2c1e14" />
      <path d="M19 9 Q15 4, 13 3" />
      <path d="M21 9 Q25 4, 27 3" />
    </svg>
  );
}

/**
 * Washi Tape / Kraft Photo Tape Tab
 */
export function VintageWashiTape({
  className = '',
  color = '#d6c5a5',
  rotate = '-6deg',
}: {
  className?: string;
  color?: string;
  rotate?: string;
}) {
  return (
    <div
      className={`h-2.5 w-7 sm:w-8 pointer-events-none select-none z-30 shadow-2xs opacity-80 ${className}`}
      style={{
        backgroundColor: color,
        transform: `rotate(${rotate})`,
        clipPath: 'polygon(4% 0%, 96% 0%, 100% 25%, 97% 50%, 100% 75%, 96% 100%, 0% 100%, 3% 75%, 0% 50%, 4% 25%)',
        boxShadow: '0 1px 2px rgba(44, 30, 20, 0.15)',
      }}
    />
  );
}

/**
 * Pressed White Daisy Blossom
 */
export function VintageDaisyBlossom({ className = '', size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <g opacity="0.92">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <ellipse
            key={i}
            cx="16"
            cy="7"
            rx="2.6"
            ry="6"
            fill="#fffdf8"
            stroke="#c8b49a"
            strokeWidth="0.8"
            transform={`rotate(${deg} 16 16)`}
          />
        ))}
        {/* Center golden disk */}
        <circle cx="16" cy="16" r="4.2" fill="#d99b26" stroke="#855d10" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="2.5" fill="#f59e0b" />
      </g>
    </svg>
  );
}

/**
 * Classical Philosopher / Greek Marble Statue Bust Cutout
 */
export function VintageBustAccent({ className = '', size = 52 }: { className?: string; size?: number }) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} style={{ width: size, height: size * 1.15 }}>
      <img
        src="/templates/vintage/bust.jpg"
        alt="Classical Statue Bust"
        className="w-full h-full object-cover mix-blend-multiply opacity-90 drop-shadow-[0_2px_4px_rgba(44,30,20,0.2)] rounded-[2px]"
      />
    </div>
  );
}

/**
 * Weathered Brass Oil Lantern with Glowing Light
 */
export function VintageLanternAccent({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} style={{ width: size, height: size * 1.25 }}>
      <img
        src="/templates/vintage/lantern.jpg"
        alt="Vintage Lantern"
        className="w-full h-full object-contain mix-blend-multiply opacity-95 drop-shadow-[0_2px_8px_rgba(217,119,6,0.25)]"
      />
    </div>
  );
}

/**
 * Vintage 1960s Retro Light-Blue Car Cutout
 */
export function VintageCarAccent({ className = '', size = 64 }: { className?: string; size?: number }) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} style={{ width: size, height: size * 0.65 }}>
      <img
        src="/templates/vintage/car.jpg"
        alt="Vintage Blue Car"
        className="w-full h-full object-contain mix-blend-multiply opacity-95 drop-shadow-[0_2px_5px_rgba(44,30,20,0.25)]"
      />
    </div>
  );
}

/**
 * Burnt Antique Newspaper Clipping & Etched Butterfly Collage (Top-Right Block)
 */
export function VintageNewspaperCollage({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-full aspect-[4/3] rounded-xs overflow-hidden select-none shadow-[0_2px_8px_rgba(44,30,20,0.12)] border border-[#3d2b1f]/20 bg-[#f7f2e8] ${className}`}
    >
      {/* Burnt Antique Newspaper Clipping Background */}
      <img
        src="/templates/vintage/burnt_newspaper.jpg"
        alt="Vintage Newspaper Clipping"
        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 scale-105 pointer-events-none"
      />

      {/* Top Kraft Washi Tape Tab */}
      <VintageWashiTape rotate="-4deg" className="absolute -top-1 left-3 z-20" />

      {/* Copperplate Etched Butterfly */}
      <div className="absolute top-1 right-1.5 z-20 pointer-events-none drop-shadow-xs transform rotate-6">
        <VintageEtchedButterfly size={26} />
      </div>

      {/* Postmark Stamp overlaid */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-1">
        <VintagePostmarkStamp />
      </div>
    </div>
  );
}

/**
 * Botanical Herbarium Pressed Yellow Roses & Pink Ticket Collage (Bottom-Left Block)
 */
export function VintageBotanicalCollage({ caption, className = '' }: { caption?: string; className?: string }) {
  return (
    <div
      className={`relative w-full h-full aspect-[4/3] rounded-xs overflow-hidden select-none shadow-[0_2px_8px_rgba(44,30,20,0.12)] border border-[#3d2b1f]/20 bg-[#f7f2e8] ${className}`}
    >
      {/* Background Aged Letter Texture */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: "url('/templates/vintage/paper_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom left',
        }}
      />

      {/* Pressed Dried Yellow Wild Roses */}
      <img
        src="/templates/vintage/roses.jpg"
        alt="Pressed Dried Wild Roses"
        className="absolute -left-2 -bottom-2.5 w-[58%] h-auto max-h-[115%] object-contain mix-blend-multiply opacity-95 pointer-events-none z-10 drop-shadow-[0_2px_4px_rgba(44,30,20,0.18)]"
      />

      {/* Pink Ticket Stub ("72411 It's a Beautiful Life") */}
      <div className="absolute -bottom-1 -right-1 z-20 pointer-events-none transform -rotate-3 scale-[0.85] sm:scale-90 drop-shadow-xs">
        <VintageTicketStub number="72411" />
      </div>

      {/* Archival Editorial Text */}
      <div className="relative z-10 w-full h-full flex items-center justify-end pr-1 sm:pr-2 pl-10 sm:pl-12 py-1">
        <VintageEditorialNote caption={caption} />
      </div>

      {/* Kraft Washi Tape Tab */}
      <VintageWashiTape rotate="4deg" color="#c2b090" className="absolute -bottom-1 left-2 z-20" />
    </div>
  );
}

