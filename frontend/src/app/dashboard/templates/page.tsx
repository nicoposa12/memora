'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Sparkles, 
  Crown, 
  Check, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  Type, 
  Palette, 
  Maximize2, 
  Camera, 
  Download,
  Lock,
  ExternalLink,
  Sliders,
  AlertCircle,
  Film,
  Grid2X2,
  LayoutGrid,
  Columns,
  Square,
  Star,
  Flame,
  Heart,
  Radio,
  Brush,
  FileText,
  Bookmark,
  Award,
  Compass,
  Feather,
  ChevronDown
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { isAdminRole } from '@/types/user';
import { useRealtime, RealtimeStatusBadge } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';
import { useModal } from '@/context/ModalContext';
import { usePlans, isTemplateUnlocked, isLayoutUnlocked } from '@/lib/plans';

export type TierType = 'free' | 'event' | 'pro';
export type StripLayoutStyle = 'strip4' | 'strip3' | 'grid2x2' | 'grid2x3' | 'filmstrip' | 'polaroid' | 'duo' | 'diagonal_duo';
export type DesignTheme = 'champagne' | 'editorial' | 'noir' | 'romance' | 'analog' | 'cyber' | 'gala' | 'emerald' | 'coastal';
export type BorderOrnament = 'double_gold' | 'artdeco' | 'filigree' | 'sprockets' | 'hairline' | 'botanical' | 'none';
export type InsigniaType = 'star' | 'crest' | 'wreath' | 'wax_seal' | 'seal_jp' | 'diamond' | 'none';
export type FontFamilyOption = 'editorial' | 'sans' | 'mono' | 'script';

export interface LuxuryTemplatePreset {
  id: string;
  name: string;
  category: 'wedding' | 'editorial' | 'vintage' | 'vip' | 'school';
  subtitle: string;
  layout: StripLayoutStyle;
  theme: DesignTheme;
  frameColor: string;
  textColor: string;
  accentColor: string;
  borderOrnament: BorderOrnament;
  insignia: InsigniaType;
  fontFamily: FontFamilyOption;
  monogramText: string;
  dateText: string;
  filmEdgeMarkings: boolean;
  filmEdgeText: string;
  badge: string;
  freeTierEligible?: boolean;
}

export interface TierTemplateConfig {
  tier: TierType;
  tierLabel: string;
  badge: string;
  rate: string;
  stripName: string;
  stripLayout: StripLayoutStyle;
  designTheme: DesignTheme;
  borderOrnament: BorderOrnament;
  insignia: InsigniaType;
  photoCount: number;
  frameColor: string;
  textColor: string;
  accentColor: string;
  monogramText: string;
  dateText: string;
  fontFamily: FontFamilyOption;
  watermarkEnabled: boolean;
  watermarkText: string;
  maxPhotoLimit: number | 'Unlimited';
  resolution: string;
  allowedFilters: string[];
  filmEdgeMarkings: boolean;
  filmEdgeText: string;
  customOverlayGraphic: boolean;
}

// 10 Default Strip Template Designs
export const DEFAULT_ATELIER_PRESETS: LuxuryTemplatePreset[] = [
  {
    id: 'classic_filmstrip',
    name: '35mm Noir Filmstrip',
    category: 'vintage',
    subtitle: 'Authentic 35mm film negative with sprocket perforations and classic black borders',
    layout: 'filmstrip',
    theme: 'noir',
    frameColor: '#050505',
    textColor: '#f5f5f7',
    accentColor: '#ffffff',
    borderOrnament: 'sprockets',
    insignia: 'none',
    fontFamily: 'editorial',
    monogramText: 'MEMORA 35MM NOIR',
    dateText: 'ANALOG ARCHIVE • EXP 36',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Free & Pro • 35mm Film',
    freeTierEligible: true,
  },
  {
    id: 'crimson_romance',
    name: 'Crimson Romance',
    category: 'wedding',
    subtitle: 'Deep crimson wine frame with dramatic calligraphy, double pose layout, and date inscription',
    layout: 'duo',
    theme: 'romance',
    frameColor: '#6e0d19',
    textColor: '#ffffff',
    accentColor: '#f43f5e',
    borderOrnament: 'double_gold',
    insignia: 'crest',
    fontFamily: 'editorial',
    monogramText: 'YOU AND ME FOREVER',
    dateText: '02.14.2026 • CELEBRATION',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Editorial Love',
    freeTierEligible: true,
  },
  {
    id: 'music_player',
    name: 'Aesthetic Audio Player',
    category: 'vip',
    subtitle: 'Moody obsidian frame featuring a sleek music player widget with track progress and playback controls',
    layout: 'strip3',
    theme: 'noir',
    frameColor: '#121316',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    borderOrnament: 'hairline',
    insignia: 'star',
    fontFamily: 'mono',
    monogramText: 'ABOUT YOU • THE 1975',
    dateText: 'TRACK 01 • MEMORA SOUND',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Track 01 • Player',
    freeTierEligible: true,
  },
  {
    id: 'gingham_strawberry',
    name: 'Gingham Sweet Strawberry',
    category: 'vintage',
    subtitle: 'Red and white picnic gingham border adorned with glossy strawberries, ribbon bow, and cherries',
    layout: 'strip3',
    theme: 'analog',
    frameColor: '#d91b2c',
    textColor: '#ffffff',
    accentColor: '#f43f5e',
    borderOrnament: 'none',
    insignia: 'none',
    fontFamily: 'script',
    monogramText: 'SWEET STRAWBERRY',
    dateText: 'PICNIC VIBES • SWEET ERA',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Coquette Cutie',
    freeTierEligible: true,
  },
  {
    id: 'kpop_candy_stripes',
    name: 'Haru Pastel Candy Stripes',
    category: 'editorial',
    subtitle: 'Pastel sky blue candy stripes featuring Korean 사랑해요 typography, retro toy camera, and doodle stickers',
    layout: 'strip3',
    theme: 'coastal',
    frameColor: '#bae6fd',
    textColor: '#1e3a8a',
    accentColor: '#38bdf8',
    borderOrnament: 'hairline',
    insignia: 'none',
    fontFamily: 'sans',
    monogramText: '사랑해요 • SARANGHAEYO',
    dateText: 'HARU PHOTO • SEOUL EDITION',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Seoul K-Deco',
    freeTierEligible: true,
  },
  {
    id: 'vintage_postcard',
    name: 'Vintage Archival Postcard',
    category: 'vintage',
    subtitle: 'Aged parchment card featuring a diagonal duo photo layout, vintage postmark stamp, and letterpress typography',
    layout: 'diagonal_duo',
    theme: 'analog',
    frameColor: '#f6efe3',
    textColor: '#2c1e14',
    accentColor: '#8c735d',
    borderOrnament: 'hairline',
    insignia: 'diamond',
    fontFamily: 'editorial',
    monogramText: 'MEMORA ARCHIVAL PRINT',
    dateText: 'AIR MAIL • POSTE RESTANTE',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Vintage Postcard',
    freeTierEligible: true,
  },
];

