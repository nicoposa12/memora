'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Check, 
  ChevronDown, 
  X, 
  Camera,
  Sparkles
} from 'lucide-react';
import { EventType, EVENT_TYPES_LIST, getEventEmoji, getEventBareLabel } from '@/types';
import { Logo } from '@/components/Logo';

// Theme-specific embellishment components
import {
  StudentIdBadgeIcon,
  VintageBookStackIcon,
  SchoolStationeryIcon,
  SchoolAcademicFooterIcon,
} from '@/components/school-theme/SchoolIcons';
import { BeachPhotoAccents, CoastalWaveFooterIcon } from '@/components/beach-theme/BeachIcons';
import {
  PartyPhotoAccents,
  PartyEqualizerFooterIcon,
  DiscoBallIcon,
  PartyPopperIcon,
  PartySparklesIcon,
  GlossyBalloonsIcon,
} from '@/components/party-theme/PartyIcons';
import {
  WeddingPhotoAccents,
  WeddingBotanicalFooterIcon,
  WeddingRingsIcon,
  WeddingSparklesIcon,
  WeddingBouquetIcon,
  BotanicalLeavesIcon,
  WeddingHeartIcon,
} from '@/components/wedding-theme/WeddingIcons';
import {
  BirthdayPhotoAccents,
  BirthdayBuntingFooterIcon,
  BirthdayCakeIcon,
  BirthdayBalloonsIcon,
  BirthdaySparklesIcon,
} from '@/components/birthday-theme/BirthdayIcons';
import {
  CorporatePhotoAccents,
  CorporateSkylineFooterIcon,
  BuildingSkyscraperIcon,
  TrophyCupIcon,
  CorporateSparklesIcon,
} from '@/components/corporate-theme/CorporateIcons';
import {
  GraduationPhotoAccents,
  GraduationDiplomaFooterIcon,
  GraduationCapIcon,
  GraduationTrophyIcon,
  GraduationSparklesIcon,
} from '@/components/graduation-theme/GraduationIcons';

interface EventTypeSelectWithPreviewProps {
  value: EventType;
  onChange: (value: EventType) => void;
  hasStudioPlan?: boolean;
}

export interface EventTypePalette {
  bg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  slotBg: string;
  slotBorder: string;
  title: string;
  subtitle: string;
  slots: string[];
  badge?: string;
  badgeEmoji?: string;
  description: string;
}

