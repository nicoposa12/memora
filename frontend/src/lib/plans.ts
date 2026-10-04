'use client';

import { useState, useEffect, useCallback } from 'react';
import { broadcastRealtime, subscribeRealtime } from './realtime';

export interface PlanFeature {
  id: string;
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanConfig {
  id: 'free' | 'pro' | 'studio';
  name: string;
  eyebrow: string;
  badge: string;
  price: number;
  priceDisplay: string;
  period: string;
  summary: string;
  features: PlanFeature[];
  watermark: boolean; // true = watermark included, false = zero watermark
  maxPhotos: number; // -1 for unlimited
  templatesUnlocked: string; // text summary of template tier
  filtersUnlocked: string; // text summary of filters
  downloads: string; // text summary of download options
  eventCoverage: string; // text summary of event coverage
  allowedTemplateIds?: string[]; // template IDs enabled for this plan
  allowedLayoutIds?: string[]; // strip layout style IDs enabled for this plan
  allowedEventTypes?: string[]; // event types supported/unlocked for this plan
  gifExport?: boolean; // true = animated GIF strip generation & export enabled, false = disabled
}

export const ALL_EVENT_TYPE_IDS = ['school', 'beach', 'party', 'wedding', 'birthday', 'graduation', 'corporate', 'debut', 'other'];

export interface AvailableTemplateOption {
  id: string;
  name: string;
  badge: string;
  layout: string;
  frameColor: string;
  textColor: string;
  description: string;
  category: string;
}

export const ALL_SYSTEM_TEMPLATES: AvailableTemplateOption[] = [
  {
    id: 'classic_filmstrip',
    name: '35mm Noir Filmstrip',
    badge: '35mm Film',
    layout: 'Filmstrip',
    frameColor: '#050505',
    textColor: '#f5f5f7',
    description: 'Authentic 35mm film negative with sprocket perforations and classic black borders',
    category: 'vintage',
  },
  {
    id: 'crimson_romance',
    name: 'Crimson Romance',
    badge: 'Editorial Love',
    layout: 'Duo Diptych',
    frameColor: '#6e0d19',
    textColor: '#ffffff',
    description: 'Deep crimson wine frame with dramatic calligraphy, double pose layout, and date inscription',
    category: 'romance',
  },
  {
    id: 'music_player',
    name: 'Aesthetic Audio Player',
    badge: 'Track 01',
    layout: '3-Photo Strip',
    frameColor: '#121316',
    textColor: '#ffffff',
    description: 'Moody obsidian frame featuring a sleek music player widget with track progress and playback controls',
    category: 'modern',
  },
  {
    id: 'gingham_strawberry',
    name: 'Gingham Sweet Strawberry',
    badge: 'Coquette Cutie',
    layout: '3-Photo Strip',
    frameColor: '#d91b2c',
    textColor: '#ffffff',
    description: 'Red and white picnic gingham border adorned with glossy strawberries, ribbon bow, and cherries',
    category: 'cute',
  },
  {
    id: 'kpop_candy_stripes',
    name: 'Haru Pastel Candy Stripes',
    badge: 'Seoul K-Deco',
    layout: '3-Photo Strip',
    frameColor: '#9fd5f6',
    textColor: '#0369a1',
    description: 'Pastel sky blue candy stripes featuring Korean artist companion cutouts, 사랑해요 dimensional hangul, and retro stickers',
    category: 'kpop',
  },
  {
    id: 'vintage_postcard',
    name: 'Vintage Archival Duo',
    badge: 'Vintage Postcard',
    layout: 'Diagonal Duo',
    frameColor: '#f6efe3',
    textColor: '#2c1e14',
    description: 'Aged museum parchment with warm sepia tones, diagonal staggered dual portraits, fine double border, and vintage archival typography',
    category: 'vintage',
  },
];

export const PRO_EVENT_THEME_TEMPLATES: Record<string, AvailableTemplateOption> = {
  party: {
    id: 'event_party',
    name: 'Pro Event – Party',
    badge: 'PRO Pass',
    layout: '3-Photo Strip',
    frameColor: '#0f1117',
    textColor: '#f4f4f5',
    description: 'Party celebration with disco ball, balloons, party poppers, and neon soundwave equalizer',
    category: 'party_event',
  },
  wedding: {
    id: 'event_wedding',
    name: 'Pro Event – Wedding',
    badge: 'PRO Pass',
    layout: '4-Pose Strip',
    frameColor: '#fcf8f4',
    textColor: '#1f1b18',
    description: 'Botanical ivory frame with golden rings, bouquet, hearts, and floral flourishes',
    category: 'wedding_event',
  },
  birthday: {
    id: 'event_birthday',
    name: 'Pro Event – Birthday',
    badge: 'PRO Pass',
    layout: '3-Photo Strip',
    frameColor: '#fffdf9',
    textColor: '#18181b',
    description: 'Festive celebration with birthday cake, balloons, sparkles, and bunting banner',
    category: 'birthday_event',
  },
  school: {
    id: 'event_school',
    name: 'Pro Event – School',
    badge: 'PRO Pass',
    layout: '4-Pose Strip',
    frameColor: '#0a1424',
    textColor: '#f6eedb',
    description: 'Campus navy with gold academic diploma borders, student badges, and stationery accents',
    category: 'school_event',
  },
  beach: {
    id: 'event_beach',
    name: 'Pro Event – Beach',
    badge: 'PRO Pass',
    layout: '3-Photo Strip',
    frameColor: '#f0f9ff',
    textColor: '#0f172a',
    description: 'Sun-drenched coastal frame with palm leaves, seashells, ocean waves, and starfish',
    category: 'beach_event',
  },
  corporate: {
    id: 'event_corporate',
    name: 'Pro Event – Corporate',
    badge: 'PRO Pass',
    layout: '4-Pose Strip',
    frameColor: '#f8fafc',
    textColor: '#0f172a',
    description: 'Executive modern frame with skyline footer, trophy cup, and skyscraper accents',
    category: 'corporate_event',
  },
  graduation: {
    id: 'event_graduation',
    name: 'Pro Event – Graduation',
    badge: 'PRO Pass',
    layout: '4-Pose Strip',
    frameColor: '#0a1128',
    textColor: '#fcf8ef',
    description: 'Midnight navy frame with gilded graduation caps, diploma footer, and honor trophy',
    category: 'graduation_event',
  },
  debut: {
    id: 'event_debut',
    name: 'Pro Event – Debut',
    badge: 'PRO Pass',
    layout: '4-Pose Strip',
    frameColor: '#fff5f7',
    textColor: '#831843',
    description: 'Grand 18th debutante celebration with rose florals, tiara crowns, and champagne accents',
    category: 'debut_event',
  },
  other: {
    id: 'event_party',
    name: 'Pro Event – Celebration',
    badge: 'PRO Pass',
    layout: '3-Photo Strip',
    frameColor: '#0f1117',
    textColor: '#f4f4f5',
    description: 'Universal celebration strip with sparkling lights, disco ball, and festive accents',
    category: 'party_event',
  },
};

export const ALL_PRO_EVENT_TEMPLATES = Object.values(PRO_EVENT_THEME_TEMPLATES);
export const ALL_PRO_EVENT_TEMPLATE_IDS = ALL_PRO_EVENT_TEMPLATES.map((t) => t.id);

export const ALL_TEMPLATE_IDS = ALL_SYSTEM_TEMPLATES.map((t) => t.id);

export interface AvailableLayoutOption {
  id: string;
  name: string;
  label: string;
  badge: string;
  poses: string;
  slots: number;
  description: string;
}

export const ALL_STRIP_LAYOUTS: AvailableLayoutOption[] = [
  {
    id: 'strip4',
    name: 'Signature 4-Pose Strip',
    label: '4-Pose Vertical',
    badge: 'Studio Signature',
    poses: '4 Poses',
    slots: 4,
    description: 'Classic vertical photobooth strip with 4 sequential shots and custom typography.',
  },
  {
    id: 'strip3',
    name: 'Classic 3-Photo Strip',
    label: '3-Photo Vertical',
    badge: 'Vintage Standard',
    poses: '3 Poses',
    slots: 3,
    description: 'Timeless 3-frame layout with balanced spacing and centered event text.',
  },
  {
    id: 'grid2x2',
    name: '2x2 Quad Grid Collage',
    label: '2x2 Quad Grid',
    badge: 'Postcard Chic',
    poses: '4 Poses',
    slots: 4,
    description: 'Square collage layout with a 2x2 photo grid and centered text or logo.',
  },
  {
    id: 'grid2x3',
    name: '2x3 Hexa Grid Collage',
    label: '2x3 Grid',
    badge: 'Six-Frame Chic',
    poses: '6 Poses',
    slots: 6,
    description: 'Two-column, three-row photo grid layout with 6 sequential frames, perfect for group shots and multi-shot series.',
  },
  {
    id: 'filmstrip',
    name: '35mm Analog Filmstrip',
    label: '35mm Filmstrip',
    badge: 'Film Negative',
    poses: '3 Poses',
    slots: 3,
    description: 'Continuous sprocket perforations along both borders with authentic 35mm film negative styling.',
  },
  {
    id: 'polaroid',
    name: 'Single Photo (Polaroid)',
    label: 'Single',
    badge: 'Instant Single',
    poses: '1 Pose',
    slots: 1,
    description: 'Classic single-photo Polaroid proportions with a wide bottom margin for date stamps or custom text.',
  },
  {
    id: 'duo',
    name: 'Minimalist Duo Diptych',
    label: 'Minimalist Duo',
    badge: 'Modern Editorial',
    poses: '2 Poses',
    slots: 2,
    description: 'Two vertical portraits with clean margins and minimalist typography.',
  },
  {
    id: 'diagonal_duo',
    name: 'Vintage Diagonal Duo',
    label: 'Diagonal Duo',
    badge: 'Archival Postcard',
    poses: '2 Poses',
    slots: 2,
    description: 'Diagonal staggered dual photo composition with vintage postal markings and editorial space.',
  },
];

export const ALL_LAYOUT_IDS = ALL_STRIP_LAYOUTS.map(l => l.id);

export function getTemplateNativeLayoutId(layoutStr?: string, templateId?: string): string {
  if (templateId) {
    const directMap: Record<string, string> = {
      event_party: 'strip3',
      event_wedding: 'strip4',
      event_birthday: 'strip3',
      event_school: 'strip4',
      event_beach: 'strip3',
      event_corporate: 'strip4',
      event_graduation: 'strip4',
      event_debut: 'strip4',
      classic_filmstrip: 'filmstrip',
      crimson_romance: 'duo',
      music_player: 'strip3',
      gingham_strawberry: 'strip3',
      kpop_candy_stripes: 'strip3',
      vintage_postcard: 'diagonal_duo',
      marais_darkroom: 'filmstrip',
      marais_analog: 'filmstrip',
      vogue_met: 'grid2x2',
      soho_loft: 'grid2x2',
      soho_cyber: 'grid2x2',
      ritz_gala: 'strip4',
      amalfi_wedding: 'strip4',
      versailles_baroque: 'strip4',
      versailles_gold: 'strip4',
      yearbook_alumni: 'strip4',
      rose_romance: 'strip3',
      rose_velvet: 'strip3',
      ivy_collegiate: 'strip3',
      monaco_grandprix: 'duo',
      monaco_emerald: 'duo',
      kyoto_wabi: 'duo',
      kyoto_gallery: 'duo',
      hamptons_linen: 'polaroid',
    };
    if (directMap[templateId]) return directMap[templateId];
  }
  if (!layoutStr) return 'strip3';
  const l = layoutStr.toLowerCase();
  if (l.includes('diagonal') || l.includes('staggered')) return 'diagonal_duo';
  if (l.includes('film')) return 'filmstrip';
  if (l.includes('2x3') || l.includes('6-photo')) return 'grid2x3';
  if (l.includes('2x2') || l.includes('grid')) return 'grid2x2';
  if (l.includes('polaroid') || l.includes('single')) return 'polaroid';
  if (l.includes('duo')) return 'duo';
  if (l.includes('3-photo') || l.includes('3-strip')) return 'strip3';
  if (l.includes('4-pose') || l.includes('4-strip')) return 'strip4';
  return 'strip3';
}

export function isLayoutUnlocked(plan: PlanConfig | undefined, layoutId: string): boolean {
  if (!plan) return false;
  const allowed = plan.allowedLayoutIds;
  if (!allowed || allowed.length === 0) {
    if (plan.id === 'pro' || plan.id === 'studio') return true;
    return layoutId === 'strip3' || layoutId === 'filmstrip';
  }
  if (allowed.includes('*') || allowed.includes('all') || allowed.includes(layoutId)) {
    return true;
  }
  if ((layoutId === 'grid4' || layoutId === 'grid2x2') && (allowed.includes('grid4') || allowed.includes('grid2x2'))) return true;
  if ((layoutId === 'single' || layoutId === 'polaroid') && (allowed.includes('single') || allowed.includes('polaroid'))) return true;

  return false;
}

export function isTemplateUnlocked(plan: PlanConfig | undefined, templateId: string): boolean {
  if (!plan) return false;
  const allowed = plan.allowedTemplateIds;
  if (!allowed || allowed.length === 0) {
    if (plan.id === 'pro' || plan.id === 'studio') return true;
    return ALL_TEMPLATE_IDS.includes(templateId);
  }

  if (allowed.includes('*') || allowed.includes('all') || allowed.includes(templateId)) {
    return true;
  }

  if ((plan.id === 'pro' || plan.id === 'studio') && templateId.startsWith('event_')) {
    return true;
  }

  // Cross-alias mapping between admin and dashboard preset identifiers
  const aliasMap: Record<string, string[]> = {
    marais_analog: ['marais_darkroom'],
    marais_darkroom: ['marais_analog'],
    versailles_gold: ['versailles_baroque'],
    versailles_baroque: ['versailles_gold'],
    soho_cyber: ['soho_loft'],
    soho_loft: ['soho_cyber'],
    rose_velvet: ['rose_romance'],
    rose_romance: ['rose_velvet'],
    monaco_emerald: ['monaco_grandprix'],
    monaco_grandprix: ['monaco_emerald'],
    kyoto_gallery: ['kyoto_wabi'],
    kyoto_wabi: ['kyoto_gallery'],
  };

  const aliases = aliasMap[templateId] || [];
  return aliases.some(alias => allowed.includes(alias));
}

export function isGifExportAllowed(plan: PlanConfig | undefined | null): boolean {
  if (!plan) return true;
  return plan.gifExport !== false;
}

export function isEventTypeUnlocked(plan: PlanConfig | undefined | null, eventType: string): boolean {
  if (!plan) return true;
  if (Array.isArray(plan.allowedEventTypes)) {
    return (
      plan.allowedEventTypes.includes('*') ||
      plan.allowedEventTypes.includes('all') ||
      plan.allowedEventTypes.includes(eventType)
    );
  }
  // Default fallback if not yet set
  if (plan.id === 'pro' || plan.id === 'studio') return true;
  return eventType === 'party' || eventType === 'birthday';
}

export const DEFAULT_PLANS: Record<'free' | 'pro' | 'studio', PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Account',
    eyebrow: 'FREE ACCOUNT',
    badge: 'WORKSPACE PREVIEW',
    price: 0,
    priceDisplay: '₱0',
    period: 'workspace preview',
    summary: 'Explore templates, configure booth settings, and preview layouts',
    watermark: true,
    maxPhotos: 0,
    templatesUnlocked: '5 Studio Templates Included',
    filtersUnlocked: 'Classic Filters Preview',
    downloads: 'Preview Only',
    eventCoverage: 'Paid Plan Required to Host Events',
    allowedTemplateIds: ALL_TEMPLATE_IDS,
    allowedLayoutIds: ALL_LAYOUT_IDS,
    allowedEventTypes: ['other'],
    gifExport: true,
    features: [
      { id: 'f1', text: 'Full workspace & dashboard access', included: true },
      { id: 'f2', text: 'All 7 strip layouts included for preview', included: true },
      { id: 'f_tpl', text: '5 curated studio templates preview', included: true },
      { id: 'f_hardware', text: 'Camera hardware & countdown testing', included: true },
      { id: 'f3', text: '3 vintage & monochrome filters', included: true },
      { id: 'f4', text: 'Event hosting requires PRO or STUDIO plan', included: false, highlight: true },
    ],
  },
  pro: {
    id: 'pro',
    name: 'PRO Pass',
    eyebrow: 'EVENT PASS',
    badge: 'MOST POPULAR',
    price: 1499,
    priceDisplay: '₱1,499',
    period: 'per event · 1 month access',
    summary: 'Full event pass with exclusive PRO event templates, zero watermark, and 1-month active access',
    watermark: false,
    maxPhotos: -1,
    templatesUnlocked: 'All Templates & Layouts Unlocked',
    filtersUnlocked: 'Premium Filters & Frames',
    downloads: 'Event gallery & HD downloads',
    eventCoverage: 'Full coverage for School, Beach, Party, Wedding, Birthday, Graduation & Corporate',
    allowedTemplateIds: [...ALL_TEMPLATE_IDS, ...ALL_PRO_EVENT_TEMPLATE_IDS],
    allowedLayoutIds: ALL_LAYOUT_IDS,
    allowedEventTypes: ALL_EVENT_TYPE_IDS,
    gifExport: true,
    features: [
      { id: 'p1', text: 'Unlimited photos for 1 full event', included: true, highlight: true },
      { id: 'p_validity', text: '1-month active event access & live gallery countdown', included: true, highlight: true },
      { id: 'p_events', text: 'Exclusive PRO event templates: Party, Wedding, Birthday, School & more', included: true, highlight: true },
      { id: 'p2', text: 'All 7 strip layouts & 5 designer templates included', included: true, highlight: true },
      { id: 'p_gif', text: 'Animated Strip GIF generation & export', included: true, highlight: true },
      { id: 'p3', text: 'Zero watermark & custom event header', included: true, highlight: true },
      { id: 'p4', text: 'Premium filters & live countdowns', included: true },
      { id: 'p5', text: 'Full live event gallery & HD guest downloads', included: true },
    ],
  },
  studio: {
    id: 'studio',
    name: 'STUDIO Monthly',
    eyebrow: 'WORKSPACE SUBSCRIPTION',
    badge: 'UNLIMITED',
    price: 4999,
    priceDisplay: '₱4,999',
    period: 'per month · all events included',
    summary: 'Complete platform access for photobooth businesses & event planners',
    watermark: false,
    maxPhotos: -1,
    templatesUnlocked: 'All Templates & Layouts Unlocked',
    filtersUnlocked: 'All Filters & Custom Themes',
    downloads: 'Full High-Resolution Archive & Bulk ZIP',
    eventCoverage: 'Unlimited events across School, Beach, Party, Wedding, Birthday, Graduation & Corporate',
    allowedTemplateIds: [...ALL_TEMPLATE_IDS, ...ALL_PRO_EVENT_TEMPLATE_IDS],
    allowedLayoutIds: ALL_LAYOUT_IDS,
    allowedEventTypes: ALL_EVENT_TYPE_IDS,
    gifExport: true,
    features: [
      { id: 's1', text: 'Unlimited events covered concurrently', included: true, highlight: true },
      { id: 's_events', text: 'Unlimited coverage across School, Beach, Party, Wedding, Birthday, Graduation & Corporate', included: true, highlight: true },
      { id: 's2', text: 'All PRO event templates & 5 designer templates', included: true, highlight: true },
      { id: 's_gif', text: 'Animated Strip GIF generation & export', included: true, highlight: true },
      { id: 's3', text: 'Custom studio branding & zero watermark', included: true, highlight: true },
      { id: 's4', text: 'Multi-organizer team access & export analytics', included: true },
      { id: 's5', text: 'Retention grace period protection', included: true },
    ],
  },
};

