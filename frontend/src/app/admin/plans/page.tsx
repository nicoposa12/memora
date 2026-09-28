'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Check, 
  Eye, 
  Layers, 
  DollarSign, 
  Settings2,
  Lock,
  Unlock,
  Sliders,
  ExternalLink,
  Layout,
  Search,
  Columns,
  Grid2X2,
  LayoutGrid,
  Film,
  Square,
  Maximize2,
  Camera,
  Image as ImageIcon,
  Calendar,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { 
  usePlans, 
  PlanConfig, 
  PlanFeature, 
  DEFAULT_PLANS, 
  ALL_SYSTEM_TEMPLATES, 
  AvailableTemplateOption, 
  isTemplateUnlocked,
  ALL_STRIP_LAYOUTS,
  AvailableLayoutOption,
  isLayoutUnlocked,
  ALL_EVENT_TYPE_IDS,
  isEventTypeUnlocked,
} from '@/lib/plans';
import { EVENT_TYPES_LIST, getEventEmoji, getEventLabel, getEventBareLabel } from '@/types';
import { useModal } from '@/context/ModalContext';
import { RealtimeStatusBadge } from '@/context/RealtimeContext';
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
  GiftBoxIcon,
  PartyFaceIcon,
  CelebrationGlassesIcon,
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

const isLightColor = (hex: string) => {
  if (!hex) return false;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

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
    slots: ['PHOTO 1', 'PHOTO 2', 'PHOTO 3', 'PHOTO 4'],
  },
  wedding: {
    bg: '#fcf8f4',
    textColor: '#1f1b18',
    accentColor: '#b8860b',
    borderColor: 'rgba(184, 134, 11, 0.4)',
    slotBg: 'rgba(184, 134, 11, 0.05)',
    slotBorder: 'rgba(184, 134, 11, 0.25)',
    title: 'Forever Begins',
    subtitle: 'Two hearts • One beautiful journey',
    slots: ['CEREMONY', 'COCKTAILS', 'FIRST DANCE', 'AFTER PARTY'],
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
    slots: ['PARTY VIBES', 'MAKE A WISH', 'CAKE TIME', 'SQUAD'],
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
    slots: ['KEYNOTE', 'TEAM SYNERGY', 'NETWORKING', 'SUMMIT'],
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
    slots: ['MOMENT 01', 'MOMENT 02', 'MOMENT 03', 'MOMENT 04'],
  },
  gala: {
    bg: '#090a0f',
    textColor: '#fdfaf3',
    accentColor: '#e5c05b',
    borderColor: 'rgba(229, 192, 91, 0.5)',
    slotBg: 'rgba(229, 192, 91, 0.06)',
    slotBorder: 'rgba(229, 192, 91, 0.3)',
    title: 'Black Tie Charity Gala',
    subtitle: 'Grand Ballroom • Evening of Elegance',
    slots: ['RED CARPET', 'CHAMPAGNE', 'AWARDS', 'AFTER-PARTY'],
  },
  festival: {
    bg: '#140c1e',
    textColor: '#faf5ff',
    accentColor: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.5)',
    slotBg: 'rgba(168, 85, 247, 0.08)',
    slotBorder: 'rgba(168, 85, 247, 0.3)',
    title: 'Live Music & Arts Festival',
    subtitle: 'Main Stage • Summer Festival Tour',
    slots: ['MAIN STAGE', 'HEADLINER', 'FESTIVAL CROWD', 'ENCORE'],
  },
};

