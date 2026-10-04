'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  Palette, 
  Smile, 
  Layout, 
  Lock,
  Check,
  Columns,
  Grid2X2,
  LayoutGrid,
  Film,
  Square,
  Maximize2,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';
import { 
  LUXURY_TEMPLATES, 
  LuxuryTemplatePreset, 
  StripLayoutStyle, 
  BorderOrnament, 
  InsigniaType,
  FontFamilyOption 
} from '@/app/dashboard/templates/page';
import { isAdminRole } from '@/types/user';
import { useModal } from '@/context/ModalContext';
import { isTemplateUnlocked, isLayoutUnlocked, getStoredPlans, isGifExportAllowed } from '@/lib/plans';
import { GIFEncoder, quantize, applyPalette } from '@/lib/gifEncoder';

export type FilterType = 'normal' | 'vogue' | 'golden' | 'portra' | 'triX' | 'vintage';

export interface FilterConfig {
  name: string;
  tag: string;
  canvasFilter: string;
  dotColor: string;
}

export const FILTER_STYLES: Record<FilterType, FilterConfig> = {
  normal: { 
    name: 'Natural', 
    tag: 'True Tone', 
    canvasFilter: 'contrast(1.05) saturate(1.05)', 
    dotColor: '#f8fafc' 
  },
  vogue: { 
    name: 'Vogue B&W', 
    tag: 'Silver Noir', 
    canvasFilter: 'grayscale(1) contrast(1.35) brightness(1.02)', 
    dotColor: '#94a3b8' 
  },
  golden: { 
    name: 'Golden Glow', 
    tag: 'Warmth', 
    canvasFilter: 'sepia(0.28) saturate(1.3) brightness(1.04)', 
    dotColor: '#d8b86a' 
  },
  portra: { 
    name: 'Portra 400', 
    tag: 'Analogue', 
    canvasFilter: 'sepia(0.18) contrast(1.12) saturate(1.15) brightness(1.03)', 
    dotColor: '#fb923c' 
  },
  triX: { 
    name: 'Noir Tri-X', 
    tag: 'High-Contrast', 
    canvasFilter: 'grayscale(1) contrast(1.45) brightness(0.96)', 
    dotColor: '#475569' 
  },
  vintage: { 
    name: 'Vintage 35mm', 
    tag: 'Warm Sepia', 
    canvasFilter: 'sepia(0.38) contrast(1.15) brightness(1.06)', 
    dotColor: '#d97706' 
  },
};

export interface PhotoEditorProps {
  capturedFrames: string[];
  eventName: string;
  eventDate?: string;
  isPremium?: boolean;
  initialFilter?: FilterType;
  onRetake: () => void;
}

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