export const LUXURY_TEMPLATES: LuxuryTemplatePreset[] = DEFAULT_ATELIER_PRESETS;

// Available Strip Layout Styles for Event Pass
export const STRIP_STYLES: {
  id: StripLayoutStyle;
  label: string;
  poses: string;
  badge: string;
  desc: string;
  icon: any;
  tiers: TierType[];
}[] = [
  {
    id: 'strip4',
    label: 'Signature 4-Pose Strip',
    poses: '4 Poses',
    badge: 'Studio Signature',
    desc: 'Classic vertical photobooth strip with 4 sequential shots and custom typography.',
    icon: Columns,
    tiers: ['event', 'pro'],
  },
  {
    id: 'strip3',
    label: 'Classic 3-Photo Strip',
    poses: '3 Poses',
    badge: 'Vintage Standard',
    desc: 'Timeless 3-frame layout with balanced spacing and centered event text.',
    icon: Columns,
    tiers: ['free', 'event', 'pro'],
  },
  {
    id: 'grid2x2',
    label: '2x2 Quad Grid Collage',
    poses: '4 Poses',
    badge: 'Postcard Chic',
    desc: 'Square collage layout with a 2x2 photo grid and centered text or logo.',
    icon: Grid2X2,
    tiers: ['event', 'pro'],
  },
  {
    id: 'grid2x3',
    label: '2x3 Hexa Grid Collage',
    poses: '6 Poses',
    badge: 'Six-Frame Chic',
    desc: 'Two-column, three-row photo grid layout with 6 sequential frames, perfect for group shots and multi-shot series.',
    icon: LayoutGrid,
    tiers: ['event', 'pro'],
  },
  {
    id: 'filmstrip',
    label: '35mm Analog Filmstrip',
    poses: '3-4 Poses',
    badge: 'Film Negative',
    desc: 'Continuous sprocket perforations along both borders with authentic 35mm film negative styling.',
    icon: Film,
    tiers: ['free', 'event', 'pro'],
  },
  {
    id: 'polaroid',
    label: 'Wide Polaroid Instant',
    poses: '1-2 Poses',
    badge: 'Instant Polaroid',
    desc: 'Classic Polaroid proportions with a wide bottom margin for date stamps or custom text.',
    icon: Square,
    tiers: ['event', 'pro'],
  },
  {
    id: 'duo',
    label: 'Minimalist Duo Diptych',
    poses: '2 Poses',
    badge: 'Modern Editorial',
    desc: 'Two vertical portraits with clean margins and minimalist typography.',
    icon: Maximize2,
    tiers: ['event', 'pro'],
  },
  {
    id: 'diagonal_duo',
    label: 'Vintage Diagonal Duo',
    poses: '2 Poses',
    badge: 'Diagonal Duo',
    desc: 'Staggered 2-photo diagonal arrangement on a landscape card with vintage postal stamps and letterpress typography.',
    icon: LayoutGrid,
    tiers: ['free', 'event', 'pro'],
  },
];