export default function AdminPlansPage() {
  const { plans, isLoaded, updateAllPlans, resetAllPlans } = usePlans();
  const { confirm: confirmModal, alert: alertModal } = useModal();

  const [activePlanId, setActivePlanId] = useState<'free' | 'pro' | 'studio'>('free');
  const [draftPlans, setDraftPlans] = useState<Record<'free' | 'pro' | 'studio', PlanConfig>>(plans);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'idle'>('idle');
  const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newFeatureHighlight, setNewFeatureHighlight] = useState(false);
  const [allTemplates, setAllTemplates] = useState<AvailableTemplateOption[]>(ALL_SYSTEM_TEMPLATES);
  const [matrixTab, setMatrixTab] = useState<'templates' | 'events'>('templates');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateFilterTab, setTemplateFilterTab] = useState<'all' | 'included' | 'locked'>('all');
  const [eventSearch, setEventSearch] = useState('');
  const [eventFilterTab, setEventFilterTab] = useState<'all' | 'included' | 'locked'>('all');
  const [previewEventType, setPreviewEventType] = useState<string>('wedding');

  // Interactive Live Strip & Template Preview state
  const [previewMode, setPreviewMode] = useState<'template' | 'event'>('template');
  const [previewTemplateId, setPreviewTemplateId] = useState<string>('classic_filmstrip');
  const [previewLayoutId, setPreviewLayoutId] = useState<string>('filmstrip');
  const [mainTab, setMainTab] = useState<'details' | 'matrix' | 'preview'>('details');

  // Load active tab and plan from localStorage if previously chosen
  useEffect(() => {
    try {
      const storedTab = localStorage.getItem('memora_admin_plans_active_plan');
      if (storedTab === 'free' || storedTab === 'pro' || storedTab === 'studio') {
        setActivePlanId(storedTab);
      }
      const storedMainTab = localStorage.getItem('memora_admin_plans_main_tab');
      if (storedMainTab === 'details' || storedMainTab === 'matrix' || storedMainTab === 'preview') {
        setMainTab(storedMainTab);
      }
    } catch {}
  }, []);

  const handleSelectMainTab = (tab: 'details' | 'matrix' | 'preview') => {
    setMainTab(tab);
    try {
      localStorage.setItem('memora_admin_plans_main_tab', tab);
    } catch {}
  };

  const handleSelectPlan = (id: 'free' | 'pro' | 'studio') => {
    setActivePlanId(id);
    const targetPlan = draftPlans[id];
    if (targetPlan) {
      const unlockedTemplates = allTemplates.filter((t) => isTemplateUnlocked(targetPlan, t.id));
      if (unlockedTemplates.length > 0 && !isTemplateUnlocked(targetPlan, previewTemplateId)) {
        setPreviewTemplateId(unlockedTemplates[0].id);
      }
      const unlockedLayouts = ALL_STRIP_LAYOUTS.filter((l) => isLayoutUnlocked(targetPlan, l.id));
      if (unlockedLayouts.length > 0 && !isLayoutUnlocked(targetPlan, previewLayoutId)) {
        setPreviewLayoutId(unlockedLayouts[0].id);
      }
    }
    try {
      localStorage.setItem('memora_admin_plans_active_plan', id);
    } catch {}
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_admin_templates');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const systemIds = new Set(ALL_SYSTEM_TEMPLATES.map((t) => t.id));
          const customTemplates: AvailableTemplateOption[] = parsed
            .filter((p: any) => !systemIds.has(p.id))
            .map((p: any) => ({
              id: p.id,
              name: p.name || 'Custom Template',
              badge: p.badge || 'Custom',
              layout: p.layout || 'Vertical Strip',
              frameColor: p.frameColor || '#050505',
              textColor: p.textColor || '#ffffff',
              description: p.subtitle || 'Custom photobooth strip template',
              category: p.category || 'custom',
            }));
          setAllTemplates([...ALL_SYSTEM_TEMPLATES, ...customTemplates]);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setDraftPlans(plans);
    }
  }, [isLoaded, plans]);

  const activePlan = draftPlans[activePlanId];

  // Instantly persist changes to localStorage and broadcast via realtime
  const applyAndPersistPlans = (nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig>) => {
    setDraftPlans(nextPlans);
    updateAllPlans(nextPlans);
    setSaveStatus('saved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('idle');
    }, 2500);
  };

  const handleFieldChange = (field: keyof PlanConfig, value: any) => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        [field]: value,
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleFeatureTextChange = (featId: string, newText: string) => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        features: draftPlans[activePlanId].features.map((f) =>
          f.id === featId ? { ...f, text: newText } : f
        ),
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleToggleHighlight = (featId: string) => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        features: draftPlans[activePlanId].features.map((f) =>
          f.id === featId ? { ...f, highlight: !f.highlight } : f
        ),
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleDeleteFeature = (featId: string) => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        features: draftPlans[activePlanId].features.filter((f) => f.id !== featId),
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;

    const newFeat: PlanFeature = {
      id: `feat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: newFeatureText.trim(),
      included: true,
      highlight: newFeatureHighlight,
    };

    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        features: [...draftPlans[activePlanId].features, newFeat],
      },
    };

    setNewFeatureText('');
    setNewFeatureHighlight(false);
    applyAndPersistPlans(nextPlans);
  };

  const handleToggleTemplate = (templateId: string) => {
    let currentAllowed = activePlan.allowedTemplateIds;
    if (!currentAllowed || currentAllowed.length === 0) {
      currentAllowed = activePlanId === 'free' 
        ? ['classic_filmstrip', 'vogue_met'] 
        : allTemplates.map((t) => t.id);
    } else if (currentAllowed.includes('*') || currentAllowed.includes('all')) {
      currentAllowed = allTemplates.map((t) => t.id);
    }

    const isIncluded = isTemplateUnlocked(activePlan, templateId);
    let nextAllowed: string[];

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

    if (isIncluded) {
      const toRemove = new Set([templateId, ...(aliasMap[templateId] || [])]);
      nextAllowed = currentAllowed.filter((id) => !toRemove.has(id));
      if (toRemove.has(previewTemplateId)) {
        const remaining = allTemplates.find((t) => !toRemove.has(t.id) && nextAllowed.includes(t.id));
        if (remaining) {
          setPreviewTemplateId(remaining.id);
        }
      }
    } else {
      nextAllowed = [...currentAllowed, templateId];
      setPreviewTemplateId(templateId);
      const foundTpl = allTemplates.find((t) => t.id === templateId);
      if (foundTpl?.layout) {
        const l = foundTpl.layout.toLowerCase();
        if (l.includes('film') && isLayoutUnlocked(activePlan, 'filmstrip')) setPreviewLayoutId('filmstrip');
        else if ((l.includes('2x3') || l.includes('6-photo')) && isLayoutUnlocked(activePlan, 'grid2x3')) setPreviewLayoutId('grid2x3');
        else if ((l.includes('2x2') || l.includes('grid')) && isLayoutUnlocked(activePlan, 'grid2x2')) setPreviewLayoutId('grid2x2');
        else if (l.includes('polaroid') && isLayoutUnlocked(activePlan, 'polaroid')) setPreviewLayoutId('polaroid');
        else if (l.includes('duo') && isLayoutUnlocked(activePlan, 'duo')) setPreviewLayoutId('duo');
        else if (l.includes('3-photo') && isLayoutUnlocked(activePlan, 'strip3')) setPreviewLayoutId('strip3');
        else if (l.includes('4-pose') && isLayoutUnlocked(activePlan, 'strip4')) setPreviewLayoutId('strip4');
      }
    }

    const testPlan: PlanConfig = {
      ...activePlan,
      allowedTemplateIds: nextAllowed,
    };
    const unlockedCount = allTemplates.filter((t) => isTemplateUnlocked(testPlan, t.id)).length;

    const summaryText = unlockedCount === allTemplates.length 
      ? 'All Templates Included' 
      : unlockedCount === 0
      ? '0 Templates Included'
      : `${unlockedCount} Template${unlockedCount === 1 ? '' : 's'} Included`;

    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedTemplateIds: nextAllowed,
        templatesUnlocked: summaryText,
      },
    };

    applyAndPersistPlans(nextPlans);
  };

  const handleSelectAllTemplates = () => {
    const allIds = allTemplates.map((t) => t.id);
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedTemplateIds: allIds,
        templatesUnlocked: 'All Templates Included',
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleClearAllTemplates = () => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedTemplateIds: [],
        templatesUnlocked: '0 Templates Included',
      },
    };
    applyAndPersistPlans(nextPlans);
  };



  const handleToggleEventType = (eventTypeId: string) => {
    let currentAllowed = activePlan.allowedEventTypes;
    if (!currentAllowed) {
      currentAllowed = activePlanId === 'free' ? ['other'] : ALL_EVENT_TYPE_IDS;
    } else if (currentAllowed.includes('*') || currentAllowed.includes('all')) {
      currentAllowed = ALL_EVENT_TYPE_IDS;
    }

    const isIncluded = isEventTypeUnlocked(activePlan, eventTypeId);
    let nextAllowed: string[];

    if (isIncluded) {
      nextAllowed = currentAllowed.filter((id) => id !== eventTypeId);
    } else {
      nextAllowed = [...currentAllowed, eventTypeId];
      setPreviewEventType(eventTypeId);
      setPreviewMode('event');
    }

    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedEventTypes: nextAllowed,
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleSelectAllEventTypes = () => {
    const allIds = ALL_EVENT_TYPE_IDS;
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedEventTypes: allIds,
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const handleClearAllEventTypes = () => {
    const nextPlans: Record<'free' | 'pro' | 'studio', PlanConfig> = {
      ...draftPlans,
      [activePlanId]: {
        ...draftPlans[activePlanId],
        allowedEventTypes: [],
      },
    };
    applyAndPersistPlans(nextPlans);
  };

  const getLayoutIcon = (id: string) => {
    switch (id) {
      case 'strip4': return Columns;
      case 'strip3': return Columns;
      case 'grid2x2': return Grid2X2;
      case 'grid2x3': return LayoutGrid;
      case 'filmstrip': return Film;
      case 'polaroid': return Square;
      case 'duo': return Maximize2;
      default: return Columns;
    }
  };

  const handleSave = async () => {
    updateAllPlans(draftPlans);
    setSaveStatus('saved');
    await alertModal({
      title: 'Plan Features Updated',
      description: 'Your plan changes, prices, and feature matrix have been saved and broadcast to all pages in real time.',
      variant: 'success',
      eyebrow: 'CONFIGURATION SAVED',
    });
  };

  const handleResetDefaults = async () => {
    const ok = await confirmModal({
      title: 'Reset to System Defaults?',
      description: 'This will restore the standard features, watermarks, template tiers, and pricing for Free, PRO, and STUDIO plans.',
      confirmText: 'Restore Defaults',
      cancelText: 'Keep Current',
      variant: 'warning',
      eyebrow: 'RESET CONFIRMATION',
    });

    if (ok) {
      resetAllPlans();
      setDraftPlans(DEFAULT_PLANS);
      setSaveStatus('saved');
      await alertModal({
        title: 'Defaults Restored',
        description: 'All 3 plans have been reset to system recommended specifications.',
        variant: 'info',
        eyebrow: 'SYSTEM NOTICE',
      });
    }
  };

  if (!isLoaded || !activePlan) {
    return (
      <div className="p-8 sm:p-12 text-center text-muted-foreground font-mono text-xs animate-pulse">
        Loading plan configuration matrix...
      </div>
    );
  }

  const renderPlanTierSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {(['free', 'pro', 'studio'] as const).map((id) => {
        const p = draftPlans[id];
        const isSelected = activePlanId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelectPlan(id)}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden shadow-xs ring-1 ${
              isSelected
                ? 'bg-card border-primary ring-primary/30 shadow-md'
                : 'bg-card/60 border-border/70 ring-border/20 hover:border-foreground/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                {p.eyebrow}
              </span>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-medium ${
                id === 'pro'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-secondary text-muted-foreground border border-border/60'
              }`}>
                {p.badge}
              </span>
            </div>
            <h3 className="font-display text-2xl text-foreground font-light flex items-center gap-2">
              {p.name}
            </h3>
            <p className="text-xs text-primary font-mono mt-0.5 font-medium">
              {p.priceDisplay} • {p.period}
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
              <span>
                {mainTab === 'matrix'
                  ? `${allTemplates.filter(t => isTemplateUnlocked(p, t.id)).length} Templates • ${EVENT_TYPES_LIST.filter(e => isEventTypeUnlocked(p, e.id)).length} Event Types`
                  : `${p.features.length} Features Configured`
                }
              </span>
              <span className={p.watermark ? 'text-amber-500 font-medium' : 'text-emerald-500 font-medium'}>
                {p.watermark ? 'Watermark On' : 'Zero Watermark'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-primary font-semibold">
              Admin Configuration
            </span>
            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60 font-medium">
              Realtime Sync
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-foreground tracking-tight mt-1">
            Plans & Feature Matrix
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light max-w-2xl">
            Manage features, watermark rules, template access, and pricing for Free Trial, PRO Pass, and STUDIO Monthly. Updates apply immediately across Organizer Billing and Templates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <RealtimeStatusBadge />
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-full border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Section Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/50 dark:bg-card/60 border border-border/70 shadow-2xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectMainTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              mainTab === 'details'
                ? 'bg-card text-primary font-semibold shadow-xs border border-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${mainTab === 'details' ? 'text-primary' : 'text-muted-foreground/70'}`} />
            <span>Plan Details & Features</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMainTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              mainTab === 'matrix'
                ? 'bg-card text-primary font-semibold shadow-xs border border-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${mainTab === 'matrix' ? 'text-primary' : 'text-muted-foreground/70'}`} />
            <span>Templates & Events</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
              mainTab === 'matrix'
                ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                : 'bg-secondary text-muted-foreground border border-border/60 font-medium'
            }`}>
              {allTemplates.filter(t => isTemplateUnlocked(activePlan, t.id)).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMainTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              mainTab === 'preview'
                ? 'bg-card text-primary font-semibold shadow-xs border border-primary/25'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${mainTab === 'preview' ? 'text-primary' : 'text-muted-foreground/70'}`} />
            <span>Customer Portal Preview</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>Configuring:</span>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 uppercase text-[10px]">
            {activePlan.name} • {activePlan.priceDisplay}
          </span>
        </div>
      </div>

      {/* TAB 1: Plan Details & Features */}
      {mainTab === 'details' && (
        <div className="space-y-6">
          {renderPlanTierSelector()}

          {/* Plan Details & Features Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Plan Properties & Capabilities (5 cols) */}
        <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold block">
                  Plan Metadata
                </span>
                <h2 className="font-display text-xl font-light text-foreground">
                  Editing: {activePlan.name}
                </h2>
              </div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full uppercase">
              ID: {activePlan.id}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                Plan Display Name
              </label>
              <input
                type="text"
                value={activePlan.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground text-xs font-medium outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={activePlan.eyebrow}
                  onChange={(e) => handleFieldChange('eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                  Badge Pill
                </label>
                <input
                  type="text"
                  value={activePlan.badge}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                  Price Display String
                </label>
                <input
                  type="text"
                  value={activePlan.priceDisplay}
                  onChange={(e) => handleFieldChange('priceDisplay', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs font-mono font-medium outline-hidden"
                  placeholder="₱0"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                  Numeric Price (PHP)
                </label>
                <input
                  type="number"
                  value={activePlan.price}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs font-mono outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                  Billing Cadence / Validity Period
                </label>
                {activePlan.id === 'pro' && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>1 Month Expiration</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={activePlan.period}
                onChange={(e) => handleFieldChange('period', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs outline-hidden"
                placeholder="per event · 1 month access"
              />
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none">
                {activePlan.id === 'pro' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('period', 'per event · 1 month access')}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                    >
                      per event · 1 month access
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('period', '30-day validity · per event')}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                    >
                      30-day validity · per event
                    </button>
                  </>
                ) : activePlan.id === 'studio' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('period', 'per month · all events included')}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                    >
                      per month · all events included
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('period', 'monthly workspace subscription')}
                      className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                    >
                      monthly workspace subscription
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('period', 'single event · free trial')}
                    className="px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-[10px] font-mono text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
                  >
                    single event · free trial
                  </button>
                )}
              </div>
            </div>

            {activePlan.id === 'pro' && (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Clock className="w-3.5 h-3.5" />
                  <span>1-Month (30 Days) Pass Validity</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Every PRO Event Pass includes a 30-day active validity window. Organizers and administrators can track real-time countdown badges, renewal status, and expiration in Manage Users.
                </p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                Plan Summary Tagline
              </label>
              <textarea
                rows={2}
                value={activePlan.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs outline-hidden resize-none"
              />
            </div>

            <div className="pt-4 border-t border-border/60 space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                Tier Capabilities & Constraints
              </span>

              {/* Watermark Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 border border-border/70">
                <div className="flex items-center gap-2.5">
                  {activePlan.watermark ? (
                    <Lock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-500" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-foreground">Watermark Enforcement</p>
                    <p className="text-[10px] text-muted-foreground font-light">
                      {activePlan.watermark ? 'Photos include Memora watermark' : 'Zero watermark on output'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('watermark', !activePlan.watermark)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    activePlan.watermark
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {activePlan.watermark ? 'Watermarked' : 'No Watermark'}
                </button>
              </div>

              {/* Animated Strip GIF Generation Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 border border-border/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Animated Strip GIF Generation</p>
                    <p className="text-[10px] text-muted-foreground font-light">
                      {activePlan.gifExport !== false
                        ? 'Guests can export animated photobooth strip GIFs in this plan'
                        : 'GIF export disabled; only static PNG strips permitted'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('gifExport', activePlan.gifExport === false ? true : false)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    activePlan.gifExport !== false
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                  }`}
                >
                  {activePlan.gifExport !== false ? 'GIF Enabled' : 'GIF Disabled'}
                </button>
              </div>

              {/* Photos Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Max Photos (-1 for Unlimited)
                  </label>
                  <input
                    type="number"
                    value={activePlan.maxPhotos}
                    onChange={(e) => handleFieldChange('maxPhotos', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Template Access
                  </label>
                  <input
                    type="text"
                    value={activePlan.templatesUnlocked}
                    onChange={(e) => handleFieldChange('templatesUnlocked', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manage Features List (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold block">
                  Feature Bullets
                </span>
                <h2 className="font-display text-xl font-light text-foreground">
                  Features List ({activePlan.features.length})
                </h2>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-light">
              Appears in billing cards, checkout & template previews
            </p>
          </div>

          {/* Current Features List */}
          <div className="space-y-2.5">
            {activePlan.features.map((feature, idx) => (
              <div
                key={feature.id}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/50 border border-border/70 hover:border-foreground/20 transition-all group"
              >
                <span className="w-6 text-center font-mono text-[10px] text-muted-foreground shrink-0 font-medium">
                  {idx + 1}.
                </span>
                
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => handleFeatureTextChange(feature.id, e.target.value)}
                  className="flex-1 bg-transparent border-0 text-xs text-foreground focus:ring-0 outline-hidden font-light"
                />

                <button
                  type="button"
                  title="Toggle highlight accent"
                  onClick={() => handleToggleHighlight(feature.id)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    feature.highlight
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-background/80 text-muted-foreground hover:text-foreground border border-border/60'
                  }`}
                >
                  {feature.highlight ? 'Highlighted' : 'Normal'}
                </button>

                <button
                  type="button"
                  title="Remove feature"
                  onClick={() => handleDeleteFeature(feature.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {activePlan.features.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 text-muted-foreground text-xs font-light">
                No features added to this plan yet. Use the form below to add bullets.
              </div>
            )}
          </div>

          {/* Add New Feature Form */}
          <form onSubmit={handleAddFeature} className="pt-4 border-t border-border/60 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
              + Add New Bullet Feature
            </span>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="e.g. 100 high-resolution print exports"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-xs outline-hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewFeatureHighlight(!newFeatureHighlight)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                    newFeatureHighlight
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium'
                      : 'bg-secondary text-muted-foreground border-border/60'
                  }`}
                >
                  {newFeatureHighlight ? '★ Accent' : 'Standard'}
                </button>
                <button
                  type="submit"
                  disabled={!newFeatureText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}

      {/* TAB 2: Template Access & Photo Strip Layout Matrix Section */}
      {mainTab === 'matrix' && (
        <div className="space-y-6">
          {renderPlanTierSelector()}

          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
                  Templates & Event Types
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[10px] font-mono text-foreground font-semibold bg-secondary px-2.5 py-0.5 rounded-full">
                  {activePlan.name} Tier
                </span>
              </div>
              <h2 className="font-display text-2xl font-light text-foreground mt-0.5">
                Template Access & Event Types
              </h2>
            </div>
          </div>

          {/* Subtab Switcher: Templates vs Event Types */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-secondary/50 dark:bg-card/60 border border-border/70 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMatrixTab('templates');
                setPreviewMode('template');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                matrixTab === 'templates'
                  ? 'bg-card text-primary font-semibold shadow-xs border border-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
              }`}
            >
              <Layout className={`w-3.5 h-3.5 ${matrixTab === 'templates' ? 'text-primary' : 'text-muted-foreground/70'}`} />
              <span>Templates</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                matrixTab === 'templates'
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'bg-secondary text-muted-foreground border border-border/60'
              }`}>
                {allTemplates.filter(t => isTemplateUnlocked(activePlan, t.id)).length}/{allTemplates.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMatrixTab('events');
                setPreviewMode('event');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                matrixTab === 'events'
                  ? 'bg-card text-primary font-semibold shadow-xs border border-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${matrixTab === 'events' ? 'text-primary' : 'text-muted-foreground/70'}`} />
              <span>Event Types</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                matrixTab === 'events'
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'bg-secondary text-muted-foreground border border-border/60'
              }`}>
                {EVENT_TYPES_LIST.filter(e => isEventTypeUnlocked(activePlan, e.id)).length}/{EVENT_TYPES_LIST.length}
              </span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Configurator List (Left 7 cols) + Live Photorealistic Strip Preview (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Matrix List */}
          <div className="lg:col-span-7 space-y-5">
            {matrixTab === 'templates' ? (
              /* TAB 1: TEMPLATES */
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full pl-9 pr-3 py-1.5 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary font-mono shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
                      {(['all', 'included', 'locked'] as const).map((tab) => {
                        const activeCount = allTemplates.filter(t => isTemplateUnlocked(activePlan, t.id)).length;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setTemplateFilterTab(tab)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer capitalize ${
                              templateFilterTab === tab
                                ? 'bg-foreground text-background font-semibold shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab === 'all' ? `All (${allTemplates.length})` : tab === 'included' ? `Included (${activeCount})` : `Locked (${allTemplates.length - activeCount})`}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSelectAllTemplates}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-mono uppercase tracking-wider text-foreground hover:text-primary transition-all cursor-pointer shadow-2xs font-medium"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllTemplates}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
                  {allTemplates
                    .filter((t) => {
                      const isIncluded = isTemplateUnlocked(activePlan, t.id);
                      if (templateFilterTab === 'included' && !isIncluded) return false;
                      if (templateFilterTab === 'locked' && isIncluded) return false;
                      if (templateSearch.trim()) {
                        const q = templateSearch.toLowerCase();
                        return t.name.toLowerCase().includes(q) || t.badge.toLowerCase().includes(q) || t.layout.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map((tpl) => {
                      const isIncluded = isTemplateUnlocked(activePlan, tpl.id);
                      const isPreviewing = previewTemplateId === tpl.id && previewMode === 'template';

                      return (
                        <div
                          key={tpl.id}
                          onClick={() => handleToggleTemplate(tpl.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative group select-none shadow-2xs ${
                            isPreviewing
                              ? 'ring-2 ring-primary border-primary bg-primary/[0.04]'
                              : isIncluded
                              ? 'bg-secondary/40 border-border/80 hover:border-foreground/30'
                              : 'bg-card border-border/60 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border border-black/20 shadow-xs shrink-0"
                                style={{ backgroundColor: tpl.frameColor }}
                              />
                              <div>
                                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block leading-tight">
                                  {tpl.name}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {tpl.badge} • {tpl.layout}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              title={isIncluded ? `Remove ${tpl.name} from ${activePlan.name}` : `Include ${tpl.name} in ${activePlan.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTemplate(tpl.id);
                              }}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                isIncluded 
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-border/80 bg-background text-transparent hover:border-primary/50'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          <p className="text-[11px] text-muted-foreground font-light line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>

                          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono">
                            {isIncluded ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewTemplateId(tpl.id);
                                  setPreviewMode('template');
                                }}
                                className={`flex items-center gap-1 font-semibold cursor-pointer ${
                                  isPreviewing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                <Eye className="w-3 h-3" />
                                <span>{isPreviewing ? 'Previewing' : 'Preview'}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTemplate(tpl.id);
                                }}
                                className="flex items-center gap-1 text-muted-foreground hover:text-primary font-medium cursor-pointer"
                                title={`Include ${tpl.name} in ${activePlan.name} to preview`}
                              >
                                <span>+ Include to Preview</span>
                              </button>
                            )}

                            <span className={`px-2 py-0.5 rounded-full font-semibold ${
                              isIncluded
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-secondary text-muted-foreground border border-border/60'
                            }`}>
                              {isIncluded ? 'Included' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* TAB 2: EVENT TYPES */
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Search event types..."
                      className="w-full pl-9 pr-3 py-1.5 bg-secondary/50 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary font-mono shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
                      {(['all', 'included', 'locked'] as const).map((tab) => {
                        const activeCount = EVENT_TYPES_LIST.filter((e) => isEventTypeUnlocked(activePlan, e.id)).length;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setEventFilterTab(tab)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer capitalize ${
                              eventFilterTab === tab
                                ? 'bg-foreground text-background font-semibold shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab === 'all'
                              ? `All (${EVENT_TYPES_LIST.length})`
                              : tab === 'included'
                              ? `Included (${activeCount})`
                              : `Locked (${EVENT_TYPES_LIST.length - activeCount})`}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSelectAllEventTypes}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-mono uppercase tracking-wider text-foreground hover:text-primary transition-all cursor-pointer shadow-2xs font-medium"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllEventTypes}
                        className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Event Types Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
                  {EVENT_TYPES_LIST.filter((evt) => {
                    const isIncluded = isEventTypeUnlocked(activePlan, evt.id);
                    if (eventFilterTab === 'included' && !isIncluded) return false;
                    if (eventFilterTab === 'locked' && isIncluded) return false;
                    if (eventSearch.trim()) {
                      const q = eventSearch.toLowerCase();
                      return (
                        evt.label.toLowerCase().includes(q) ||
                        evt.id.toLowerCase().includes(q) ||
                        evt.description.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  }).map((evt) => {
                    const isIncluded = isEventTypeUnlocked(activePlan, evt.id);
                    const isPreviewing = previewEventType === evt.id && previewMode === 'event';

                    return (
                      <div
                        key={evt.id}
                        onClick={() => handleToggleEventType(evt.id)}
                        className={`bg-card border rounded-2xl p-4.5 transition-all cursor-pointer space-y-3 relative group ${
                          isPreviewing
                            ? 'ring-2 ring-primary border-primary shadow-sm'
                            : isIncluded
                            ? 'border-emerald-500/40 hover:border-emerald-500/80 shadow-2xs'
                            : 'border-border/70 hover:border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center text-xl shrink-0 border border-border/60">
                              <span>{evt.emoji}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-display text-sm font-normal text-foreground">
                                  {evt.label}
                                </h4>
                                {evt.tier === 'pro_studio' ? (
                                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-semibold">
                                    PRO & STUDIO
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-secondary text-muted-foreground border border-border/60 font-semibold">
                                    ALL PLANS
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                ID: {evt.id}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            title={isIncluded ? `Remove ${evt.label} from ${activePlan.name}` : `Include ${evt.label} in ${activePlan.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEventType(evt.id);
                            }}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              isIncluded
                                ? 'bg-primary border-primary text-primary-foreground'
                                : 'border-border/80 bg-background text-transparent hover:border-primary/50'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono">
                          {isIncluded ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewEventType(evt.id);
                                setPreviewMode('event');
                              }}
                              className={`flex items-center gap-1 font-semibold cursor-pointer ${
                                isPreviewing ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{isPreviewing ? 'Previewing Theme' : 'Preview Theme'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleEventType(evt.id);
                              }}
                              className="flex items-center gap-1 text-muted-foreground hover:text-primary font-medium cursor-pointer"
                              title={`Include ${evt.label} in ${activePlan.name}`}
                            >
                              <span>+ Include in Plan</span>
                            </button>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold ${
                              isIncluded
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-secondary text-muted-foreground border border-border/60'
                            }`}
                          >
                            {isIncluded ? `Included in ${activePlan.name}` : `Locked in ${activePlan.name}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Live Strip & Layout Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            {(() => {
              const unlockedPreviewTemplates = allTemplates.filter((t) => isTemplateUnlocked(activePlan, t.id));
              const unlockedPreviewLayouts = ALL_STRIP_LAYOUTS.filter((l) => isLayoutUnlocked(activePlan, l.id));

              const currentPreviewTemplate =
                unlockedPreviewTemplates.find((t) => t.id === previewTemplateId) ||
                unlockedPreviewTemplates[0] ||
                null;

              const currentPreviewLayout =
                ALL_STRIP_LAYOUTS.find((l) => l.id === previewLayoutId) ||
                ALL_STRIP_LAYOUTS[0];

              if (!currentPreviewTemplate) {
                return (
                  <div className="bg-card border border-border/80 rounded-3xl p-8 shadow-xs text-center space-y-4 ring-1 ring-border/20">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display text-base font-medium text-foreground">
                        No Frame Templates Active
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        To display a live strip preview for {activePlan.name}, enable at least one frame template from the options on the left.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllTemplates}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-medium cursor-pointer"
                      >
                        Enable All Templates
                      </button>
                    </div>
                  </div>
                );
              }

              const currentEventPalette = EVENT_TYPE_PALETTES[previewEventType] || EVENT_TYPE_PALETTES.school;

              const isSchoolTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'school' || currentPreviewTemplate.id === 'ivy_collegiate' || currentPreviewTemplate.id === 'yearbook_alumni')
                : (previewEventType === 'school');

              const isBeachTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'beach' || currentPreviewTemplate.id?.includes('beach'))
                : (previewEventType === 'beach');

              const isPartyTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'party' || currentPreviewTemplate.id?.includes('party') || currentPreviewTemplate.id === 'nightclub')
                : (previewEventType === 'party');

              const isWeddingTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'wedding' || currentPreviewTemplate.id?.includes('wedding') || currentPreviewTemplate.id === 'amalfi_wedding' || currentPreviewTemplate.id === 'versailles_baroque' || currentPreviewTemplate.id === 'rose_romance' || currentPreviewTemplate.id === 'hamptons_linen')
                : (previewEventType === 'wedding');

              const isBirthdayTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'birthday' || currentPreviewTemplate.id?.includes('birthday'))
                : (previewEventType === 'birthday');

              const isCorporateTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'corporate' || currentPreviewTemplate.id?.includes('corporate'))
                : (previewEventType === 'corporate');

              const isGraduationTheme = previewMode === 'template'
                ? (currentPreviewTemplate.category === 'graduation' || currentPreviewTemplate.id?.includes('graduation'))
                : (previewEventType === 'graduation');

              const isLight = previewMode === 'template'
                ? isLightColor(currentPreviewTemplate.frameColor)
                : isLightColor(currentEventPalette.bg);

              const isSchoolLight = isSchoolTheme
                ? (previewMode === 'template' ? (currentPreviewTemplate.id === 'yearbook_alumni' || isLight) : true)
                : isLight;

              const schoolPalette = {
                bg: isSchoolLight ? '#fdfaf3' : '#091424',
                textPrimary: isSchoolLight ? '#0c1a30' : '#fcf8ef',
                textSecondary: isSchoolLight ? '#855d10' : '#e5c05b',
                accentGold: isSchoolLight ? '#a37519' : '#e5c05b',
                borderGold: isSchoolLight ? 'rgba(133, 93, 16, 0.45)' : 'rgba(212, 175, 55, 0.45)',
                outerBorder: isSchoolLight ? '2.5px solid #855d10' : '2.5px solid rgba(212, 175, 55, 0.85)',
                outerShadow: isSchoolLight
                  ? '0 0 0 2px rgba(12, 26, 48, 0.9), 0 0 0 4px rgba(133, 93, 16, 0.25)'
                  : '0 0 0 2px rgba(9, 20, 36, 0.95), 0 0 0 4px rgba(212, 175, 55, 0.35)',
                slotBg: isSchoolLight ? '#f5eee0' : 'rgba(212, 175, 55, 0.05)',
                slotBorder: isSchoolLight ? '1.5px solid rgba(133, 93, 16, 0.4)' : '1.5px solid rgba(212, 175, 55, 0.45)',
                pillBg: isSchoolLight ? '#0c1a30' : 'rgba(212, 175, 55, 0.18)',
                pillText: '#fcf8ef',
                pillBorder: isSchoolLight ? '1px solid #855d10' : '1px solid rgba(212, 175, 55, 0.5)',
              };

              const stripBg = isSchoolTheme
                ? schoolPalette.bg
                : previewMode === 'template'
                ? currentPreviewTemplate.frameColor
                : currentEventPalette.bg;

              const stripTextColor = isSchoolTheme
                ? schoolPalette.textPrimary
                : previewMode === 'template'
                ? currentPreviewTemplate.textColor
                : currentEventPalette.textColor;

              const stripBorder = isSchoolTheme
                ? schoolPalette.outerBorder
                : previewMode === 'template'
                ? `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'}`
                : `2px solid ${currentEventPalette.borderColor}`;

              // Select photos count
              let visibleCount = 4;
              if (currentPreviewLayout.id === 'grid2x3') visibleCount = 6;
              else if (currentPreviewLayout.id === 'strip3' || currentPreviewLayout.id === 'filmstrip') visibleCount = 3;
              else if (currentPreviewLayout.id === 'duo') visibleCount = 2;
              else if (currentPreviewLayout.id === 'polaroid') visibleCount = 1;
              const photoSlots = Array.from({ length: visibleCount });

              return (
                <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-xs space-y-4 ring-1 ring-border/20">
                  {/* Preview Top Meta with Mode Switcher */}
                  {/* Preview Top Meta */}
                  <div className="flex items-center justify-between gap-2.5 border-b border-border/60 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
                          Live Photo Strip Preview
                        </span>
                      </div>
                      <h4 className="font-display text-base font-light text-foreground mt-0.5">
                        {previewMode === 'template' ? currentPreviewTemplate.name : `${getEventEmoji(previewEventType)} ${currentEventPalette.title}`}
                      </h4>
                    </div>
                  </div>

                  {/* 1. Included Frames Quick Switcher (Active for Templates) */}
                  {previewMode === 'template' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted-foreground uppercase tracking-wider font-medium">
                          Included Frames ({unlockedPreviewTemplates.length}):
                        </span>
                        <span className="text-primary font-semibold truncate max-w-[170px]">
                          {currentPreviewTemplate.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {unlockedPreviewTemplates.map((tpl) => {
                          const isSelected = currentPreviewTemplate.id === tpl.id;
                          return (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => setPreviewTemplateId(tpl.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                                  : 'bg-secondary/50 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: tpl.frameColor }}
                              />
                              <span>{tpl.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Photo Strip Layouts Dropdown Selector */}
                  <div className="p-2.5 rounded-xl bg-secondary/35 border border-border/60 space-y-1.5 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Columns className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-foreground font-medium uppercase tracking-wider">Strip Layout</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 text-[9px]">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>Included in PRO Pass</span>
                      </span>
                    </div>

                    <div className="relative">
                      <select
                        id="strip-layout-select"
                        value={previewLayoutId}
                        onChange={(e) => setPreviewLayoutId(e.target.value)}
                        className="w-full appearance-none bg-card hover:bg-card/90 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-xl px-3 py-2 pr-9 text-xs font-mono text-foreground font-medium transition-all cursor-pointer shadow-2xs outline-none"
                      >
                        {ALL_STRIP_LAYOUTS.map((layout) => (
                          <option key={layout.id} value={layout.id} className="bg-popover text-popover-foreground py-1.5">
                            {layout.name} — {layout.poses} ({layout.badge})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* 3. Event Type Theme Quick Switcher (Active for Event Types) */}
                  {previewMode === 'event' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted-foreground uppercase tracking-wider font-medium">
                          Event Inscription ({EVENT_TYPES_LIST.length}):
                        </span>
                        <span className="text-primary font-semibold flex items-center gap-1">
                          <span>{getEventEmoji(previewEventType)}</span>
                          <span>{getEventBareLabel(previewEventType)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {EVENT_TYPES_LIST.map((evt) => {
                          const isSelected = previewEventType === evt.id;
                          const isUnlocked = isEventTypeUnlocked(activePlan, evt.id);
                          return (
                            <button
                              key={evt.id}
                              type="button"
                              onClick={() => setPreviewEventType(evt.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-2xs'
                                  : 'bg-secondary/50 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              <span>{evt.emoji}</span>
                              <span>{evt.label}</span>
                              {!isUnlocked && <Lock className="w-2.5 h-2.5 opacity-60 text-amber-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Status Indicator Pill */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border/60 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-foreground font-medium">
                        Active for {activePlan.name} • {unlockedPreviewTemplates.length} Frame{unlockedPreviewTemplates.length === 1 ? '' : 's'} & {unlockedPreviewLayouts.length} Format{unlockedPreviewLayouts.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <span className="text-muted-foreground text-[9px]">
                      {previewMode === 'template' ? 'Template Preview' : 'Event Type Preview'}
                    </span>
                  </div>

                  {/* Photobooth Strip Canvas Container */}
                  <div className="bg-[#101217]/5 dark:bg-black/30 rounded-2xl p-4 sm:p-6 flex items-center justify-center border border-border/50 overflow-hidden">
                    <div
                      className="w-60 max-w-full rounded-xl transition-all shadow-2xl relative p-3.5 flex flex-col items-center justify-between overflow-visible"
                      style={{
                        backgroundColor: isPartyTheme ? '#0f1117' : isWeddingTheme ? '#fcf8f4' : isBirthdayTheme ? '#fffdf9' : isCorporateTheme ? '#f8fafc' : isGraduationTheme ? '#0a1128' : stripBg,
                        color: isPartyTheme ? '#f4f4f5' : isWeddingTheme ? '#1f1b18' : isBirthdayTheme ? '#18181b' : isCorporateTheme ? '#0f172a' : isGraduationTheme ? '#fcf8ef' : stripTextColor,
                        border: isPartyTheme ? '2px solid rgba(236, 72, 153, 0.65)' : isWeddingTheme ? '2px solid rgba(184, 134, 11, 0.45)' : isBirthdayTheme ? '2px solid rgba(245, 158, 11, 0.5)' : isCorporateTheme ? '2px solid rgba(37, 99, 235, 0.45)' : isGraduationTheme ? '2px solid rgba(212, 175, 55, 0.65)' : stripBorder,
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
                      {/* Header Inscription */}
                      {isSchoolTheme ? (
                        <div className="w-full text-center pb-2 pt-1 border-b mb-2" style={{ borderColor: schoolPalette.borderGold }}>
                          <div className="flex items-center justify-center gap-1.5 text-[7.5px] font-mono uppercase tracking-[0.25em]" style={{ color: schoolPalette.textSecondary }}>
                            <span>★</span>
                            <span>GOOD DAYS • GREAT MEMORIES</span>
                            <span>★</span>
                          </div>
                          <h4 className="font-serif text-xs font-bold tracking-wider uppercase mt-1" style={{ color: schoolPalette.textPrimary }}>
                            OUR SCHOOL ERA
                          </h4>
                          <div className="flex items-center justify-center gap-2 mt-1 opacity-90">
                            <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                            <span className="text-[7px] font-mono tracking-widest uppercase font-semibold" style={{ color: schoolPalette.textSecondary }}>
                              SCHOOL YEAR 2026–2027
                            </span>
                            <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                          </div>
                        </div>
                      ) : previewMode === 'template' ? (
                        /* Pure Template Header: Bespoke Branding, ZERO Event Type emojis */
                        <div className="w-full text-center pb-2 pt-1 border-b mb-2" style={{ borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                          <div className="flex items-center justify-center gap-1 text-[8px] font-mono uppercase tracking-[0.25em] opacity-80">
                            <span>✦</span>
                            <span>{currentPreviewTemplate.badge?.toUpperCase() || 'MEMORA PHOTO STUDIO'}</span>
                            <span>✦</span>
                          </div>
                          <p className="font-display text-xs tracking-wide mt-0.5 font-medium" style={{ color: currentPreviewTemplate.textColor }}>
                            {currentPreviewTemplate.name}
                          </p>
                          <p className="text-[7px] font-mono tracking-wider opacity-70 mt-0.5" style={{ color: currentPreviewTemplate.textColor }}>
                            {currentPreviewTemplate.layout} • Studio Edition
                          </p>
                        </div>
                      ) : (
                        /* Pure Event Type Header: Event Theme, ZERO Curated Template Branding */
                        <div className="w-full text-center pb-2 pt-1 border-b mb-2 relative" style={{ borderColor: isPartyTheme ? 'rgba(236, 72, 153, 0.5)' : isWeddingTheme ? 'rgba(184, 134, 11, 0.35)' : isBirthdayTheme ? 'rgba(245, 158, 11, 0.4)' : currentEventPalette.borderColor }}>
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
                          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold" style={{ color: isPartyTheme ? '#ec4899' : isWeddingTheme ? '#b8860b' : isBirthdayTheme ? '#d97706' : isCorporateTheme ? '#2563eb' : isGraduationTheme ? '#d4af37' : currentEventPalette.accentColor }}>
                            {isPartyTheme ? (
                              <span>PARTY NIGHT</span>
                            ) : isWeddingTheme ? (
                              <span>WEDDING CELEBRATION</span>
                            ) : isBirthdayTheme ? (
                              <span>YOUR DAY • YOUR MOMENT</span>
                            ) : isCorporateTheme ? (
                              <span>CORPORATE MOMENTS</span>
                            ) : isGraduationTheme ? (
                              <span>GRADUATION CELEBRATION</span>
                            ) : (
                              <>
                                <span>{currentEventPalette.badgeEmoji || getEventEmoji(previewEventType)}</span>
                                <span>{currentEventPalette.badge ? currentEventPalette.badge.toUpperCase() : `${getEventBareLabel(previewEventType).toUpperCase()} CELEBRATION`}</span>
                                <span>{currentEventPalette.badgeEmoji || getEventEmoji(previewEventType)}</span>
                              </>
                            )}
                          </div>
                          <h4 className={`font-serif ${isBirthdayTheme ? 'text-[10px] tracking-[0.08em]' : isCorporateTheme ? 'text-[9.5px] tracking-[0.06em]' : 'text-xs tracking-[0.2em]'} font-bold uppercase mt-0.5 max-w-[176px] mx-auto`} style={{ color: isPartyTheme ? '#f4f4f5' : isWeddingTheme ? '#1f1b18' : isBirthdayTheme ? '#18181b' : isCorporateTheme ? '#0f172a' : isGraduationTheme ? '#fcf8ef' : currentEventPalette.textColor }}>
                            {currentEventPalette.title}
                          </h4>
                          <p className="text-[6.5px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: isPartyTheme ? '#ec4899' : isWeddingTheme ? '#855d10' : isBirthdayTheme ? '#d97706' : isCorporateTheme ? '#2563eb' : isGraduationTheme ? '#d4af37' : currentEventPalette.accentColor, fontStyle: isWeddingTheme ? 'italic' : undefined }}>
                            {currentEventPalette.subtitle}
                          </p>
                        </div>
                      )}

                      {/* Photo Strip Slots Body */}
                      {currentPreviewLayout.id === 'filmstrip' ? (
                        /* 35mm Analog Filmstrip with Sprocket Perforations */
                        <div className="w-full flex items-stretch gap-1.5 py-1">
                          {/* Left Sprockets */}
                          <div
                            className="flex flex-col justify-between py-1 px-1 rounded-sm shrink-0"
                            style={{
                              backgroundColor: isSchoolTheme
                                ? (isSchoolLight ? 'rgba(133, 93, 16, 0.1)' : 'rgba(212, 175, 55, 0.12)')
                                : previewMode === 'template'
                                ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)')
                                : `${currentEventPalette.accentColor}18`,
                            }}
                          >
                            {[...Array(7)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2.5 rounded-[2px] my-1 shrink-0"
                                style={{
                                  backgroundColor: isSchoolTheme
                                    ? schoolPalette.accentGold
                                    : previewMode === 'template'
                                    ? (isLight ? '#1c1917' : '#ffffff')
                                    : currentEventPalette.accentColor,
                                  border: isSchoolTheme
                                    ? '1px solid ' + schoolPalette.borderGold
                                    : previewMode === 'template'
                                    ? (isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)')
                                    : `1px solid ${currentEventPalette.borderColor}`,
                                  opacity: isSchoolTheme ? 0.9 : 1,
                                }}
                              />
                            ))}
                          </div>

                          {/* Center Slots */}
                          <div className="flex-1 space-y-1.5">
                            {photoSlots.map((_, pIdx) => (
                              <div
                                key={pIdx}
                                className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                                style={{
                                  backgroundColor: isSchoolTheme
                                    ? schoolPalette.slotBg
                                    : previewMode === 'template'
                                    ? (isLight ? 'rgba(0,0,0,0.08)' : '#090a0f')
                                    : currentEventPalette.slotBg,
                                  borderColor: isSchoolTheme
                                    ? schoolPalette.slotBorder
                                    : previewMode === 'template'
                                    ? (isLight ? 'rgba(0,0,0,0.15)' : '#000000')
                                    : currentEventPalette.slotBorder,
                                }}
                              >
                                {isSchoolTheme && (
                                  <>
                                    <span className="absolute top-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                                    <span className="absolute top-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                                    <span className="absolute bottom-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                                    <span className="absolute bottom-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                                  </>
                                )}
                                <div className="flex flex-col items-center justify-center gap-1 p-2 text-center select-none opacity-80">
                                  <Camera className="w-3.5 h-3.5" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }} />
                                  <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                    {isSchoolTheme
                                      ? `Photo ${pIdx + 1}`
                                      : previewMode === 'template'
                                      ? `Photo ${pIdx + 1}`
                                      : currentEventPalette.slots[pIdx % currentEventPalette.slots.length]}
                                  </span>
                                </div>
                                {!isSchoolTheme && (
                                  <span
                                    className="absolute bottom-0.5 right-0.5 text-[5px] font-mono px-1 rounded font-semibold"
                                    style={{
                                      backgroundColor: previewMode === 'template'
                                        ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)')
                                        : `${currentEventPalette.accentColor}18`,
                                      color: stripTextColor,
                                    }}
                                  >
                                    {previewMode === 'template' ? `0${pIdx + 1}A` : `${getEventBareLabel(previewEventType).slice(0, 3).toUpperCase()}-0${pIdx + 1}`}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Right Sprockets */}
                          <div
                            className="flex flex-col justify-between py-1 px-1 rounded-sm shrink-0"
                            style={{
                              backgroundColor: isSchoolTheme
                                ? (isSchoolLight ? 'rgba(133, 93, 16, 0.1)' : 'rgba(212, 175, 55, 0.12)')
                                : previewMode === 'template'
                                ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)')
                                : `${currentEventPalette.accentColor}18`,
                            }}
                          >
                            {[...Array(7)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2.5 rounded-[2px] my-1 shrink-0"
                                style={{
                                  backgroundColor: isSchoolTheme
                                    ? schoolPalette.accentGold
                                    : previewMode === 'template'
                                    ? (isLight ? '#1c1917' : '#ffffff')
                                    : currentEventPalette.accentColor,
                                  border: isSchoolTheme
                                    ? '1px solid ' + schoolPalette.borderGold
                                    : previewMode === 'template'
                                    ? (isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)')
                                    : `1px solid ${currentEventPalette.borderColor}`,
                                  opacity: isSchoolTheme ? 0.9 : 1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : currentPreviewLayout.id === 'grid2x2' ? (
                        /* 2x2 Quad Grid Collage */
                        <div className="w-full grid grid-cols-2 gap-1.5 py-1">
                          {photoSlots.map((_, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                              style={{
                                backgroundColor: isSchoolTheme
                                  ? schoolPalette.slotBg
                                  : previewMode === 'template'
                                  ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')
                                  : currentEventPalette.slotBg,
                                borderColor: isSchoolTheme
                                  ? schoolPalette.slotBorder
                                  : previewMode === 'template'
                                  ? (isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)')
                                  : currentEventPalette.slotBorder,
                              }}
                            >
                              {isSchoolTheme && (
                                <>
                                  <span className="absolute top-0.5 left-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                                  <span className="absolute top-0.5 right-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                                  <span className="absolute bottom-0.5 left-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                                  <span className="absolute bottom-0.5 right-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                                </>
                              )}
                              <div className="flex flex-col items-center justify-center gap-0.5 p-1 select-none opacity-80">
                                <Camera className="w-3 h-3" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }} />
                                <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                  {isSchoolTheme
                                    ? `Photo ${pIdx + 1}`
                                    : previewMode === 'template'
                                    ? `Photo ${pIdx + 1}`
                                    : currentEventPalette.slots[pIdx % currentEventPalette.slots.length]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : currentPreviewLayout.id === 'grid2x3' ? (
                        /* 2x3 Hexa Grid Collage */
                        <div className="w-full grid grid-cols-2 gap-1.5 py-1">
                          {photoSlots.map((_, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                              style={{
                                backgroundColor: isSchoolTheme
                                  ? schoolPalette.slotBg
                                  : previewMode === 'template'
                                  ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')
                                  : currentEventPalette.slotBg,
                                borderColor: isSchoolTheme
                                  ? schoolPalette.slotBorder
                                  : previewMode === 'template'
                                  ? (isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)')
                                  : currentEventPalette.slotBorder,
                              }}
                            >
                              {isSchoolTheme && (
                                <>
                                  <span className="absolute top-0.5 left-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                                  <span className="absolute top-0.5 right-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                                  <span className="absolute bottom-0.5 left-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                                  <span className="absolute bottom-0.5 right-1 text-[6px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                                </>
                              )}
                              <div className="flex flex-col items-center justify-center gap-0.5 p-1 select-none opacity-80">
                                <Camera className="w-3 h-3" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }} />
                                <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                  {isSchoolTheme
                                    ? `Photo ${pIdx + 1}`
                                    : previewMode === 'template'
                                    ? `Photo ${pIdx + 1}`
                                    : currentEventPalette.slots[pIdx % currentEventPalette.slots.length]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : currentPreviewLayout.id === 'polaroid' ? (
                        /* Wide Polaroid Instant */
                        <div className="w-full space-y-2 py-1">
                          <div
                            className="relative overflow-hidden aspect-square rounded-xs flex flex-col items-center justify-center border"
                            style={{
                              backgroundColor: isSchoolTheme
                                ? schoolPalette.slotBg
                                : previewMode === 'template'
                                ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)')
                                : currentEventPalette.slotBg,
                              borderColor: isSchoolTheme
                                ? schoolPalette.slotBorder
                                : previewMode === 'template'
                                ? (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)')
                                : currentEventPalette.slotBorder,
                            }}
                          >
                            {isSchoolTheme && (
                              <>
                                <span className="absolute top-1 left-1.5 text-[8px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                                <span className="absolute top-1 right-1.5 text-[8px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                                <span className="absolute bottom-1 left-1.5 text-[8px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                                <span className="absolute bottom-1 right-1.5 text-[8px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                              </>
                            )}
                            <div className="flex flex-col items-center justify-center gap-1 select-none opacity-80 p-3">
                              <Camera className="w-4 h-4" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }} />
                              <span className="font-mono text-[8px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                {isSchoolTheme ? 'Campus Life Portrait' : previewMode === 'template' ? 'Polaroid Instant Frame' : currentEventPalette.title}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 pb-1 text-center">
                            <span className="font-serif italic text-[9px] tracking-wider opacity-90 font-medium" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }}>
                              {isSchoolTheme
                                ? 'School Year 2026–2027 • Student Days'
                                : previewMode === 'template'
                                ? `${currentPreviewTemplate.name} • 2026`
                                : `${currentEventPalette.title} • 2026`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Vertical Stack: strip4, strip3, duo */
                        <div className="w-full space-y-2 py-1 relative">
                          {/* MADE OF MEMORIES Divider (School Theme) */}
                          {isSchoolTheme && (
                            <div className="flex items-center justify-center gap-1.5 -mb-0.5">
                              <div className="h-px flex-1 opacity-60" style={{ backgroundColor: schoolPalette.borderGold }} />
                              <div
                                className="flex items-center justify-center px-2.5 py-0.5 rounded-full shadow-2xs border"
                                style={{
                                  backgroundColor: isSchoolLight ? '#ffffff' : '#0c182b',
                                  borderColor: schoolPalette.borderGold,
                                }}
                              >
                                <span className="text-[7px] font-mono tracking-widest uppercase font-bold" style={{ color: schoolPalette.textSecondary }}>
                                  MADE OF MEMORIES
                                </span>
                              </div>
                              <div className="h-px flex-1 opacity-60" style={{ backgroundColor: schoolPalette.borderGold }} />
                            </div>
                          )}

                          {photoSlots.map((_, pIdx) => (
                            <React.Fragment key={pIdx}>
                              <div
                                className="relative rounded-xs flex flex-col items-center justify-center border aspect-[4/3] transition-all"
                                style={{
                                  backgroundColor: isSchoolTheme
                                    ? schoolPalette.slotBg
                                    : previewMode === 'template'
                                    ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)')
                                    : currentEventPalette.slotBg,
                                  borderColor: isSchoolTheme
                                    ? schoolPalette.slotBorder
                                    : previewMode === 'template'
                                    ? (isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)')
                                    : currentEventPalette.slotBorder,
                                  boxShadow: isSchoolTheme ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
                                }}
                              >
                                {isSchoolTheme && (
                                  <>
                                    <span className="absolute top-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌜</span>
                                    <span className="absolute top-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌝</span>
                                    <span className="absolute bottom-0.5 left-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌞</span>
                                    <span className="absolute bottom-0.5 right-1 text-[7px] leading-none select-none font-serif" style={{ color: schoolPalette.textSecondary }}>⌟</span>
                                  </>
                                )}
                                <div className="flex flex-col items-center justify-center gap-0.5 p-1 select-none opacity-85">
                                  <Camera className="w-3.5 h-3.5" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : previewMode === 'event' ? currentEventPalette.accentColor : undefined }} />
                                  <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                    {isSchoolTheme
                                      ? `Photo ${pIdx + 1}`
                                      : previewMode === 'template'
                                      ? `Frame ${pIdx + 1}`
                                      : currentEventPalette.slots[pIdx % currentEventPalette.slots.length]}
                                  </span>
                                </div>

                                {/* Sticker 1: Student ID Badge sticker on Right Edge of Photo 1 */}
                                {isSchoolTheme && pIdx === 0 && (
                                  <div className="absolute -right-3.5 -bottom-3.5 z-20 pointer-events-none transform rotate-[7deg] drop-shadow-md">
                                    <StudentIdBadgeIcon isLight={isSchoolLight} size={36} />
                                  </div>
                                )}

                                {/* Sticker 2: Vintage Book Stack sticker on Left Edge of Photo 2 */}
                                {isSchoolTheme && pIdx === 1 && (
                                  <div className="absolute -left-3.5 -bottom-3 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
                                    <VintageBookStackIcon isLight={isSchoolLight} size={36} />
                                  </div>
                                )}

                                {/* Sticker 3: School Stationery sticker on Right Edge of Photo 3 */}
                                {isSchoolTheme && pIdx === 2 && (
                                  <div className="absolute -right-3.5 -bottom-3 z-20 pointer-events-none transform rotate-[7deg] drop-shadow-md">
                                    <SchoolStationeryIcon isLight={isSchoolLight} size={36} />
                                  </div>
                                )}

                                {/* Coastal Beach Theme Embellishments: shells, bubbles, plumeria, waves, starfish along margins */}
                                {isBeachTheme && (
                                  <BeachPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Nightclub & Party Embellishments: disco ball, headphones, camera flash, vinyl, dancers, lightning, flame */}
                                {isPartyTheme && (
                                  <PartyPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Wedding Celebration Embellishments: rings, bouquets, candles, leaves, hearts, sparkles */}
                                {isWeddingTheme && (
                                  <WeddingPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Birthday Celebration Embellishments: 12 elements (cake, balloons, gift, popper, party face, sparkles, confetti, candles, cupcake, star, ribbon, glasses) */}
                                {isBirthdayTheme && (
                                  <BirthdayPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Corporate Theme Embellishments: 12 elements (briefcase, handshake, bar chart, target, trophy, lightbulb, team, growth arrow, building, achievement, microphone, sparkles) */}
                                {isCorporateTheme && (
                                  <CorporatePhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Graduation Celebration Embellishments: 12 elements (cap, trophy, diploma, medal, stars, sparkles, books, confetti, badge, tassel, pen, celebration) */}
                                {isGraduationTheme && (
                                  <GraduationPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Frame Numbering */}
                                {!isSchoolTheme && (
                                  <span
                                    className="absolute bottom-0.5 right-1 text-[5.5px] font-mono px-1 py-0.2 rounded font-semibold"
                                    style={{
                                      backgroundColor: previewMode === 'template'
                                        ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)')
                                        : `${currentEventPalette.accentColor}18`,
                                      color: stripTextColor,
                                    }}
                                  >
                                    {previewMode === 'template' ? `0${pIdx + 1}A` : isBirthdayTheme ? `BIR-0${pIdx + 1}` : isCorporateTheme ? `COR-0${pIdx + 1}` : isGraduationTheme ? `GRA-0${pIdx + 1}` : `${getEventBareLabel(previewEventType).slice(0, 3).toUpperCase()}-0${pIdx + 1}`}
                                  </span>
                                )}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Footer Inscription & Insignia */}
                      <div className="w-full pt-2 mt-1 border-t text-center flex flex-col items-center gap-1" style={{ borderColor: isSchoolTheme ? schoolPalette.borderGold : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                        {isSchoolTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <SchoolAcademicFooterIcon width={120} height={18} isLight={isSchoolLight} />
                            </div>
                            {activePlan.watermark ? (
                              <div className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[7px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-2 h-2" />
                                <span>Memora Watermark Included</span>
                              </div>
                            ) : (
                              <div className="text-[7px] font-mono uppercase tracking-widest opacity-60 mt-0.5" style={{ color: schoolPalette.textSecondary }}>
                                ✦ ZERO WATERMARK ✦
                              </div>
                            )}
                          </>
                        ) : previewMode === 'template' ? (
                          /* Pure Template Footer: Studio Branding */
                          <>
                            <span className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-75">
                              ✦ MEMORA ATELIER • {currentPreviewTemplate.badge?.toUpperCase()} ✦
                            </span>
                            {activePlan.watermark ? (
                              <div className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[7px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-2 h-2" />
                                <span>Memora Watermark Included</span>
                              </div>
                            ) : (
                              <div className="text-[7px] font-mono uppercase tracking-widest opacity-60 mt-0.5">
                                ✦ ZERO WATERMARK ✦
                              </div>
                            )}
                          </>
                        ) : (
                          /* Pure Event Type Footer: Event Edition */
                          <>
                            {previewEventType === 'beach' ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <CoastalWaveFooterIcon width={120} height={16} />
                              </div>
                            ) : previewEventType === 'party' || isPartyTheme ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <PartyEqualizerFooterIcon width={120} height={16} />
                              </div>
                            ) : previewEventType === 'wedding' || isWeddingTheme ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <WeddingBotanicalFooterIcon width={120} height={18} />
                              </div>
                            ) : previewEventType === 'birthday' || isBirthdayTheme ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <BirthdayBuntingFooterIcon width={120} height={18} />
                              </div>
                            ) : previewEventType === 'corporate' || isCorporateTheme ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <CorporateSkylineFooterIcon width={120} height={18} />
                              </div>
                            ) : previewEventType === 'graduation' || isGraduationTheme ? (
                              <div className="py-0.5 flex items-center justify-center">
                                <GraduationDiplomaFooterIcon width={120} height={18} />
                              </div>
                            ) : (
                              <span className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-80" style={{ color: currentEventPalette.accentColor }}>
                                {currentEventPalette.badgeEmoji || getEventEmoji(previewEventType)} {getEventBareLabel(previewEventType).toUpperCase()} SPECIAL EDITION • 2026
                              </span>
                            )}
                            {activePlan.watermark ? (
                              <div className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[7px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-2 h-2" />
                                <span>Memora Watermark Included</span>
                              </div>
                            ) : (
                              <div className="text-[7px] font-mono uppercase tracking-widest opacity-60 mt-0.5">
                                ✦ ZERO WATERMARK ✦
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Quick Specs */}
                  <div className="pt-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>
                      {currentPreviewLayout.poses} • {previewMode === 'template' ? currentPreviewTemplate.badge : `${getEventBareLabel(previewEventType)} Theme`}
                    </span>
                    <span className="text-primary font-medium">{currentPreviewLayout.name}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  )}

      {/* TAB 3: Live Customer Portal Preview */}
      {mainTab === 'preview' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary font-semibold">
                Live Customer Portal Preview
              </span>
            </div>
            <h2 className="font-display text-2xl font-light text-foreground mt-0.5">
              How Organizers See Your Plans
            </h2>
            <p className="text-xs text-muted-foreground font-light">
              This preview reflects your edits instantly. It matches the exact visual appearance of <Link href="/dashboard/billing" className="underline hover:text-foreground">/dashboard/billing</Link> and <Link href="/dashboard/templates" className="underline hover:text-foreground">/dashboard/templates</Link>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/billing"
              target="_blank"
              className="px-4 py-2 rounded-full border border-border text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors"
            >
              <span>View Billing Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Card 1: FREE */}
          <div className="rounded-3xl p-8 bg-[#faf7f2] text-[#261f1d] ring-1 ring-[#261f1d]/12 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#261f1d]/60 font-medium">
                  {draftPlans.free.eyebrow}
                </p>
                <span className="rounded-full bg-[#261f1d]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#261f1d] font-semibold">
                  {draftPlans.free.badge}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#261f1d]">
                {draftPlans.free.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#261f1d]/60 mt-1">
                {draftPlans.free.period}
              </p>
              <p className="text-xs text-[#261f1d]/70 mt-2 font-light">
                {draftPlans.free.summary}
              </p>
              <ul className="mt-7 space-y-3 text-sm font-light">
                {draftPlans.free.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className="text-[#261f1d]/80">{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[#261f1d]/10 flex items-center justify-between font-mono text-[11px] text-[#261f1d]/70">
              <span className="uppercase tracking-wider">Free Trial</span>
              <span className="font-semibold text-[#f05a28]">
                {allTemplates.filter(t => isTemplateUnlocked(draftPlans.free, t.id)).length} Templates
              </span>
            </div>
          </div>

          {/* Card 2: PRO */}
          <div className="rounded-3xl p-8 bg-[#201915] text-[#faf7f2] shadow-2xl flex flex-col justify-between relative border border-[#f05a28]/25 ring-1 ring-[#f05a28]/20">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#f05a28] font-medium">
                  {draftPlans.pro.eyebrow}
                </p>
                <span className="rounded-full bg-[#f05a28]/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f05a28] font-semibold">
                  {draftPlans.pro.badge}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#faf7f2]">
                {draftPlans.pro.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#faf7f2]/60 mt-1">
                {draftPlans.pro.period}
              </p>
              <p className="text-xs text-[#faf7f2]/70 mt-2 font-light">
                {draftPlans.pro.summary}
              </p>
              <ul className="mt-7 space-y-3 text-sm font-light">
                {draftPlans.pro.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className={f.highlight ? 'text-white font-medium' : 'text-[#faf7f2]/90'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
              <span className="uppercase tracking-wider text-[#faf7f2]/60">Event Pass Tier</span>
              <span className="font-semibold text-[#f05a28]">
                {allTemplates.filter(t => isTemplateUnlocked(draftPlans.pro, t.id)).length} Templates • Included in PRO Pass
              </span>
            </div>
          </div>

          {/* Card 3: STUDIO */}
          <div className="rounded-3xl p-8 bg-[#faf7f2] text-[#261f1d] ring-1 ring-[#261f1d]/12 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#261f1d]/60 font-medium">
                  {draftPlans.studio.eyebrow}
                </p>
                <span className="rounded-full bg-[#261f1d]/5 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#261f1d] font-semibold">
                  {draftPlans.studio.badge}
                </span>
              </div>
              <p className="mt-3 font-display text-5xl sm:text-6xl font-light tracking-tight text-[#261f1d]">
                {draftPlans.studio.priceDisplay}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#261f1d]/60 mt-1">
                {draftPlans.studio.period}
              </p>
              <p className="text-xs text-[#261f1d]/70 mt-2 font-light">
                {draftPlans.studio.summary}
              </p>
              <ul className="mt-7 space-y-3 text-sm font-light">
                {draftPlans.studio.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2.5">
                    <span className="text-[#f05a28] font-serif text-lg">—</span>
                    <span className={f.highlight ? 'text-[#261f1d] font-medium' : 'text-[#261f1d]/80'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[#261f1d]/10 flex items-center justify-between font-mono text-[11px] text-[#261f1d]/70">
              <span className="uppercase tracking-wider">Studio Workspace</span>
              <span className="font-semibold text-[#f05a28]">
                {allTemplates.filter(t => isTemplateUnlocked(draftPlans.studio, t.id)).length} Templates • Included in PRO Pass
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Floating Auto-Save Status Pill */}
      {saveStatus === 'saved' && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-xs font-mono shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All changes saved & sync active</span>
        </div>
      )}
    </div>
  );
}