export const EVENT_TYPE_PALETTES: Record<string, EventTypePalette> = {
  school: {
    bg: '#fdfaf3',
    textColor: '#0c1a30',
    accentColor: '#855d10',
    borderColor: '#855d10',
    slotBg: '#f5eee0',
    slotBorder: 'rgba(133, 93, 16, 0.4)',
    title: 'High School Chronicles',
    subtitle: 'School Year 2026–2027 • Campus Life',
    badge: 'OUR SCHOOL ERA',
    badgeEmoji: '🎓',
    slots: ['CAMPUS VIBES', 'STUDY BREAK', 'CLASSMATES', 'HOMEROOM'],
    description: 'Oxford ivory with collegiate navy borders, varsity crest, stationery stickers, and student memories.',
  },
  wedding: {
    bg: '#fcf8f4',
    textColor: '#1f1b18',
    accentColor: '#b8860b',
    borderColor: 'rgba(184, 134, 11, 0.45)',
    slotBg: 'rgba(184, 134, 11, 0.05)',
    slotBorder: 'rgba(184, 134, 11, 0.25)',
    title: 'Forever Begins',
    subtitle: 'Two hearts • One beautiful journey',
    badge: 'WEDDING CELEBRATION',
    badgeEmoji: '💍',
    slots: ['CEREMONY', 'COCKTAILS', 'FIRST DANCE', 'AFTER PARTY'],
    description: 'Soft ivory silk background with double gold filigree borders, botanical olive leaves, and champagne crest.',
  },
  birthday: {
    bg: '#ffffff',
    textColor: '#18181b',
    accentColor: '#d97706',
    borderColor: 'rgba(217, 119, 6, 0.35)',
    slotBg: 'rgba(217, 119, 6, 0.05)',
    slotBorder: 'rgba(217, 119, 6, 0.25)',
    title: 'Celebrate every little moment',
    subtitle: 'Good Times • Big Smiles • Great Memories',
    badge: 'YOUR DAY • YOUR MOMENT',
    badgeEmoji: '🎂',
    slots: ['PARTY VIBES', 'MAKE A WISH', 'CAKE TIME', 'SQUAD'],
    description: 'Celebration white layout with warm amber foil accents, party bunting, balloons, and cake stickers.',
  },
  beach: {
    bg: '#fefcf6',
    textColor: '#0f172a',
    accentColor: '#0284c7',
    borderColor: 'rgba(2, 132, 199, 0.35)',
    slotBg: 'rgba(2, 132, 199, 0.05)',
    slotBorder: 'rgba(2, 132, 199, 0.25)',
    title: 'Good Vibes, Great Times',
    subtitle: 'Sun • Sand • Sea • Memories',
    badge: 'Let the Good Times Roll',
    badgeEmoji: '🌴',
    slots: ['SUN & SURF', 'BEACH VIBES', 'GOLDEN HOUR', 'BONFIRE'],
    description: 'Breezy coastal layout with ocean blue accents, wave crest, tropical shells, and sun-kissed memories.',
  },
  party: {
    bg: '#0f1117',
    textColor: '#f4f4f5',
    accentColor: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.5)',
    slotBg: 'rgba(236, 72, 153, 0.08)',
    slotBorder: 'rgba(236, 72, 153, 0.3)',
    title: 'GOOD FRIENDS. GREAT NIGHT',
    subtitle: 'Dance • Laugh • Celebrate • Repeat',
    badge: 'Party Night',
    badgeEmoji: '🪩',
    slots: ['PRE-GAME', 'DANCE FLOOR', 'MIDNIGHT', 'VIP CREW'],
    description: 'High-contrast noir nightlife theme with neon magenta accents, disco reflections, and equalizer footer.',
  },
  corporate: {
    bg: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#2563eb',
    borderColor: 'rgba(37, 99, 235, 0.35)',
    slotBg: 'rgba(37, 99, 235, 0.04)',
    slotBorder: 'rgba(37, 99, 235, 0.2)',
    title: 'Built together. Achieved together',
    subtitle: 'Connect • Collaborate • Celebrate',
    badge: 'CORPORATE MOMENTS',
    badgeEmoji: '🏢',
    slots: ['KEYNOTE', 'TEAM SYNERGY', 'NETWORKING', 'SUMMIT'],
    description: 'Executive corporate styling with crisp architectural margins, professional sapphire badges, and skyline footer.',
  },
  graduation: {
    bg: '#0a1128',
    textColor: '#fcf8ef',
    accentColor: '#d4af37',
    borderColor: 'rgba(212, 175, 55, 0.6)',
    slotBg: 'rgba(212, 175, 55, 0.08)',
    slotBorder: 'rgba(212, 175, 55, 0.35)',
    title: 'The Next Chapter',
    subtitle: 'One journey ends. Another begins',
    badge: 'GRADUATION CELEBRATION',
    badgeEmoji: '🎓',
    slots: ['COMMENCEMENT', 'GRADUATES', 'CAP TOSS', 'ALUMNI'],
    description: 'Deep midnight blue with metallic gold diploma seals, mortarboard emblems, trophy accents, and diploma footer.',
  },
  debut: {
    bg: '#fdf7f9',
    textColor: '#261420',
    accentColor: '#db2777',
    borderColor: 'rgba(219, 39, 119, 0.45)',
    slotBg: 'rgba(219, 39, 119, 0.05)',
    slotBorder: 'rgba(219, 39, 119, 0.28)',
    title: 'Grand 18th Debutante',
    subtitle: 'Eighteen Roses • A Grand Beginning',
    badge: 'DEBUTANTE CELEBRATION',
    badgeEmoji: '👑',
    slots: ['GRAND ENTRANCE', '18 ROSES', '18 CANDLES', 'AFTER GLOW'],
    description: 'Blush pink and rose gold debutante theme with floral crowns, elegant script, and ballroom elegance.',
  },
  other: {
    bg: '#ffffff',
    textColor: '#18181b',
    accentColor: '#3b82f6',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    slotBg: 'rgba(59, 130, 246, 0.05)',
    slotBorder: 'rgba(59, 130, 246, 0.2)',
    title: 'Memora Photo Studio',
    subtitle: 'Everyday Moments • Instant Prints',
    badge: 'PHOTOSTUDIO EDITION',
    badgeEmoji: '✨',
    slots: ['MOMENT 01', 'MOMENT 02', 'MOMENT 03', 'MOMENT 04'],
    description: 'Versatile minimalist studio strip with clean modern margins, adaptable for any gathering or pop-up event.',
  },
};

