'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  ShieldCheck, 
  Check, 
  Save, 
  Sparkles, 
  Crown, 
  Lock,
  Columns,
  Grid2X2,
  Film,
  Square,
  Maximize2,
  Palette,
  Type,
  RotateCcw,
  Eye,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Camera,
  X,
  AlertTriangle,
  LayoutGrid
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useModal } from '@/context/ModalContext';

export type TierType = 'free' | 'event' | 'pro';
export type StripLayoutStyle = 'strip4' | 'strip3' | 'grid2x2' | 'grid2x3' | 'filmstrip' | 'polaroid' | 'duo';
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
  gifExportEnabled: boolean;
}

export const DEFAULT_ATELIER_PRESETS: LuxuryTemplatePreset[] = [
  {
    id: 'ritz_gala',
    name: 'The Ritz Grand Gala',
    category: 'vip',
    subtitle: 'Classic dark background with refined double gold borders and formal crest',
    layout: 'strip4',
    theme: 'noir',
    frameColor: '#0a0c10',
    textColor: '#f5f3ef',
    accentColor: '#d8b86a',
    borderOrnament: 'double_gold',
    insignia: 'crest',
    fontFamily: 'editorial',
    monogramText: 'VICTORIA & ALEXANDER',
    dateText: 'MMXXVI • THE RITZ-CARLTON GRAND BALLROOM',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Black Tie Signature',
  },
  {
    id: 'amalfi_wedding',
    name: 'Amalfi Riviera Wedding',
    category: 'wedding',
    subtitle: 'Soft ivory background with botanical olive leaf details and gold accents',
    layout: 'strip4',
    theme: 'champagne',
    frameColor: '#faf6ee',
    textColor: '#1a1712',
    accentColor: '#d4af37',
    borderOrnament: 'botanical',
    insignia: 'wreath',
    fontFamily: 'editorial',
    monogramText: 'CLAIRE & SEBASTIAN',
    dateText: 'JUNE 20 • VILLA CIMBRONE • RAVELLO',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Destination Wedding',
  },
  {
    id: 'vogue_met',
    name: 'Vogue Met Gala Editorial',
    category: 'editorial',
    subtitle: 'Clean white layout with structured margins and minimalist diamond stamp',
    layout: 'grid2x2',
    theme: 'editorial',
    frameColor: '#ffffff',
    textColor: '#08090d',
    accentColor: '#475569',
    borderOrnament: 'hairline',
    insignia: 'diamond',
    fontFamily: 'sans',
    monogramText: 'METROPOLITAN SOIRÉE',
    dateText: 'OCTOBER 2026 • EDITION № 04',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Modern Editorial',
  },
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
    id: 'marais_darkroom',
    name: 'Le Marais 35mm Darkroom',
    category: 'vintage',
    subtitle: 'Continuous 35mm film negative with warm amber stamps',
    layout: 'filmstrip',
    theme: 'analog',
    frameColor: '#0e1014',
    textColor: '#f1f1f3',
    accentColor: '#f59e0b',
    borderOrnament: 'sprockets',
    insignia: 'star',
    fontFamily: 'mono',
    monogramText: 'PARIS ARCHIVE 1984',
    dateText: 'SAFETY FILM • KODAK TRI-X 400',
    filmEdgeMarkings: true,
    filmEdgeText: 'KODAK 400TX • 24A • EXP 36',
    badge: 'Paris Darkroom',
    freeTierEligible: true,
  },
  {
    id: 'versailles_baroque',
    name: 'Château de Versailles',
    category: 'vip',
    subtitle: 'Warm champagne background with ornamental corner filigree',
    layout: 'strip4',
    theme: 'gala',
    frameColor: '#17140e',
    textColor: '#fef3c7',
    accentColor: '#f59e0b',
    borderOrnament: 'artdeco',
    insignia: 'wax_seal',
    fontFamily: 'script',
    monogramText: 'GENEVIEVE & JULIEN',
    dateText: 'LE PETIT TRIANON • VERSAILLES',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Baroque Gilded',
  },
  {
    id: 'soho_loft',
    name: 'SoHo Metropolitan Loft',
    category: 'editorial',
    subtitle: 'Modern dark frame with clean gold perimeter line and coordinates',
    layout: 'grid2x2',
    theme: 'cyber',
    frameColor: '#090c13',
    textColor: '#f0f9ff',
    accentColor: '#eab308',
    borderOrnament: 'hairline',
    insignia: 'star',
    fontFamily: 'sans',
    monogramText: 'GREENE ST STUDIO 4B',
    dateText: '40.7233° N, 73.9998° W • NEW YORK',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Metro VIP',
  },
  {
    id: 'rose_romance',
    name: 'Rose Romance & Silk',
    category: 'wedding',
    subtitle: 'Deep burgundy frame with delicate rose gold borders',
    layout: 'strip3',
    theme: 'romance',
    frameColor: '#1a0f15',
    textColor: '#fdf2f8',
    accentColor: '#f472b6',
    borderOrnament: 'botanical',
    insignia: 'crest',
    fontFamily: 'editorial',
    monogramText: 'ISABELLA & MATTEO',
    dateText: 'SEPTEMBER 12 • VILLA BALBIANELLO',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Romantic Velvet',
  },
  {
    id: 'monaco_grandprix',
    name: 'Monaco Grand Prix Club',
    category: 'vip',
    subtitle: 'Deep emerald green background with brass borders and crest',
    layout: 'duo',
    theme: 'emerald',
    frameColor: '#0a1612',
    textColor: '#f2fbf6',
    accentColor: '#e6c687',
    borderOrnament: 'double_gold',
    insignia: 'crest',
    fontFamily: 'editorial',
    monogramText: 'PADDOCK CLUB MONTE CARLO',
    dateText: 'CIRCUIT DE MONACO • FORMULA 1',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Riviera VIP',
  },
  {
    id: 'kyoto_wabi',
    name: 'Kyoto Wabi-Sabi Gallery',
    category: 'editorial',
    subtitle: 'Minimalist charcoal frame with classic red seal stamp',
    layout: 'duo',
    theme: 'editorial',
    frameColor: '#18181b',
    textColor: '#fafaf9',
    accentColor: '#ef4444',
    borderOrnament: 'hairline',
    insignia: 'seal_jp',
    fontFamily: 'editorial',
    monogramText: 'KYOTO GALLERY EDITION',
    dateText: 'KYOTO • HEISEI ARCHIVE',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Wabi-Sabi Modern',
  },
  {
    id: 'hamptons_linen',
    name: 'Hamptons Solstice Linen',
    category: 'wedding',
    subtitle: 'Warm linen beige background with clean borders and star stamp',
    layout: 'strip4',
    theme: 'coastal',
    frameColor: '#f7f4ed',
    textColor: '#211e19',
    accentColor: '#c29d59',
    borderOrnament: 'double_gold',
    insignia: 'wreath',
    fontFamily: 'editorial',
    monogramText: 'CAROLINE & NICHOLAS',
    dateText: 'MONTAUK YACHT CLUB • EAST HAMPTON',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'Coastal Linen',
  },
  {
    id: 'ivy_collegiate',
    name: 'High School Days & Varsity',
    category: 'school',
    subtitle: 'Classic campus navy with student pass, stationery supplies, and current school year memories',
    layout: 'strip3',
    theme: 'noir',
    frameColor: '#0a1424',
    textColor: '#f6eedb',
    accentColor: '#d4af37',
    borderOrnament: 'double_gold',
    insignia: 'crest',
    fontFamily: 'editorial',
    monogramText: 'CAMPUS DAYS • SY 2026–2027',
    dateText: 'CLASSMATES & FRIENDS • DAILY MEMORIES',
    filmEdgeMarkings: false,
    filmEdgeText: '',
    badge: 'School Year Edition',
  },
];