const PLANS_STORAGE_KEY = 'memora_plans_config';

export function getStoredPlans(): Record<'free' | 'pro' | 'studio', PlanConfig> {
  if (typeof window === 'undefined') return DEFAULT_PLANS;
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) return DEFAULT_PLANS;
    const parsed = JSON.parse(raw);

    // Merge features safely while ensuring the 1-month validity bullet is included for pro
    let proFeatures = Array.isArray(parsed.pro?.features) ? parsed.pro.features : DEFAULT_PLANS.pro.features;
    if (!proFeatures.some((f: PlanFeature) => f.id === 'p_validity')) {
      proFeatures = [
        proFeatures[0] || DEFAULT_PLANS.pro.features[0],
        DEFAULT_PLANS.pro.features[1],
        ...proFeatures.slice(1),
      ];
    }

    return {
      free: { 
        ...DEFAULT_PLANS.free, 
        ...(parsed.free || {}),
        features: Array.isArray(parsed.free?.features) ? parsed.free.features : DEFAULT_PLANS.free.features,
        allowedTemplateIds: Array.isArray(parsed.free?.allowedTemplateIds) ? parsed.free.allowedTemplateIds : DEFAULT_PLANS.free.allowedTemplateIds,
        allowedLayoutIds: Array.isArray(parsed.free?.allowedLayoutIds) ? parsed.free.allowedLayoutIds : DEFAULT_PLANS.free.allowedLayoutIds,
        allowedEventTypes: Array.isArray(parsed.free?.allowedEventTypes) ? parsed.free.allowedEventTypes : DEFAULT_PLANS.free.allowedEventTypes,
        gifExport: typeof parsed.free?.gifExport === 'boolean' ? parsed.free.gifExport : DEFAULT_PLANS.free.gifExport,
      },
      pro: { 
        ...DEFAULT_PLANS.pro, 
        ...(parsed.pro || {}),
        period: (!parsed.pro?.period || parsed.pro.period.includes('no subscription')) 
          ? DEFAULT_PLANS.pro.period 
          : parsed.pro.period,
        features: proFeatures,
        allowedTemplateIds: Array.isArray(parsed.pro?.allowedTemplateIds) ? parsed.pro.allowedTemplateIds : DEFAULT_PLANS.pro.allowedTemplateIds,
        allowedLayoutIds: Array.isArray(parsed.pro?.allowedLayoutIds) ? parsed.pro.allowedLayoutIds : DEFAULT_PLANS.pro.allowedLayoutIds,
        allowedEventTypes: Array.isArray(parsed.pro?.allowedEventTypes) ? parsed.pro.allowedEventTypes : DEFAULT_PLANS.pro.allowedEventTypes,
        gifExport: typeof parsed.pro?.gifExport === 'boolean' ? parsed.pro.gifExport : DEFAULT_PLANS.pro.gifExport,
      },
      studio: { 
        ...DEFAULT_PLANS.studio, 
        ...(parsed.studio || {}),
        features: Array.isArray(parsed.studio?.features) ? parsed.studio.features : DEFAULT_PLANS.studio.features,
        allowedTemplateIds: Array.isArray(parsed.studio?.allowedTemplateIds) ? parsed.studio.allowedTemplateIds : DEFAULT_PLANS.studio.allowedTemplateIds,
        allowedLayoutIds: Array.isArray(parsed.studio?.allowedLayoutIds) ? parsed.studio.allowedLayoutIds : DEFAULT_PLANS.studio.allowedLayoutIds,
        allowedEventTypes: Array.isArray(parsed.studio?.allowedEventTypes) ? parsed.studio.allowedEventTypes : DEFAULT_PLANS.studio.allowedEventTypes,
        gifExport: typeof parsed.studio?.gifExport === 'boolean' ? parsed.studio.gifExport : DEFAULT_PLANS.studio.gifExport,
      },
    };
  } catch {
    return DEFAULT_PLANS;
  }
}