export function PhotoEditor({
  capturedFrames,
  eventName,
  eventDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  isPremium = false,
  initialFilter = 'normal',
  onRetake,
}: PhotoEditorProps) {
  const { alert: alertModal } = useModal();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (isAdminRole(u?.role) || u?.role === 'admin') {
          setIsAdminUser(true);
        }
      }
    } catch {}
  }, []);

  const effectiveIsPremium = isPremium || isAdminUser;

  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter || 'normal');
  const [selectedLayout, setSelectedLayout] = useState<StripLayoutStyle>(effectiveIsPremium ? 'strip4' : 'strip3');
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>(effectiveIsPremium ? '#0a0c10' : '#ffffff');
  const [selectedTextColor, setSelectedTextColor] = useState<string>(effectiveIsPremium ? '#f5f3ef' : '#08090d');
  const [selectedAccentColor, setSelectedAccentColor] = useState<string>(effectiveIsPremium ? '#d8b86a' : '#64748b');
  const [selectedBorderOrnament, setSelectedBorderOrnament] = useState<BorderOrnament>(effectiveIsPremium ? 'double_gold' : 'hairline');
  const [selectedInsignia, setSelectedInsignia] = useState<InsigniaType>(effectiveIsPremium ? 'crest' : 'none');
  const [selectedFontFamily, setSelectedFontFamily] = useState<FontFamilyOption>('editorial');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('classic_filmstrip');

  const [activeTab, setActiveTab] = useState<'templates' | 'layouts' | 'filters' | 'stickers'>('templates');
  const [addedStickers, setAddedStickers] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Read defaults from saved template preset if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_strip_templates');
      if (stored) {
        const parsed = JSON.parse(stored);
        const activeConfig = effectiveIsPremium ? (parsed.event || parsed.pro) : parsed.free;
        if (activeConfig) {
          if (activeConfig.stripLayout) setSelectedLayout(activeConfig.stripLayout);
          if (activeConfig.frameColor) setSelectedFrameColor(activeConfig.frameColor);
          if (activeConfig.textColor) setSelectedTextColor(activeConfig.textColor);
          if (activeConfig.accentColor) setSelectedAccentColor(activeConfig.accentColor);
          if (activeConfig.borderOrnament) setSelectedBorderOrnament(activeConfig.borderOrnament);
          if (activeConfig.insignia) setSelectedInsignia(activeConfig.insignia);
          if (activeConfig.fontFamily) setSelectedFontFamily(activeConfig.fontFamily);
        }
      } else {
        if (!effectiveIsPremium) {
          setSelectedLayout('strip3');
          setSelectedFrameColor('#ffffff');
          setSelectedTextColor('#08090d');
          setSelectedAccentColor('#64748b');
          setSelectedBorderOrnament('hairline');
          setSelectedInsignia('none');
          setSelectedPresetId('editorial_white');
        }
      }
    } catch {}
  }, [effectiveIsPremium]);

  // Sync initialFilter prop if updated from camera
  useEffect(() => {
    if (initialFilter) {
      setSelectedFilter(initialFilter);
    }
  }, [initialFilter]);

  // 1-Click apply luxury preset
  const handleApplyLuxuryPreset = (preset: LuxuryTemplatePreset) => {
    setSelectedPresetId(preset.id);
    setSelectedLayout(preset.layout);
    setSelectedFrameColor(preset.frameColor);
    setSelectedTextColor(preset.textColor);
    setSelectedAccentColor(preset.accentColor);
    setSelectedBorderOrnament(preset.borderOrnament);
    setSelectedInsignia(preset.insignia);
    setSelectedFontFamily(preset.fontFamily);
  };

  // Render composite image onto Canvas with Haute Tactile Details
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load all captured frames (fallback if few captured)
    const images: HTMLImageElement[] = await Promise.all(
      capturedFrames.map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    if (images.length === 0) return;

    // Helper to get image with wraparound
    const getImage = (idx: number) => images[idx % images.length];

    const isDarkFrame = selectedFrameColor === '#0a0c10' || selectedFrameColor === '#0e1014' || selectedFrameColor === '#0a1612' || selectedFrameColor === '#1a0f15' || selectedFrameColor === '#090c13' || selectedFrameColor === '#121316';
    const themeBg = selectedFrameColor;
    const themeTextColor = selectedTextColor;
    const themeAccent = selectedAccentColor;

    // Check template storage for watermark rules
    let savedTemplates: any = null;
    try {
      const raw = localStorage.getItem('memora_strip_templates');
      if (raw) savedTemplates = JSON.parse(raw);
    } catch {}

    // Helper: Draw image with true CSS object-fit: cover into target rectangle
    const drawCoverImage = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      dx: number,
      dy: number,
      dWidth: number,
      dHeight: number
    ) => {
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;
      if (!imgW || !imgH) {
        ctx.drawImage(img, dx, dy, dWidth, dHeight);
        return;
      }
      const targetRatio = dWidth / dHeight;
      const imgRatio = imgW / imgH;
      let sx = 0;
      let sy = 0;
      let sWidth = imgW;
      let sHeight = imgH;
      if (imgRatio > targetRatio) {
        sWidth = imgH * targetRatio;
        sx = (imgW - sWidth) / 2;
      } else {
        sHeight = imgW / targetRatio;
        sy = (imgH - sHeight) / 2;
      }
      ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    // Helper: Safe rounded rectangle for perforations and frames
    const drawRoundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }
    };

    // Helper: Determine perceived brightness of a hex color
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

    // Helper: Draw authentic 35mm film continuous white rounded sprocket perforations
    const drawSprocketPerforations = (
      ctx: CanvasRenderingContext2D,
      stripWidth: number,
      stripHeight: number,
      railWidth: number = 68,
      holeColor: string = '#ffffff'
    ) => {
      const holeW = 28;
      const holeH = 38;
      const holeRadius = 6;
      const holeSpacing = 58;
      const marginX = Math.round((railWidth - holeW) / 2);
      const totalHoles = Math.floor(stripHeight / holeSpacing);
      const startY = Math.floor((stripHeight - (totalHoles * holeSpacing - (holeSpacing - holeH))) / 2);

      // Rounded sprocket perforations adapting to strip color
      ctx.fillStyle = holeColor;
      for (let h = 0; h < totalHoles; h++) {
        const yHole = startY + h * holeSpacing;
        drawRoundedRect(ctx, marginX, yHole, holeW, holeH, holeRadius);
        drawRoundedRect(ctx, stripWidth - marginX - holeW, yHole, holeW, holeH, holeRadius);
      }
    };

    // 1. 35MM CELLULOID ANALOG FILMSTRIP WITH WHITE SPROCKETS (Standard 2x6 Strip: 800 x 2400 px)
    // Matches classic 35mm film negative with solid white rounded sprocket holes down both edges
    if (selectedLayout === 'filmstrip' || selectedBorderOrnament === 'sprockets') {
      const isThree = selectedLayout === 'strip3' || capturedFrames.length === 3 || (!effectiveIsPremium && selectedLayout !== 'strip4');
      const count = isThree ? 3 : (selectedLayout === 'duo' ? 2 : 4);
      const stripWidth = 800;
      const stripHeight = 2400; // Exact 1:3 ratio (standard 2x6 inch print at 300 DPI)
      const railWidth = 68;
      const photoWidth = stripWidth - railWidth * 2; // 664px
      const topMargin = 28;
      const footerHeight = 210;
      const photoGap = count === 3 ? 24 : count === 4 ? 20 : 32;
      const totalAvailable = stripHeight - topMargin - footerHeight;
      const photoHeight = Math.floor((totalAvailable - photoGap * (count - 1)) / count);

      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Base Paper Stock / Strip Color chosen by user
      const stripBg = selectedFrameColor || '#050505';
      const isLight = isLightColor(stripBg);

      ctx.fillStyle = stripBg;
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Sprocket holes adapt: white on dark strip, dark charcoal cutout on light strip
      const sprocketColor = isLight ? '#121214' : '#ffffff';
      drawSprocketPerforations(ctx, stripWidth, stripHeight, railWidth, sprocketColor);

      // Photos (True object-cover fitting into black celluloid frames)
      for (let i = 0; i < count; i++) {
        const yPos = topMargin + i * (photoHeight + photoGap);
        ctx.save();
        ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
        drawCoverImage(ctx, getImage(i), railWidth, yPos, photoWidth, photoHeight);
        ctx.restore();

        // Divider separation
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(railWidth, yPos, photoWidth, photoHeight);

        // Frame number stamp
        ctx.fillStyle = isLight ? '#475569' : '#f59e0b';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`▶ 0${i + 1}A`, stripWidth - railWidth - 58, yPos + photoHeight + 17);
      }

      // Edge stamps along inner rail margin
      ctx.fillStyle = isLight ? '#64748b' : '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.save();
      ctx.translate(railWidth - 10, stripHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('35MM ANALOG FILM  •  SAFETY FILM  •  ISO 400', -150, 0);
      ctx.restore();

      // Footer Typography & Monogram
      const footerY = topMargin + count * photoHeight + (count - 1) * photoGap + 48;
      ctx.textAlign = 'center';
      ctx.fillStyle = selectedTextColor || (isLight ? '#0f172a' : '#f5f5f7');
      ctx.font = 'bold 36px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(eventName.toUpperCase(), stripWidth / 2, footerY);

      ctx.font = '600 16px monospace';
      ctx.fillStyle = isLight ? '#475569' : '#f59e0b';
      ctx.fillText(eventDate.toUpperCase(), stripWidth / 2, footerY + 36);

      // Watermark Logic
      if (!effectiveIsPremium) {
        const freeWatermark = savedTemplates?.free?.watermarkText || 'MEMORA • 35MM STUDIO';
        ctx.font = '500 13px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(freeWatermark, stripWidth / 2, footerY + 70);
      } else {
        if (savedTemplates?.pro?.watermarkEnabled && savedTemplates?.pro?.watermarkText) {
          ctx.font = '600 13px sans-serif';
          ctx.fillStyle = '#d8b86a';
          ctx.fillText(savedTemplates.pro.watermarkText, stripWidth / 2, footerY + 70);
        }
      }

    // 2. SIGNATURE 4-POSE STRIP & CLASSIC 3-PHOTO STRIP & DUO STRIP
    // Industry Standard 2x6 inch Photobooth Strip (1:3 Aspect Ratio: 800 x 2400 px)
    } else if (selectedLayout === 'strip4' || selectedLayout === 'strip3' || selectedLayout === 'duo') {
      const count = selectedLayout === 'strip4' ? 4 : selectedLayout === 'strip3' ? 3 : 2;
      const stripWidth = 800;
      const stripHeight = 2400; // Exact 1:3 ratio (standard 2x6 inch print at 300 DPI)
      const photoMargin = 32;
      const innerWidth = stripWidth - photoMargin * 2; // 736px
      const footerHeight = 230;
      const totalAvailable = stripHeight - photoMargin - footerHeight;
      const photoGap = count === 4 ? 20 : count === 3 ? 24 : 32;
      const photoHeight = Math.floor((totalAvailable - photoGap * (count - 1)) / count);

      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Background Paper Stock
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Gold Leaf Double Hairline Inset Border
      if (selectedBorderOrnament === 'double_gold') {
        ctx.strokeStyle = themeAccent;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(14, 14, stripWidth - 28, stripHeight - 28);
        ctx.strokeStyle = `${themeAccent}40`;
        ctx.lineWidth = 1;
        ctx.strokeRect(19, 19, stripWidth - 38, stripHeight - 38);
      }

      // Botanical Wreath Rim
      if (selectedBorderOrnament === 'botanical') {
        ctx.strokeStyle = `${themeAccent}50`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(14, 14, stripWidth - 28, stripHeight - 28);
        ctx.font = '16px serif';
        ctx.fillStyle = themeAccent;
        ctx.fillText('🌿', 22, 28);
        ctx.fillText('🌿', stripWidth - 38, 28);
      }

      // Photos (Standard 2x6 layout, true object-cover fitting)
      for (let i = 0; i < count; i++) {
        const yPos = photoMargin + i * (photoHeight + photoGap);
        ctx.save();
        ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
        drawCoverImage(ctx, getImage(i), photoMargin, yPos, innerWidth, photoHeight);
        ctx.restore();

        // Gilded frame around each photo
        ctx.strokeStyle = isDarkFrame ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(photoMargin, yPos, innerWidth, photoHeight);
      }

      // Footer Typography
      const footerY = photoMargin + count * photoHeight + (count - 1) * photoGap + 48;
      
      // Draw Insignia
      if (selectedInsignia !== 'none') {
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = themeAccent;
        const iconSymbol = 
          selectedInsignia === 'crest' ? '👑' :
          selectedInsignia === 'wreath' ? '🌿' :
          selectedInsignia === 'wax_seal' ? '⚚' :
          selectedInsignia === 'diamond' ? '💎' :
          selectedInsignia === 'seal_jp' ? '印' : '✦';
        ctx.fillText(iconSymbol, stripWidth / 2, footerY - 20);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = themeTextColor;
      
      const headlineFont = selectedFontFamily === 'mono' 
        ? 'bold 32px monospace' 
        : selectedFontFamily === 'sans' 
        ? 'bold 36px "Plus Jakarta Sans", sans-serif' 
        : selectedFontFamily === 'script'
        ? 'italic 42px "Cormorant Garamond", Georgia, serif'
        : 'bold 38px "Cormorant Garamond", Georgia, serif';

      ctx.font = headlineFont;
      ctx.fillText(eventName.toUpperCase(), stripWidth / 2, footerY + 22);

      ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDarkFrame ? '#94a3b8' : '#64748b';
      ctx.fillText(eventDate.toUpperCase(), stripWidth / 2, footerY + 54);

      // Watermark Logic: Event Pass has ZERO watermark
      if (!effectiveIsPremium) {
        const freeWatermark = savedTemplates?.free?.watermarkText || 'MEMORA • STUDIO PHOTOBOOTH';
        ctx.font = '500 13px sans-serif';
        ctx.fillStyle = isDarkFrame ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fillText(freeWatermark, stripWidth / 2, footerY + 95);
      } else {
        if (savedTemplates?.pro?.watermarkEnabled && savedTemplates?.pro?.watermarkText) {
          ctx.font = '600 13px sans-serif';
          ctx.fillStyle = themeAccent;
          ctx.fillText(savedTemplates.pro.watermarkText, stripWidth / 2, footerY + 95);
        }
      }

    // 3. 2X2 QUAD POSTCARD COLLAGE (Standard 4x6 Postcard: 1200 x 1800 px, 2:3 ratio)
    } else if (selectedLayout === 'grid2x2') {
      const cardWidth = 1200;
      const cardHeight = 1800; // Standard 4x6 inch Postcard print!
      const margin = 48;
      const gridGap = 24;
      const cellWidth = (cardWidth - margin * 2 - gridGap) / 2; // 540px
      const footerHeight = 240;
      const cellHeight = Math.floor((cardHeight - margin - footerHeight - gridGap) / 2); // 744px

      canvas.width = cardWidth;
      canvas.height = cardHeight;

      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Gold Double Frame
      if (selectedBorderOrnament === 'double_gold' || selectedBorderOrnament === 'hairline') {
        ctx.strokeStyle = themeAccent;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(18, 18, cardWidth - 36, cardHeight - 36);
      }

      const positions = [
        { x: margin, y: margin },
        { x: margin + cellWidth + gridGap, y: margin },
        { x: margin, y: margin + cellHeight + gridGap },
        { x: margin + cellWidth + gridGap, y: margin + cellHeight + gridGap },
      ];

      for (let i = 0; i < 4; i++) {
        const pos = positions[i];
        ctx.save();
        ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
        drawCoverImage(ctx, getImage(i), pos.x, pos.y, cellWidth, cellHeight);
        ctx.restore();

        ctx.strokeStyle = isDarkFrame ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pos.x, pos.y, cellWidth, cellHeight);
      }

      // Bottom Monogram Banner
      const footerY = margin + (cellHeight * 2) + gridGap + 64;
      
      if (selectedInsignia !== 'none') {
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = themeAccent;
        ctx.fillText('💎', cardWidth / 2, footerY - 20);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = themeTextColor;
      ctx.font = 'bold 42px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(eventName.toUpperCase(), cardWidth / 2, footerY + 22);

      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = isDarkFrame ? '#94a3b8' : '#64748b';
      ctx.fillText(eventDate.toUpperCase(), cardWidth / 2, footerY + 54);

      if (!effectiveIsPremium) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = isDarkFrame ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
        ctx.fillText('MEMORA • QUAD BOOTH', cardWidth / 2, footerY + 86);
      }

    // 3.5. 2X3 HEXA GRID (Standard 4x6 Postcard: 1200 x 1800 px, 2 columns x 3 rows photo matrix)
    } else if (selectedLayout === 'grid2x3') {
      const cardWidth = 1200;
      const cardHeight = 1800;
      const margin = 48;
      const gridGap = 20;
      const cellWidth = Math.floor((cardWidth - margin * 2 - gridGap) / 2);
      const footerHeight = 220;
      const cellHeight = Math.floor((cardHeight - margin - footerHeight - gridGap * 2) / 3);

      canvas.width = cardWidth;
      canvas.height = cardHeight;

      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      if (selectedBorderOrnament === 'double_gold' || selectedBorderOrnament === 'hairline') {
        ctx.strokeStyle = themeAccent;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(18, 18, cardWidth - 36, cardHeight - 36);
      }

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
          const idx = row * 2 + col;
          const x = margin + col * (cellWidth + gridGap);
          const y = margin + row * (cellHeight + gridGap);

          ctx.save();
          ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
          drawCoverImage(ctx, getImage(idx), x, y, cellWidth, cellHeight);
          ctx.restore();

          ctx.strokeStyle = isDarkFrame ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, cellWidth, cellHeight);
        }
      }

      const footerY = margin + (cellHeight * 3) + (gridGap * 2) + 64;

      if (selectedInsignia !== 'none') {
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = themeAccent;
        ctx.fillText('💎', cardWidth / 2, footerY - 20);
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = themeTextColor;
      ctx.font = 'bold 42px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(eventName.toUpperCase(), cardWidth / 2, footerY + 22);

      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = isDarkFrame ? '#94a3b8' : '#64748b';
      ctx.fillText(eventDate.toUpperCase(), cardWidth / 2, footerY + 54);

      if (!effectiveIsPremium) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = isDarkFrame ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
        ctx.fillText('MEMORA • 2X3 HEXA BOOTH', cardWidth / 2, footerY + 86);
      }

    // 4. ELEGANT POLAROID INSTANT (Standard Instant Format: 900 x 1120 px)
    } else if (selectedLayout === 'polaroid') {
      const frameWidth = 900;
      const frameHeight = 1120;
      const margin = 48;
      const photoWidth = frameWidth - margin * 2; // 804px
      const photoHeight = 780;

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, frameWidth, frameHeight);

      ctx.save();
      ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
      drawCoverImage(ctx, getImage(0), margin, margin, photoWidth, photoHeight);
      ctx.restore();

      ctx.strokeStyle = isDarkFrame ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(margin, margin, photoWidth, photoHeight);

      ctx.textAlign = 'center';
      ctx.fillStyle = themeTextColor;
      ctx.font = 'bold 42px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(eventName, frameWidth / 2, frameHeight - 120);
      
      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = isDarkFrame ? '#94a3b8' : '#64748b';
      ctx.fillText(eventDate.toUpperCase(), frameWidth / 2, frameHeight - 70);

      if (!effectiveIsPremium) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = isDarkFrame ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fillText('MEMORA STUDIO', frameWidth / 2, frameHeight - 32);
      }

    // 5. EDITORIAL PORTRAIT SINGLE (Exact 3:4 Portrait Matching Camera Output)
    } else {
      const width = 1200;
      const height = 1600; // 3:4 portrait!
      canvas.width = width;
      canvas.height = height;

      ctx.save();
      ctx.filter = FILTER_STYLES[selectedFilter].canvasFilter;
      drawCoverImage(ctx, getImage(0), 0, 0, width, height);
      ctx.restore();

      ctx.fillStyle = 'rgba(7, 8, 11, 0.7)';
      ctx.fillRect(0, height - 120, width, 120);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#faf6ee';
      ctx.font = 'bold 36px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(eventName, 45, height - 52);

      ctx.textAlign = 'right';
      ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#e6c687';
      ctx.fillText(eventDate.toUpperCase(), width - 45, height - 52);

      if (!effectiveIsPremium) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('MEMORA STUDIO', width - 45, height - 20);
      }
    }

    // Render Stickers
    addedStickers.forEach((st) => {
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.emoji, st.x, st.y);
    });

    setExportDataUrl(canvas.toDataURL('image/jpeg', 0.96));
  }, [
    capturedFrames, 
    selectedFilter, 
    selectedLayout, 
    selectedFrameColor, 
    selectedTextColor, 
    selectedAccentColor, 
    selectedBorderOrnament, 
    selectedInsignia, 
    selectedFontFamily, 
    eventName, 
    eventDate, 
    effectiveIsPremium, 
    addedStickers
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (exportDataUrl) {
        const link = document.createElement('a');
        link.download = `${eventName.toLowerCase().replace(/\s+/g, '-')}-photobooth.jpg`;
        link.href = exportDataUrl;
        link.click();

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#d8b86a', '#ffffff', '#e6c687'],
        });
      }
      setIsExporting(false);
    }, 400);
  };

  const handleDownloadGif = async () => {
    if (!canvasRef.current || isExportingGif) return;
    setIsExportingGif(true);
    try {
      const sourceCanvas = canvasRef.current;
      const baseW = sourceCanvas.width;
      const baseH = sourceCanvas.height;

      // Scale to optimal lightweight GIF dimensions
      const scale = Math.min(380 / baseW, 780 / baseH);
      const gifWidth = Math.round(baseW * scale);
      const gifHeight = Math.round(baseH * scale);

      const animCanvas = document.createElement('canvas');
      animCanvas.width = gifWidth;
      animCanvas.height = gifHeight;
      const animCtx = animCanvas.getContext('2d');
      if (!animCtx) return;

      const encoder = GIFEncoder();

      // Number of shots for current layout
      let count = 3;
      if (selectedLayout === 'strip4' || selectedLayout === 'grid2x2') count = 4;
      else if (selectedLayout === 'grid2x3') count = 6;
      else if (selectedLayout === 'polaroid') count = 1;
      else if (selectedLayout === 'duo') count = 2;

      // Draw frames with spotlight pulse across the strip
      for (let i = 0; i < count; i++) {
        animCtx.clearRect(0, 0, gifWidth, gifHeight);
        animCtx.drawImage(sourceCanvas, 0, 0, gifWidth, gifHeight);

        // Highlight flash / border on frame i
        animCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        animCtx.fillRect(0, 0, gifWidth, gifHeight);

        const { data } = animCtx.getImageData(0, 0, gifWidth, gifHeight);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        encoder.writeFrame(index, gifWidth, gifHeight, { palette, delay: 550 });
      }

      // Finale frame: original crisp canvas (delay 1200ms)
      animCtx.clearRect(0, 0, gifWidth, gifHeight);
      animCtx.drawImage(sourceCanvas, 0, 0, gifWidth, gifHeight);
      const { data } = animCtx.getImageData(0, 0, gifWidth, gifHeight);
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      encoder.writeFrame(index, gifWidth, gifHeight, { palette, delay: 1200 });

      encoder.finish();
      const bytes = encoder.bytes();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `${eventName.toLowerCase().replace(/\s+/g, '-')}-strip.gif`;
      link.href = gifUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#d8b86a', '#ffffff', '#e6c687'],
      });
    } catch (err) {
      console.error('Error generating editor GIF:', err);
    } finally {
      setIsExportingGif(false);
    }
  };

  const handleShare = async () => {
    if (!exportDataUrl) return;
    if (navigator.share) {
      try {
        const blob = await (await fetch(exportDataUrl)).blob();
        const file = new File([blob], 'photobooth-strip.jpg', { type: 'image/jpeg' });
        await navigator.share({
          title: eventName,
          text: `Memora photobooth strip from ${eventName}!`,
          files: [file],
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      await alertModal({
        title: 'Link Copied',
        description: 'Photobooth strip link has been copied to your clipboard.',
        buttonText: 'Understood',
        variant: 'success',
        eyebrow: 'SHARE LINK',
      });
    }
  };

  const handleAddSticker = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = canvas.width / 2 + (Math.random() * 80 - 40);
    const y = canvas.height / 2 + (Math.random() * 80 - 40);
    setAddedStickers((prev) => [...prev, { id: Math.random().toString(), emoji, x, y }]);
  };

  const layoutOptions: { id: StripLayoutStyle; label: string; icon: any; premiumOnly: boolean }[] = [
    { id: 'strip4', label: '4-Strip', icon: Columns, premiumOnly: true },
    { id: 'strip3', label: '3-Strip', icon: Columns, premiumOnly: false },
    { id: 'filmstrip', label: '35mm Film', icon: Film, premiumOnly: false }, // Unlocked for Free tier
    { id: 'grid2x2', label: '2x2 Grid', icon: Grid2X2, premiumOnly: true },
    { id: 'grid2x3', label: '2x3 Grid', icon: LayoutGrid, premiumOnly: true },
    { id: 'polaroid', label: 'Polaroid', icon: Square, premiumOnly: true },
    { id: 'duo', label: 'Duo', icon: Maximize2, premiumOnly: true },
  ];

  const frameOptions: { id: BorderOrnament; label: string; icon: any; premiumOnly: boolean }[] = [
    { id: 'sprockets', label: '35mm Sprockets', icon: Film, premiumOnly: false }, // Unlocked for Free tier
    { id: 'double_gold', label: '24K Double Gold', icon: Sparkles, premiumOnly: true },
    { id: 'hairline', label: 'Minimalist Razor', icon: Square, premiumOnly: false },
    { id: 'botanical', label: 'Botanical Wreath', icon: Sparkles, premiumOnly: true },
    { id: 'none', label: 'Borderless Clean', icon: Columns, premiumOnly: false },
  ];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6">
      {/* Top action bar: Retake */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-[#d8b86a]" />
          <span>Retake</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#d8b86a] px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
          <Sparkles className="w-3 h-3" />
          <span>{effectiveIsPremium ? '4K Studio Composite' : 'Free Trial'}</span>
        </div>
      </div>

      {/* Main Preview: Photobooth Canvas with Luxury Shadow */}
      <div className="relative w-full flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden min-h-[440px]">
        <canvas
          ref={canvasRef}
          className="max-h-[62vh] sm:max-h-[68vh] w-auto max-w-full rounded-md shadow-2xl object-contain border border-white/10"
        />
      </div>

      {/* Control Drawer Tabs */}
      <div className="w-full mt-4 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-3">
        {/* Tab Headers */}
        <div className="flex items-center justify-around border-b border-white/[0.08] pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 pb-1 transition-colors cursor-pointer ${
              activeTab === 'templates' ? 'text-[#e6c687] border-b-2 border-[#e6c687]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('layouts')}
            className={`flex items-center gap-1.5 pb-1 transition-colors cursor-pointer ${
              activeTab === 'layouts' ? 'text-[#e6c687] border-b-2 border-[#e6c687]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Strip & Frames
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-1.5 pb-1 transition-colors cursor-pointer ${
              activeTab === 'filters' ? 'text-[#e6c687] border-b-2 border-[#e6c687]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Filters
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-1.5 pb-1 transition-colors cursor-pointer ${
              activeTab === 'stickers' ? 'text-[#e6c687] border-b-2 border-[#e6c687]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            Accents
          </button>
        </div>

        {/* Tab 1: Templates Carousel */}
        {activeTab === 'templates' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#9b9ca3] uppercase tracking-wider block">
              Photo Strip Templates ({LUXURY_TEMPLATES.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {LUXURY_TEMPLATES.map((tpl: LuxuryTemplatePreset) => {
                const isSelected = selectedPresetId === tpl.id;
                const isLocked = !effectiveIsPremium && !isTemplateUnlocked(getStoredPlans().free, tpl.id);

                return (
                  <button
                    key={tpl.id}
                    disabled={isLocked}
                    onClick={() => handleApplyLuxuryPreset(tpl)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl border transition-all text-left flex items-center gap-2 ${
                      isLocked ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'bg-[#d8b86a] text-[#060709] border-[#e6c687] font-bold shadow-md'
                        : 'bg-white/[0.04] text-slate-200 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full border border-black/30 flex-shrink-0"
                      style={{ backgroundColor: tpl.frameColor }}
                    />
                    <div>
                      <span className="block text-xs font-semibold leading-tight">{tpl.name}</span>
                      <span className={`block text-[8px] font-mono ${isSelected ? 'text-black/70' : 'text-[#d8b86a]'}`}>
                        {tpl.badge}
                      </span>
                    </div>
                    {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Layouts & Frames (Event Pass Strip Styles & Border Ornaments) */}
        {activeTab === 'layouts' && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#9b9ca3] uppercase tracking-wider block mb-1.5">
                Strip Layout Style
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {layoutOptions.map((layout) => {
                  const isLocked = !effectiveIsPremium && !isLayoutUnlocked(getStoredPlans().free, layout.id);
                  const isSelected = selectedLayout === layout.id;
                  const IconComp = layout.icon;

                  return (
                    <button
                      key={layout.id}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedLayout(layout.id);
                        if (layout.id === 'filmstrip') {
                          setSelectedBorderOrnament('sprockets');
                          setSelectedFrameColor('#050505');
                          setSelectedTextColor('#f5f5f7');
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isLocked ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.02]' : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'bg-[#e6c687] text-[#07080b] border-[#fff2d6]/40 shadow-lg shadow-[#e6c687]/20 font-bold'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <IconComp className="w-3 h-3" />
                      <span>{layout.label}</span>
                      {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#9b9ca3] uppercase tracking-wider block mb-1.5">
                Frame & Border Ornament
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {frameOptions.map((frame) => {
                  const isLocked = !effectiveIsPremium && frame.premiumOnly;
                  const isSelected = selectedBorderOrnament === frame.id;
                  const IconComp = frame.icon;

                  return (
                    <button
                      key={frame.id}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedBorderOrnament(frame.id);
                        if (frame.id === 'sprockets') {
                          setSelectedFrameColor('#050505');
                          setSelectedTextColor('#f5f5f7');
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isLocked ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.02]' : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'bg-[#e6c687] text-[#07080b] border-[#fff2d6]/40 shadow-lg shadow-[#e6c687]/20 font-bold'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <IconComp className="w-3 h-3" />
                      <span>{frame.label}</span>
                      {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#9b9ca3] uppercase tracking-wider block mb-1.5">
                Strip & Paper Color
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {/* Photo Strip Paper & Finish Colors */}
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
                ].map((palette) => {
                  const isSelected = selectedFrameColor.toLowerCase() === palette.hex.toLowerCase();
                  return (
                    <button
                      key={palette.hex}
                      onClick={() => {
                        setSelectedFrameColor(palette.hex);
                        setSelectedTextColor(palette.text);
                        setSelectedAccentColor(palette.accent);
                      }}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white/20 border-white text-white font-bold shadow-xs'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-black/30 shadow-xs flex-shrink-0"
                        style={{ backgroundColor: palette.hex }}
                      />
                      <span className="text-[10px] font-mono">{palette.label}</span>
                    </button>
                  );
                })}

                {/* Custom Color Wheel / Hex Picker */}
                <label className="flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-white cursor-pointer flex items-center gap-1.5 transition-all">
                  <input 
                    type="color" 
                    value={normalizeHexColor(selectedFrameColor)}
                    onChange={(e) => {
                      const color = e.target.value;
                      setSelectedFrameColor(color);
                      if (isLightColor(color)) {
                        setSelectedTextColor('#0f172a');
                        setSelectedAccentColor('#334155');
                      } else {
                        setSelectedTextColor('#ffffff');
                        setSelectedAccentColor('#d8b86a');
                      }
                    }}
                    className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-[10px] font-mono">Custom Color</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Filters */}
        {activeTab === 'filters' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(Object.keys(FILTER_STYLES) as FilterType[]).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setSelectedFilter(filterKey)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === filterKey
                    ? 'bg-[#e6c687] text-[#07080b] border-[#fff2d6]/40 shadow-lg shadow-[#e6c687]/20 font-bold'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: FILTER_STYLES[filterKey].dotColor }}
                />
                <span>{FILTER_STYLES[filterKey].name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 4: Stickers */}
        {activeTab === 'stickers' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-2xl">
            {['✨', '🥂', '💍', '👑', '🎉', '🕊️', '🖤', '🤍', '⭐', '🍾', '✦', '🌹', '🌿', '💎'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAddSticker(emoji)}
                className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] flex items-center justify-center hover:scale-125 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Action CTAs: Download & Share */}
      <div className={`w-full grid gap-2.5 mt-4 ${isGifExportAllowed(getStoredPlans().free) ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleShare}
          className="w-full text-xs sm:text-sm"
        >
          <Share2 className="w-3.5 h-3.5 mr-1 text-[#e6c687]" />
          Share
        </Button>

        <Button
          variant="glow"
          size="lg"
          onClick={handleDownload}
          isLoading={isExporting}
          className="w-full text-xs sm:text-sm"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Save JPEG
        </Button>

        {isGifExportAllowed(getStoredPlans().free) && (
          <Button
            variant="glow"
            size="lg"
            onClick={handleDownloadGif}
            isLoading={isExportingGif}
            className="w-full text-xs sm:text-sm bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-200 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#e6c687]" />
            Save GIF
          </Button>
        )}
      </div>

      {/* Free tier notice / watermark reminder */}
      {!effectiveIsPremium && (
        <p className="text-[10px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-[#e6c687]" />
          Free trial: Watermarked 3-strip. Upgrade to PRO (₱1,499) for 10 luxury templates & zero watermark.
        </p>
      )}
    </div>
  );
}