export const LUXURY_TEMPLATES: LuxuryTemplatePreset[] = DEFAULT_ATELIER_PRESETS;

export const STRIP_STYLES: Array<{
  id: StripLayoutStyle;
  label: string;
  poses: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tiers: TierType[];
}> = [
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
];

export default function AdminTemplatesGovernancePage() {
  const { confirm: confirmModal } = useModal();
  const [activeAdminTab, setActiveAdminTab] = useState<'studio' | 'policies'>('studio');
  const [activeTier, setActiveTier] = useState<TierType>('event');
  const [savedToast, setSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Master templates, colors, and frame parameters successfully published globally!');
  
  // Dynamic Master Templates Library (cleared by default)
  const [templates, setTemplates] = useState<LuxuryTemplatePreset[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectTier = (tier: TierType) => {
    setActiveTier(tier);
    try {
      localStorage.setItem('memora_admin_templates_active_tier', tier);
    } catch {}
  };

  // New Template Form State
  const [newTemplateForm, setNewTemplateForm] = useState<{
    name: string;
    layout: StripLayoutStyle;
    category: 'wedding' | 'editorial' | 'vintage' | 'vip';
    theme: DesignTheme;
    frameColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: FontFamilyOption;
    borderOrnament: BorderOrnament;
    insignia: InsigniaType;
    monogramText: string;
    dateText: string;
    badge: string;
  }>({
    name: '',
    layout: 'strip4',
    category: 'wedding',
    theme: 'noir',
    frameColor: '#0a0c10',
    textColor: '#f5f3ef',
    accentColor: '#d8b86a',
    fontFamily: 'editorial',
    borderOrnament: 'double_gold',
    insignia: 'crest',
    monogramText: '',
    dateText: '',
    badge: 'Custom Template',
  });

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
      gifExportEnabled: true,
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
      gifExportEnabled: true,
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
      gifExportEnabled: true,
    },
  });

  // Global platform quota policies
  const [globalQuotas, setGlobalQuotas] = useState({
    freeMaxPhotos: 25,
    freeWatermarkText: 'MEMORA • PHOTOBOOTH',
    freeAllowedLayouts: ['strip3'],
    eventPassPrice: 29,
    eventPassZeroWatermark: true,
    eventPassUnlockedStyles: 6,
    eventPassMaxDesigns: 10,
    studioProPrice: 89,
    studioProWhiteLabelAllowed: true,
    studioProCustomCssAllowed: true,
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const storedTier = localStorage.getItem('memora_admin_templates_active_tier') as TierType;
      if (storedTier && ['free', 'event', 'pro'].includes(storedTier)) {
        setActiveTier(storedTier);
      }
      const storedQuotas = localStorage.getItem('memora_global_quotas');
      if (storedQuotas) {
        setGlobalQuotas(prev => ({ ...prev, ...JSON.parse(storedQuotas) }));
      }
      const storedTemplates = localStorage.getItem('memora_admin_templates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      } else {
        // Explicitly clear all samples and start empty
        setTemplates([]);
        localStorage.setItem('memora_admin_templates', JSON.stringify([]));
      }

      const stored = localStorage.getItem('memora_strip_templates');
      if (stored) {
        setConfigs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

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

  const handleUpdateGlobalQuotas = (updates: Partial<typeof globalQuotas>) => {
    setGlobalQuotas(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('memora_global_quotas', JSON.stringify(next));
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
      photoCount: preset.layout === 'strip3' ? 3 : preset.layout === 'duo' ? 2 : preset.layout === 'polaroid' ? 1 : 4,
    });
  };

  const handleSelectLayout = (layoutId: StripLayoutStyle) => {
    let count = 4;
    if (layoutId === 'grid2x3') count = 6;
    else if (layoutId === 'strip3') count = 3;
    else if (layoutId === 'duo') count = 2;
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
      showNotification('Template and frame settings saved successfully.');
    } catch {}
  };

  const handleClearAllTemplates = async () => {
    const confirmed = await confirmModal({
      title: 'Clear Template Library',
      description: 'Are you sure you want to clear all templates from the library? Custom presets will be removed.',
      confirmText: 'Clear All Templates',
      cancelText: 'Cancel',
      variant: 'danger',
      eyebrow: 'DELETION CONFIRMATION',
    });
    if (confirmed) {
      setTemplates([]);
      localStorage.setItem('memora_admin_templates', JSON.stringify([]));
      showNotification('All templates cleared from library.');
    }
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('memora_admin_templates', JSON.stringify(updated));
    showNotification('Template removed from library.');
  };

  const handleRestoreSamplePresets = async () => {
    const confirmed = await confirmModal({
      title: 'Restore Default Presets',
      description: 'Restore the 10 default template presets to your library?',
      confirmText: 'Restore Presets',
      cancelText: 'Keep Current',
      variant: 'info',
      eyebrow: 'LIBRARY RESTORATION',
    });
    if (confirmed) {
      setTemplates(DEFAULT_ATELIER_PRESETS);
      localStorage.setItem('memora_admin_templates', JSON.stringify(DEFAULT_ATELIER_PRESETS));
      showNotification('Default template presets restored.');
    }
  };

  const handleCreateNewTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateForm.name.trim()) return;

    const newPreset: LuxuryTemplatePreset = {
      id: 'custom_' + Date.now(),
      name: newTemplateForm.name.trim(),
      category: newTemplateForm.category,
      subtitle: `${STRIP_STYLES.find(s => s.id === newTemplateForm.layout)?.label || 'Custom'} layout`,
      layout: newTemplateForm.layout,
      theme: newTemplateForm.theme,
      frameColor: newTemplateForm.frameColor,
      textColor: newTemplateForm.textColor,
      accentColor: newTemplateForm.accentColor,
      borderOrnament: newTemplateForm.borderOrnament,
      insignia: newTemplateForm.insignia,
      fontFamily: newTemplateForm.fontFamily,
      monogramText: newTemplateForm.monogramText.trim() || newTemplateForm.name.toUpperCase(),
      dateText: newTemplateForm.dateText.trim() || 'EST. 2026',
      filmEdgeMarkings: newTemplateForm.layout === 'filmstrip',
      filmEdgeText: newTemplateForm.layout === 'filmstrip' ? 'SAFETY FILM • 400TX' : '',
      badge: newTemplateForm.badge.trim() || 'Custom',
    };

    const updated = [newPreset, ...templates];
    setTemplates(updated);
    localStorage.setItem('memora_admin_templates', JSON.stringify(updated));
    handleApplyPreset(newPreset);
    setIsCreateModalOpen(false);
    showNotification(`Template "${newPreset.name}" created and activated.`);
    
    // Reset form
    setNewTemplateForm({
      name: '',
      layout: 'strip4',
      category: 'wedding',
      theme: 'noir',
      frameColor: '#0a0c10',
      textColor: '#f5f3ef',
      accentColor: '#d8b86a',
      fontFamily: 'editorial',
      borderOrnament: 'double_gold',
      insignia: 'crest',
      monogramText: '',
      dateText: '',
      badge: 'Custom Template',
    });
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirmModal({
      title: 'Reset Template Settings',
      description: 'Reset template settings for all tiers to standard defaults? Any unpublished modifications will be discarded.',
      confirmText: 'Reset Defaults',
      cancelText: 'Cancel',
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
    if (current.stripLayout === 'duo') return 2;
    if (current.stripLayout === 'polaroid') return 1;
    return 4;
  };

  const visibleSlots = Array.from({ length: getVisibleCount() });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary font-medium">
              Administration
            </span>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Administrator Mode</span>
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Templates, Colors & Frame Styles
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light max-w-2xl leading-relaxed">
            Customize template presets, photo strip layouts, color themes, and fonts across the platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/templates"
            className="px-4 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-white dark:bg-card text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Organizer View</span>
          </Link>
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-full border border-border/80 hover:bg-secondary bg-white dark:bg-card text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background font-medium text-xs font-mono uppercase tracking-[0.14em] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Publish to Global Catalog</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 text-xs font-mono flex items-center gap-2 animate-in fade-in shadow-2xs font-semibold">
          <Check className="w-4 h-4" />
          <span>Master templates, colors, and frame parameters successfully published globally!</span>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-secondary/50 border border-border/70 w-fit">
        <button
          type="button"
          onClick={() => setActiveAdminTab('studio')}
          className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'studio'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Master Templates, Colors & Frames Studio
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('policies')}
          className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'policies'
              ? 'bg-foreground text-background font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Plan Quotas & Watermark Policies
        </button>
      </div>

      {activeAdminTab === 'studio' ? (
        <div className="space-y-8">
          {/* 3-Tier Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['free', 'event', 'pro'] as const).map((tierKey) => {
              const cfg = configs[tierKey];
              const isSelected = activeTier === tierKey;

              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => handleSelectTier(tierKey)}
                  className={`p-6 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs ring-1 ${
                    isSelected
                      ? 'bg-white dark:bg-card border-foreground ring-foreground/20 shadow-md'
                      : 'bg-white/60 dark:bg-card/60 border-border/70 ring-border/20 hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
                      {tierKey === 'free' ? 'Starter Tier' : tierKey === 'event' ? 'Per-Event Pass' : 'Studio Pro'}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium border border-border/60">
                      {cfg.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-foreground font-light">{cfg.tierLabel}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{cfg.rate}</p>
                </button>
              );
            })}
          </div>

          {/* MASTER TEMPLATE & FRAME LIBRARY (Dynamic CRUD Studio) */}
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs ring-1 ring-border/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Master Template & Frame Catalog</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground font-light">
                  {templates.length === 0 ? 'Template Library Cleared' : `${templates.length} Active Template Designs`}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-light">
                  {templates.length === 0
                    ? 'All sample presets and frames have been cleared. Click "+ Create New Template" to add your custom frame layout.'
                    : 'Manage custom templates and frame designs. Click any template to load into the live editor or delete unwanted presets.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Template</span>
                </button>

                {templates.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllTemplates}
                    className="px-3.5 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Clear all template presets and frames from the library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRestoreSamplePresets}
                  className="px-3.5 py-2 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-all border border-border/70 cursor-pointer shadow-2xs"
                  title="Restore default sample presets for testing"
                >
                  <span>Restore Samples</span>
                </button>
              </div>
            </div>

            {templates.length === 0 ? (
              /* EMPTY STATE: When all samples are cleared */
              <div className="py-12 px-6 sm:px-12 text-center rounded-2xl border border-dashed border-border/80 bg-secondary/15 flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/60 border border-border/70 flex items-center justify-center text-primary shadow-2xs">
                  <Layers className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-light text-foreground">
                    No Templates in Library
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md font-light leading-relaxed mt-1">
                    All sample presets and frames have been cleared. You can create custom photobooth templates from scratch, configure frame layouts, and publish them globally.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider font-medium hover:bg-foreground/90 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Template</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRestoreSamplePresets}
                    className="px-4 py-2.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground font-mono text-xs uppercase tracking-wider transition-all border border-border/70 cursor-pointer"
                  >
                    <span>Restore Demo Samples</span>
                  </button>
                </div>
              </div>
            ) : (
              /* GRID OF DYNAMIC TEMPLATES */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((preset) => {
                  const isSelected = current.stripName === preset.name;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-5 rounded-2xl border transition-all text-left relative flex flex-col justify-between gap-3 group shadow-2xs cursor-pointer hover:border-foreground/30 hover:bg-secondary/40 ${
                        isSelected 
                          ? 'bg-secondary/50 border-primary ring-1 ring-primary/40 shadow-xs' 
                          : 'bg-white dark:bg-card border-border/80'
                      }`}
                    >
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

                        <div className="flex items-center gap-1.5">
                          {isSelected ? (
                            <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground group-hover:text-foreground">
                              Load
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleDeleteTemplate(preset.id, e)}
                            className="p-1 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title={`Delete ${preset.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-display text-xl text-foreground group-hover:text-primary transition-colors font-light">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-light">
                          {preset.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                        <span>Format: {STRIP_STYLES.find(s => s.id === preset.layout)?.label}</span>
                        <span className="text-primary font-medium">{preset.category.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Studio Customizer Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Admin Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: Strip Architecture & Layout */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Columns className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Frame Layout Architecture</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    6 Available Frame Geometries
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STRIP_STYLES.map((style) => {
                    const isSelected = current.stripLayout === style.id;
                    const IconComponent = style.icon;

                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleSelectLayout(style.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2 shadow-2xs cursor-pointer hover:border-foreground/30 ${
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
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                            {style.poses}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                          {style.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Colors & Paper Stock Customizer */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-2xl text-foreground font-light">Color Palette & Frame Finishes</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    Admin Controlled
                  </span>
                </div>

                {/* 1-Click Strip / Paper Stock Colors */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Paper Stock & Photo Strip Backgrounds (1-Click Apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    {[
                      { label: '35mm Noir', hex: '#050505', text: '#ffffff', accent: '#ffffff' },
                      { label: 'Obsidian Black', hex: '#0a0c10', text: '#f5f3ef', accent: '#d8b86a' },
                      { label: 'Studio White', hex: '#ffffff', text: '#08090d', accent: '#475569' },
                      { label: 'Warm Ivory', hex: '#faf6ee', text: '#1a1712', accent: '#d4af37' },
                      { label: 'Natural Cream', hex: '#fdfbf7', text: '#1c1917', accent: '#ca8a04' },
                      { label: 'Studio Silver Fog', hex: '#959595', text: '#0f172a', accent: '#1e293b' },
                      { label: 'Emerald Green', hex: '#0a1612', text: '#f2fbf6', accent: '#e6c687' },
                      { label: 'Deep Burgundy', hex: '#1a0f15', text: '#fdf2f8', accent: '#f472b6' },
                      { label: 'Vintage Film', hex: '#0e1014', text: '#f1f1f3', accent: '#f59e0b' },
                      { label: 'Soft Rose', hex: '#fce7f3', text: '#831843', accent: '#db2777' },
                    ].map((palette) => (
                      <button
                        key={palette.hex}
                        type="button"
                        onClick={() => updateCurrent({ 
                          frameColor: palette.hex,
                          textColor: palette.text,
                          accentColor: palette.accent,
                        })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 shadow-2xs ${
                          current.frameColor.toLowerCase() === palette.hex.toLowerCase()
                            ? 'border-foreground ring-2 ring-foreground/20 bg-secondary/70 font-semibold'
                            : 'border-border/70 bg-secondary/30 hover:border-foreground/30 hover:bg-secondary/50'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-black/20 shadow-xs block shrink-0" 
                          style={{ backgroundColor: palette.hex }} 
                        />
                        <span className="text-[9px] font-mono truncate text-foreground leading-tight w-full">{palette.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Color Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                        Strip Background Color
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Paper Base</span>
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
                        Typography Ink
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Text Color</span>
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
                        Accent & Foil Border
                      </label>
                      <span className="text-[9px] font-mono text-muted-foreground/70">Ornament Ink</span>
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

                {/* Embossed Border Foil Style */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Embossed Foil Border Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                      { id: 'sprockets', label: '35mm Film Sprockets' },
                      { id: 'double_gold', label: '24K Gold Double Hairline' },
                      { id: 'artdeco', label: 'Art Deco 1920s Frame' },
                      { id: 'botanical', label: 'Botanical Wreath Rim' },
                      { id: 'hairline', label: 'Minimalist Razor Hairline' },
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
              </div>

              {/* SECTION 3: Typography & Inscriptions */}
              <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Type className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-2xl text-foreground font-light">Fine-Art Typography Standards</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
                      Event Headline / Monogram
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
                      Event Date & Location Stamp
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
            </div>

            {/* Right Column: Live Physical Strip Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-start sticky top-24">
              <div className="flex flex-col items-center gap-2 mb-4 w-full">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary font-medium">
                  Live Strip Canvas Preview • {current.tierLabel}
                </span>
              </div>

              {/* Physical Strip Container */}
              <div 
                className="w-full max-w-[320px] rounded-lg p-4 sm:p-5 shadow-2xl border border-border/80 transition-all duration-500 relative flex flex-col items-center"
                style={{ 
                  backgroundColor: getValidCssColor(current.frameColor),
                  color: current.textColor,
                }}
              >
                {/* Double Gold Pinstripe Inner Border */}
                {current.borderOrnament === 'double_gold' && (
                  <div 
                    className="absolute inset-2 border rounded-sm pointer-events-none"
                    style={{ borderColor: current.accentColor, opacity: 0.6 }}
                  >
                    <div 
                      className="absolute inset-1 border rounded-xs pointer-events-none"
                      style={{ borderColor: current.accentColor, opacity: 0.4 }}
                    />
                  </div>
                )}

                {/* Art Deco 1920s Frame */}
                {current.borderOrnament === 'artdeco' && (
                  <>
                    <div 
                      className="absolute inset-2 border pointer-events-none rounded-xs"
                      style={{ borderColor: current.accentColor, opacity: 0.7 }}
                    />
                    <span className="absolute top-1.5 left-1.5 text-[14px] font-mono leading-none select-none" style={{ color: current.accentColor }}>⌜</span>
                    <span className="absolute top-1.5 right-1.5 text-[14px] font-mono leading-none select-none" style={{ color: current.accentColor }}>⌝</span>
                    <span className="absolute bottom-1.5 left-1.5 text-[14px] font-mono leading-none select-none" style={{ color: current.accentColor }}>⌞</span>
                    <span className="absolute bottom-1.5 right-1.5 text-[14px] font-mono leading-none select-none" style={{ color: current.accentColor }}>⌟</span>
                  </>
                )}

                {/* Botanical Wreath Rim */}
                {current.borderOrnament === 'botanical' && (
                  <>
                    <div 
                      className="absolute inset-2 border pointer-events-none rounded-xs"
                      style={{ borderColor: current.accentColor, opacity: 0.5 }}
                    />
                    <span className="absolute top-1.5 left-1.5 text-[11px] select-none" style={{ color: current.accentColor }}>🌿</span>
                    <span className="absolute top-1.5 right-1.5 text-[11px] select-none" style={{ color: current.accentColor }}>🌿</span>
                    <span className="absolute bottom-1.5 left-1.5 text-[11px] select-none" style={{ color: current.accentColor }}>🌿</span>
                    <span className="absolute bottom-1.5 right-1.5 text-[11px] select-none" style={{ color: current.accentColor }}>🌿</span>
                  </>
                )}

                {/* Minimalist Razor Hairline */}
                {current.borderOrnament === 'hairline' && (
                  <div 
                    className="absolute inset-2 border pointer-events-none rounded-xs"
                    style={{ borderColor: current.accentColor, opacity: 0.5 }}
                  />
                )}

                {/* Top Monogram Inscription */}
                <div className="text-center pb-3 pt-1 w-full relative z-10">
                  <p 
                    className="text-base tracking-[0.2em] font-light leading-snug uppercase transition-all"
                    style={{ 
                      color: current.textColor,
                      fontFamily: current.fontFamily === 'mono' 
                        ? 'var(--font-mono, "Courier New", Courier, monospace)' 
                        : current.fontFamily === 'sans' 
                        ? 'var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif)' 
                        : current.fontFamily === 'script'
                        ? '"Cormorant Garamond", "Playfair Display", Georgia, serif'
                        : 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
                      fontStyle: current.fontFamily === 'script' ? 'italic' : 'normal',
                      fontWeight: current.fontFamily === 'mono' ? '600' : 'normal',
                    }}
                  >
                    {current.monogramText}
                  </p>
                  <p 
                    className="text-[8px] uppercase tracking-[0.2em] mt-0.5 opacity-80 transition-all"
                    style={{ 
                      color: current.accentColor,
                      fontFamily: current.fontFamily === 'mono' 
                        ? 'var(--font-mono, "Courier New", Courier, monospace)' 
                        : current.fontFamily === 'sans' 
                        ? 'var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif)' 
                        : 'var(--font-mono, "Courier New", Courier, monospace)',
                    }}
                  >
                    {current.dateText}
                  </p>
                </div>

                {/* Photo Frames Section */}
                {current.stripLayout === 'filmstrip' || (current.borderOrnament === 'sprockets' && current.stripLayout !== 'grid2x2' && current.stripLayout !== 'polaroid' && current.stripLayout !== 'duo') ? (
                  <div 
                    className="w-full flex items-stretch gap-2 my-1 relative rounded-xl border shadow-inner transition-colors duration-300"
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
                          className="w-2.5 h-3.5 rounded-[2px] shadow-2xs my-1 shrink-0 transition-colors"
                          style={{ 
                            backgroundColor: isLightColor(current.frameColor) ? '#18181b' : '#ffffff',
                            border: isLightColor(current.frameColor) ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)'
                          }}
                        />
                      ))}
                    </div>

                    {/* Center Slots */}
                    <div className="flex-1 space-y-2">
                      {visibleSlots.map((_, pIdx) => (
                        <div 
                          key={pIdx}
                          className="relative overflow-hidden aspect-[4/3] rounded-xs shadow-inner flex flex-col items-center justify-center transition-all border"
                          style={{
                            backgroundColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.08)' : '#090a0f',
                            borderColor: isLightColor(current.frameColor) ? 'rgba(0,0,0,0.15)' : '#000000',
                          }}
                        >
                          <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none">
                            <Camera className="w-4 h-4" style={{ color: current.accentColor }} />
                            <span className="font-mono text-[8px] uppercase tracking-wider font-semibold" style={{ color: current.textColor }}>
                              Photo {pIdx + 1} • {current.stripLayout === 'filmstrip' ? '35mm Film' : 'Photo Frame'}
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
                          className="w-2.5 h-3.5 rounded-[2px] shadow-2xs my-1 shrink-0 transition-colors"
                          style={{ 
                            backgroundColor: isLightColor(current.frameColor) ? '#18181b' : '#ffffff',
                            border: isLightColor(current.frameColor) ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`w-full relative z-10 ${
                    current.stripLayout === 'grid2x3' ? 'grid grid-cols-2 gap-1.5' : current.stripLayout === 'grid2x2' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'
                  }`}>
                    {visibleSlots.map((_, pIdx) => (
                      <div 
                        key={pIdx}
                        className="relative overflow-hidden aspect-[4/3] rounded-xs shadow-inner flex flex-col items-center justify-center transition-all"
                        style={{
                          border: `1.5px dashed ${current.accentColor}55`,
                          backgroundColor: `${current.textColor}08`,
                        }}
                      >
                        <div className="flex flex-col items-center justify-center gap-1 p-1 text-center select-none">
                          <Camera className="w-4 h-4 opacity-70" style={{ color: current.accentColor }} />
                          <span className="font-mono text-[8px] uppercase tracking-wider font-semibold opacity-85" style={{ color: current.textColor }}>
                            Photo {pIdx + 1}
                          </span>
                          <span className="font-mono text-[6px] uppercase tracking-widest opacity-60" style={{ color: current.accentColor }}>
                            {current.stripLayout === 'grid2x3' ? '2×3 Grid' : current.stripLayout === 'grid2x2' ? '2×2 Grid' : 'Photo Frame'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Inscription & Insignia */}
                <div className="pt-4 pb-1 text-center w-full relative z-10 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1 text-xs opacity-75" style={{ color: current.accentColor }}>
                    <span>✦</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em]">MEMORA PHOTO STUDIO</span>
                    <span>✦</span>
                  </div>
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
                  <span>Canvas Frame:</span>
                  <strong className="text-foreground font-medium uppercase">{current.frameColor}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Typography Ink:</span>
                  <strong className="text-foreground font-medium uppercase">{current.textColor}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: POLICIES & QUOTAS */
        <div className="space-y-6 max-w-4xl">
          {/* Tier 1: Free Trial Quotas */}
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h3 className="font-display text-2xl text-foreground font-light">Free Plan Limits</h3>
              </div>
              <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold font-mono">
                Starter Tier
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-muted-foreground mb-1.5 font-medium">
                  Free Photo Limit Per Event
                </label>
                <input
                  type="number"
                  value={globalQuotas.freeMaxPhotos}
                  onChange={(e) => handleUpdateGlobalQuotas({ freeMaxPhotos: parseInt(e.target.value) || 25 })}
                  className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-foreground shadow-2xs"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">Guests can take up to this many photos for free</span>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1.5 font-medium">
                  Mandatory Watermark Text
                </label>
                <input
                  type="text"
                  value={globalQuotas.freeWatermarkText}
                  onChange={(e) => handleUpdateGlobalQuotas({ freeWatermarkText: e.target.value })}
                  className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-foreground shadow-2xs"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">Displayed on downloaded photos during free trials</span>
              </div>
            </div>
          </div>

          {/* Tier 2: Event Pass Privileges */}
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display text-2xl text-foreground font-light">PRO Event Pass (₱1,499)</h3>
              </div>
              <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold font-mono">
                Single Event Pass
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/60 shadow-2xs">
                <div>
                  <span className="text-foreground block font-semibold">Zero Watermarks</span>
                  <span className="text-xs text-muted-foreground">Photos downloaded by guests will have 100% zero watermarks</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Included</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/60 shadow-2xs">
                <div>
                  <span className="text-foreground block font-semibold">All 6 Frame Layouts & 10 Template Designs</span>
                  <span className="text-xs text-muted-foreground">Includes 3-photo strips, 4-photo strips, 2x2 grids, filmstrips, and Polaroid frames</span>
                </div>
                <span className="text-primary font-semibold">Included</span>
              </div>
            </div>
          </div>

          {/* Tier 3: Studio Pro Governance */}
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs ring-1 ring-border/20">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <h3 className="font-display text-2xl text-foreground font-light">Studio Pro (₱4,999/mo)</h3>
              </div>
              <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold font-mono">
                Unlimited Events
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/60 shadow-2xs">
                <div>
                  <span className="text-foreground block font-semibold">Custom White-Label Branding</span>
                  <span className="text-xs text-muted-foreground">Organizers can use their own logo, branding, and studio watermark</span>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/60 shadow-2xs">
                <div>
                  <span className="text-foreground block font-semibold">Custom Overlays & CSS</span>
                  <span className="text-xs text-muted-foreground">Full design control for corporate events and private clients</span>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TEMPLATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card border border-border/80 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-medium">
                  Studio Design Engine
                </span>
                <h3 className="font-display text-2xl text-foreground font-light mt-0.5">
                  Create Custom Template & Frame
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTemplateSubmit} className="space-y-5">
              {/* Template Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5 font-medium">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplateForm.name}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                    placeholder="e.g. Monaco Grand Prix Club"
                    className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5 font-medium">
                    Category
                  </label>
                  <select
                    value={newTemplateForm.category}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, category: e.target.value as any })}
                    className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground shadow-2xs font-mono"
                  >
                    <option value="wedding">Weddings & Galas</option>
                    <option value="editorial">Modern Editorial</option>
                    <option value="vintage">Vintage & Darkroom</option>
                    <option value="vip">Metropolitan VIP</option>
                  </select>
                </div>
              </div>

              {/* Frame Layout Architecture */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-2 font-medium">
                  Frame Layout
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STRIP_STYLES.map((style) => {
                    const isSelected = newTemplateForm.layout === style.id;
                    const IconComp = style.icon;

                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setNewTemplateForm({ ...newTemplateForm, layout: style.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-foreground text-background font-medium shadow-xs border-foreground'
                            : 'bg-secondary/35 border-border/70 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-mono truncate">{style.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-secondary/35 border border-border/60 space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground">
                    Canvas Base
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTemplateForm.frameColor}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, frameColor: e.target.value })}
                      className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <span className="text-[11px] font-mono uppercase font-bold text-foreground truncate">
                      {newTemplateForm.frameColor}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/35 border border-border/60 space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground">
                    Typography Ink
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTemplateForm.textColor}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, textColor: e.target.value })}
                      className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <span className="text-[11px] font-mono uppercase font-bold text-foreground truncate">
                      {newTemplateForm.textColor}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/35 border border-border/60 space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-muted-foreground">
                    Accent Foil
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTemplateForm.accentColor}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, accentColor: e.target.value })}
                      className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <span className="text-[11px] font-mono uppercase font-bold text-foreground truncate">
                      {newTemplateForm.accentColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typography Font Family */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5 font-medium">
                  Font Family
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'editorial', label: 'Editorial Serif' },
                    { id: 'sans', label: 'Modern Sans' },
                    { id: 'mono', label: 'Technical Mono' },
                    { id: 'script', label: 'Romantic Script' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setNewTemplateForm({ ...newTemplateForm, fontFamily: f.id as any })}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-mono text-[10px] ${
                        newTemplateForm.fontFamily === f.id
                          ? 'border-foreground bg-foreground text-background font-medium shadow-xs'
                          : 'border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inscription Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1 font-medium">
                    Headline Monogram
                  </label>
                  <input
                    type="text"
                    value={newTemplateForm.monogramText}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, monogramText: e.target.value })}
                    placeholder="e.g. SOPHIA & MATTHEW"
                    className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-foreground shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1 font-medium">
                    Date & Location Stamp
                  </label>
                  <input
                    type="text"
                    value={newTemplateForm.dateText}
                    onChange={(e) => setNewTemplateForm({ ...newTemplateForm, dateText: e.target.value })}
                    placeholder="e.g. OCTOBER 2026 • PARIS"
                    className="w-full bg-secondary/50 border border-border/70 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-foreground shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-border/80 text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold hover:bg-foreground/90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Activate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