export function EventTypeSelectWithPreview({
  value,
  onChange,
  hasStudioPlan,
}: EventTypeSelectWithPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewingType, setPreviewingType] = useState<EventType | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedMeta = EVENT_TYPES_LIST.find((e) => e.id === value) || EVENT_TYPES_LIST[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown or modal on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (previewingType) setPreviewingType(null);
        else if (isOpen) setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewingType, isOpen]);

  const activePalette = previewingType
    ? EVENT_TYPE_PALETTES[previewingType] || EVENT_TYPE_PALETTES.other
    : null;

  const isSchoolTheme = previewingType === 'school';
  const isBeachTheme = previewingType === 'beach';
  const isPartyTheme = previewingType === 'party';
  const isWeddingTheme = previewingType === 'wedding' || previewingType === 'debut';
  const isBirthdayTheme = previewingType === 'birthday';
  const isCorporateTheme = previewingType === 'corporate';
  const isGraduationTheme = previewingType === 'graduation';

  const schoolPalette = {
    bg: '#fdfaf3',
    textPrimary: '#0c1a30',
    textSecondary: '#855d10',
    accentGold: '#a37519',
    borderGold: 'rgba(133, 93, 16, 0.45)',
    outerBorder: '2.5px solid #855d10',
    outerShadow: '0 0 0 2px rgba(12, 26, 48, 0.9), 0 0 0 4px rgba(133, 93, 16, 0.25)',
    slotBg: '#f5eee0',
    slotBorder: '1.5px solid rgba(133, 93, 16, 0.4)',
  };

  const photoSlots = activePalette?.slots || ['PHOTO 1', 'PHOTO 2', 'PHOTO 3', 'PHOTO 4'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm flex items-center justify-between shadow-2xs cursor-pointer transition-all ${
          isOpen
            ? 'border-primary ring-1 ring-primary'
            : 'border-border/70 hover:border-border'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-base leading-none">{selectedMeta.emoji}</span>
          <span className="font-medium text-foreground">{selectedMeta.label}</span>
          {selectedMeta.tier === 'pro_studio' && (
            <span className="text-[10px] font-mono text-muted-foreground">
              • Pro & Studio
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden py-1 max-h-80 overflow-y-auto animate-in fade-in-50 zoom-in-98">
          <div className="px-3 py-1.5 border-b border-border/40 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Select Event Theme</span>
            <span>Click 👁 to preview layout</span>
          </div>

          <div className="p-1 space-y-0.5">
            {EVENT_TYPES_LIST.map((evt) => {
              const isSelected = evt.id === value;
              return (
                <div
                  key={evt.id}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-secondary/70 text-foreground'
                  }`}
                  onClick={() => {
                    onChange(evt.id as EventType);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <span className="text-sm shrink-0">{evt.emoji}</span>
                    <span className="truncate">{evt.label}</span>
                    {evt.tier === 'pro_studio' && (
                      <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">
                        • Pro & Studio
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}

                    {/* Eye Icon Preview Button */}
                    <button
                      type="button"
                      title={`Preview ${evt.label} layout`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewingType(evt.id as EventType);
                      }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/15 border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ACCURATE PHOTO STRIP & THEME PREVIEW */}
      {previewingType && activePalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setPreviewingType(null)}
          />

          {/* Modal Container */}
          <div className="relative bg-card border border-border/80 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 z-10 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-mono font-semibold text-primary uppercase tracking-widest block">
                  Layout & Frame Preview
                </span>
                <h3 className="text-lg font-display font-medium text-foreground flex items-center gap-2 mt-0.5">
                  <span>{getEventEmoji(previewingType)}</span>
                  <span>{getEventBareLabel(previewingType)} Theme Layout</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingType(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Strip Canvas Container: Identical to Plans & Features Page */}
            <div className="bg-[#101217]/5 dark:bg-black/40 rounded-2xl p-4 sm:p-6 flex items-center justify-center border border-border/50 overflow-visible">
              <div
                className="w-60 max-w-full rounded-xl transition-all shadow-2xl relative p-3.5 flex flex-col items-center justify-between overflow-visible"
                style={{
                  backgroundColor: isPartyTheme
                    ? '#0f1117'
                    : isWeddingTheme
                    ? '#fcf8f4'
                    : isBirthdayTheme
                    ? '#fffdf9'
                    : isCorporateTheme
                    ? '#f8fafc'
                    : isGraduationTheme
                    ? '#0a1128'
                    : isSchoolTheme
                    ? schoolPalette.bg
                    : activePalette.bg,
                  color: isPartyTheme
                    ? '#f4f4f5'
                    : isWeddingTheme
                    ? '#1f1b18'
                    : isBirthdayTheme
                    ? '#18181b'
                    : isCorporateTheme
                    ? '#0f172a'
                    : isGraduationTheme
                    ? '#fcf8ef'
                    : isSchoolTheme
                    ? schoolPalette.textPrimary
                    : activePalette.textColor,
                  border: isPartyTheme
                    ? '2px solid rgba(236, 72, 153, 0.65)'
                    : isWeddingTheme
                    ? '2px solid rgba(184, 134, 11, 0.45)'
                    : isBirthdayTheme
                    ? '2px solid rgba(245, 158, 11, 0.5)'
                    : isCorporateTheme
                    ? '2px solid rgba(37, 99, 235, 0.45)'
                    : isGraduationTheme
                    ? '2px solid rgba(212, 175, 55, 0.65)'
                    : isSchoolTheme
                    ? schoolPalette.outerBorder
                    : `2px solid ${activePalette.borderColor}`,
                  boxShadow: isSchoolTheme
                    ? schoolPalette.outerShadow
                    : isPartyTheme
                    ? '0 0 25px rgba(236, 72, 153, 0.25), 0 0 0 1px rgba(236, 72, 153, 0.3)'
                    : isWeddingTheme
                    ? '0 0 20px rgba(184, 134, 11, 0.12), 0 0 0 1px rgba(184, 134, 11, 0.2)'
                    : isBirthdayTheme
                    ? '0 0 22px rgba(245, 158, 11, 0.16), 0 0 0 1px rgba(245, 158, 11, 0.25)'
                    : isCorporateTheme
                    ? '0 0 22px rgba(37, 99, 235, 0.14), 0 0 0 1px rgba(37, 99, 235, 0.25)'
                    : isGraduationTheme
                    ? '0 0 24px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.3)'
                    : undefined,
                }}
              >
                {/* 1. Header Inscription */}
                {isSchoolTheme ? (
                  <div
                    className="w-full text-center pb-2 pt-1 border-b mb-2"
                    style={{ borderColor: schoolPalette.borderGold }}
                  >
                    <div
                      className="flex items-center justify-center gap-1.5 text-[7.5px] font-mono uppercase tracking-[0.25em]"
                      style={{ color: schoolPalette.textSecondary }}
                    >
                      <span>★</span>
                      <span>GOOD DAYS • GREAT MEMORIES</span>
                      <span>★</span>
                    </div>
                    <h4
                      className="font-serif text-xs font-bold tracking-wider uppercase mt-1"
                      style={{ color: schoolPalette.textPrimary }}
                    >
                      OUR SCHOOL ERA
                    </h4>
                    <div className="flex items-center justify-center gap-2 mt-1 opacity-90">
                      <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                      <span
                        className="text-[7px] font-mono tracking-widest uppercase font-semibold"
                        style={{ color: schoolPalette.textSecondary }}
                      >
                        SCHOOL YEAR 2026–2027
                      </span>
                      <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full text-center pb-2 pt-1 border-b mb-2 relative"
                    style={{
                      borderColor: isPartyTheme
                        ? 'rgba(236, 72, 153, 0.5)'
                        : isWeddingTheme
                        ? 'rgba(184, 134, 11, 0.35)'
                        : isBirthdayTheme
                        ? 'rgba(245, 158, 11, 0.4)'
                        : activePalette.borderColor,
                    }}
                  >
                    {/* Top Theme Ornaments */}
                    {isPartyTheme && (
                      <>
                        <div className="absolute left-1.5 top-0 pointer-events-none transform -rotate-6 drop-shadow-xs">
                          <DiscoBallIcon size={18} />
                        </div>
                        <div className="absolute left-7 -top-1 pointer-events-none transform rotate-12">
                          <PartySparklesIcon variant="star" size={9} />
                        </div>
                        <div className="absolute right-12 -top-1 pointer-events-none transform -rotate-12">
                          <PartySparklesIcon variant="cross" size={9} />
                        </div>
                        <div className="absolute right-6.5 top-0 pointer-events-none transform -rotate-6 drop-shadow-xs">
                          <GlossyBalloonsIcon size={16} />
                        </div>
                        <div className="absolute right-1 top-0 pointer-events-none transform rotate-6 drop-shadow-xs">
                          <PartyPopperIcon size={18} />
                        </div>
                      </>
                    )}
                    {isWeddingTheme && (
                      <>
                        <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <WeddingRingsIcon size={18} className="transform -rotate-6 drop-shadow-xs" />
                          <WeddingSparklesIcon variant="star" size={8} className="opacity-80" />
                        </div>
                        <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <WeddingHeartIcon size={14} className="transform rotate-6 drop-shadow-xs" />
                          <WeddingBouquetIcon size={18} className="transform rotate-6 drop-shadow-xs" />
                        </div>
                      </>
                    )}
                    {isBirthdayTheme && (
                      <>
                        <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <BirthdayCakeIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                          <BirthdaySparklesIcon variant="star" size={7} className="opacity-80" />
                        </div>
                        <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <BirthdaySparklesIcon variant="cross" size={7} className="opacity-80" />
                          <BirthdayBalloonsIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                        </div>
                      </>
                    )}
                    {isCorporateTheme && (
                      <>
                        <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <BuildingSkyscraperIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                          <CorporateSparklesIcon variant="star" size={7} color="#2563eb" className="opacity-80" />
                        </div>
                        <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <CorporateSparklesIcon variant="cross" size={7} color="#38bdf8" className="opacity-80" />
                          <TrophyCupIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                        </div>
                      </>
                    )}
                    {isGraduationTheme && (
                      <>
                        <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <GraduationCapIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                          <GraduationSparklesIcon variant="star" size={7} color="#fde047" className="opacity-80" />
                        </div>
                        <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                          <GraduationSparklesIcon variant="cross" size={7} color="#d4af37" className="opacity-80" />
                          <GraduationTrophyIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                        </div>
                      </>
                    )}

                    <div
                      className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold"
                      style={{
                        color: isPartyTheme
                          ? '#ec4899'
                          : isWeddingTheme
                          ? '#b8860b'
                          : isBirthdayTheme
                          ? '#d97706'
                          : isCorporateTheme
                          ? '#2563eb'
                          : isGraduationTheme
                          ? '#d4af37'
                          : activePalette.accentColor,
                      }}
                    >
                      <span>★</span>
                      <span>{activePalette.badge || `${getEventBareLabel(previewingType).toUpperCase()} CELEBRATION`}</span>
                      <span>★</span>
                    </div>

                    <h4
                      className={`font-serif ${
                        isBirthdayTheme
                          ? 'text-[10px] tracking-[0.08em]'
                          : isCorporateTheme
                          ? 'text-[9.5px] tracking-[0.06em]'
                          : 'text-xs tracking-[0.2em]'
                      } font-bold uppercase mt-0.5 max-w-[176px] mx-auto`}
                      style={{
                        color: isPartyTheme
                          ? '#f4f4f5'
                          : isWeddingTheme
                          ? '#1f1b18'
                          : isBirthdayTheme
                          ? '#18181b'
                          : isCorporateTheme
                          ? '#0f172a'
                          : isGraduationTheme
                          ? '#fcf8ef'
                          : activePalette.textColor,
                      }}
                    >
                      {activePalette.title}
                    </h4>

                    <p
                      className="text-[6.5px] font-mono tracking-wider opacity-85 mt-0.5"
                      style={{
                        color: isPartyTheme
                          ? '#ec4899'
                          : isWeddingTheme
                          ? '#855d10'
                          : isBirthdayTheme
                          ? '#d97706'
                          : isCorporateTheme
                          ? '#2563eb'
                          : isGraduationTheme
                          ? '#d4af37'
                          : activePalette.accentColor,
                        fontStyle: isWeddingTheme ? 'italic' : undefined,
                      }}
                    >
                      {activePalette.subtitle}
                    </p>
                  </div>
                )}

                {/* 2. Photo Slots Body with Exact Embellishments */}
                <div className="w-full space-y-2 py-1 relative">
                  {/* Made of Memories Divider (School Theme) */}
                  {isSchoolTheme && (
                    <div className="flex items-center justify-center gap-1.5 -mb-0.5">
                      <div className="h-px flex-1 opacity-60" style={{ backgroundColor: schoolPalette.borderGold }} />
                      <div
                        className="flex items-center justify-center px-2.5 py-0.5 rounded-full shadow-2xs border bg-white"
                        style={{ borderColor: schoolPalette.borderGold }}
                      >
                        <span className="text-[7px] font-mono tracking-widest uppercase font-bold" style={{ color: schoolPalette.textSecondary }}>
                          MADE OF MEMORIES
                        </span>
                      </div>
                      <div className="h-px flex-1 opacity-60" style={{ backgroundColor: schoolPalette.borderGold }} />
                    </div>
                  )}

                  {photoSlots.map((slotLabel, pIdx) => (
                    <div
                      key={pIdx}
                      className="relative rounded-xs flex flex-col items-center justify-center border aspect-[4/3] transition-all"
                      style={{
                        backgroundColor: isSchoolTheme
                          ? schoolPalette.slotBg
                          : activePalette.slotBg,
                        borderColor: isSchoolTheme
                          ? schoolPalette.slotBorder
                          : activePalette.slotBorder,
                      }}
                    >
                      {/* School Corner Brackets */}
                      {isSchoolTheme && (
                        <>
                          <span className="absolute top-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                          <span className="absolute top-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                          <span className="absolute bottom-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                          <span className="absolute bottom-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                        </>
                      )}

                      {/* Photo Placeholder Center */}
                      <div className="flex flex-col items-center justify-center gap-0.5 p-1 select-none opacity-85">
                        <Camera
                          className="w-3.5 h-3.5"
                          style={{
                            color: isSchoolTheme
                              ? schoolPalette.textSecondary
                              : activePalette.accentColor,
                          }}
                        />
                        <span
                          className="font-mono text-[7px] uppercase tracking-wider font-semibold"
                          style={{
                            color: isSchoolTheme
                              ? schoolPalette.textPrimary
                              : undefined,
                          }}
                        >
                          {slotLabel}
                        </span>
                      </div>

                      {/* Theme-Specific Stickers & Embellishments */}
                      {isSchoolTheme && pIdx === 0 && (
                        <div className="absolute -right-3.5 -bottom-3.5 z-20 pointer-events-none transform rotate-[7deg] drop-shadow-md">
                          <StudentIdBadgeIcon isLight={true} size={36} />
                        </div>
                      )}
                      {isSchoolTheme && pIdx === 1 && (
                        <div className="absolute -left-3.5 -bottom-3 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
                          <VintageBookStackIcon isLight={true} size={36} />
                        </div>
                      )}
                      {isSchoolTheme && pIdx === 2 && (
                        <div className="absolute -right-3.5 -bottom-3 z-20 pointer-events-none transform rotate-[7deg] drop-shadow-md">
                          <SchoolStationeryIcon isLight={true} size={36} />
                        </div>
                      )}

                      {/* Coastal Beach Embellishments */}
                      {isBeachTheme && (
                        <BeachPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}

                      {/* Nightclub & Party Embellishments */}
                      {isPartyTheme && (
                        <PartyPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}

                      {/* Wedding Celebration Embellishments */}
                      {isWeddingTheme && (
                        <WeddingPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}

                      {/* Birthday Celebration Embellishments */}
                      {isBirthdayTheme && (
                        <BirthdayPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}

                      {/* Corporate Theme Embellishments */}
                      {isCorporateTheme && (
                        <CorporatePhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}

                      {/* Graduation Celebration Embellishments */}
                      {isGraduationTheme && (
                        <GraduationPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. Footer Inscription & Insignia */}
                <div
                  className="w-full pt-2 mt-1 border-t text-center flex flex-col items-center gap-1"
                  style={{
                    borderColor: isSchoolTheme
                      ? schoolPalette.borderGold
                      : 'rgba(0,0,0,0.1)',
                  }}
                >
                  {isSchoolTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <SchoolAcademicFooterIcon width={120} height={18} isLight={true} />
                    </div>
                  ) : previewingType === 'beach' ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <CoastalWaveFooterIcon width={120} height={16} />
                    </div>
                  ) : isPartyTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <PartyEqualizerFooterIcon width={120} height={16} />
                    </div>
                  ) : isWeddingTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <WeddingBotanicalFooterIcon width={120} height={18} />
                    </div>
                  ) : isBirthdayTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <BirthdayBuntingFooterIcon width={120} height={18} />
                    </div>
                  ) : isCorporateTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <CorporateSkylineFooterIcon width={120} height={18} />
                    </div>
                  ) : isGraduationTheme ? (
                    <div className="py-0.5 flex items-center justify-center">
                      <GraduationDiplomaFooterIcon width={120} height={18} />
                    </div>
                  ) : (
                    <span
                      className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-80"
                      style={{ color: activePalette.accentColor }}
                    >
                      MEMORA PHOTO STUDIO • 2026
                    </span>
                  )}

                  <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none">
                    <Logo className="w-2.5 h-2.5 shrink-0" />
                    <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                      NXMEMORA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Theme Palette Details */}
            <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/70 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Theme & Layout Specifications</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {EVENT_TYPES_LIST.find((e) => e.id === previewingType)?.tier === 'pro_studio'
                    ? 'Pro & Studio Plan'
                    : 'Included in All Plans'}
                </span>
              </div>
              <p className="text-muted-foreground font-light text-[11px] leading-relaxed">
                {activePalette.description}
              </p>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-border/60">
              <button
                type="button"
                onClick={() => setPreviewingType(null)}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-all cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(previewingType);
                  setPreviewingType(null);
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Layout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