export function saveStoredPlans(plans: Record<'free' | 'pro' | 'studio', PlanConfig>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    window.dispatchEvent(new CustomEvent('memora:plans_updated', { detail: plans }));
    broadcastRealtime('PLANS_UPDATED', plans);
  } catch (e) {
    console.error('Error saving plans:', e);
  }

  // Persist to server API to keep Chrome, Edge, mobile, and guest browsers synchronized
  try {
    fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plans),
    }).catch(() => {});
  } catch {}
}

export function resetStoredPlans(): Record<'free' | 'pro' | 'studio', PlanConfig> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(PLANS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('memora:plans_updated', { detail: DEFAULT_PLANS }));
      broadcastRealtime('PLANS_UPDATED', DEFAULT_PLANS);
      fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DEFAULT_PLANS),
      }).catch(() => {});
    } catch {}
  }
  return DEFAULT_PLANS;
}

export function usePlans() {
  const [plans, setPlans] = useState<Record<'free' | 'pro' | 'studio', PlanConfig>>(DEFAULT_PLANS);
  const [isLoaded, setIsLoaded] = useState(false);

  const reloadPlans = useCallback(async () => {
    const local = getStoredPlans();
    setPlans(local);
    setIsLoaded(true);

    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.plans) {
          setPlans(data.plans);
          try {
            localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(data.plans));
          } catch {}
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    reloadPlans();

    const handleLocalUpdate = (eventOrMsg?: any) => {
      try {
        const incoming = eventOrMsg?.detail || eventOrMsg?.payload;
        if (incoming && typeof incoming === 'object' && incoming.free && incoming.pro && incoming.studio) {
          setPlans(incoming);
          setIsLoaded(true);
          return;
        }
      } catch {}
      reloadPlans();
    };

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === PLANS_STORAGE_KEY || e.key === 'memora_realtime_sync') {
        reloadPlans();
      }
    };

    const onFocus = () => reloadPlans();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') reloadPlans();
    };

    window.addEventListener('memora:plans_updated', handleLocalUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const unsub = subscribeRealtime('PLANS_UPDATED', handleLocalUpdate);

    return () => {
      window.removeEventListener('memora:plans_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      unsub();
    };
  }, [reloadPlans]);

  const updatePlan = (planId: 'free' | 'pro' | 'studio', updated: Partial<PlanConfig>) => {
    const current = getStoredPlans();
    const next = {
      ...current,
      [planId]: {
        ...current[planId],
        ...updated,
      },
    };
    saveStoredPlans(next);
    setPlans(next);
  };

  const updateAllPlans = (nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig>) => {
    saveStoredPlans(nextPlans);
    setPlans(nextPlans);
  };

  const resetAllPlans = () => {
    const reset = resetStoredPlans();
    setPlans(reset);
  };

  return {
    plans,
    isLoaded,
    updatePlan,
    updateAllPlans,
    resetAllPlans,
    reloadPlans,
  };
}