export default function StripTemplatesPage() {
  const { confirm: confirmModal } = useModal();
  const { plans } = usePlans();
  const [activeTier, setActiveTier] = useState<TierType>('event');
  const [templateFilter, setTemplateFilter] = useState<'all' | 'wedding' | 'editorial' | 'vintage' | 'vip'>('all');
  const [savedToast, setSavedToast] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string>('organizer');
  const [templates, setTemplates] = useState<LuxuryTemplatePreset[]>([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  const handleSelectTier = (tier: TierType) => {
    setActiveTier(tier);
    try {
      localStorage.setItem('memora_dashboard_templates_active_tier', tier);
    } catch {}
  };

  // Template settings for each of the 3 tiers
  const [configs, setConfigs] = useState<Record<TierType, TierTemplateConfig>>({
    free: {
      tier: 'free',
      tierLabel: 'Free Trial',
      badge: 'Starter • $0',
      rate: '$0 / single test event',
      stripName: 'Free 35mm Noir Filmstrip',
      stripLayout: 'filmstrip',
      designTheme: 'noir',
      borderOrnament: 'sprockets',
      insignia: 'none',
      photoCount: 3,
      frameColor: '#050505',
      textColor: '#ffffff',
      accentColor: '#ffffff',
      monogramText: 'MEMORA NOIR 35MM',
      dateText: 'ANALOG ARCHIVE • MMXXVI',
      fontFamily: 'editorial',
      watermarkEnabled: true,
      watermarkText: 'MEMORA • STUDIO PHOTOBOOTH',
      maxPhotoLimit: 25,
      resolution: '1080p Standard Canvas',
      allowedFilters: ['noir', 'minimal', 'bw'],
      filmEdgeMarkings: false,
      filmEdgeText: '',
      customOverlayGraphic: false,
    },
    event: {
      tier: 'event',
      tierLabel: 'PRO Pass',
      badge: 'Per Event Choice • ₱1,499',
      rate: '₱1,499 / single event • no subscription',
      stripName: 'Custom Fine-Art Strip',
      stripLayout: 'strip4',
      designTheme: 'noir',
      borderOrnament: 'double_gold',
      insignia: 'crest',
      photoCount: 4,
      frameColor: '#0a0c10',
      textColor: '#f5f3ef',
      accentColor: '#d8b86a',
      monogramText: 'MEMORA CELEBRATION',
      dateText: 'MMXXVI • PRIVATE OCCASION',
      fontFamily: 'editorial',
      watermarkEnabled: false,
      watermarkText: '',
      maxPhotoLimit: 'Unlimited',
      resolution: 'Ultra-HD 4K Canvas (300 DPI)',
      allowedFilters: ['noir', 'portra', 'champagne', 'minimal'],
      filmEdgeMarkings: false,
      filmEdgeText: 'KODAK TRI-X 400TX',
      customOverlayGraphic: false,
    },
    pro: {
      tier: 'pro',
      tierLabel: 'Studio Monthly',
      badge: 'Planners & Venues • ₱4,999/mo',
      rate: '₱4,999 / month • unlimited active events',
      stripName: 'Studio Pro Strip',
      stripLayout: 'strip4',
      designTheme: 'noir',
      borderOrnament: 'double_gold',
      insignia: 'wax_seal',
      photoCount: 4,
      frameColor: '#0a0c10',
      textColor: '#f5f3ef',
      accentColor: '#d8b86a',
      monogramText: 'ELEANOR VANCE STUDIO',
      dateText: 'MMXXVI • PRIVATE ARCHIVE • NYC',
      fontFamily: 'editorial',
      watermarkEnabled: true,
      watermarkText: 'ELEANOR VANCE • PHOTO STUDIO',
      maxPhotoLimit: 'Unlimited',
      resolution: 'Ultra-HD 4K + Custom CSS Overlays',
      allowedFilters: ['noir', 'portra', 'champagne', 'minimal'],
      filmEdgeMarkings: true,
      filmEdgeText: 'KODAK SAFETY FILM 400',
      customOverlayGraphic: true,
    },
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const storedTier = localStorage.getItem('memora_dashboard_templates_active_tier') as TierType;
      if (storedTier && ['free', 'event', 'pro'].includes(storedTier)) {
        setActiveTier(storedTier);
      }
      const storedUser = localStorage.getItem('memora_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role || u.email) {
          setUserRole(u.role || 'organizer');
          setIsAdmin(isAdminRole(u.role) || u.role === 'admin');
        }
      }
      const storedTemplates = localStorage.getItem('memora_admin_templates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        setTemplates([]);
      }
      const stored = localStorage.getItem('memora_strip_templates');
      if (stored) {
        setConfigs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const current = configs[activeTier];

  const normalizeHexColor = (val: string) => {
    if (!val) return '#000000';
    let clean = val.trim();
    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) return clean.toLowerCase();
    if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
      const r = clean[1], g = clean[2], b = clean[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return '#000000';
  };

  const getValidCssColor = (val: string, fallback = '#000000') => {
    if (!val) return fallback;
    const clean = val.trim();
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean)) {
      return `#${clean}`;
    }
    return clean;
  };

  const isLightColor = (colorStr: string) => {
    if (!colorStr) return false;
    let hex = colorStr.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) return false;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  const updateCurrent = (updates: Partial<TierTemplateConfig>) => {
    setConfigs(prev => {
      const next = {
        ...prev,
        [activeTier]: {
          ...prev[activeTier],
          ...updates,
        },
      };
      try {
        localStorage.setItem('memora_strip_templates', JSON.stringify(next));
        const { broadcastRealtime } = require('@/lib/realtime');
        broadcastRealtime('TEMPLATE_UPDATED', { activeTier, config: next[activeTier] });
      } catch {}
      return next;
    });
  };

  const handleApplyPreset = (preset: LuxuryTemplatePreset) => {
    updateCurrent({
      stripName: preset.name,
      stripLayout: preset.layout,
      designTheme: preset.theme,
      frameColor: preset.frameColor,
      textColor: preset.textColor,
      accentColor: preset.accentColor,
      borderOrnament: preset.borderOrnament,
      insignia: preset.insignia,
      fontFamily: preset.fontFamily,
      monogramText: preset.monogramText,
      dateText: preset.dateText,
      filmEdgeMarkings: preset.filmEdgeMarkings,
      filmEdgeText: preset.filmEdgeText,
      photoCount: preset.layout === 'strip3' ? 3 : (preset.layout === 'duo' || preset.layout === 'diagonal_duo') ? 2 : preset.layout === 'polaroid' ? 1 : 4,
    });
  };

  const handleSelectLayout = (layoutId: StripLayoutStyle) => {
    let count = 4;
    if (layoutId === 'grid2x3') count = 6;
    else if (layoutId === 'strip3') count = 3;
    else if (layoutId === 'duo' || layoutId === 'diagonal_duo') count = 2;
    else if (layoutId === 'polaroid') count = 1;
    
    // Automatically adjust borderOrnament if switching away from filmstrip
    let newOrnament = current.borderOrnament;
    if (layoutId === 'filmstrip') {
      newOrnament = 'sprockets';
    } else if (current.borderOrnament === 'sprockets') {
      newOrnament = 'double_gold';
    }

    updateCurrent({
      stripLayout: layoutId,
      photoCount: count,
      borderOrnament: newOrnament,
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem('memora_strip_templates', JSON.stringify(configs));
      broadcastRealtime('TEMPLATE_UPDATED', { activeTier, config: configs[activeTier] });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } catch {}
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirmModal({
      title: 'Reset Template Settings',
      description: 'Are you sure you want to reset template configurations for all tiers to default presets? Any custom colors, fonts, and monograms will be reverted.',
      confirmText: 'Reset to Defaults',
      cancelText: 'Keep Current',
      variant: 'warning',
      eyebrow: 'RESET CONFIRMATION',
    });
    if (confirmed) {
      localStorage.removeItem('memora_strip_templates');
      window.location.reload();
    }
  };

  const getVisibleCount = () => {
    if (current.stripLayout === 'grid2x3') return 6;
    if (current.stripLayout === 'strip3') return 3;
    if (current.stripLayout === 'duo' || current.stripLayout === 'diagonal_duo') return 2;
    if (current.stripLayout === 'polaroid') return 1;
    return 4; // strip4, grid2x2, filmstrip
  };

  const visibleSlots = Array.from({ length: getVisibleCount() });

  const filteredPresets = templateFilter === 'all' 
    ? templates 
    : templates.filter(p => p.category === templateFilter);

  const sortedPresets = React.useMemo(() => {
    const activePlanConfig = activeTier === 'event' ? plans.pro : activeTier === 'pro' ? plans.studio : plans.free;
    return [...filteredPresets].sort((a, b) => {
      const aUnlocked = isTemplateUnlocked(activePlanConfig, a.id);
      const bUnlocked = isTemplateUnlocked(activePlanConfig, b.id);
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return 0;
    });
  }, [filteredPresets, activeTier, plans]);

  const visiblePresets = showAllTemplates ? sortedPresets : sortedPresets.slice(0, 6);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              {isAdmin ? 'Template Management' : 'Templates & Design'}
            </span>
            <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
              isAdmin 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'bg-secondary text-foreground border border-border/80'
            }`}>
              {isAdmin ? <Sparkles className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3 text-primary" />}
              <span>{isAdmin ? 'Admin Mode' : 'Organizer View'}</span>
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            {isAdmin ? 'Templates & Frame Styles' : 'Photo Strip Templates'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light max-w-2xl leading-relaxed">
            {isAdmin 
              ? 'Customize photo strip templates, frame styles, colors, fonts, and watermarks for your photobooths.'
              : 'Choose a design preset below to customize the layout, frame colors, and styling for your photobooth.'}
          </p>
        </div>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-5 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-white dark:bg-card text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save Template</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary/60 border border-border/80 text-xs font-mono text-muted-foreground shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Managed by Admin</span>
            </div>
          </div>
        )}
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 text-xs font-mono flex items-center gap-2 animate-in fade-in shadow-2xs font-semibold">
          <Check className="w-4 h-4" />
          <span>Template settings saved successfully.</span>
        </div>
      )}

      {/* 3-Tier Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Free Trial */}
        <button
          type="button"
          onClick={() => handleSelectTier('free')}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs ring-1 ${
            activeTier === 'free'
              ? 'bg-white dark:bg-card border-foreground ring-foreground/20 shadow-md'
              : 'bg-white/60 dark:bg-card/60 border-border/70 ring-border/20 hover:border-foreground/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
              {plans.free.eyebrow}
            </span>
            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
              {plans.free.badge}
            </span>
          </div>
          <h3 className="font-display text-2xl text-foreground font-light">{plans.free.name}</h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {plans.free.priceDisplay} • {plans.free.templatesUnlocked}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground space-y-1">
            <p>• {plans.free.templatesUnlocked}</p>
            <p>• {plans.free.watermark ? 'Includes Memora watermark' : 'Zero watermark'}</p>
          </div>
        </button>

        {/* Tier 2: Event Pass */}
        <button
          type="button"
          onClick={() => handleSelectTier('event')}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs ring-1 ${
            activeTier === 'event'
              ? 'bg-white dark:bg-card border-primary ring-primary/30 shadow-md'
              : 'bg-white/60 dark:bg-card/60 border-border/70 ring-border/20 hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{plans.pro.eyebrow}</span>
            </span>
            <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
              {plans.pro.badge}
            </span>
          </div>
          <h3 className="font-display text-2xl text-foreground font-light">{plans.pro.name}</h3>
          <p className="text-xs text-primary font-mono mt-0.5 font-medium">
            {isAdmin ? `₱0 • ${plans.pro.templatesUnlocked}` : `${plans.pro.priceDisplay} • ${plans.pro.templatesUnlocked}`}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 text-[10px] font-mono text-foreground space-y-1">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ {plans.pro.templatesUnlocked}</p>
            <p className="text-primary font-semibold">✓ {plans.pro.watermark ? 'Includes watermark' : 'Custom Borders • No Watermark'}</p>
          </div>
        </button>

        {/* Tier 3: Studio Pro */}
        <button
          type="button"
          onClick={() => handleSelectTier('pro')}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs ring-1 ${
            activeTier === 'pro'
              ? 'bg-white dark:bg-card border-foreground ring-foreground/20 shadow-md'
              : 'bg-white/60 dark:bg-card/60 border-border/70 ring-border/20 hover:border-foreground/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
              {plans.studio.eyebrow}
            </span>
            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium border border-border/60">
              {plans.studio.badge}
            </span>
          </div>
          <h3 className="font-display text-2xl text-foreground font-light">{plans.studio.name}</h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {isAdmin ? `₱0 • ${plans.studio.templatesUnlocked}` : `${plans.studio.priceDisplay}/mo • ${plans.studio.templatesUnlocked}`}
          </p>
          <div className="mt-3 pt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground space-y-1">
            <p>• {plans.studio.templatesUnlocked}</p>
            <p>• {plans.studio.watermark ? 'Includes watermark' : 'Custom studio branding & no watermark'}</p>
          </div>
        </button>
      </div>

      {/* Notice for Organizers */}
      {!isAdmin && (
        <div className="p-5 rounded-3xl bg-white dark:bg-card border border-border/80 shadow-xs ring-1 ring-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground flex items-center gap-2">
                <span>Templates Managed by Admin</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">Preview Mode</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-light">
                Template layouts, color themes, and fonts are set up globally by administrators. Click any design preset below to preview how it will appear on your photobooth strip.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE PRESETS GALLERY */}
      <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs ring-1 ring-border/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Template Library</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground font-light">
              Ready-to-Use Template Designs
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">
              Select a design preset below to apply matching fonts, borders, and colors.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Templates' },
              { id: 'wedding', label: 'Weddings & Parties' },
              { id: 'editorial', label: 'Editorial & Modern' },
              { id: 'vintage', label: 'Retro & Film' },
              { id: 'vip', label: 'Classic & Formal' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTemplateFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  templateFilter === f.id
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {templates.length === 0 ? (
          /* EMPTY STATE FOR ORGANIZERS */
          <div className="py-12 px-6 sm:px-12 text-center rounded-2xl border border-dashed border-border/80 bg-secondary/15 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/60 border border-border/70 flex items-center justify-center text-primary shadow-2xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-light text-foreground">
                No Templates Published Yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-md font-light leading-relaxed mt-1">
                No active templates were found in the library. Templates created by administrators will automatically appear here.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Templates Grid Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePresets.map((preset) => {
                const isSelected = current.stripName === preset.name;
                const activePlanConfig = activeTier === 'event' ? plans.pro : activeTier === 'pro' ? plans.studio : plans.free;
                const isLocked = !isTemplateUnlocked(activePlanConfig, preset.id);

                return (
                  <div
                    key={preset.id}
                    onClick={() => !isLocked && handleApplyPreset(preset)}
                    className={`p-5 rounded-2xl border transition-all text-left relative flex flex-col justify-between gap-3 group shadow-2xs ${
                      isLocked 
                        ? 'opacity-40 cursor-not-allowed border-border/40 bg-secondary/20' 
                        : 'cursor-pointer hover:border-foreground/30 hover:bg-secondary/40'
                    } ${
                      isSelected 
                        ? 'bg-secondary/50 border-primary ring-1 ring-primary/40 shadow-xs' 
                        : 'bg-white dark:bg-card border-border/80'
                    }`}
                  >
                    {/* Top: Swatch & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-black/20 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: preset.frameColor }}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                          {preset.badge}
                        </span>
                      </div>
                      {isLocked ? (
                        <span className="flex items-center gap-1 text-[8px] font-mono text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Lock className="w-2.5 h-2.5" /> Requires {activeTier === 'free' ? 'PRO Pass' : 'STUDIO'}
                        </span>
                      ) : isSelected ? (
                        <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground group-hover:text-foreground">
                          Load Preset
                        </span>
                      )}
                    </div>

                    {/* Center: Title & Description */}
                    <div>
                      <h4 className="font-display text-xl text-foreground group-hover:text-primary transition-colors font-light">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-light">
                        {preset.subtitle}
                      </p>
                    </div>

                    {/* Bottom: Format tags */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Format: {STRIP_STYLES.find(s => s.id === preset.layout)?.label}</span>
                      <span className="text-primary font-medium">No Watermark ✓</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedPresets.length > 6 && (
              <div className="flex justify-center pt-5">
                <button
                  type="button"
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/70 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <span>{showAllTemplates ? 'Show less' : 'Show more'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showAllTemplates ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Studio Customizer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Controls */}
        <div className="lg:col-span-7 space-y-6">
          {!isAdmin ? (
            /* ORGANIZER READ-ONLY SPECIFICATION INSPECTOR */
            <div className="space-y-6">
              {/* Card 1: Active Preset Specifications */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Columns className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Template Frame & Layout</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/70 font-semibold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-primary" />
                    <span>Admin Preset</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted-foreground">Active Preset:</span>
                      <strong className="text-sm font-display text-foreground font-light">{current.stripName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted-foreground">Frame Layout:</span>
                      <span className="text-xs font-mono font-medium text-foreground">
                        {STRIP_STYLES.find(s => s.id === current.stripLayout)?.label || 'Vertical Strip'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-muted-foreground">Photo Count:</span>
                      <span className="text-xs font-mono text-foreground font-medium">
                        {current.photoCount} Poses • {current.resolution}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    This preset includes balanced spacing, standard aspect ratio dimensions, and clean margins configured by the administrator.
                  </p>
                </div>
              </div>

              {/* Card 2: Master Color Palette & Paper Stock */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Template Color Theme</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/70 font-semibold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-primary" />
                    <span>Preset Colors</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 text-center space-y-2">
                    <span className="w-8 h-8 rounded-full border border-black/20 mx-auto block shadow-xs ring-1 ring-border/40" style={{ backgroundColor: current.frameColor }} />
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Background</span>
                    <span className="text-xs font-mono font-bold text-foreground block uppercase">{current.frameColor}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 text-center space-y-2">
                    <span className="w-8 h-8 rounded-full border border-black/20 mx-auto block shadow-xs ring-1 ring-border/40" style={{ backgroundColor: current.textColor }} />
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Text Color</span>
                    <span className="text-xs font-mono font-bold text-foreground block uppercase">{current.textColor}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 text-center space-y-2">
                    <span className="w-8 h-8 rounded-full border border-black/20 mx-auto block shadow-xs ring-1 ring-border/40" style={{ backgroundColor: current.accentColor }} />
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">Accent Color</span>
                    <span className="text-xs font-mono font-bold text-foreground block uppercase">{current.accentColor}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Border Style:</span>
                  <span className="text-foreground font-medium capitalize">{current.borderOrnament.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Card 3: Typography & Inscriptions */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Typography & Text</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/70 font-semibold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-primary" />
                    <span>Preset Font</span>
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60">
                    <span className="text-muted-foreground">Font Family:</span>
                    <span className="text-foreground font-medium capitalize">{current.fontFamily} Serif</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60">
                    <span className="text-muted-foreground">Headline / Title:</span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{current.monogramText}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60">
                    <span className="text-muted-foreground">Date & Venue:</span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{current.dateText}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Watermark & Rights */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Watermark Settings</h3>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                    activeTier === 'free' 
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25'
                  }`}>
                    {activeTier === 'free' ? 'WATERMARK INCLUDED' : 'NO WATERMARK'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {activeTier === 'free'
                    ? 'Free trial strips include the Memora watermark. Upgrade to PRO for clean, watermark-free photo downloads.'
                    : 'Watermarks are removed. All guest photos and strips download cleanly without logos.'}
                </p>
              </div>
            </div>
          ) : (
            /* ADMIN FULL MANAGEMENT CUSTOMIZER */
            <>
              {/* SECTION 1: Strip Architecture & Layout */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Columns className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Photo Strip Layout</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {(() => {
                      const activePlanConfig = activeTier === 'event' ? plans.pro : activeTier === 'pro' ? plans.studio : plans.free;
                      const count = STRIP_STYLES.filter(s => isLayoutUnlocked(activePlanConfig, s.id)).length;
                      return `${count} Layout${count === 1 ? '' : 's'} Available`;
                    })()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STRIP_STYLES.map((style) => {
                    const activePlanConfig = activeTier === 'event' ? plans.pro : activeTier === 'pro' ? plans.studio : plans.free;
                    const isLocked = !isLayoutUnlocked(activePlanConfig, style.id);
                    const isSelected = current.stripLayout === style.id;
                    const IconComponent = style.icon;

                    return (
                      <button
                        key={style.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleSelectLayout(style.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2 shadow-2xs ${
                          isLocked
                            ? 'opacity-40 cursor-not-allowed border-border/40 bg-secondary/20'
                            : 'cursor-pointer hover:border-foreground/30'
                        } ${
                          isSelected
                            ? 'bg-secondary/70 border-foreground ring-1 ring-foreground/20 shadow-xs'
                            : 'bg-white dark:bg-card border-border/70 hover:bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-foreground text-background' : 'bg-secondary text-primary'}`}>
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-semibold text-foreground">{style.label}</span>
                          </div>
                          {isLocked ? (
                            <span className="flex items-center gap-1 text-[8px] font-mono text-amber-700 dark:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 font-semibold">
                              <Lock className="w-2.5 h-2.5" /> Pass Only
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                              {style.poses}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                          {style.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Paper Stock & Foil Ornamentation */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Colors & Frame Borders</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    Color Themes
                  </span>
                </div>

                {/* Frame Material Swatches */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Preset Color Themes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    {[
                      { id: 'noir', label: '35mm Noir', hex: '#050505', text: '#ffffff', accent: '#ffffff' },
                      { id: 'obsidian', label: 'Obsidian Black', hex: '#0a0c10', text: '#f5f3ef', accent: '#d8b86a' },
                      { id: 'editorial', label: 'Studio White', hex: '#ffffff', text: '#08090d', accent: '#475569' },
                      { id: 'champagne', label: 'Warm Ivory', hex: '#faf6ee', text: '#1a1712', accent: '#d4af37' },
                      { id: 'cream', label: 'Natural Cream', hex: '#fdfbf7', text: '#1c1917', accent: '#ca8a04' },
                      { id: 'silver', label: 'Studio Silver Fog', hex: '#959595', text: '#0f172a', accent: '#1e293b' },
                      { id: 'emerald', label: 'Emerald Green', hex: '#0a1612', text: '#f2fbf6', accent: '#e6c687' },
                      { id: 'romance', label: 'Deep Burgundy', hex: '#1a0f15', text: '#fdf2f8', accent: '#f472b6' },
                      { id: 'analog', label: 'Vintage Film', hex: '#0e1014', text: '#f1f1f3', accent: '#f59e0b' },
                      { id: 'rose', label: 'Soft Rose', hex: '#fce7f3', text: '#831843', accent: '#db2777' },
                    ].map((stock) => (
                      <button
                        key={stock.id}
                        type="button"
                        onClick={() => updateCurrent({ 
                          frameColor: stock.hex, 
                          textColor: stock.text, 
                          accentColor: stock.accent,
                          designTheme: stock.id as any
                        })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 shadow-2xs ${
                          current.frameColor.toLowerCase() === stock.hex.toLowerCase()
                            ? 'border-foreground ring-2 ring-foreground/20 bg-secondary/70 font-semibold'
                            : 'border-border/70 bg-secondary/30 hover:border-foreground/30 hover:bg-secondary/50'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-black/20 shadow-xs shrink-0" style={{ backgroundColor: stock.hex }} />
                        <span className="text-[9px] font-mono truncate text-foreground leading-tight w-full">{stock.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Color Customization Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                        Background Color
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Card Base</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={normalizeHexColor(current.frameColor)}
                        onChange={(e) => updateCurrent({ frameColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <input 
                        type="text" 
                        value={current.frameColor}
                        onChange={(e) => updateCurrent({ frameColor: e.target.value })}
                        placeholder="#050505"
                        className="w-full bg-white dark:bg-card border border-border/70 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                        Text Color
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Typography</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={normalizeHexColor(current.textColor)}
                        onChange={(e) => updateCurrent({ textColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <input 
                        type="text" 
                        value={current.textColor}
                        onChange={(e) => updateCurrent({ textColor: e.target.value })}
                        placeholder="#ffffff"
                        className="w-full bg-white dark:bg-card border border-border/70 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                        Border & Accent Color
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Border Ink</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={normalizeHexColor(current.accentColor)}
                        onChange={(e) => updateCurrent({ accentColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <input 
                        type="text" 
                        value={current.accentColor}
                        onChange={(e) => updateCurrent({ accentColor: e.target.value })}
                        placeholder="#d8b86a"
                        className="w-full bg-white dark:bg-card border border-border/70 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Embossed Border Inset Styles */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Frame Border Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                      { id: 'sprockets', label: '35mm Film Sprockets' },
                      { id: 'double_gold', label: 'Gold Double Line' },
                      { id: 'artdeco', label: 'Art Deco Frame' },
                      { id: 'botanical', label: 'Botanical Wreath' },
                      { id: 'hairline', label: 'Minimalist Line' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => updateCurrent({ borderOrnament: b.id as BorderOrnament })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-mono text-[10px] ${
                          current.borderOrnament === b.id
                            ? 'border-foreground bg-foreground text-background font-medium shadow-xs'
                            : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="block leading-tight">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stamp & Badge */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Stamp & Icon
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { id: 'star', label: 'Star', icon: '✦' },
                      { id: 'crest', label: 'Crest', icon: '👑' },
                      { id: 'wreath', label: 'Olive Wreath', icon: '🌿' },
                      { id: 'wax_seal', label: 'Wax Seal', icon: '⚚' },
                      { id: 'diamond', label: 'Diamond', icon: '💎' },
                      { id: 'seal_jp', label: 'Stamp Seal', icon: '印' },
                    ].map((ins) => (
                      <button
                        key={ins.id}
                        type="button"
                        onClick={() => updateCurrent({ insignia: ins.id as InsigniaType })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          current.insignia === ins.id
                            ? 'border-foreground bg-secondary/80 text-foreground font-semibold shadow-2xs'
                            : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-base text-primary block mb-0.5">{ins.icon}</span>
                        <span className="text-[8px] font-mono block">{ins.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Haute Typography & Monogram */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Type className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-2xl text-foreground font-light">Text & Monogram</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Event Headline / Header Text
                    </label>
                    <input
                      type="text"
                      value={current.monogramText}
                      onChange={(e) => updateCurrent({ monogramText: e.target.value })}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Date & Location Subtitle
                    </label>
                    <input
                      type="text"
                      value={current.dateText}
                      onChange={(e) => updateCurrent({ dateText: e.target.value })}
                      className="w-full bg-secondary/50 border border-border/70 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground font-mono shadow-2xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Font Family Selection
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'editorial', label: 'Cormorant Serif', preview: 'Editorial' },
                      { id: 'script', label: 'Romantic Script', preview: 'Calligraphy' },
                      { id: 'sans', label: 'Jakarta Sans', preview: 'Modern Swiss' },
                      { id: 'mono', label: 'Courier Mono', preview: 'Analog Vintage' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateCurrent({ fontFamily: f.id as FontFamilyOption })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          current.fontFamily === f.id
                            ? 'border-foreground bg-foreground text-background font-medium shadow-xs'
                            : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="block text-xs font-semibold">{f.label}</span>
                        <span className="text-[8px] font-mono opacity-70">{f.preview}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Watermark & Branding Policy */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Watermark Settings</h3>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                    activeTier === 'free' 
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25'
                  }`}>
                    {activeTier === 'free' ? 'WATERMARK REQUIRED' : 'ZERO WATERMARKS'}
                  </span>
                </div>

                {activeTier === 'free' ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
                    <p className="font-semibold mb-1">Free Trial Settings:</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                      {isAdmin 
                        ? 'Unlimited complimentary access (₱0) with zero watermarks across all templates.'
                        : 'Free Trial includes a standard 3-photo vertical strip with the Memora watermark. Upgrade to PRO Pass (₱1,499) to unlock all 10 templates, custom borders, and 100% watermark-free downloads.'}
                    </p>
                  </div>
                ) : activeTier === 'event' ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Check className="w-4 h-4" />
                      <span>Watermark-Free Downloads Active</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                      Guests download clean, high-resolution photobooth strips containing solely your event text, colors, and monogram without third-party logos.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Crown className="w-4 h-4 text-primary" />
                      <span>Studio Custom Branding</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                      Organizers can replace platform logos with their own photography studio branding, agency badge, or sponsor crest.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Live Physical Strip Preview with Deep Tactile Luxury */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start sticky top-24">
          <div className="flex flex-col items-center gap-2 mb-4 w-full">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary font-medium">
              Photo Strip Preview • {current.tierLabel}
            </span>
          </div>

          {/* Physical Strip Container with Realistic Texture & Depth */}
          <div 
            className={`w-full ${current.stripLayout === 'diagonal_duo' || current.stripLayout === 'grid2x2' || current.stripLayout === 'grid2x3' ? 'max-w-[360px]' : 'max-w-[320px]'} rounded-lg p-4 sm:p-5 shadow-[0_30px_70px_rgba(0,0,0,0.95)] border border-white/15 transition-all duration-500 relative flex flex-col items-center`}
            style={{ 
              backgroundColor: getValidCssColor(current.frameColor),
              color: current.textColor,
            }}
          >
            {/* Double Gold-Leaf Inset Border */}
            {current.borderOrnament === 'double_gold' && (
              <>
                <div 
                  className="absolute inset-2 border pointer-events-none rounded"
                  style={{ borderColor: current.accentColor, opacity: 0.6 }}
                />
                <div 
                  className="absolute inset-3 border pointer-events-none rounded"
                  style={{ borderColor: `${current.accentColor}35` }}
                />
              </>
            )}

            {/* Art Deco Brackets */}
            {current.borderOrnament === 'artdeco' && (
              <>
                <span className="absolute top-2 left-2 text-[12px] font-mono" style={{ color: current.accentColor }}>⌜</span>
                <span className="absolute top-2 right-2 text-[12px] font-mono" style={{ color: current.accentColor }}>⌝</span>
                <span className="absolute bottom-2 left-2 text-[12px] font-mono" style={{ color: current.accentColor }}>⌞</span>
                <span className="absolute bottom-2 right-2 text-[12px] font-mono" style={{ color: current.accentColor }}>⌟</span>
              </>
            )}

            {/* Botanical Corner Filigree */}
            {current.borderOrnament === 'botanical' && (
              <>
                <span className="absolute top-2 left-2 text-[10px]" style={{ color: current.accentColor }}>🌿</span>
                <span className="absolute top-2 right-2 text-[10px]" style={{ color: current.accentColor }}>🌿</span>
                <span className="absolute bottom-2 left-2 text-[10px]" style={{ color: current.accentColor }}>🌿</span>
                <span className="absolute bottom-2 right-2 text-[10px]" style={{ color: current.accentColor }}>🌿</span>
              </>
            )}

            {/* Top Film Edge Header */}
            {current.filmEdgeMarkings && (
              <div 
                className="w-full flex items-center justify-between text-[7px] font-mono uppercase tracking-widest pb-1.5 opacity-60 border-b"
                style={{ borderColor: `${current.textColor}20` }}
              >
                <span style={{ color: current.accentColor }}>{current.filmEdgeText || 'KODAK TRI-X 400'}</span>
                <span>ISO 400 • FRAME 01A</span>
              </div>
            )}

            {/* Layout Variant 1: 35mm Analog Filmstrip with Perforations */}
            {current.stripLayout === 'filmstrip' || (current.borderOrnament === 'sprockets' && current.stripLayout !== 'grid2x2' && current.stripLayout !== 'polaroid' && current.stripLayout !== 'duo') ? (
              <div 
                className="w-full flex items-stretch gap-2.5 my-2 relative p-2 sm:p-2.5 rounded-xl border shadow-inner transition-colors duration-300"
                style={{ 
                  backgroundColor: getValidCssColor(current.frameColor),
                  borderColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                }}
              >
                {/* Left Sprockets */}
                <div 
                  className="flex flex-col justify-between py-1 px-1 rounded-md transition-colors"
                  style={{ backgroundColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)' }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-4 rounded-[2px] shadow-2xs my-1 shrink-0 transition-colors" 
                      style={{ 
                        backgroundColor: isLightColor(current.frameColor) ? '#18181b' : '#ffffff',
                        border: isLightColor(current.frameColor) ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)'
                      }}
                    />
                  ))}
                </div>

                {/* Center Slots */}
                <div className="flex-1 space-y-2.5">
                  {visibleSlots.map((_, idx) => (
                    <div 
                      key={idx}
                      className="relative aspect-[4/3] w-full rounded-xs overflow-hidden flex flex-col items-center justify-center transition-all border shadow-sm"
                      style={{
                        backgroundColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.08)' : '#090a0f',
                        borderColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.15)' : '#000000',
                      }}
                    >
                      <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none">
                        <Camera className="w-4 h-4" style={{ color: current.accentColor }} />
                        <span className="font-mono text-[8px] uppercase tracking-wider font-semibold" style={{ color: current.textColor }}>
                          Photo {idx + 1} • {current.stripLayout === 'filmstrip' ? '35mm Film' : 'Photo Frame'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Sprockets */}
                <div 
                  className="flex flex-col justify-between py-1 px-1 rounded-md transition-colors"
                  style={{ backgroundColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)' }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-4 rounded-[2px] shadow-2xs my-1 shrink-0 transition-colors" 
                      style={{ 
                        backgroundColor: isLightColor(current.frameColor) ? '#18181b' : '#ffffff',
                        border: isLightColor(current.frameColor) ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : current.stripLayout === 'diagonal_duo' ? (
              /* Layout Variant: Vintage Diagonal Duo */
              <div className="w-full grid grid-cols-2 gap-2 my-2.5">
                {/* Row 1, Col 1: Photo 1 */}
                <div 
                  className="relative aspect-[4/3] w-full rounded overflow-hidden flex flex-col items-center justify-center transition-all"
                  style={{
                    border: `1.5px dashed ${current.accentColor}55`,
                    backgroundColor: `${current.textColor}08`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none">
                    <Camera className="w-4 h-4 opacity-70" style={{ color: current.accentColor }} />
                    <span className="font-mono text-[8px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                      Photo 1
                    </span>
                    <span className="font-mono text-[6px] uppercase tracking-widest opacity-60" style={{ color: current.accentColor }}>
                      Top Left
                    </span>
                  </div>
                </div>

                {/* Row 1, Col 2: Postal Stamp */}
                <div className="flex items-center justify-center p-1 rounded border border-dashed aspect-[4/3] overflow-hidden" style={{ borderColor: `${current.accentColor}40` }}>
                  <span className="font-mono text-[7px] text-center opacity-70 uppercase tracking-wider" style={{ color: current.accentColor }}>
                    Postal Stamp
                  </span>
                </div>

                {/* Row 2, Col 1: Inscription */}
                <div className="flex items-center justify-center p-1 rounded border border-dashed aspect-[4/3] overflow-hidden" style={{ borderColor: `${current.accentColor}40` }}>
                  <span className="font-mono text-[7px] text-center opacity-70 uppercase tracking-wider" style={{ color: current.accentColor }}>
                    Archival Inscription
                  </span>
                </div>

                {/* Row 2, Col 2: Photo 2 */}
                <div 
                  className="relative aspect-[4/3] w-full rounded overflow-hidden flex flex-col items-center justify-center transition-all"
                  style={{
                    border: `1.5px dashed ${current.accentColor}55`,
                    backgroundColor: `${current.textColor}08`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none">
                    <Camera className="w-4 h-4 opacity-70" style={{ color: current.accentColor }} />
                    <span className="font-mono text-[8px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                      Photo 2
                    </span>
                    <span className="font-mono text-[6px] uppercase tracking-widest opacity-60" style={{ color: current.accentColor }}>
                      Bottom Right
                    </span>
                  </div>
                </div>
              </div>
            ) : current.stripLayout === 'grid2x2' ? (
              /* Layout Variant 2: 2x2 Quad Grid Collage */
              <div className="w-full grid grid-cols-2 gap-2 my-3">
                {visibleSlots.map((_, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-[4/3] w-full rounded overflow-hidden flex flex-col items-center justify-center transition-all"
                    style={{
                      border: `1.5px dashed ${current.accentColor}55`,
                      backgroundColor: `${current.textColor}08`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none">
                      <Camera className="w-4 h-4 opacity-70" style={{ color: current.accentColor }} />
                      <span className="font-mono text-[8px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                        Quad #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : current.stripLayout === 'grid2x3' ? (
              /* Layout Variant: 2x3 Hexa Grid Collage */
              <div className="w-full grid grid-cols-2 gap-1.5 my-3">
                {visibleSlots.map((_, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-[4/3] w-full rounded overflow-hidden flex flex-col items-center justify-center transition-all"
                    style={{
                      border: `1.5px dashed ${current.accentColor}55`,
                      backgroundColor: `${current.textColor}08`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5 p-1 text-center select-none">
                      <Camera className="w-3 h-3 opacity-70" style={{ color: current.accentColor }} />
                      <span className="font-mono text-[7px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : current.stripLayout === 'polaroid' ? (
              /* Layout Variant 3: Wide Polaroid Instant */
              <div className="w-full my-2">
                <div 
                  className="relative aspect-square w-full rounded overflow-hidden flex flex-col items-center justify-center mb-4 transition-all"
                  style={{
                    border: `1.5px dashed ${current.accentColor}55`,
                    backgroundColor: `${current.textColor}08`,
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center select-none">
                    <Camera className="w-6 h-6 opacity-70" style={{ color: current.accentColor }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                      Polaroid Photo
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Layout Variant 4: Vertical Stack (strip4, strip3, duo) */
              <div className="w-full space-y-2.5 my-3">
                {visibleSlots.map((_, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-[4/3] w-full rounded overflow-hidden flex flex-col items-center justify-center transition-all"
                    style={{
                      border: `1.5px dashed ${current.accentColor}55`,
                      backgroundColor: `${current.textColor}08`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center select-none">
                      <Camera className="w-5 h-5 opacity-70" style={{ color: current.accentColor }} />
                      <span className="font-mono text-[9px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                        Photo {idx + 1}
                      </span>
                      <span className="font-mono text-[7px] uppercase tracking-widest opacity-60" style={{ color: current.accentColor }}>
                        Standard 4×6" Aspect
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Strip Footer Branding with Insignia */}
            <div className="w-full text-center pt-2 pb-1 space-y-1">
              {/* Insignia Icon */}
              {current.insignia !== 'none' && (
                <div className="flex justify-center mb-1">
                  <span className="text-sm" style={{ color: current.accentColor }}>
                    {current.insignia === 'star' && '✦'}
                    {current.insignia === 'crest' && '👑'}
                    {current.insignia === 'wreath' && '🌿'}
                    {current.insignia === 'wax_seal' && '⚚'}
                    {current.insignia === 'diamond' && '💎'}
                    {current.insignia === 'seal_jp' && '印'}
                  </span>
                </div>
              )}

              <h4 
                className={`text-lg sm:text-xl font-bold uppercase tracking-wider leading-tight ${
                  current.fontFamily === 'mono' ? 'font-mono' : current.fontFamily === 'sans' ? 'font-sans' : current.fontFamily === 'script' ? 'italic font-serif' : 'font-editorial'
                }`}
                style={{
                  fontFamily: current.fontFamily === 'mono' 
                    ? 'var(--font-mono, "Courier New", Courier, monospace)' 
                    : current.fontFamily === 'sans' 
                    ? 'var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif)' 
                    : current.fontFamily === 'script'
                    ? '"Cormorant Garamond", "Playfair Display", Georgia, serif'
                    : 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
                  fontStyle: current.fontFamily === 'script' ? 'italic' : 'normal',
                }}
              >
                {current.monogramText || 'EVENT MONOGRAM'}
              </h4>
              <p 
                className="text-[8px] font-semibold uppercase tracking-widest opacity-60"
                style={{
                  fontFamily: current.fontFamily === 'mono' 
                    ? 'var(--font-mono, "Courier New", Courier, monospace)' 
                    : current.fontFamily === 'sans' 
                    ? 'var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif)' 
                    : 'var(--font-mono, "Courier New", Courier, monospace)',
                }}
              >
                {current.dateText || 'DATE & LOCATION'}
              </p>

              {/* Watermark Display based on Tier */}
              {activeTier === 'free' && current.watermarkEnabled && (
                <div className="pt-2">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-black/50 bg-black/5 px-2 py-0.5 rounded">
                    {current.watermarkText}
                  </span>
                </div>
              )}

              {activeTier === 'event' && (
                <div className="pt-1.5 text-[7px] font-mono uppercase tracking-widest text-emerald-600 font-bold flex items-center justify-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>ZERO WATERMARKS • ULTRA-HD 4K</span>
                </div>
              )}

              {activeTier === 'pro' && current.watermarkEnabled && (
                <div className="pt-2">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#d8b86a] bg-black/40 px-2 py-0.5 rounded border border-[#d8b86a]/30">
                    {current.watermarkText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Details Below Strip */}
          <div className="mt-6 w-full max-w-sm p-5 rounded-3xl bg-white dark:bg-card border border-border/80 text-xs font-mono space-y-2.5 shadow-xs ring-1 ring-border/20">
            <div className="flex justify-between text-muted-foreground">
              <span>Template Preset:</span>
              <strong className="text-foreground font-medium">{current.stripName}</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Layout Style:</span>
              <strong className="text-foreground font-medium">
                {STRIP_STYLES.find(s => s.id === current.stripLayout)?.label || 'Vertical Strip'}
              </strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Watermark Guarantee:</span>
              <strong className={activeTier === 'free' ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
                {activeTier === 'free' ? 'Required (Free)' : '100% Zero Watermark'}
              </strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Guest Photos Cap:</span>
              <strong className="text-foreground font-medium">{current.maxPhotoLimit === 'Unlimited' ? 'Unlimited Photos' : `${current.maxPhotoLimit} Photos`}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
