'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Timer, RotateCcw, Sparkles, Film, Palette, Layers, Camera, Check, Lock, ChevronDown } from 'lucide-react';
import { broadcastRealtime, subscribeRealtime } from '@/lib/realtime';
import { GIFEncoder, quantize, applyPalette } from '@/lib/gifEncoder';
import {
  isGifExportAllowed,
  isLayoutUnlocked,
  isTemplateUnlocked,
  getStoredPlans,
  PlanConfig,
  DEFAULT_PLANS,
  ALL_SYSTEM_TEMPLATES,
  ALL_PRO_EVENT_TEMPLATES,
  PRO_EVENT_THEME_TEMPLATES,
  ALL_EVENT_TYPE_IDS,
  AvailableTemplateOption,
  getTemplateNativeLayoutId,
} from '@/lib/plans';
import { getEventEmoji, getEventLabel, getEventBareLabel } from '@/types';
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

export interface FilterOption {
  id: string;
  label: string;
  css: string;
}

export interface LayoutOption {
  id: string;
  label: string;
  shots: number;
  columns: number;
}

export interface FrameOption {
  id: string;
  label: string;
  paper: string;
  ink: string;
}

export const FILTERS: FilterOption[] = [
  { id: 'original', label: 'Original', css: 'none' },
  { id: 'warm', label: 'Warm', css: 'saturate(1.15) sepia(0.2) contrast(1.05)' },
  { id: 'cool', label: 'Cool', css: 'saturate(1.1) hue-rotate(-12deg) brightness(1.03)' },
  { id: 'vintage', label: 'Vintage', css: 'sepia(0.45) contrast(0.95) saturate(0.85)' },
  { id: 'mono', label: 'B&W', css: 'grayscale(1) contrast(1.1)' },
  { id: 'bright', label: 'Bright', css: 'brightness(1.12) contrast(1.06)' },
];

export const LAYOUTS: LayoutOption[] = [
  { id: 'strip3', label: '3-Photo Strip', shots: 3, columns: 1 },
  { id: 'strip4', label: '4-Pose Strip', shots: 4, columns: 1 },
  { id: 'filmstrip', label: '35mm Filmstrip', shots: 3, columns: 1 },
  { id: 'grid2x2', label: '2x2 Quad Grid', shots: 4, columns: 2 },
  { id: 'grid2x3', label: '2x3 Hexa Grid', shots: 6, columns: 2 },
  { id: 'duo', label: 'Minimalist Duo', shots: 2, columns: 1 },
  { id: 'polaroid', label: 'Single Polaroid', shots: 1, columns: 1 },
];

export const FRAMES: FrameOption[] = [
  { id: 'classic', label: 'Classic', paper: '#fffdf7', ink: '#2b211c' },
  { id: 'ember', label: 'Ember', paper: '#f4623a', ink: '#fffdf7' },
  { id: 'signal', label: 'Signal', paper: '#1668c4', ink: '#fffdf7' },
  { id: 'night', label: 'Night', paper: '#2b211c', ink: '#fffdf7' },
];

export const COUNTDOWNS = [0, 3, 5, 10];

export const isLightColor = (hex: string) => {
  if (!hex) return false;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

const ERROR_MESSAGES: Record<string, string> = {
  denied: 'Camera access was blocked. Allow the camera in your browser settings, then try again.',
  notfound: "We couldn't find a camera on this device.",
  inuse: 'Another app is already using your camera. Close it and try again.',
  unsupported: "This browser can't open the camera. Try Chrome on Android or Safari on iPhone.",
  unknown: "We couldn't start the camera. Please try again.",
};

function getCameraErrorKind(err: unknown): string {
  const name = typeof err === 'object' && err && 'name' in err ? String((err as { name: string }).name) : '';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') return 'notfound';
  if (name === 'NotReadableError' || name === 'AbortError' || name === 'TrackStartError') return 'inuse';
  return 'unknown';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load photo'));
    img.src = src;
  });
}

const PHOTO_WIDTH = 900;
const PHOTO_HEIGHT = 1200;

interface RenderStripOptions {
  shots: string[];
  layout: string;
  frame: string;
  filterCss: string;
  title: string;
  caption: string;
  watermark?: boolean;
  frameColor?: string;
  textColor?: string;
  templateId?: string;
}

function drawCanvasSchoolThemeAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isLight: boolean,
  photoRects: { x: number; y: number; w: number; h: number }[]
) {
  const gold = isLight ? '#855d10' : '#d4af37';
  const strokeColor = isLight ? '#0c1a30' : '#050a12';
  const paper = isLight ? '#ffffff' : '#0c182b';

  ctx.save();

  // 1. Top Crown: Varsity School Pennant Flag above Photo 1
  if (photoRects.length > 0) {
    const p1 = photoRects[0];
    const flagX = width / 2;
    const flagY = Math.max(34, p1.y - 16);

    ctx.save();
    ctx.translate(flagX, flagY);
    ctx.scale(2.2, 2.2);

    // Mast staff
    ctx.strokeStyle = isLight ? '#5a3d0b' : '#c59d2f';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.lineTo(-16, 14);
    ctx.stroke();

    // Mast finial ball
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(-16, -14, 2, 0, Math.PI * 2);
    ctx.fill();

    // Pennant triangle
    ctx.fillStyle = isLight ? '#0c1a30' : '#0a1628';
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-15, -12);
    ctx.lineTo(18, 0);
    ctx.lineTo(-15, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pennant spine binding
    ctx.fillStyle = gold;
    ctx.fillRect(-16, -12, 3, 24);

    // Pennant inscription
    ctx.fillStyle = isLight ? '#fdfaf3' : '#f6eedb';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2026', -4, 0);

    ctx.restore();
  }

  // 2. Student ID Badge on right edge between Photo 1 and Photo 2
  if (photoRects.length >= 2) {
    const p1 = photoRects[0];
    const badgeX = p1.x + p1.w - 18;
    const badgeY = p1.y + p1.h - 12;

    ctx.save();
    ctx.translate(badgeX, badgeY);
    ctx.rotate((8 * Math.PI) / 180);
    ctx.scale(2.2, 2.2);

    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    // Card Body
    ctx.fillStyle = paper;
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-24, -36, 48, 70, 5);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Header banner
    ctx.fillStyle = isLight ? '#0c1a30' : gold;
    ctx.fillRect(-22, -28, 44, 12);
    ctx.fillStyle = isLight ? '#f6eedb' : '#0c1a30';
    ctx.font = 'bold 5.2px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STUDENT PASS', 0, -20);

    // Photo Box & Silhouette
    ctx.fillStyle = isLight ? '#ede6d6' : '#142338';
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(-18, -12, 16, 18);
    ctx.fillRect(-18, -12, 16, 18);
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(-10, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Details Text
    ctx.fillStyle = isLight ? '#0c1a30' : '#f6eedb';
    ctx.font = 'bold 4.8px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SY 25-26', 2, -6);
    ctx.font = 'bold 4.2px sans-serif';
    ctx.fillText('GRADE 11', 2, 2);

    // Barcode lines
    ctx.fillStyle = isLight ? '#0c1a30' : gold;
    for (let b = 0; b < 9; b++) {
      const bx = -18 + b * 4;
      const bw = b % 2 === 0 ? 2 : 1;
      ctx.fillRect(bx, 10, bw, 12);
    }
    ctx.restore();
  }

  // 3. School Books Stack on left edge between Photo 2 and Photo 3
  if (photoRects.length >= 3) {
    const p2 = photoRects[1];
    const bookX = p2.x + 16;
    const bookY = p2.y + p2.h - 10;

    ctx.save();
    ctx.translate(bookX, bookY);
    ctx.rotate((-7 * Math.PI) / 180);
    ctx.scale(2.2, 2.2);

    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    // Book 1 (Bottom, Navy)
    ctx.fillStyle = isLight ? '#0c1a30' : '#0a1626';
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-24, 12, 46, 11, 2);
    ctx.fill();
    ctx.stroke();

    // Book 2 (Middle, Crimson)
    ctx.fillStyle = isLight ? '#7e1823' : '#881b27';
    ctx.beginPath();
    ctx.roundRect(-21, 1, 42, 11, 2);
    ctx.fill();
    ctx.stroke();

    // Book 3 (Top, Gold/Tan)
    ctx.fillStyle = isLight ? '#916916' : '#c89d2d';
    ctx.beginPath();
    ctx.roundRect(-18, -10, 36, 10, 2);
    ctx.fill();
    ctx.stroke();

    // Bookmark Ribbon
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(8, 12);
    ctx.lineTo(8, 26);
    ctx.lineTo(11, 23);
    ctx.lineTo(14, 26);
    ctx.lineTo(14, 12);
    ctx.closePath();
    ctx.fill();

    // Red Apple on top
    ctx.fillStyle = isLight ? '#991b1b' : '#b91c1c';
    ctx.beginPath();
    ctx.arc(0, -14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. School Stationery & Hall Pass (Crossed Ruler & Pencil) on right edge of Photo 3
  if (photoRects.length >= 3) {
    const p3 = photoRects[2];
    const statX = p3.x + p3.w - 18;
    const statY = p3.y + p3.h - 10;

    ctx.save();
    ctx.translate(statX, statY);
    ctx.rotate((7 * Math.PI) / 180);
    ctx.scale(2.2, 2.2);

    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Wooden ruler angled at 25deg
    ctx.save();
    ctx.rotate((25 * Math.PI) / 180);
    ctx.fillStyle = isLight ? '#f2e6cb' : '#e6d4aa';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.fillRect(-22, -4, 44, 8);
    ctx.strokeRect(-22, -4, 44, 8);
    // Ruler tick marks
    ctx.strokeStyle = isLight ? '#5a3d0b' : '#3d2806';
    ctx.lineWidth = 0.6;
    for (let t = -18; t <= 18; t += 3) {
      ctx.beginPath();
      ctx.moveTo(t, -4);
      ctx.lineTo(t, t % 6 === 0 ? 0 : -2);
      ctx.stroke();
    }
    ctx.restore();

    // Yellow HB pencil angled at -25deg
    ctx.save();
    ctx.rotate((-25 * Math.PI) / 180);
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.fillRect(-18, -3, 36, 6);
    ctx.strokeRect(-18, -3, 36, 6);
    // Graphite tip
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(18, -3);
    ctx.lineTo(24, 0);
    ctx.lineTo(18, 3);
    ctx.closePath();
    ctx.fill();
    // Pink eraser
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-22, -3, 4, 6);
    ctx.strokeRect(-22, -3, 4, 6);
    ctx.restore();

    // Center Gold Star Medal
    ctx.fillStyle = isLight ? '#0c1a30' : '#0a1628';
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = gold;
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, 0);

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draw coastal beach embellishments (spiral shells, starfish, bubbles, waves, plumeria) onto canvas
 */
function drawCanvasBeachThemeAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[]
) {
  if (photoRects.length === 0) return;
  ctx.save();

  photoRects.forEach((rect, idx) => {
    const pIdx = idx % 4;
    const leftX = rect.x - 26;
    const rightX = rect.x + rect.w + 26;
    const topY = rect.y + 14;
    const midY = rect.y + rect.h / 2;
    const botY = rect.y + rect.h - 14;

    const drawSpiralShell = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(2, 132, 199, 0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 3.5; t += 0.2) {
        const r = 1.2 + 0.8 * t;
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawBubbles = (cx: number, cy: number, scale = 1) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const grad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 9);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.4, 'rgba(253, 244, 255, 0.7)');
      grad.addColorStop(0.7, 'rgba(244, 114, 182, 0.45)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.75)');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();

      ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(-7, 7, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawPlumeria = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * 72 * Math.PI) / 180);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(0, -6, 4, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowColor = 'transparent';
      const yellowGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 5);
      yellowGrad.addColorStop(0, '#f59e0b');
      yellowGrad.addColorStop(0.5, '#fde047');
      yellowGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = yellowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawStarfish = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(234, 88, 12, 0.25)';
      ctx.shadowBlur = 5;

      ctx.fillStyle = '#fb923c';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * (Math.PI / 180);
        const innerAngle = (i * 72 + 36 - 90) * (Math.PI / 180);
        const ox = 9 * Math.cos(outerAngle);
        const oy = 9 * Math.sin(outerAngle);
        const ix = 3.8 * Math.cos(innerAngle);
        const iy = 3.8 * Math.sin(innerAngle);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawScallop = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(2, 132, 199, 0.2)';
      ctx.shadowBlur = 5;

      ctx.fillStyle = '#f0fdfa';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, -1, 8.5, 0, Math.PI, true);
      ctx.lineTo(3, 7);
      ctx.lineTo(-3, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.9;
      for (let a = -0.7; a <= 0.7; a += 0.35) {
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.lineTo(8 * Math.sin(a), -8 * Math.cos(a) - 1);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawWave = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);

      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-9, 6);
      ctx.bezierCurveTo(-5, 6, -1, 4, 1, 0);
      ctx.bezierCurveTo(3, -4, 6, -7, 8, -4);
      ctx.bezierCurveTo(9, -2, 7, 0, 5, -1);
      ctx.bezierCurveTo(2, -2, 0, 2, -3, 5);
      ctx.bezierCurveTo(-5, 7, -7, 7, -9, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(7.5, -4.5, 1.2, 0, Math.PI * 2);
      ctx.arc(5.5, -2, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    if (pIdx === 0) {
      drawSpiralShell(leftX, topY, 1.4, -10);
      drawBubbles(leftX, botY, 1.2);
      drawBubbles(rightX, topY, 1.3);
      drawPlumeria(rightX, botY, 1.3, 12);
    } else if (pIdx === 1) {
      drawWave(leftX, midY, 1.3, -8);
      drawPlumeria(leftX, botY, 1.2, -12);
      drawStarfish(rightX, topY, 1.2, 14);
      drawSpiralShell(rightX, midY, 1.2, -10);
    } else if (pIdx === 2) {
      drawScallop(leftX, midY, 1.3, 8);
      drawStarfish(leftX, botY, 1.2, -14);
      drawWave(rightX, topY, 1.2, 8);
      drawBubbles(rightX, midY, 1.3);
      drawScallop(rightX, botY, 1.2, 10);
    } else if (pIdx === 3) {
      drawBubbles(leftX, topY, 1.2);
      drawSpiralShell(leftX, botY, 1.2, 12);
      drawScallop(rightX, topY, 1.2, -10);
      drawPlumeria(rightX, midY, 1.2, 10);
      drawStarfish(rightX, botY, 1.2, -8);
    }
  });

  ctx.restore();
}

/**
 * Draw nightclub & party theme embellishments (disco balls, headphones, camera flash,
 * vinyl records, dancing silhouettes, lightning, flame, balloons, poppers, sparkles) onto canvas
 */
function drawCanvasPartyThemeAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[]
) {
  if (photoRects.length === 0) return;
  ctx.save();

  photoRects.forEach((rect, idx) => {
    const pIdx = idx % 4;
    const leftX = rect.x - 26;
    const rightX = rect.x + rect.w + 26;
    const topY = rect.y + 14;
    const midY = rect.y + rect.h / 2;
    const botY = rect.y + rect.h - 14;

    const drawDiscoBall = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.45)';
      ctx.shadowBlur = 8;

      // Hanging wire
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, -10);
      ctx.stroke();

      // Main sphere
      const sphereGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, 10);
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.35, '#e2e8f0');
      sphereGrad.addColorStop(0.65, '#f472b6');
      sphereGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = sphereGrad;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Facet grid lines
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, -3.5, 9, 2.2, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, 10, 2.8, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 3.5, 9, 2.2, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Starburst glints
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4, -4, 1.5, 0, Math.PI * 2);
      ctx.arc(4, 3, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPartyPopper = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
      ctx.shadowBlur = 6;

      // Popper cone
      ctx.fillStyle = '#ec4899';
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, 8);
      ctx.lineTo(2, 0);
      ctx.lineTo(-4, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Streamers
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(3, -2);
      ctx.quadraticCurveTo(8, -8, 12, -4);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(4, 2);
      ctx.quadraticCurveTo(9, 7, 13, 3);
      ctx.stroke();

      // Confetti
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(8, -6, 2, 2);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(11, 0, 2, 2);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(6, 4, 2, 2);
      ctx.restore();
    };

    const drawBalloons = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.35)';
      ctx.shadowBlur = 6;

      // Balloon 1 (Purple/Cyan, back)
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(-3, -2, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Balloon 2 (Neon Pink, front)
      const grad = ctx.createRadialGradient(2, -4, 1, 3, -2, 8);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#f472b6');
      grad.addColorStop(1, '#be185d');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(3, 0, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Highlight crescent
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(1, -3, 4, -Math.PI * 0.7, -Math.PI * 0.2);
      ctx.stroke();

      // Ribbon string
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(3, 9);
      ctx.quadraticCurveTo(0, 14, 2, 18);
      ctx.stroke();
      ctx.restore();
    };

    const drawHeadphones = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.shadowBlur = 6;

      // Padded headband
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 0, 9, Math.PI, 0, false);
      ctx.stroke();

      // Ear cups
      ctx.fillStyle = '#ec4899';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-10.5, -2, 3.5, 8, 1.5);
      ctx.roundRect(7, -2, 3.5, 8, 1.5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawCameraFlash = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(250, 204, 21, 0.4)';
      ctx.shadowBlur = 6;

      // Flash burst star
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(2.5, -4);
      ctx.lineTo(10, -2);
      ctx.lineTo(3.5, 1);
      ctx.lineTo(6, 8);
      ctx.lineTo(0, 3);
      ctx.lineTo(-6, 8);
      ctx.lineTo(-3.5, 1);
      ctx.lineTo(-10, -2);
      ctx.lineTo(-2.5, -4);
      ctx.closePath();
      ctx.fill();

      // Camera body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.fillRect(-7, 1, 14, 9);
      ctx.strokeRect(-7, 1, 14, 9);

      // Lens
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 5.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawVinylRecord = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.35)';
      ctx.shadowBlur = 6;

      // Vinyl outer body
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sound grooves
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.stroke();

      // Center neon label
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Spindle hole
      ctx.fillStyle = '#0f1117';
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawDancingSilhouette = (cx: number, cy: number, scale = 1, angle = 0, variant = 1) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
      ctx.shadowBlur = 6;

      ctx.fillStyle = variant === 1 ? '#f472b6' : '#38bdf8';
      // Head
      ctx.beginPath();
      ctx.arc(0, -9, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dancer body & motion limbs
      ctx.strokeStyle = variant === 1 ? '#f472b6' : '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(variant === 1 ? 1 : -1, 0); // torso
      ctx.stroke();

      ctx.beginPath();
      if (variant === 1) {
        // Raised party arms
        ctx.moveTo(-7, -9);
        ctx.lineTo(-2, -4);
        ctx.lineTo(2, -4);
        ctx.lineTo(7, -8);
        ctx.stroke();
        // Dynamic dancing legs
        ctx.moveTo(1, 0);
        ctx.lineTo(-4, 9);
        ctx.moveTo(1, 0);
        ctx.lineTo(5, 7);
        ctx.stroke();
      } else {
        // Groove pose
        ctx.moveTo(-6, -3);
        ctx.lineTo(-1, -4);
        ctx.lineTo(3, -5);
        ctx.lineTo(8, -10);
        ctx.stroke();
        ctx.moveTo(-1, 0);
        ctx.lineTo(-5, 8);
        ctx.moveTo(-1, 0);
        ctx.lineTo(4, 9);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawLightning = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
      ctx.shadowBlur = 6;

      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(1, -9);
      ctx.lineTo(-5, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(-2, 9);
      ctx.lineTo(5, -1);
      ctx.lineTo(0, -1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawFlame = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
      ctx.shadowBlur = 6;

      const grad = ctx.createLinearGradient(0, -9, 0, 9);
      grad.addColorStop(0, '#facc15');
      grad.addColorStop(0.5, '#f43f5e');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.quadraticCurveTo(6, -2, 5, 4);
      ctx.quadraticCurveTo(3, 9, 0, 9);
      ctx.quadraticCurveTo(-3, 9, -5, 4);
      ctx.quadraticCurveTo(-6, -2, 0, -9);
      ctx.fill();
      ctx.restore();
    };

    const drawMusicNotes = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
      ctx.shadowBlur = 5;

      ctx.fillStyle = '#ec4899';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.4;

      // Note heads
      ctx.beginPath();
      ctx.ellipse(-4, 5, 2.5, 2, -0.3, 0, Math.PI * 2);
      ctx.ellipse(4, 3, 2.5, 2, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Note stems & beam
      ctx.beginPath();
      ctx.moveTo(-1.8, 4);
      ctx.lineTo(-1.8, -5);
      ctx.moveTo(6.2, 2);
      ctx.lineTo(6.2, -7);
      ctx.stroke();

      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-2, -4);
      ctx.lineTo(6.5, -6);
      ctx.stroke();
      ctx.restore();
    };

    const drawSparkle = (cx: number, cy: number, scale = 1, type = 'star') => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 5;

      if (type === 'cross') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(1.5, -1.5);
        ctx.lineTo(6, 0);
        ctx.lineTo(1.5, 1.5);
        ctx.lineTo(0, 6);
        ctx.lineTo(-1.5, 1.5);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-1.5, -1.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    if (pIdx === 0) {
      drawDiscoBall(leftX, topY, 1.4, -6);
      drawSparkle(leftX, midY, 1.2, 'star');
      drawLightning(leftX, botY, 1.3, 10);

      drawCameraFlash(rightX, topY, 1.3, 8);
      drawSparkle(rightX, midY, 1.2, 'cross');
      drawMusicNotes(rightX, botY, 1.3, -10);
    } else if (pIdx === 1) {
      drawHeadphones(leftX, topY, 1.3, -10);
      drawMusicNotes(leftX, midY, 1.3, 8);
      drawSparkle(leftX, botY, 1.2, 'cross');

      drawDancingSilhouette(rightX, topY, 1.3, 6, 1);
      drawSparkle(rightX, midY, 1.2, 'star');
      drawFlame(rightX, botY, 1.3, 10);
    } else if (pIdx === 2) {
      drawVinylRecord(leftX, topY, 1.3, 12);
      drawSparkle(leftX, midY, 1.2, 'star');
      drawFlame(leftX, botY, 1.3, -8);

      drawDancingSilhouette(rightX, topY, 1.3, -6, 2);
      drawMusicNotes(rightX, midY, 1.3, 8);
      drawSparkle(rightX, botY, 1.3, 'star');
    } else if (pIdx === 3) {
      drawPartyPopper(leftX, topY, 1.3, -8);
      drawSparkle(leftX, midY, 1.1, 'cross');
      drawLightning(leftX, botY, 1.3, 14);

      drawBalloons(rightX, topY, 1.3, 8);
      drawSparkle(rightX, midY, 1.2, 'star');
      drawDiscoBall(rightX, botY, 1.3, -10);
    }
  });

  ctx.restore();
}

/**
 * Draw wedding celebration theme embellishments (wedding rings, bouquet,
 * pearl hearts, peace dove, sparkles, botanical leaves, champagne flutes, candle, small hearts) onto canvas
 */
function drawCanvasWeddingThemeAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[]
) {
  if (photoRects.length === 0) return;
  ctx.save();

  photoRects.forEach((rect, idx) => {
    const pIdx = idx % 4;
    const leftX = rect.x - 26;
    const rightX = rect.x + rect.w + 26;
    const topY = rect.y + 14;
    const midY = rect.y + rect.h / 2;
    const botY = rect.y + rect.h - 14;

    const drawWeddingRings = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(184, 134, 11, 0.4)';
      ctx.shadowBlur = 6;

      // Band 1 (Left, angled)
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(-3.5, 0, 6.5, 6, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Band 2 (Right, interlocking)
      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(3, 0, 6.5, 6, 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Diamond Solitaire on Band 1
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-4, -6.5);
      ctx.lineTo(-2, -9.5);
      ctx.lineTo(-4, -11.5);
      ctx.lineTo(-6, -9.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Prongs
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(-2, -9, 0.9, 0, Math.PI * 2);
      ctx.arc(-6, -9, 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Diamond Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4, -9.5, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBouquet = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(244, 114, 182, 0.35)';
      ctx.shadowBlur = 6;

      // Stems
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-1, 2);
      ctx.lineTo(-3, 11);
      ctx.moveTo(1, 2);
      ctx.lineTo(2, 11);
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 12);
      ctx.stroke();

      // Satin Ribbon Bow
      ctx.fillStyle = '#fce7f3';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(-3, 4, 3, 2, -0.4, 0, Math.PI * 2);
      ctx.ellipse(3, 4, 3, 2, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 4, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sage Leaves
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.ellipse(-7, -2, 4, 2.2, -0.6, 0, Math.PI * 2);
      ctx.ellipse(7, -2, 4, 2.2, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Roses / Peonies
      // Central blush rose
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(0, -3.5, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, -3.5, 2.2, 0, Math.PI);
      ctx.stroke();

      // Left ivory peony
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-4.5, -6, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(-4.5, -6, 1.8, 0, Math.PI);
      ctx.stroke();

      // Right rosebud
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(4.5, -5.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(4.5, -5.5, 1.8, 0, Math.PI);
      ctx.stroke();

      ctx.restore();
    };

    const drawDove = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(203, 213, 225, 0.6)';
      ctx.shadowBlur = 6;

      // Dove Body & Wings
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;

      // Upper Wing
      ctx.beginPath();
      ctx.moveTo(-1, -2);
      ctx.quadraticCurveTo(-3, -11, 4, -10);
      ctx.quadraticCurveTo(2, -5, 1, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Torso & Tail
      ctx.beginPath();
      ctx.moveTo(6, -2);
      ctx.quadraticCurveTo(8, 0, 4, 3);
      ctx.quadraticCurveTo(0, 5, -5, 4);
      ctx.lineTo(-10, 6);
      ctx.lineTo(-8, 3);
      ctx.quadraticCurveTo(-4, 0, 0, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(4.8, -0.8, 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Golden Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(6.5, -1.2);
      ctx.lineTo(9.5, -0.5);
      ctx.lineTo(6.8, 0.3);
      ctx.closePath();
      ctx.fill();

      // Olive Branch in Beak
      ctx.strokeStyle = '#65a30d';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(8.5, -0.5);
      ctx.quadraticCurveTo(11, -3, 13, -1);
      ctx.stroke();
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.ellipse(10.5, -2.5, 1.8, 1, 0.5, 0, Math.PI * 2);
      ctx.ellipse(12.5, -1.2, 1.8, 1, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawChampagneGlasses = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 6;

      // Toast spark glint
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, -5, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Left Flute (angled right)
      ctx.save();
      ctx.translate(-4, 0);
      ctx.rotate(0.2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-3, -8);
      ctx.lineTo(3, -8);
      ctx.quadraticCurveTo(3, 0, 0, 2);
      ctx.quadraticCurveTo(-3, 0, -3, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 9);
      ctx.moveTo(-3, 9);
      ctx.lineTo(3, 9);
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(-2.5, -4);
      ctx.lineTo(2.5, -4);
      ctx.quadraticCurveTo(2.5, 0, 0, 1.8);
      ctx.quadraticCurveTo(-2.5, 0, -2.5, -4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right Flute (angled left)
      ctx.save();
      ctx.translate(4, 0);
      ctx.rotate(-0.2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-3, -8);
      ctx.lineTo(3, -8);
      ctx.quadraticCurveTo(3, 0, 0, 2);
      ctx.quadraticCurveTo(-3, 0, -3, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 9);
      ctx.moveTo(-3, 9);
      ctx.lineTo(3, 9);
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(-2.5, -4);
      ctx.lineTo(2.5, -4);
      ctx.quadraticCurveTo(2.5, 0, 0, 1.8);
      ctx.quadraticCurveTo(-2.5, 0, -2.5, -4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    const drawCandle = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 7;

      // Base / Saucer
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.ellipse(0, 9, 7, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pillar Candle Body
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 0.8;
      ctx.fillRect(-3.5, 0, 7, 9);
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wick
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -3);
      ctx.stroke();

      // Warm Amber Glow Halo
      const glow = ctx.createRadialGradient(0, -6, 1, 0, -6, 7);
      glow.addColorStop(0, 'rgba(253, 224, 71, 0.8)');
      glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, -6, 7, 0, Math.PI * 2);
      ctx.fill();

      // Flickering Teardrop Flame
      const flameGrad = ctx.createLinearGradient(0, -9, 0, -3);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.4, '#fde047');
      flameGrad.addColorStop(1, '#f97316');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.quadraticCurveTo(2.2, -6, 0, -3);
      ctx.quadraticCurveTo(-2.2, -6, 0, -10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawLeaves = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(77, 124, 15, 0.35)';
      ctx.shadowBlur = 5;

      // Stem
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.quadraticCurveTo(3, 0, -2, -10);
      ctx.stroke();

      // Sage Leaves
      ctx.fillStyle = '#84cc16';
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 0.6;

      const leafPairs = [
        { x: -4, y: 5, a: -0.6 },
        { x: 4, y: 3, a: 0.6 },
        { x: -4, y: -2, a: -0.7 },
        { x: 3, y: -4, a: 0.7 },
        { x: -2, y: -10, a: -0.2 },
      ];

      leafPairs.forEach(({ x, y, a }) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.8, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      ctx.restore();
    };

    const drawHeart = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
      ctx.shadowBlur = 6;

      // Pearl Luster Heart
      const grad = ctx.createLinearGradient(0, -6, 0, 6);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#fef3c7');
      grad.addColorStop(1, '#fde68a');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.1;

      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(-5, -2, -6, -6, -2.5, -7);
      ctx.bezierCurveTo(0, -7.5, 0, -4.5, 0, -4.5);
      ctx.bezierCurveTo(0, -4.5, 0, -7.5, 2.5, -7);
      ctx.bezierCurveTo(6, -6, 5, -2, 0, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const drawFloatingHearts = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);

      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';

      // Small heart 1
      ctx.save();
      ctx.translate(-3, 2);
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(-3, -1, -4, -4, -1.8, -4.5);
      ctx.bezierCurveTo(0, -5, 0, -3, 0, -3);
      ctx.bezierCurveTo(0, -3, 0, -5, 1.8, -4.5);
      ctx.bezierCurveTo(4, -4, 3, -1, 0, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Small heart 2
      ctx.save();
      ctx.translate(3, -3);
      ctx.scale(0.75, 0.75);
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(-3, -1, -4, -4, -1.8, -4.5);
      ctx.bezierCurveTo(0, -5, 0, -3, 0, -3);
      ctx.bezierCurveTo(0, -3, 0, -5, 1.8, -4.5);
      ctx.bezierCurveTo(4, -4, 3, -1, 0, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    const drawSparkle = (cx: number, cy: number, scale = 1, type = 'star') => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 5;

      if (type === 'cross') {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(1.4, -1.4);
        ctx.lineTo(6, 0);
        ctx.lineTo(1.4, 1.4);
        ctx.lineTo(0, 6);
        ctx.lineTo(-1.4, 1.4);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-1.4, -1.4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    if (pIdx === 0) {
      // Photo 1: Ceremony
      drawWeddingRings(leftX, topY, 1.3, -12);
      drawFloatingHearts(leftX, midY, 1.2, 5);
      drawLeaves(leftX, botY, 1.2, -8);

      drawLeaves(rightX, topY, 1.3, 10);
      drawSparkle(rightX, midY, 1.2, 'cross');
      drawHeart(rightX, botY, 1.3, -8);
    } else if (pIdx === 1) {
      // Photo 2: Cocktails
      drawChampagneGlasses(leftX, topY, 1.3, 10);
      drawSparkle(leftX, midY, 1.2, 'star');
      drawHeart(leftX, botY, 1.2, 6);

      drawCandle(rightX, topY, 1.3, 6);
      drawSparkle(rightX, midY, 1.2, 'star');
      drawChampagneGlasses(rightX, botY, 1.3, 10);
    } else if (pIdx === 2) {
      // Photo 3: First Dance
      drawBouquet(leftX, topY, 1.3, 8);
      drawFloatingHearts(leftX, midY, 1.2, -8);
      drawChampagneGlasses(leftX, botY, 1.3, -10);

      drawDove(rightX, topY, 1.3, -6);
      drawFloatingHearts(rightX, midY, 1.2, 4);
      drawWeddingRings(rightX, botY, 1.3, 8);
    } else if (pIdx === 3) {
      // Photo 4: After Party
      drawCandle(leftX, topY, 1.3, -6);
      drawFloatingHearts(leftX, midY, 1.2, 6);
      drawLeaves(leftX, botY, 1.2, 14);

      drawBouquet(rightX, topY, 1.3, 8);
      drawSparkle(rightX, midY, 1.2, 'star');
      drawChampagneGlasses(rightX, botY, 1.3, -10);
    }
  });

  ctx.restore();
}

/**
 * Draw birthday party celebration theme embellishments (cake, balloons, gift box,
 * party popper, party face, sparkles, confetti, candles, cupcake, stars, ribbon, celebration glasses) onto canvas
 */
function drawCanvasBirthdayThemeAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[]
) {
  if (photoRects.length === 0) return;
  ctx.save();

  photoRects.forEach((rect, idx) => {
    const pIdx = idx % 4;
    const leftX = rect.x - 26;
    const rightX = rect.x + rect.w + 26;
    const topY = rect.y + 14;
    const midY = rect.y + rect.h / 2;
    const botY = rect.y + rect.h - 14;

    const drawCake = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(217, 119, 6, 0.35)';
      ctx.shadowBlur = 6;

      // Cake Plate / Stand
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, 10, 10, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bottom Tier Sponge
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.rect(-8, 3, 16, 6.5);
      ctx.fill();
      ctx.stroke();

      // Middle Cream Stripe
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, 6.5);
      ctx.lineTo(8, 6.5);
      ctx.stroke();

      // Top Frosting Scallop Drips
      ctx.fillStyle = '#fce7f3';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-8, 3);
      ctx.lineTo(8, 3);
      ctx.quadraticCurveTo(6, 6, 4, 3);
      ctx.quadraticCurveTo(2, 6, 0, 3);
      ctx.quadraticCurveTo(-2, 6, -4, 3);
      ctx.quadraticCurveTo(-6, 6, -8, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sprinkles
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-4, 4.5, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 4.2, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.arc(4, 4.8, 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Lit Candles
      const candleColors = ['#38bdf8', '#ec4899', '#facc15'];
      const candleX = [-4.5, 0, 4.5];
      candleX.forEach((kx, ci) => {
        ctx.fillStyle = candleColors[ci];
        ctx.fillRect(kx - 0.8, -1.5, 1.6, 4.5);
        // Flame halo
        ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.beginPath();
        ctx.arc(kx, -4.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Flame
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(kx, -6);
        ctx.quadraticCurveTo(kx + 1.2, -4, kx, -2.5);
        ctx.quadraticCurveTo(kx - 1.2, -4, kx, -6);
        ctx.fill();
      });

      ctx.restore();
    };

    const drawBalloons = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(239, 68, 68, 0.35)';
      ctx.shadowBlur = 6;

      // Cyan Balloon (Back Left)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-4.5, -2, 4.5, 6, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Gold Balloon (Back Right)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(4.5, -3, 4.5, 6, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Coral Red Balloon (Front Center)
      ctx.fillStyle = '#f43f5e';
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, -1, 5.5, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glossy highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(-2, -4, 1.4, 2.8, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Knot
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-1, 6.5);
      ctx.lineTo(1, 6.5);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();

      // Ribbon strings
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.quadraticCurveTo(-3, 11, 0, 13);
      ctx.quadraticCurveTo(2, 15, -1, 17);
      ctx.stroke();

      ctx.restore();
    };

    const drawGiftBox = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.35)';
      ctx.shadowBlur = 6;

      // Box Body
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.roundRect(-7, -2, 14, 11, 1.5);
      ctx.fill();
      ctx.stroke();

      // Lid
      ctx.beginPath();
      ctx.roundRect(-8, -5.5, 16, 3.5, 1.2);
      ctx.fill();
      ctx.stroke();

      // Vertical Gold Ribbon
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-1.5, -5.5, 3, 14.5);

      // Ribbon Bow loops
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.ellipse(-3, -7.5, 3, 2, -0.3, 0, Math.PI * 2);
      ctx.ellipse(3, -7.5, 3, 2, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Knot
      ctx.beginPath();
      ctx.arc(0, -6.8, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const drawPopper = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(236, 72, 153, 0.4)';
      ctx.shadowBlur = 6;

      // Party Cone
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-7, 8);
      ctx.lineTo(3, -2);
      ctx.lineTo(6, 1);
      ctx.lineTo(-4, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cone stripes
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.lineTo(0, 2);
      ctx.stroke();

      // Confetti Streamers
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(3, -2);
      ctx.quadraticCurveTo(8, -8, 11, -5);
      ctx.stroke();

      ctx.strokeStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.moveTo(6, 1);
      ctx.quadraticCurveTo(10, 4, 13, 0);
      ctx.stroke();

      // Confetti dots
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(8, -6, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(11, 2, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(6, -8, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawPartyFace = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      ctx.shadowBlur = 6;

      // Face
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(0, 2, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rosy Cheeks
      ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
      ctx.beginPath();
      ctx.arc(-4.5, 3.5, 1.5, 0, Math.PI * 2);
      ctx.arc(4.5, 3.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Smiling curved eyes
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-3, 0, 1.5, Math.PI, 0, false);
      ctx.moveTo(1.5, 0);
      ctx.arc(3, 0, 1.5, Math.PI, 0, false);
      ctx.stroke();

      // Party Cone Hat
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-3.5, -4.5);
      ctx.lineTo(2, -12);
      ctx.lineTo(5.5, -3.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hat Pompom
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(2, -12, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Horn swirl from mouth
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(1, 5);
      ctx.quadraticCurveTo(6, 6, 8, 4);
      ctx.stroke();

      ctx.restore();
    };

    const drawSparkles = (cx: number, cy: number, scale = 1, variant = 'star') => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 5;

      if (variant === 'cross') {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.lineTo(4, 4);
        ctx.moveTo(4, -4);
        ctx.lineTo(-4, 4);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, -6.5);
        ctx.lineTo(1.5, -1.5);
        ctx.lineTo(6.5, 0);
        ctx.lineTo(1.5, 1.5);
        ctx.lineTo(0, 6.5);
        ctx.lineTo(-1.5, 1.5);
        ctx.lineTo(-6.5, 0);
        ctx.lineTo(-1.5, -1.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawConfetti = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Streamer 1
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.quadraticCurveTo(0, -10, 4, -4);
      ctx.quadraticCurveTo(8, 2, 4, 8);
      ctx.stroke();

      // Streamer 2
      ctx.strokeStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.quadraticCurveTo(0, 2, 6, 4);
      ctx.stroke();

      // Dots
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(-5, 0, 1.2, 0, Math.PI * 2);
      ctx.arc(6, -6, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(1, -2, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawCandles = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
      ctx.shadowBlur = 6;

      const candles = [
        { x: -5, h: 10, col: '#38bdf8' },
        { x: 0, h: 13, col: '#f472b6' },
        { x: 5, h: 10, col: '#facc15' },
      ];

      candles.forEach(({ x, h, col }) => {
        ctx.fillStyle = col;
        ctx.fillRect(x - 1.8, 10 - h, 3.6, h);
        // Wick
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, 10 - h);
        ctx.lineTo(x, 8 - h);
        ctx.stroke();
        // Flame
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(x, 5 - h);
        ctx.quadraticCurveTo(x + 1.4, 7.5 - h, x, 9 - h);
        ctx.quadraticCurveTo(x - 1.4, 7.5 - h, x, 5 - h);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(x, 7.5 - h, 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    const drawCupcake = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(217, 119, 6, 0.35)';
      ctx.shadowBlur = 6;

      // Gold Foil Cup
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(-6, 2);
      ctx.lineTo(-4.5, 9);
      ctx.lineTo(4.5, 9);
      ctx.lineTo(6, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Frosting Swirl
      ctx.fillStyle = '#fed7aa';
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.ellipse(0, 2, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffedd5';
      ctx.beginPath();
      ctx.ellipse(0, -1, 4.5, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Lit Candle
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-0.8, -6, 1.6, 4.5);
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.quadraticCurveTo(1.2, -7.5, 0, -6);
      ctx.quadraticCurveTo(-1.2, -7.5, 0, -9);
      ctx.fill();

      // Sprinkles
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-3, 1.5, 0.6, 0, Math.PI * 2);
      ctx.arc(3, 1, 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawStar = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
      ctx.shadowBlur = 6;

      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * (Math.PI / 180);
        const innerAngle = (i * 72 + 36 - 90) * (Math.PI / 180);
        const ox = 8 * Math.cos(outerAngle);
        const oy = 8 * Math.sin(outerAngle);
        const ix = 3.4 * Math.cos(innerAngle);
        const iy = 3.4 * Math.sin(innerAngle);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Facet highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(1.8, -2);
      ctx.lineTo(6, -2);
      ctx.lineTo(2.5, 1.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawRibbon = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
      ctx.shadowBlur = 6;

      ctx.fillStyle = '#f43f5e';
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 0.8;

      // Left Loop
      ctx.beginPath();
      ctx.ellipse(-4, -1, 3.8, 2.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right Loop
      ctx.beginPath();
      ctx.ellipse(4, -1, 3.8, 2.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Center Knot
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tails
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-1, 1.5);
      ctx.quadraticCurveTo(-4, 6, -6, 9);
      ctx.moveTo(1, 1.5);
      ctx.quadraticCurveTo(4, 6, 6, 9);
      ctx.stroke();

      ctx.restore();
    };

    const drawGlasses = (cx: number, cy: number, scale = 1, angle = 0) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.shadowColor = 'rgba(234, 179, 8, 0.45)';
      ctx.shadowBlur = 6;

      // Toast spark glint
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, -6, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Left glass (angled right)
      ctx.save();
      ctx.translate(-3.5, 0);
      ctx.rotate(0.2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-2.5, -7);
      ctx.lineTo(2.5, -7);
      ctx.quadraticCurveTo(2.5, 0, 0, 2);
      ctx.quadraticCurveTo(-2.5, 0, -2.5, -7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 8);
      ctx.moveTo(-2.5, 8);
      ctx.lineTo(2.5, 8);
      ctx.stroke();
      ctx.restore();

      // Right glass (angled left)
      ctx.save();
      ctx.translate(3.5, 0);
      ctx.rotate(-0.2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-2.5, -7);
      ctx.lineTo(2.5, -7);
      ctx.quadraticCurveTo(2.5, 0, 0, 2);
      ctx.quadraticCurveTo(-2.5, 0, -2.5, -7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 8);
      ctx.moveTo(-2.5, 8);
      ctx.lineTo(2.5, 8);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    if (pIdx === 0) {
      // Photo 1: PARTY VIBES
      drawPopper(leftX, topY, 1.3, -8);
      drawSparkles(leftX, midY, 1.2, 'star');
      drawConfetti(leftX, botY, 1.2, 5);

      drawBalloons(rightX, topY, 1.3, 8);
      drawStar(rightX, midY, 1.3, 12);
      drawRibbon(rightX, botY, 1.3, -8);
    } else if (pIdx === 1) {
      // Photo 2: MAKE A WISH
      drawCandles(leftX, topY, 1.3, -6);
      drawSparkles(leftX, midY, 1.2, 'cross');
      drawPartyFace(leftX, botY, 1.2, 6);

      drawCake(rightX, topY, 1.3, 6);
      drawSparkles(rightX, midY, 1.2, 'star');
      drawGlasses(rightX, botY, 1.3, 8);
    } else if (pIdx === 2) {
      // Photo 3: CAKE TIME
      drawCupcake(leftX, topY, 1.3, 8);
      drawStar(leftX, midY, 1.2, -10);
      drawConfetti(leftX, botY, 1.2, -6);

      drawCake(rightX, topY, 1.3, -6);
      drawRibbon(rightX, midY, 1.2, 4);
      drawGlasses(rightX, botY, 1.3, -10);
    } else if (pIdx === 3) {
      // Photo 4: SQUAD
      drawGiftBox(leftX, topY, 1.3, -6);
      drawPartyFace(leftX, midY, 1.2, 8);
      drawStar(leftX, botY, 1.2, 14);

      drawBalloons(rightX, topY, 1.3, 8);
      drawSparkles(rightX, midY, 1.2, 'cross');
      drawPopper(rightX, botY, 1.3, 10);
    }
  });

  ctx.restore();
}

async function renderPhotoStrip(opts: RenderStripOptions): Promise<string> {
  const layout = LAYOUTS.find((l) => l.id === opts.layout || (l.id === 'polaroid' && opts.layout === 'single') || (l.id === 'grid2x2' && opts.layout === 'grid4')) ?? LAYOUTS[0];
  const frame = FRAMES.find((f) => f.id === opts.frame) ?? FRAMES[0];
  const images = await Promise.all(opts.shots.map(loadImage));

  const cols = layout.columns;
  const rows = Math.ceil(images.length / cols);
  const canvasWidth = 112 + cols * PHOTO_WIDTH + (cols - 1) * 32;
  const canvasHeight = 112 + rows * PHOTO_HEIGHT + (rows - 1) * 32 + 200;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser');

  // Fill paper
  ctx.fillStyle = opts.frameColor || frame.paper;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const isSchoolThemeCanvas = 
    opts.templateId === 'event_school' ||
    (!opts.templateId && (
      opts.frameColor === '#0a1424' || 
      opts.frameColor === '#091424' || 
      opts.frameColor === '#fdfaf3' ||
      opts.title.toLowerCase().includes('school') ||
      opts.title.toLowerCase().includes('academy') ||
      opts.title.toLowerCase().includes('collegiate') ||
      opts.title.toLowerCase().includes('yearbook')
    ));

  const isLightCanvas = isLightColor(opts.frameColor || frame.paper);
  const schoolGold = isLightCanvas ? '#855d10' : '#d4af37';
  const schoolInk = isLightCanvas ? '#0c1a30' : '#fcf8ef';

  // Academic Double Gold Diploma Borders
  if (isSchoolThemeCanvas) {
    ctx.strokeStyle = schoolGold;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);
    ctx.strokeStyle = isLightCanvas ? 'rgba(133, 93, 16, 0.45)' : 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);
  }

  // Draw photos
  const photoRects: { x: number; y: number; w: number; h: number }[] = [];
  images.forEach((img, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = 56 + col * (PHOTO_WIDTH + 32);
    const y = 56 + row * (PHOTO_HEIGHT + 32);
    photoRects.push({ x, y, w: PHOTO_WIDTH, h: PHOTO_HEIGHT });

    const scale = Math.max(PHOTO_WIDTH / img.width, PHOTO_HEIGHT / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
    ctx.clip();
    ctx.filter = opts.filterCss || 'none';
    ctx.drawImage(img, x + (PHOTO_WIDTH - drawW) / 2, y + (PHOTO_HEIGHT - drawH) / 2, drawW, drawH);
    ctx.restore();

    if (isSchoolThemeCanvas) {
      ctx.strokeStyle = isLightCanvas ? 'rgba(133, 93, 16, 0.7)' : 'rgba(212, 175, 55, 0.8)';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
    }
  });

  // Draw school stickers & badges onto canvas
  if (isSchoolThemeCanvas && cols === 1) {
    drawCanvasSchoolThemeAccents(ctx, canvasWidth, canvasHeight, isLightCanvas, photoRects);
  }

  const isBeachThemeCanvas =
    opts.templateId === 'event_beach' ||
    (!opts.templateId && (
      opts.frameColor === '#fefcf6' ||
      opts.title.toLowerCase().includes('beach') ||
      opts.title.toLowerCase().includes('surf') ||
      opts.title.toLowerCase().includes('bonfire') ||
      opts.caption.toLowerCase().includes('beach') ||
      opts.caption.toLowerCase().includes('surf')
    ));

  if (isBeachThemeCanvas && cols === 1) {
    drawCanvasBeachThemeAccents(ctx, canvasWidth, canvasHeight, photoRects);
  }

  const isPartyThemeCanvas =
    opts.templateId === 'event_party' ||
    (!opts.templateId && (
      opts.frameColor === '#0f1117' ||
      opts.title.toLowerCase().includes('party') ||
      opts.title.toLowerCase().includes('nightclub') ||
      opts.title.toLowerCase().includes('dance') ||
      opts.caption.toLowerCase().includes('party') ||
      opts.caption.toLowerCase().includes('midnight')
    ));

  if (isPartyThemeCanvas && cols === 1) {
    drawCanvasPartyThemeAccents(ctx, canvasWidth, canvasHeight, photoRects);
  }

  const isWeddingThemeCanvas =
    opts.templateId === 'event_wedding' ||
    (!opts.templateId && (
      opts.frameColor === '#fcf8f4' ||
      opts.frameColor === '#fbf8f1' ||
      opts.title.toLowerCase().includes('wedding') ||
      opts.title.toLowerCase().includes('matrimony') ||
      opts.title.toLowerCase().includes('nuptial') ||
      opts.title.toLowerCase().includes('vow') ||
      opts.caption.toLowerCase().includes('wedding') ||
      opts.caption.toLowerCase().includes('reception')
    ));

  if (isWeddingThemeCanvas && cols === 1) {
    drawCanvasWeddingThemeAccents(ctx, canvasWidth, canvasHeight, photoRects);
  }

  const isBirthdayThemeCanvas =
    opts.templateId === 'event_birthday' ||
    (!opts.templateId && (
      opts.frameColor === '#fffdf9' ||
      (opts.frameColor === '#ffffff' && (opts.title.toLowerCase().includes('birthday') || opts.caption.toLowerCase().includes('birthday'))) ||
      opts.title.toLowerCase().includes('birthday') ||
      opts.title.toLowerCase().includes('bash') ||
      opts.title.toLowerCase().includes('celebrate') ||
      opts.caption.toLowerCase().includes('birthday') ||
      opts.caption.toLowerCase().includes('celebration')
    ));

  const isCorporateThemeCanvas =
    opts.templateId === 'event_corporate' ||
    (!opts.templateId && (
      opts.frameColor === '#f8fafc' ||
      opts.title.toLowerCase().includes('corporate') ||
      opts.title.toLowerCase().includes('summit') ||
      opts.title.toLowerCase().includes('gala') ||
      opts.caption.toLowerCase().includes('corporate') ||
      opts.caption.toLowerCase().includes('innovation')
    ));

  const isGraduationThemeCanvas =
    opts.templateId === 'event_graduation' ||
    (!opts.templateId && (
      opts.frameColor === '#0a1128' ||
      opts.title.toLowerCase().includes('graduation') ||
      opts.title.toLowerCase().includes('commencement') ||
      opts.caption.toLowerCase().includes('honors') ||
      opts.caption.toLowerCase().includes('graduate')
    ));

  if (isBirthdayThemeCanvas && cols === 1) {
    drawCanvasBirthdayThemeAccents(ctx, canvasWidth, canvasHeight, photoRects);
  }

  ctx.filter = 'none';

  // Bottom footer area
  const footerTop = canvasHeight - 200 + 24;
  ctx.fillStyle = isSchoolThemeCanvas
    ? schoolInk
    : isBeachThemeCanvas
    ? '#0f172a'
    : isPartyThemeCanvas
    ? '#f4f4f5'
    : isWeddingThemeCanvas
    ? '#1f1b18'
    : isBirthdayThemeCanvas
    ? '#18181b'
    : isCorporateThemeCanvas
    ? '#0f172a'
    : isGraduationThemeCanvas
    ? '#fcf8ef'
    : (opts.textColor || frame.ink);
  ctx.textAlign = 'center';
  ctx.font = 'bold 72px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(
    isSchoolThemeCanvas
      ? 'CAMPUS DAYS • SCHOOL YEAR 2026–2027'
      : isBeachThemeCanvas
      ? 'GOOD VIBES, GREAT TIMES'
      : isPartyThemeCanvas
      ? 'GOOD FRIENDS. GREAT NIGHT'
      : isWeddingThemeCanvas
      ? 'FOREVER BEGINS'
      : isBirthdayThemeCanvas
      ? 'CELEBRATE EVERY LITTLE MOMENT'
      : isCorporateThemeCanvas
      ? 'BUILT TOGETHER. ACHIEVED TOGETHER'
      : isGraduationThemeCanvas
      ? 'THE NEXT CHAPTER'
      : opts.title.toUpperCase().slice(0, 28),
    canvasWidth / 2,
    footerTop + 58
  );

  ctx.fillStyle = isSchoolThemeCanvas
    ? schoolGold
    : isBeachThemeCanvas
    ? '#0284c7'
    : isPartyThemeCanvas
    ? '#ec4899'
    : isWeddingThemeCanvas
    ? '#b8860b'
    : isBirthdayThemeCanvas
    ? '#d97706'
    : isCorporateThemeCanvas
    ? '#2563eb'
    : isGraduationThemeCanvas
    ? '#d4af37'
    : (opts.textColor || frame.ink);
  if (isSchoolThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('MEMORIES WITH CLASSMATES • EVERYDAY MOMENTS', canvasWidth / 2, footerTop + 116);
  } else if (isBeachThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('SUN • SAND • SEA • MEMORIES', canvasWidth / 2, footerTop + 116);
  } else if (isPartyThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('DANCE • LAUGH • CELEBRATE • REPEAT', canvasWidth / 2, footerTop + 116);
  } else if (isWeddingThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('TWO HEARTS • ONE BEAUTIFUL JOURNEY', canvasWidth / 2, footerTop + 116);
  } else if (isBirthdayThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('GOOD TIMES • BIG SMILES • GREAT MEMORIES', canvasWidth / 2, footerTop + 116);
  } else if (isCorporateThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('CONNECT • COLLABORATE • CELEBRATE', canvasWidth / 2, footerTop + 116);
  } else if (isGraduationThemeCanvas) {
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText('ONE JOURNEY ENDS. ANOTHER BEGINS', canvasWidth / 2, footerTop + 116);
  } else if (opts.caption.trim()) {
    ctx.font = 'italic 44px "Cormorant Garamond", Georgia, serif';
    ctx.globalAlpha = 0.85;
    ctx.fillText(opts.caption.slice(0, 44), canvasWidth / 2, footerTop + 126);
    ctx.globalAlpha = 1;
  }

  if (opts.watermark !== false) {
    ctx.font = '500 24px "JetBrains Mono", monospace';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = isSchoolThemeCanvas ? schoolInk : (opts.textColor || frame.ink);
    ctx.fillText('MEMORA • LIVE BOOTH', canvasWidth / 2, canvasHeight - 34);
    ctx.globalAlpha = 1;
  }

  return canvas.toDataURL('image/png');
}

async function renderPhotoStripGif(opts: RenderStripOptions): Promise<string> {
  const layout = LAYOUTS.find((l) => l.id === opts.layout || (l.id === 'polaroid' && opts.layout === 'single') || (l.id === 'grid2x2' && opts.layout === 'grid4')) ?? LAYOUTS[0];
  const frame = FRAMES.find((f) => f.id === opts.frame) ?? FRAMES[0];
  const images = await Promise.all(opts.shots.map(loadImage));

  const cols = layout.columns;
  const rows = Math.ceil(images.length / cols);
  const baseWidth = 112 + cols * PHOTO_WIDTH + (cols - 1) * 32;
  const baseHeight = 112 + rows * PHOTO_HEIGHT + (rows - 1) * 32 + 200;

  // Optimized responsive dimensions for silky smooth mobile & desktop GIF generation
  const scale = Math.min(380 / baseWidth, 780 / baseHeight);
  const gifWidth = Math.round(baseWidth * scale);
  const gifHeight = Math.round(baseHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = gifWidth;
  canvas.height = gifHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser');

  const encoder = GIFEncoder();

  const drawStripFrame = (activeIdx: number | null) => {
    ctx.save();
    ctx.scale(scale, scale);

    // Fill background paper
    ctx.fillStyle = opts.frameColor || frame.paper;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    const isSchoolThemeCanvas = 
      opts.templateId === 'event_school' ||
      (!opts.templateId && (
        opts.frameColor === '#0a1424' || 
        opts.frameColor === '#091424' || 
        opts.frameColor === '#fdfaf3' ||
        opts.title.toLowerCase().includes('school') ||
        opts.title.toLowerCase().includes('academy') ||
        opts.title.toLowerCase().includes('collegiate') ||
        opts.title.toLowerCase().includes('yearbook')
      ));

    const isLightCanvas = isLightColor(opts.frameColor || frame.paper);
    const schoolGold = isLightCanvas ? '#855d10' : '#d4af37';
    const schoolInk = isLightCanvas ? '#0c1a30' : '#fcf8ef';

    if (isSchoolThemeCanvas) {
      ctx.strokeStyle = schoolGold;
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, baseWidth - 40, baseHeight - 40);
      ctx.strokeStyle = isLightCanvas ? 'rgba(133, 93, 16, 0.45)' : 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, baseWidth - 60, baseHeight - 60);
    }

    // Draw photos
    const photoRects: { x: number; y: number; w: number; h: number }[] = [];
    images.forEach((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 56 + col * (PHOTO_WIDTH + 32);
      const y = 56 + row * (PHOTO_HEIGHT + 32);
      photoRects.push({ x, y, w: PHOTO_WIDTH, h: PHOTO_HEIGHT });

      const s = Math.max(PHOTO_WIDTH / img.width, PHOTO_HEIGHT / img.height);
      const drawW = img.width * s;
      const drawH = img.height * s;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
      ctx.clip();
      ctx.filter = opts.filterCss || 'none';

      // Soften inactive photos slightly in spotlight frames to highlight active pose
      if (activeIdx !== null && activeIdx !== index) {
        ctx.globalAlpha = 0.72;
      } else {
        ctx.globalAlpha = 1.0;
      }

      ctx.drawImage(img, x + (PHOTO_WIDTH - drawW) / 2, y + (PHOTO_HEIGHT - drawH) / 2, drawW, drawH);
      ctx.restore();

      // Framing stroke
      const isInkLight = opts.textColor ? isLightColor(opts.textColor) : frame.ink === '#fffdf7';
      if (activeIdx === index) {
        ctx.strokeStyle = isInkLight ? '#d8b86a' : '#2b211c';
        ctx.lineWidth = 10;
        ctx.strokeRect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
      } else if (isSchoolThemeCanvas) {
        ctx.strokeStyle = isLightCanvas ? 'rgba(133, 93, 16, 0.7)' : 'rgba(212, 175, 55, 0.8)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
      } else {
        ctx.strokeStyle = isInkLight ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
      }
    });

    // Draw school stickers & badges onto animated GIF canvas
    if (isSchoolThemeCanvas && cols === 1) {
      drawCanvasSchoolThemeAccents(ctx, baseWidth, baseHeight, isLightCanvas, photoRects);
    }

    const isBeachThemeCanvas =
      opts.templateId === 'event_beach' ||
      (!opts.templateId && (
        opts.frameColor === '#fefcf6' ||
        opts.title.toLowerCase().includes('beach') ||
        opts.title.toLowerCase().includes('surf') ||
        opts.title.toLowerCase().includes('bonfire') ||
        opts.caption.toLowerCase().includes('beach') ||
        opts.caption.toLowerCase().includes('surf')
      ));

    if (isBeachThemeCanvas && cols === 1) {
      drawCanvasBeachThemeAccents(ctx, baseWidth, baseHeight, photoRects);
    }

    const isPartyThemeCanvas =
      opts.templateId === 'event_party' ||
      (!opts.templateId && (
        opts.frameColor === '#0f1117' ||
        opts.title.toLowerCase().includes('party') ||
        opts.title.toLowerCase().includes('nightclub') ||
        opts.title.toLowerCase().includes('dance') ||
        opts.caption.toLowerCase().includes('party') ||
        opts.caption.toLowerCase().includes('midnight')
      ));

    if (isPartyThemeCanvas && cols === 1) {
      drawCanvasPartyThemeAccents(ctx, baseWidth, baseHeight, photoRects);
    }

    const isWeddingThemeCanvas =
      opts.templateId === 'event_wedding' ||
      (!opts.templateId && (
        opts.frameColor === '#fcf8f4' ||
        opts.frameColor === '#fbf8f1' ||
        opts.title.toLowerCase().includes('wedding') ||
        opts.title.toLowerCase().includes('matrimony') ||
        opts.title.toLowerCase().includes('nuptial') ||
        opts.title.toLowerCase().includes('vow') ||
        opts.caption.toLowerCase().includes('wedding') ||
        opts.caption.toLowerCase().includes('reception')
      ));

    if (isWeddingThemeCanvas && cols === 1) {
      drawCanvasWeddingThemeAccents(ctx, baseWidth, baseHeight, photoRects);
    }

    const isBirthdayThemeCanvas =
      opts.templateId === 'event_birthday' ||
      (!opts.templateId && (
        opts.frameColor === '#fffdf9' ||
        (opts.frameColor === '#ffffff' && (opts.title.toLowerCase().includes('birthday') || opts.caption.toLowerCase().includes('birthday'))) ||
        opts.title.toLowerCase().includes('birthday') ||
        opts.title.toLowerCase().includes('bash') ||
        opts.title.toLowerCase().includes('celebrate') ||
        opts.caption.toLowerCase().includes('birthday') ||
        opts.caption.toLowerCase().includes('celebration')
      ));

    const isCorporateThemeCanvas =
      opts.templateId === 'event_corporate' ||
      (!opts.templateId && (
        opts.frameColor === '#f8fafc' ||
        opts.title.toLowerCase().includes('corporate') ||
        opts.title.toLowerCase().includes('summit') ||
        opts.title.toLowerCase().includes('gala') ||
        opts.caption.toLowerCase().includes('corporate') ||
        opts.caption.toLowerCase().includes('innovation')
      ));

    const isGraduationThemeCanvas =
      opts.templateId === 'event_graduation' ||
      (!opts.templateId && (
        opts.frameColor === '#0a1128' ||
        opts.title.toLowerCase().includes('graduation') ||
        opts.title.toLowerCase().includes('commencement') ||
        opts.caption.toLowerCase().includes('honors') ||
        opts.caption.toLowerCase().includes('graduate')
      ));

    if (isBirthdayThemeCanvas && cols === 1) {
      drawCanvasBirthdayThemeAccents(ctx, baseWidth, baseHeight, photoRects);
    }

    ctx.filter = 'none';
    ctx.globalAlpha = 1;

    // Bottom footer area
    const footerTop = baseHeight - 200 + 24;
    ctx.fillStyle = isSchoolThemeCanvas
      ? schoolInk
      : isBeachThemeCanvas
      ? '#0f172a'
      : isPartyThemeCanvas
      ? '#f4f4f5'
      : isWeddingThemeCanvas
      ? '#1f1b18'
      : isBirthdayThemeCanvas
      ? '#18181b'
      : isCorporateThemeCanvas
      ? '#0f172a'
      : isGraduationThemeCanvas
      ? '#fcf8ef'
      : (opts.textColor || frame.ink);
    ctx.textAlign = 'center';
    ctx.font = 'bold 72px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(
      isSchoolThemeCanvas
        ? 'CAMPUS DAYS • SCHOOL YEAR 2026–2027'
        : isBeachThemeCanvas
        ? 'GOOD VIBES, GREAT TIMES'
        : isPartyThemeCanvas
        ? 'GOOD FRIENDS. GREAT NIGHT'
        : isWeddingThemeCanvas
        ? 'FOREVER BEGINS'
        : isBirthdayThemeCanvas
        ? 'CELEBRATE EVERY LITTLE MOMENT'
        : isCorporateThemeCanvas
        ? 'BUILT TOGETHER. ACHIEVED TOGETHER'
        : isGraduationThemeCanvas
        ? 'THE NEXT CHAPTER'
        : opts.title.toUpperCase().slice(0, 28),
      baseWidth / 2,
      footerTop + 58
    );

    ctx.fillStyle = isSchoolThemeCanvas
      ? schoolGold
      : isBeachThemeCanvas
      ? '#0284c7'
      : isPartyThemeCanvas
      ? '#ec4899'
      : isWeddingThemeCanvas
      ? '#b8860b'
      : isBirthdayThemeCanvas
      ? '#d97706'
      : isCorporateThemeCanvas
      ? '#2563eb'
      : isGraduationThemeCanvas
      ? '#d4af37'
      : (opts.textColor || frame.ink);
    if (isSchoolThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('MEMORIES WITH CLASSMATES • EVERYDAY MOMENTS', baseWidth / 2, footerTop + 116);
    } else if (isBeachThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('SUN • SAND • SEA • MEMORIES', baseWidth / 2, footerTop + 116);
    } else if (isPartyThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('DANCE • LAUGH • CELEBRATE • REPEAT', baseWidth / 2, footerTop + 116);
    } else if (isWeddingThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('TWO HEARTS • ONE BEAUTIFUL JOURNEY', baseWidth / 2, footerTop + 116);
    } else if (isBirthdayThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('GOOD TIMES • BIG SMILES • GREAT MEMORIES', baseWidth / 2, footerTop + 116);
    } else if (isCorporateThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('CONNECT • COLLABORATE • CELEBRATE', baseWidth / 2, footerTop + 116);
    } else if (isGraduationThemeCanvas) {
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText('ONE JOURNEY ENDS. ANOTHER BEGINS', baseWidth / 2, footerTop + 116);
    } else if (opts.caption.trim()) {
      ctx.font = 'italic 44px "Cormorant Garamond", Georgia, serif';
      ctx.globalAlpha = 0.85;
      ctx.fillText(opts.caption.slice(0, 44), baseWidth / 2, footerTop + 126);
      ctx.globalAlpha = 1;
    }

    if (opts.watermark !== false) {
      ctx.font = '500 24px "JetBrains Mono", monospace';
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = isSchoolThemeCanvas ? schoolInk : (opts.textColor || frame.ink);
      ctx.fillText('MEMORA • LIVE BOOTH', baseWidth / 2, baseHeight - 34);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  };

  // 1. Sequential Pose Animation Frames (Delay 550ms)
  for (let i = 0; i < images.length; i++) {
    drawStripFrame(i);
    const { data } = ctx.getImageData(0, 0, gifWidth, gifHeight);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    encoder.writeFrame(index, gifWidth, gifHeight, { palette, delay: 550 });
  }

  // 2. Grand Finale Frame: All poses illuminated together (Delay 1200ms)
  drawStripFrame(null);
  const { data } = ctx.getImageData(0, 0, gifWidth, gifHeight);
  const palette = quantize(data, 256);
  const index = applyPalette(data, palette);
  encoder.writeFrame(index, gifWidth, gifHeight, { palette, delay: 1200 });

  encoder.finish();
  const bytes = encoder.bytes();
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'image/gif' });
  return URL.createObjectURL(blob);
}

function triggerDownload(dataUrl: string, filename: string, eventName = 'Memora Booth') {
  try {
    const { incrementRealPhotos, recordRealAuditLog } = require('@/lib/adminRecords');
    incrementRealPhotos(1);
    const isGif = filename.toLowerCase().endsWith('.gif');
    recordRealAuditLog(
      isGif ? 'Guest animated GIF strip captured & exported' : 'Guest photostrip captured & exported',
      'Photobooth Kiosk',
      'info'
    );

    // Persist photo to live gallery store
    const raw = localStorage.getItem('memora_gallery_photos');
    const photos = raw ? JSON.parse(raw) : [];
    const newPhoto = {
      id: `${isGif ? 'gif' : 'strip'}_${Date.now()}`,
      eventName,
      imgUrl: dataUrl,
      capturedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      downloads: 1,
      type: isGif ? 'gif' : 'strip',
    };
    photos.unshift(newPhoto);
    localStorage.setItem('memora_gallery_photos', JSON.stringify(photos.slice(0, 50)));

    // Increment event photo count if event matches
    const storedEvents = localStorage.getItem('memora_events');
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      if (Array.isArray(events)) {
        const updated = events.map((ev: any) => {
          if (ev.name?.toLowerCase() === eventName.toLowerCase() || ev.slug === eventName.toLowerCase()) {
            return { 
              ...ev, 
              photoCount: (ev.photoCount || 0) + 1, 
              photosCount: (ev.photosCount || 0) + 1 
            };
          }
          return ev;
        });
        localStorage.setItem('memora_events', JSON.stringify(updated));
      }
    }

    // Broadcast across the realtime bus to update all open dashboards, galleries, analytics, and tabs instantly
    broadcastRealtime('PHOTO_CAPTURED', {
      id: newPhoto.id,
      eventName,
      imgUrl: dataUrl,
      timestamp: 'Just now',
    });
    broadcastRealtime('ACTIVITY_LOGGED', {
      event: `Guest photostrip captured & exported at ${eventName}`,
      actor: 'Photobooth Kiosk',
      severity: 'info',
    });
  } catch {}

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export interface MemoraBoothProps {
  eventName?: string;
  eventSubtitle?: string;
  eventType?: string;
  exitHref?: string;
}

export function MemoraBooth({
  eventName = 'Memora Booth',
  eventSubtitle = 'Try it now',
  eventType,
  exitHref = '/',
}: MemoraBoothProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initialDetectedType = eventType || 
    ALL_EVENT_TYPE_IDS.find((t) => 
      eventName.toLowerCase().includes(t) || 
      exitHref.toLowerCase().includes(`/e/${t}`)
    ) || null;

  const [matchedEventType, setMatchedEventType] = useState<string | null>(initialDetectedType);
  const [status, setStatus] = useState<'idle' | 'requesting' | 'ready' | 'error'>('idle');
  const [errorKind, setErrorKind] = useState<string | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  const [phase, setPhase] = useState<'intro' | 'shooting' | 'editing'>('intro');
  const initialDefaultTemplateId = (initialDetectedType && PRO_EVENT_THEME_TEMPLATES[initialDetectedType]) 
    ? PRO_EVENT_THEME_TEMPLATES[initialDetectedType].id 
    : 'classic_filmstrip';
  const [templateId, setTemplateId] = useState<string>(initialDefaultTemplateId);
  const [allTemplates, setAllTemplates] = useState<AvailableTemplateOption[]>([
    ...ALL_PRO_EVENT_TEMPLATES,
    ...ALL_SYSTEM_TEMPLATES,
  ]);
  const [showAllTemplates, setShowAllTemplates] = useState<boolean>(false);
  const [layoutId, setLayoutId] = useState<string>('strip3');
  const [filterId, setFilterId] = useState<string>('original');
  const [frameId, setFrameId] = useState<string>('classic');
  const [countdownDuration, setCountdownDuration] = useState<number>(3);

  const [currentCountdown, setCurrentCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [capturedShots, setCapturedShots] = useState<string[]>([]);
  const [caption, setCaption] = useState<string>('');
  const [renderedStripUrl, setRenderedStripUrl] = useState<string | null>(null);
  const [renderedGifUrl, setRenderedGifUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isRenderingGif, setIsRenderingGif] = useState<boolean>(false);
  const [previewFormat, setPreviewFormat] = useState<'strip' | 'gif'>('strip');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [activePlanConfig, setActivePlanConfig] = useState<PlanConfig>(DEFAULT_PLANS.free);

  const hasUserSelectedTemplateRef = useRef<boolean>(false);

  // Load custom templates if configured by admin in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_admin_templates');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const systemIds = new Set([...ALL_PRO_EVENT_TEMPLATES, ...ALL_SYSTEM_TEMPLATES].map((t) => t.id));
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
          setAllTemplates([...ALL_PRO_EVENT_TEMPLATES, ...ALL_SYSTEM_TEMPLATES, ...customTemplates]);
        }
      }
    } catch {}
  }, []);

  // Sync plan capability: defaults to the Admin's Free Plan for all general users and listeners
  useEffect(() => {
    let matchedPlanKey: 'free' | 'pro' | 'studio' = 'free';

    // Check if this booth is explicitly attached to a paid event
    if (eventName && eventName !== 'Memora Booth') {
      try {
        const storedEvents = localStorage.getItem('memora_events');
        if (storedEvents) {
          const events = JSON.parse(storedEvents);
          if (Array.isArray(events)) {
            const match = events.find((e: any) => 
              (e.name && e.name.toLowerCase() === eventName.toLowerCase()) || 
              (e.slug && e.slug === eventName.toLowerCase())
            );
            if (match) {
              if (match.eventType) {
                setMatchedEventType(match.eventType);
              }
              if (match.plan === 'pro' || match.plan === 'studio') {
                matchedPlanKey = match.plan;
              } else if (match.isPremium) {
                matchedPlanKey = 'pro';
              }
            }
          }
        }
      } catch {}
    }

    const updatePlan = async (directPlans?: Record<string, PlanConfig>) => {
      if (directPlans) {
        setActivePlanConfig(directPlans[matchedPlanKey] || DEFAULT_PLANS[matchedPlanKey]);
        return;
      }
      try {
        const stored = getStoredPlans();
        if (stored?.[matchedPlanKey]) {
          setActivePlanConfig(stored[matchedPlanKey]);
        }
        // Authoritative cross-browser sync from server API
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.plans?.[matchedPlanKey]) {
            setActivePlanConfig(data.plans[matchedPlanKey]);
            try {
              localStorage.setItem('memora_plans_config', JSON.stringify(data.plans));
            } catch {}
          }
        }
      } catch {
        setActivePlanConfig(DEFAULT_PLANS[matchedPlanKey]);
      }
    };

    updatePlan();

    const handlePlansUpdated = (eventOrMsg?: any) => {
      try {
        const incoming = eventOrMsg?.detail || eventOrMsg?.payload;
        if (incoming && typeof incoming === 'object') {
          const targetPlan = incoming[matchedPlanKey] || incoming.free;
          if (targetPlan && Array.isArray(targetPlan.allowedLayoutIds)) {
            setActivePlanConfig(targetPlan);
            return;
          }
        }
      } catch {}
      updatePlan();
    };

    // 1. Intra-window custom event
    window.addEventListener('memora:plans_updated', handlePlansUpdated);

    // 2. Cross-tab storage change
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'memora_plans_config' || e.key === 'memora_realtime_sync') {
        updatePlan();
      }
    };
    window.addEventListener('storage', onStorage);

    // 3. Tab wake-up / focus re-sync (Edge Sleeping Tabs & Chrome tab throttling)
    const onFocus = () => updatePlan();
    window.addEventListener('focus', onFocus);

    // 4. Tab visibility change (when switching back to booth tab from admin)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePlan();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 5. BroadcastChannel realtime engine
    const unsub = subscribeRealtime('PLANS_UPDATED', handlePlansUpdated);

    // 6. Gentle poll heartbeat while booth is on setup screen
    const interval = setInterval(updatePlan, 1500);

    return () => {
      window.removeEventListener('memora:plans_updated', handlePlansUpdated);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
      unsub();
    };
  }, [eventName]);

  // Set default PRO event template if matchedEventType is present and user hasn't selected another template
  useEffect(() => {
    if (!hasUserSelectedTemplateRef.current && matchedEventType && PRO_EVENT_THEME_TEMPLATES[matchedEventType]) {
      const eventTpl = PRO_EVENT_THEME_TEMPLATES[matchedEventType];
      if (isTemplateUnlocked(activePlanConfig, eventTpl.id)) {
        setTemplateId(eventTpl.id);
        const nativeLayout = getTemplateNativeLayoutId(eventTpl.layout, eventTpl.id);
        if (nativeLayout && isLayoutUnlocked(activePlanConfig, nativeLayout)) {
          setLayoutId(nativeLayout);
        }
      }
    }
  }, [matchedEventType, activePlanConfig]);

  // Ensure an unlocked layout and template are chosen on initial load or plan change
  useEffect(() => {
    if (activePlanConfig) {
      let currentTpl = allTemplates.find((t) => t.id === templateId && isTemplateUnlocked(activePlanConfig, t.id));
      if (!currentTpl) {
        currentTpl = allTemplates.find((t) => isTemplateUnlocked(activePlanConfig, t.id));
        if (currentTpl) setTemplateId(currentTpl.id);
      }

      if (currentTpl) {
        const nativeLayout = getTemplateNativeLayoutId(currentTpl.layout, currentTpl.id);
        if (isLayoutUnlocked(activePlanConfig, nativeLayout) && (!layoutId || !isLayoutUnlocked(activePlanConfig, layoutId))) {
          setLayoutId(nativeLayout);
        } else if (!isLayoutUnlocked(activePlanConfig, layoutId)) {
          const firstUnlocked = LAYOUTS.find((l) => isLayoutUnlocked(activePlanConfig, l.id));
          if (firstUnlocked) setLayoutId(firstUnlocked.id);
        }
      }
    }
  }, [activePlanConfig, allTemplates, layoutId, templateId]);

  // Separate PRO Event Template and Free Studio Templates
  const activeProTemplate = React.useMemo(() => {
    if (matchedEventType && PRO_EVENT_THEME_TEMPLATES[matchedEventType]) {
      return PRO_EVENT_THEME_TEMPLATES[matchedEventType];
    }
    return PRO_EVENT_THEME_TEMPLATES.party;
  }, [matchedEventType]);

  // Only display unlocked templates for the active plan
  const unlockedTemplates = React.useMemo(() => {
    return allTemplates.filter((t) => isTemplateUnlocked(activePlanConfig, t.id));
  }, [allTemplates, activePlanConfig]);

  const freeTemplates = React.useMemo(() => {
    return allTemplates.filter((t) => !t.id.startsWith('event_') && isTemplateUnlocked(activePlanConfig, t.id));
  }, [allTemplates, activePlanConfig]);

  const visibleFreeTemplates = showAllTemplates || freeTemplates.length <= 6 ? freeTemplates : freeTemplates.slice(0, 6);

  // Only display unlocked strip layouts for the active plan
  const unlockedLayouts = React.useMemo(() => {
    return LAYOUTS.filter((l) => isLayoutUnlocked(activePlanConfig, l.id));
  }, [activePlanConfig]);

  const selectedTemplate = allTemplates.find((t) => t.id === templateId) || ALL_SYSTEM_TEMPLATES[0];
  const isLight = isLightColor(selectedTemplate.frameColor);

  // Event theme is ONLY activated when the dedicated PRO Event Template is selected
  const isSchoolTheme = 
    selectedTemplate.id === 'event_school' || 
    selectedTemplate.category === 'school_event';

  const isBeachTheme =
    selectedTemplate.id === 'event_beach' ||
    selectedTemplate.category === 'beach_event';

  const isPartyTheme =
    selectedTemplate.id === 'event_party' ||
    selectedTemplate.category === 'party_event';

  const isWeddingTheme =
    selectedTemplate.id === 'event_wedding' ||
    selectedTemplate.category === 'wedding_event';

  const isBirthdayTheme =
    selectedTemplate.id === 'event_birthday' ||
    selectedTemplate.category === 'birthday_event';

  const isCorporateTheme =
    selectedTemplate.id === 'event_corporate' ||
    selectedTemplate.category === 'corporate_event';

  const isGraduationTheme =
    selectedTemplate.id === 'event_graduation' ||
    selectedTemplate.category === 'graduation_event';

  const isSchoolLight = isSchoolTheme
    ? (selectedTemplate.id === 'yearbook_alumni' || isLightColor(selectedTemplate.frameColor))
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

  const isTemplateActiveUnlocked = isTemplateUnlocked(activePlanConfig, templateId);
  const isLayoutActiveUnlocked = isLayoutUnlocked(activePlanConfig, layoutId);
  const isShootable = isTemplateActiveUnlocked && isLayoutActiveUnlocked;

  const handleSelectTemplate = (tpl: AvailableTemplateOption) => {
    hasUserSelectedTemplateRef.current = true;
    setTemplateId(tpl.id);
    const nativeLayout = getTemplateNativeLayoutId(tpl.layout, tpl.id);
    if (nativeLayout && isLayoutUnlocked(activePlanConfig, nativeLayout)) {
      setLayoutId(nativeLayout);
    }
  };

  const isGifAllowed = isGifExportAllowed(activePlanConfig);

  const isShootingRef = useRef<boolean>(false);
  const cancelCountdownRef = useRef<boolean>(false);

  const cancelCountdown = useCallback(() => {
    cancelCountdownRef.current = true;
    setCurrentCountdown(null);
    isShootingRef.current = false;
  }, []);

  const activeLayout = LAYOUTS.find((l) => l.id === layoutId || (l.id === 'polaroid' && layoutId === 'single') || (l.id === 'grid2x2' && layoutId === 'grid4')) ?? LAYOUTS[0];
  const activeFilter = FILTERS.find((f) => f.id === filterId) ?? FILTERS[0];
  const photoSlots = Array.from({ length: activeLayout.shots });

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(
    async (requestedFacing = facing) => {
      if (!isShootable) return;
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setErrorKind('unsupported');
        setStatus('error');
        return;
      }
      setStatus('requesting');
      setErrorKind(null);
      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: requestedFacing,
            width: { ideal: 1280 },
            height: { ideal: 1706 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setFacing(requestedFacing);
        setStatus('ready');

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          setHasMultipleCameras(devices.filter((d) => d.kind === 'videoinput').length > 1);
        } catch {
          setHasMultipleCameras(false);
        }
      } catch (err) {
        setErrorKind(getCameraErrorKind(err));
        setStatus('error');
      }
    },
    [facing, stopCamera, isShootable]
  );

  const attachVideo = useCallback(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, []);

  const flipCamera = useCallback(() => {
    startCamera(facing === 'user' ? 'environment' : 'user');
  }, [facing, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (phase !== 'intro') {
      attachVideo();
    }
  }, [phase, attachVideo]);

  const snapFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;

    const targetRatio = 3 / 4;
    const currentRatio = video.videoWidth / video.videoHeight;
    let cropW = video.videoWidth;
    let cropH = video.videoHeight;

    if (currentRatio > targetRatio) {
      cropW = cropH * targetRatio;
    } else {
      cropH = cropW / targetRatio;
    }

    const cropX = (video.videoWidth - cropW) / 2;
    const cropY = (video.videoHeight - cropH) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_WIDTH;
    canvas.height = PHOTO_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, [facing]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSnapClick = useCallback(async () => {
    if (isShootingRef.current || status !== 'ready' || !isShootable) return;
    cancelCountdownRef.current = false;

    isShootingRef.current = true;
    setCapturedShots([]);
    setRenderedStripUrl(null);

    const accumulator: string[] = [];

    for (let i = 0; i < activeLayout.shots; i++) {
      if (cancelCountdownRef.current) break;

      for (let sec = countdownDuration; sec > 0; sec--) {
        if (cancelCountdownRef.current) break;
        setCurrentCountdown(sec);
        await sleep(1000);
      }

      if (cancelCountdownRef.current) {
        setCurrentCountdown(null);
        break;
      }
      setCurrentCountdown(null);

      const frame = snapFrame();
      setIsFlashing(true);
      await sleep(280);
      setIsFlashing(false);

      if (frame) {
        accumulator.push(frame);
        setCapturedShots([...accumulator]);
      }

      if (i < activeLayout.shots - 1 && !cancelCountdownRef.current) {
        await sleep(1000);
      }
    }

    isShootingRef.current = false;
    if (!cancelCountdownRef.current && accumulator.length >= activeLayout.shots) {
      setPhase('editing');
    }
  }, [activeLayout.shots, countdownDuration, snapFrame, status, isShootable]);

  // Spacebar to trigger shutter, Escape to cancel countdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'shooting') return;
      if (e.code === 'Space' && currentCountdown === null && status === 'ready') {
        e.preventDefault();
        void handleSnapClick();
      }
      if (e.code === 'Escape' && currentCountdown !== null) {
        e.preventDefault();
        cancelCountdown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentCountdown, status, handleSnapClick, cancelCountdown]);

  // Strip & GIF rendering trigger when in editing phase
  useEffect(() => {
    if (phase !== 'editing' || capturedShots.length === 0) return;

    let isMounted = true;
    setIsRendering(true);

    const stripOptions: RenderStripOptions = {
      shots: capturedShots,
      layout: layoutId,
      frame: frameId,
      filterCss: activeFilter.css,
      title: eventName,
      caption: caption,
      watermark: activePlanConfig.watermark !== false,
      frameColor: selectedTemplate.frameColor,
      textColor: selectedTemplate.textColor,
      templateId: selectedTemplate.id,
    };

    renderPhotoStrip(stripOptions)
      .then((url) => {
        if (isMounted) {
          setRenderedStripUrl(url);
          setRenderError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRenderError("We couldn't build your strip. Try again.");
        }
      })
      .finally(() => {
        if (isMounted) setIsRendering(false);
      });

    if (isGifAllowed) {
      setIsRenderingGif(true);
      renderPhotoStripGif(stripOptions)
        .then((gifUrl) => {
          if (isMounted) {
            setRenderedGifUrl(gifUrl);
          }
        })
        .catch((err) => {
          console.error('Failed to generate strip GIF:', err);
        })
        .finally(() => {
          if (isMounted) setIsRenderingGif(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [phase, capturedShots, layoutId, frameId, activeFilter.css, caption, eventName, isGifAllowed, activePlanConfig, selectedTemplate.frameColor, selectedTemplate.textColor]);

  const errorMessage = errorKind ? ERROR_MESSAGES[errorKind] || ERROR_MESSAGES.unknown : null;

  return (
    <div className="min-h-screen bg-foreground text-cream font-sans">
      <div
        className={`mx-auto flex min-h-screen w-full flex-col px-4 py-4 transition-all duration-300 ${
          phase === 'intro' ? 'max-w-5xl' : 'max-w-[420px]'
        }`}
      >
        {/* Header */}
        <header className={`flex items-center justify-between transition-all ${phase === 'intro' ? 'pb-4 mb-2 border-b border-white/10' : 'pb-3'}`}>
          <Link href={exitHref} className="flex items-center gap-2.5 group cursor-pointer">
            <Logo className="w-7 h-7 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div>
              <div className="font-display text-lg leading-none tracking-tight group-hover:text-primary transition-colors">{eventName.toUpperCase()}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/60">{eventSubtitle}</div>
            </div>
          </Link>
          <Link
            href={exitHref}
            className="rounded-full bg-cream/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cream/70 hover:bg-cream/20 hover:text-cream transition-colors cursor-pointer"
          >
            Exit
          </Link>
        </header>

        {/* Phase 1: Intro Setup with Live Strip Preview */}
        {phase === 'intro' && (
          <div className="animate-rise flex flex-1 flex-col justify-center py-4 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column: Template, Layout, & Countdown Selectors */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <h1 className="font-display text-4xl sm:text-5xl font-light leading-[1.0] tracking-wide text-cream">
                    Ready for your strip?
                  </h1>
                  <p className="mt-3 text-sm text-cream/70 font-light leading-relaxed">
                    Choose your template and strip layout below. Your camera captures everything right here in your browser.
                  </p>
                </div>

                {/* 1. PRO Event Template Selector */}
                {activeProTemplate && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/50 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>PRO Event Template</span>
                      </p>
                      <span className="font-mono text-[9px] text-cream/40 uppercase tracking-wider">
                        PRO Pass
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(activeProTemplate)}
                      className={`w-full relative flex items-center gap-3 rounded-2xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                        templateId === activeProTemplate.id
                          ? 'bg-cream/15 text-cream border border-cream/50 ring-2 ring-primary/50 shadow-md'
                          : 'bg-cream/5 text-cream/70 border border-white/5 hover:bg-cream/10'
                      }`}
                      title={activeProTemplate.name}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-xs"
                        style={{ backgroundColor: activeProTemplate.frameColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs truncate leading-snug">{activeProTemplate.name}</span>
                          <span className="text-[10px] font-mono text-cream/45 truncate">
                            • {activeProTemplate.layout}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-cream/45 truncate">
                          {activeProTemplate.description}
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* 2. Free Studio Templates Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/50 flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-primary" />
                      <span>Free Templates</span>
                    </p>
                    <span className="font-mono text-[9px] text-cream/40 uppercase tracking-wider">
                      All Templates in PRO
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {visibleFreeTemplates.map((tpl) => {
                      const isSelected = templateId === tpl.id;

                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl)}
                          className={`relative flex items-center gap-2.5 rounded-2xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cream/15 text-cream border border-cream/50 ring-2 ring-primary/50 shadow-md'
                              : 'bg-cream/5 text-cream/70 border border-white/5 hover:bg-cream/10'
                          }`}
                          title={tpl.name}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-xs"
                            style={{ backgroundColor: tpl.frameColor }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-xs truncate leading-snug">{tpl.name}</div>
                            <div className="text-[10px] font-mono text-cream/45 truncate">
                              {tpl.badge} • {tpl.layout}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {freeTemplates.length > 6 && (
                    <div className="flex justify-center mt-2.5">
                      <button
                        type="button"
                        onClick={() => setShowAllTemplates(!showAllTemplates)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-cream/70 hover:text-cream bg-cream/5 hover:bg-cream/10 border border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
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

                {/* 3. Photo Strip Layout Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/50 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-primary" />
                      <span>Layout</span>
                    </p>
                    <span className="font-mono text-[9px] text-cream/40 uppercase tracking-wider">
                      All Free Strip Layouts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unlockedLayouts.map((item) => {
                      const isSelected = layoutId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLayoutId(item.id)}
                          className={`relative flex items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40'
                              : 'bg-cream/10 text-cream/70 hover:bg-cream/15'
                          }`}
                          title={item.label}
                        >
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Countdown Duration */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/50 mb-2 flex items-center gap-1.5">
                    <Timer className="w-3 h-3 text-primary" />
                    <span>Countdown</span>
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {COUNTDOWNS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setCountdownDuration(sec)}
                        className={`rounded-2xl px-2 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                          countdownDuration === sec ? 'bg-primary text-primary-foreground' : 'bg-cream/10 text-cream/70 hover:bg-cream/15'
                        }`}
                      >
                        {sec === 0 ? 'Off' : `${sec}s`}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

                {/* Enable Camera Action */}
                <button
                  type="button"
                  onClick={async () => {
                    await startCamera();
                    setPhase('shooting');
                  }}
                  disabled={status === 'requesting'}
                  className="rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-60 transition-opacity hover:opacity-95 cursor-pointer shadow-lg mt-1"
                >
                  {status === 'requesting' ? 'Starting camera…' : 'Enable camera'}
                </button>
              </div>

              {/* Right Column: Live Photo Strip Preview */}
              <div className="lg:col-span-5 w-full flex flex-col items-center">
                <div className="w-full rounded-3xl bg-cream/5 border border-white/10 p-5 sm:p-6 flex flex-col items-center backdrop-blur-xs shadow-xl">
                  {/* Card Header */}
                  <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="uppercase tracking-widest text-cream/70 font-medium">
                        Live Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cream/40 uppercase tracking-wider">
                      {activeLayout.shots} {activeLayout.shots === 1 ? 'Slot' : 'Slots'}
                    </span>
                  </div>

                  {/* Summary Bar */}
                  <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/30 border border-white/5 text-[10px] font-mono text-cream/60 mb-3">
                    <span className="truncate">{selectedTemplate.name}</span>
                    <span className="text-primary font-medium shrink-0 ml-2">{activeLayout.label}</span>
                  </div>

                  {/* Photobooth Strip Canvas Container */}
                  <div className="w-full flex justify-center py-1">
                    <div
                      className="w-60 max-w-full rounded-xl transition-all duration-300 shadow-2xl relative p-3.5 flex flex-col items-center justify-between overflow-visible"
                      style={{
                        backgroundColor: isSchoolTheme
                          ? schoolPalette.bg
                          : isPartyTheme
                          ? '#0f1117'
                          : isWeddingTheme
                          ? '#fcf8f4'
                          : isBirthdayTheme
                          ? '#fffdf9'
                          : isCorporateTheme
                          ? '#f8fafc'
                          : isGraduationTheme
                          ? '#0a1128'
                          : selectedTemplate.frameColor,
                        color: isSchoolTheme
                          ? schoolPalette.textPrimary
                          : isPartyTheme
                          ? '#f4f4f5'
                          : isWeddingTheme
                          ? '#1f1b18'
                          : isBirthdayTheme
                          ? '#18181b'
                          : isCorporateTheme
                          ? '#0f172a'
                          : isGraduationTheme
                          ? '#fcf8ef'
                          : selectedTemplate.textColor,
                        border: isSchoolTheme
                          ? schoolPalette.outerBorder
                          : isPartyTheme
                          ? '2px solid rgba(236, 72, 153, 0.65)'
                          : isWeddingTheme
                          ? '2px solid rgba(184, 134, 11, 0.45)'
                          : isBirthdayTheme
                          ? '2px solid rgba(245, 158, 11, 0.5)'
                          : isCorporateTheme
                          ? '2px solid rgba(37, 99, 235, 0.45)'
                          : isGraduationTheme
                          ? '2px solid rgba(212, 175, 55, 0.65)'
                          : `1px solid ${isLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'}`,
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
                      {/* Top Header Inscription */}
                      {isSchoolTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2" style={{ borderColor: schoolPalette.borderGold }}>
                          <div className="flex items-center justify-center gap-1.5 text-[7.5px] font-mono uppercase tracking-[0.25em]" style={{ color: schoolPalette.textSecondary }}>
                            <span>★</span>
                            <span>GOOD DAYS • GREAT MEMORIES</span>
                            <span>★</span>
                          </div>
                          <h3 className="font-serif text-xs font-bold tracking-wider uppercase mt-1" style={{ color: schoolPalette.textPrimary }}>
                            OUR SCHOOL ERA
                          </h3>
                          <div className="flex items-center justify-center gap-1.5 mt-1 opacity-90">
                            <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                            <span className="text-[7px] font-mono tracking-widest uppercase font-semibold" style={{ color: schoolPalette.textSecondary }}>
                              SCHOOL YEAR 2026–2027
                            </span>
                            <span className="h-px w-4" style={{ backgroundColor: schoolPalette.borderGold }} />
                          </div>
                        </div>
                      ) : isBeachTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2" style={{ borderColor: 'rgba(2, 132, 199, 0.35)' }}>
                          <div className="flex items-center justify-center gap-1.5 text-[7.5px] font-mono uppercase tracking-[0.2em]" style={{ color: '#0284c7' }}>
                            <span>🌴</span>
                            <span>LET THE GOOD TIMES ROLL</span>
                            <span>🌴</span>
                          </div>
                          <h3 className="font-serif text-xs font-bold tracking-wider uppercase mt-0.5" style={{ color: '#0f172a' }}>
                            GOOD VIBES, GREAT TIMES
                          </h3>
                          <p className="text-[7px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: '#0284c7' }}>
                            Sun • Sand • Sea • Memories
                          </p>
                        </div>
                      ) : isPartyTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 relative" style={{ borderColor: 'rgba(236, 72, 153, 0.5)' }}>
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
                          <div className="flex items-center justify-center gap-1.5 text-[7.5px] font-mono uppercase tracking-[0.2em]" style={{ color: '#ec4899' }}>
                            <span>PARTY NIGHT</span>
                          </div>
                          <h3 className="font-serif text-xs font-bold tracking-wider uppercase mt-0.5" style={{ color: '#f4f4f5' }}>
                            GOOD FRIENDS. GREAT NIGHT
                          </h3>
                          <p className="text-[7px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: '#ec4899' }}>
                            Dance • Laugh • Celebrate • Repeat
                          </p>
                        </div>
                      ) : isWeddingTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 relative" style={{ borderColor: 'rgba(184, 134, 11, 0.35)' }}>
                          <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <WeddingRingsIcon size={18} className="transform -rotate-6 drop-shadow-xs" />
                            <WeddingSparklesIcon variant="star" size={8} className="opacity-80" />
                          </div>
                          <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <WeddingHeartIcon size={14} className="transform rotate-6 drop-shadow-xs" />
                            <WeddingBouquetIcon size={18} className="transform rotate-6 drop-shadow-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold" style={{ color: '#b8860b' }}>
                            <span>WEDDING CELEBRATION</span>
                          </div>
                          <h3 className="font-serif text-xs font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: '#1f1b18' }}>
                            FOREVER BEGINS
                          </h3>
                          <p className="text-[7px] font-mono tracking-wider opacity-85 mt-0.5 italic" style={{ color: '#855d10' }}>
                            Two hearts • One beautiful journey
                          </p>
                        </div>
                      ) : isBirthdayTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 relative" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                          <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <BirthdayCakeIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                            <BirthdaySparklesIcon variant="star" size={7} className="opacity-80" />
                          </div>
                          <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <BirthdaySparklesIcon variant="cross" size={7} className="opacity-80" />
                            <BirthdayBalloonsIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold" style={{ color: '#d97706' }}>
                            <span>YOUR DAY • YOUR MOMENT</span>
                          </div>
                          <h3 className="font-serif text-[10px] font-bold tracking-[0.08em] uppercase mt-0.5 max-w-[176px] mx-auto" style={{ color: '#18181b' }}>
                            Celebrate every little moment
                          </h3>
                          <p className="text-[6.5px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: '#d97706' }}>
                            Good Times • Big Smiles • Great Memories
                          </p>
                        </div>
                      ) : isCorporateTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 relative" style={{ borderColor: 'rgba(37, 99, 235, 0.35)' }}>
                          <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <BuildingSkyscraperIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                            <CorporateSparklesIcon variant="star" size={7} color="#2563eb" className="opacity-80" />
                          </div>
                          <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <CorporateSparklesIcon variant="cross" size={7} color="#38bdf8" className="opacity-80" />
                            <TrophyCupIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold" style={{ color: '#2563eb' }}>
                            <span>CORPORATE MOMENTS</span>
                          </div>
                          <h3 className="font-serif text-[9.5px] font-bold tracking-[0.06em] uppercase mt-0.5 max-w-[176px] mx-auto" style={{ color: '#0f172a' }}>
                            Built together. Achieved together
                          </h3>
                          <p className="text-[6.5px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: '#2563eb' }}>
                            Connect • Collaborate • Celebrate
                          </p>
                        </div>
                      ) : isGraduationTheme ? (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2 relative" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}>
                          <div className="absolute left-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <GraduationCapIcon size={16} className="transform -rotate-6 drop-shadow-xs" />
                            <GraduationSparklesIcon variant="star" size={7} color="#fde047" className="opacity-80" />
                          </div>
                          <div className="absolute right-1.5 top-0.5 pointer-events-none flex items-center gap-1">
                            <GraduationSparklesIcon variant="cross" size={7} color="#d4af37" className="opacity-80" />
                            <GraduationTrophyIcon size={16} className="transform rotate-3 drop-shadow-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-1.5 text-[7px] font-mono uppercase tracking-[0.22em] font-semibold" style={{ color: '#d4af37' }}>
                            <span>GRADUATION CELEBRATION</span>
                          </div>
                          <h3 className="font-serif text-[10px] font-bold tracking-[0.08em] uppercase mt-0.5 max-w-[176px] mx-auto" style={{ color: '#fcf8ef' }}>
                            The Next Chapter
                          </h3>
                          <p className="text-[6.5px] font-mono tracking-wider opacity-85 mt-0.5" style={{ color: '#d4af37' }}>
                            One journey ends. Another begins
                          </p>
                        </div>
                      ) : (
                        <div className="w-full text-center pb-2 pt-0.5 border-b mb-2" style={{ borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                          <div className="flex items-center justify-center gap-1 text-[8px] font-mono uppercase tracking-[0.25em] opacity-80">
                            {matchedEventType ? (
                              <>
                                <span>{getEventEmoji(matchedEventType)}</span>
                                <span>{getEventBareLabel(matchedEventType).toUpperCase()}</span>
                                <span>{getEventEmoji(matchedEventType)}</span>
                              </>
                            ) : (
                              <>
                                <span>✦</span>
                                <span>MEMORA PHOTO STUDIO</span>
                                <span>✦</span>
                              </>
                            )}
                          </div>
                          <p className="font-display text-xs tracking-wide mt-0.5 truncate px-1" style={{ color: selectedTemplate.textColor }}>
                            {selectedTemplate.name}
                          </p>
                        </div>
                      )}

                      {/* Photo Slots Body */}
                      {layoutId === 'filmstrip' ? (
                        /* 35mm Analog Filmstrip with Sprocket Perforations */
                        <div className="w-full flex items-stretch gap-1.5 py-1">
                          {/* Left Sprockets */}
                          <div
                            className="flex flex-col justify-between py-1 px-1 rounded-xs shrink-0"
                            style={{
                              backgroundColor: isSchoolTheme ? (isSchoolLight ? 'rgba(133, 93, 16, 0.1)' : 'rgba(212, 175, 55, 0.12)') : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)',
                            }}
                          >
                            {[...Array(7)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2.5 rounded-[2px] my-1 shrink-0"
                                style={{
                                  backgroundColor: isSchoolTheme ? schoolPalette.accentGold : isLight ? '#1c1917' : '#ffffff',
                                  border: isSchoolTheme ? '1px solid ' + schoolPalette.borderGold : isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)',
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
                                  backgroundColor: isSchoolTheme ? schoolPalette.slotBg : isLight ? 'rgba(0,0,0,0.08)' : '#090a0f',
                                  borderColor: isSchoolTheme ? schoolPalette.slotBorder : isLight ? 'rgba(0,0,0,0.15)' : '#000000',
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
                                  <Camera className="w-3.5 h-3.5" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : undefined }} />
                                  <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                    {isSchoolTheme
                                      ? `Photo ${pIdx + 1}`
                                      : `Photo ${pIdx + 1}`}
                                  </span>
                                </div>
                                {!isSchoolTheme && (
                                  <span
                                    className="absolute bottom-0.5 right-0.5 text-[5px] font-mono px-1 rounded font-semibold"
                                    style={{
                                      backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)',
                                      color: selectedTemplate.textColor,
                                    }}
                                  >
                                    {`0${pIdx + 1}A`}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Right Sprockets */}
                          <div
                            className="flex flex-col justify-between py-1 px-1 rounded-xs shrink-0"
                            style={{
                              backgroundColor: isSchoolTheme ? (isSchoolLight ? 'rgba(133, 93, 16, 0.1)' : 'rgba(212, 175, 55, 0.12)') : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.6)',
                            }}
                          >
                            {[...Array(7)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2.5 rounded-[2px] my-1 shrink-0"
                                style={{
                                  backgroundColor: isSchoolTheme ? schoolPalette.accentGold : isLight ? '#1c1917' : '#ffffff',
                                  border: isSchoolTheme ? '1px solid ' + schoolPalette.borderGold : isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.4)',
                                  opacity: isSchoolTheme ? 0.9 : 1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : layoutId === 'grid2x2' ? (
                        /* 2x2 Quad Grid Collage */
                        <div className="w-full grid grid-cols-2 gap-1.5 py-1">
                          {photoSlots.map((_, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                              style={{
                                backgroundColor: isSchoolTheme ? schoolPalette.slotBg : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                borderColor: isSchoolTheme ? schoolPalette.slotBorder : isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
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
                                <Camera className="w-3 h-3" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : undefined }} />
                                <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                  {`Photo ${pIdx + 1}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : layoutId === 'grid2x3' ? (
                        /* 2x3 Hexa Grid Collage */
                        <div className="w-full grid grid-cols-2 gap-1.5 py-1">
                          {photoSlots.map((_, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                              style={{
                                backgroundColor: isSchoolTheme ? schoolPalette.slotBg : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                borderColor: isSchoolTheme ? schoolPalette.slotBorder : isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
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
                                <Camera className="w-3 h-3" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : undefined }} />
                                <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                  {`Photo ${pIdx + 1}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : layoutId === 'polaroid' ? (
                        /* Single Polaroid */
                        <div className="w-full py-1">
                          {photoSlots.map((_, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative overflow-hidden aspect-[4/3] rounded-xs flex flex-col items-center justify-center border"
                              style={{
                                backgroundColor: isSchoolTheme ? schoolPalette.slotBg : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                                borderColor: isSchoolTheme ? schoolPalette.slotBorder : isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
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
                              <div className="flex flex-col items-center justify-center gap-1 p-4 select-none opacity-80">
                                <Camera className="w-5 h-5" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : undefined }} />
                                <span className="font-mono text-[8px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : undefined }}>
                                  {isSchoolTheme ? 'Campus Life Portrait' : 'Single Instant Shot'}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="h-6" />
                        </div>
                      ) : (
                        /* Vertical Strip: Duo, 3-strip, 4-strip */
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
                                key={pIdx}
                                className="relative rounded-xs flex flex-col items-center justify-center border aspect-[4/3] transition-all"
                                style={{
                                  backgroundColor: isSchoolTheme
                                    ? schoolPalette.slotBg
                                    : isPartyTheme
                                    ? 'rgba(236, 72, 153, 0.08)'
                                    : isWeddingTheme
                                    ? 'rgba(184, 134, 11, 0.05)'
                                    : isBirthdayTheme
                                    ? 'rgba(217, 119, 6, 0.05)'
                                    : isLight
                                    ? 'rgba(0,0,0,0.05)'
                                    : 'rgba(255,255,255,0.05)',
                                  borderColor: isSchoolTheme
                                    ? schoolPalette.slotBorder
                                    : isPartyTheme
                                    ? 'rgba(236, 72, 153, 0.35)'
                                    : isWeddingTheme
                                    ? 'rgba(184, 134, 11, 0.25)'
                                    : isBirthdayTheme
                                    ? 'rgba(217, 119, 6, 0.25)'
                                    : isLight
                                    ? 'rgba(0,0,0,0.12)'
                                    : 'rgba(255,255,255,0.12)',
                                  boxShadow: isSchoolTheme
                                    ? '0 1px 3px rgba(0,0,0,0.08)'
                                    : isPartyTheme
                                    ? '0 0 10px rgba(236, 72, 153, 0.15)'
                                    : isWeddingTheme
                                    ? '0 0 10px rgba(184, 134, 11, 0.1)'
                                    : isBirthdayTheme
                                    ? '0 0 10px rgba(217, 119, 6, 0.08)'
                                    : undefined,
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
                                  <Camera className="w-3.5 h-3.5" style={{ color: isSchoolTheme ? schoolPalette.textSecondary : isPartyTheme ? '#ec4899' : isWeddingTheme ? '#b8860b' : isBirthdayTheme ? '#d97706' : undefined }} />
                                  <span className="font-mono text-[7px] uppercase tracking-wider font-semibold" style={{ color: isSchoolTheme ? schoolPalette.textPrimary : isPartyTheme ? '#f4f4f5' : isWeddingTheme ? '#1f1b18' : isBirthdayTheme ? '#18181b' : undefined }}>
                                    {isPartyTheme
                                      ? ['PRE-GAME', 'DANCE FLOOR', 'MIDNIGHT', 'VIP CREW'][pIdx % 4]
                                      : isWeddingTheme
                                      ? ['CEREMONY', 'COCKTAILS', 'FIRST DANCE', 'AFTER PARTY'][pIdx % 4]
                                      : isBirthdayTheme
                                      ? ['PARTY VIBES', 'MAKE A WISH', 'CAKE TIME', 'SQUAD'][pIdx % 4]
                                      : `Photo ${pIdx + 1}`}
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

                                {/* Nightclub & Party Theme Embellishments: disco ball, headphones, camera flash, vinyl, dancers, lightning, flame */}
                                {isPartyTheme && (
                                  <PartyPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Wedding Celebration Theme Embellishments: rings, bouquets, candles, leaves, hearts, sparkles */}
                                {isWeddingTheme && (
                                  <WeddingPhotoAccents photoIndex={pIdx} totalPhotos={photoSlots.length} />
                                )}

                                {/* Birthday Celebration Theme Embellishments: 12 elements (cake, balloons, gift, popper, party face, sparkles, confetti, candles, cupcake, star, ribbon, glasses) */}
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
                                      backgroundColor: isPartyTheme
                                        ? 'rgba(236, 72, 153, 0.18)'
                                        : isWeddingTheme
                                        ? 'rgba(184, 134, 11, 0.15)'
                                        : isBirthdayTheme
                                        ? 'rgba(217, 119, 6, 0.15)'
                                        : isCorporateTheme
                                        ? 'rgba(37, 99, 235, 0.15)'
                                        : isGraduationTheme
                                        ? 'rgba(212, 175, 55, 0.18)'
                                        : isLight
                                        ? 'rgba(0,0,0,0.06)'
                                        : 'rgba(255,255,255,0.1)',
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
                                        : selectedTemplate.textColor,
                                    }}
                                  >
                                    {isPartyTheme ? `PAR-0${pIdx + 1}` : isWeddingTheme ? `WED-0${pIdx + 1}` : isBirthdayTheme ? `BIR-0${pIdx + 1}` : isCorporateTheme ? `COR-0${pIdx + 1}` : isGraduationTheme ? `GRA-0${pIdx + 1}` : `0${pIdx + 1}A`}
                                  </span>
                                )}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer Inscription */}
                      <div className="w-full pt-2 border-t text-center mt-1" style={{ borderColor: isSchoolTheme ? schoolPalette.borderGold : isPartyTheme ? 'rgba(236, 72, 153, 0.4)' : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                        {isSchoolTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <SchoolAcademicFooterIcon width={120} height={18} isLight={isSchoolLight} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: isSchoolLight ? 'rgba(133, 93, 16, 0.12)' : 'rgba(212, 175, 55, 0.15)',
                                    color: schoolPalette.textSecondary,
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: schoolPalette.textSecondary }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isBeachTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <CoastalWaveFooterIcon width={120} height={16} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(2, 132, 199, 0.1)',
                                    color: '#0284c7',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#0284c7' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isPartyTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <PartyEqualizerFooterIcon width={120} height={16} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(236, 72, 153, 0.12)',
                                    color: '#ec4899',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#ec4899' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isWeddingTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <WeddingBotanicalFooterIcon width={120} height={18} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(184, 134, 11, 0.12)',
                                    color: '#b8860b',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#b8860b' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isBirthdayTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <BirthdayBuntingFooterIcon width={120} height={18} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(217, 119, 6, 0.12)',
                                    color: '#d97706',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#d97706' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isCorporateTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <CorporateSkylineFooterIcon width={120} height={18} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                                    color: '#2563eb',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#2563eb' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : isGraduationTheme ? (
                          <>
                            <div className="py-0.5 flex items-center justify-center">
                              <GraduationDiplomaFooterIcon width={120} height={18} />
                            </div>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                    color: '#d4af37',
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: '#d4af37' }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-display text-[10px] tracking-wide flex items-center justify-center gap-1" style={{ color: selectedTemplate.textColor }}>
                              {matchedEventType ? <span>{getEventEmoji(matchedEventType)}</span> : null}
                              <span>{eventName.toUpperCase()}</span>
                            </p>
                            <p className="text-[8px] font-mono opacity-65 tracking-wider mt-0.5">
                              {activeLayout.shots} {activeLayout.shots === 1 ? 'Pose' : 'Poses'} • {activeLayout.label}
                            </p>
                            {activePlanConfig.watermark !== false ? (
                              <div className="mt-1 flex items-center justify-center">
                                <span
                                  className="text-[6px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                                    color: selectedTemplate.textColor,
                                  }}
                                >
                                  MEMORA WATERMARK INCLUDED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-75 mt-0.5 select-none" style={{ color: selectedTemplate.textColor }}>
                                <Logo className="w-2.5 h-2.5 shrink-0" />
                                <span className="font-display font-medium text-[7.5px] tracking-[0.2em] leading-none uppercase">
                                  MEMORA
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 & 3: Camera & Editing */}
        {phase !== 'intro' && (
          <>
            <div
              className={`relative w-full overflow-hidden rounded-[26px] ${
                phase === 'editing' ? 'aspect-[3/5] bg-transparent' : 'aspect-[3/4] bg-black'
              }`}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`h-full w-full object-cover ${facing === 'user' ? '-scale-x-100' : ''} ${
                  phase === 'editing' ? 'opacity-0' : ''
                }`}
                style={{ filter: activeFilter.css }}
              />

              {/* Viewfinder Top Controls: Ultra-Minimalist Glass Bar */}
              {phase === 'shooting' && (
                <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-auto gap-2">
                  {/* Selected Template & Layout Badge Pill */}
                  <div className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 px-3 py-1 font-mono text-[10px] text-cream/90 shadow-sm select-none">
                    <span
                      className="w-2 h-2 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: selectedTemplate.frameColor }}
                    />
                    <span className="font-medium truncate max-w-[110px] sm:max-w-[140px]">{selectedTemplate.name}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-primary font-semibold">{activeLayout.label}</span>
                  </div>

                  {/* Countdown Duration Minimal Selector */}
                  <div className="flex items-center gap-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 p-0.5 font-mono text-[10px] shadow-sm select-none">
                    <Timer className="w-3 h-3 text-cream/40 ml-1.5 mr-0.5 shrink-0" />
                    {COUNTDOWNS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setCountdownDuration(sec)}
                        disabled={currentCountdown !== null}
                        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          countdownDuration === sec
                            ? 'bg-white/15 text-cream font-medium border border-white/15 shadow-2xs'
                            : 'text-cream/45 hover:text-cream/80'
                        }`}
                        title={`Countdown: ${sec === 0 ? 'Off' : `${sec}s`}`}
                      >
                        {sec === 0 ? '0s' : `${sec}s`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Editing Preview Render: Static Strip & Animated GIF */}
              {phase === 'editing' && (
                <>
                  {previewFormat === 'gif' && renderedGifUrl ? (
                    <img
                      src={renderedGifUrl}
                      alt="Your animated photo strip GIF"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : renderedStripUrl ? (
                    <img
                      src={renderedStripUrl}
                      alt="Your photo strip"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  ) : null}

                  {/* Format switcher pill when GIF is enabled */}
                  {isGifAllowed && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md p-1 border border-white/20 shadow-xl select-none">
                      <button
                        type="button"
                        onClick={() => setPreviewFormat('strip')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          previewFormat === 'strip'
                            ? 'bg-cream text-foreground font-semibold shadow-xs'
                            : 'text-cream/60 hover:text-cream'
                        }`}
                      >
                        Static Strip
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewFormat('gif')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          previewFormat === 'gif'
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'text-cream/60 hover:text-cream'
                        }`}
                      >
                        <span>Animated GIF</span>
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Countdown Overlay with Cancel Option */}
              {currentCountdown !== null && (
                <div className="absolute inset-0 grid place-items-center bg-black/25 backdrop-blur-[2px] z-30">
                  <div className="flex flex-col items-center gap-3">
                    <span className="animate-tick font-display text-8xl text-cream drop-shadow-lg">
                      {currentCountdown}
                    </span>
                    <button
                      type="button"
                      onClick={cancelCountdown}
                      className="rounded-full bg-black/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cream/80 hover:text-cream border border-cream/20 backdrop-blur-md cursor-pointer transition-colors"
                    >
                      Cancel (Esc)
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Shutter Flash */}
              {isFlashing && (
                <div className="animate-shutter pointer-events-none absolute inset-0 bg-cream z-40" />
              )}

              {/* Mini Shot Thumbnail Previews at Bottom of Viewfinder: Only appears once a shot is taken */}
              {phase === 'shooting' && capturedShots.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-1.5 pointer-events-none animate-fade-in">
                  {Array.from({ length: activeLayout.shots }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-11 w-8 sm:h-12 sm:w-9 rounded-md overflow-hidden border transition-all shadow-md ${
                        idx < capturedShots.length
                          ? 'border-white/50 bg-stone-900 ring-1 ring-black/40'
                          : idx === capturedShots.length && currentCountdown !== null
                          ? 'border-white/40 bg-black/40 border-dashed animate-pulse'
                          : 'border-white/15 bg-black/30'
                      }`}
                    >
                      {idx < capturedShots.length ? (
                        <img
                          src={capturedShots[idx]}
                          alt={`Shot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-cream/40">
                          #{idx + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Error Overlay during shooting */}
              {errorMessage && phase === 'shooting' && (
                <div className="absolute inset-0 grid place-items-center bg-foreground/90 p-6 text-center z-30">
                  <div>
                    <p className="text-sm text-cream/80">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => void startCamera()}
                      className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls: Shooting Phase */}
            {phase === 'shooting' ? (
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={flipCamera}
                    disabled={!hasMultipleCameras}
                    aria-label="Switch camera"
                    className="grid size-12 place-items-center rounded-full bg-cream/10 text-sm font-semibold text-cream disabled:opacity-40 hover:bg-cream/15 transition-colors cursor-pointer"
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSnapClick()}
                    disabled={status !== 'ready' || currentCountdown !== null}
                    className="grid size-20 place-items-center rounded-full bg-primary font-display text-2xl text-primary-foreground ring-4 ring-cream/70 disabled:opacity-60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  >
                    SNAP
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-cream/10 font-mono text-[10px] uppercase tracking-widest text-cream/70">
                      {capturedShots.length > 0 ? `${capturedShots.length}/${activeLayout.shots}` : `x${activeLayout.shots}`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream/75">
                    {capturedShots.length === 0
                      ? `Tap SNAP to capture all ${activeLayout.shots} photos with live countdown`
                      : `Shot ${capturedShots.length} of ${activeLayout.shots} captured`}
                  </p>
                </div>
              </div>
            ) : (
              /* Bottom Controls: Editing Phase */
              <div className="mt-auto space-y-4 pt-5">
                {/* Filter Pill Selector */}
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterId(f.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        filterId === f.id ? 'bg-cream text-foreground' : 'bg-cream/10 text-cream/70 hover:bg-cream/15'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Frame Swatches and Caption Input */}
                <div className="flex items-center gap-2">
                  {FRAMES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFrameId(item.id)}
                      aria-label={`${item.label} frame`}
                      style={{ backgroundColor: item.paper }}
                      className={`size-9 rounded-lg transition-all cursor-pointer ${
                        frameId === item.id ? 'ring-2 ring-cream scale-105' : 'ring-1 ring-cream/30 hover:ring-cream/60'
                      }`}
                    />
                  ))}
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={44}
                    placeholder="Add a caption"
                    className="ml-2 min-w-0 flex-1 rounded-full bg-cream/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {renderError && <p className="text-sm text-destructive">{renderError}</p>}

                {/* Action Buttons: Retake, Download PNG, Download GIF */}
                {isGifAllowed ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (renderedStripUrl) {
                            const cleanName = eventName.toLowerCase().replace(/\s+/g, '-');
                            triggerDownload(renderedStripUrl, `${cleanName}-strip.png`, eventName);
                          }
                        }}
                        disabled={isRendering || !renderedStripUrl}
                        className="flex items-center justify-center gap-1.5 rounded-full border border-cream/25 py-3.5 text-xs sm:text-sm font-semibold text-cream hover:bg-cream/10 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <span>Download PNG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (renderedGifUrl) {
                            const cleanName = eventName.toLowerCase().replace(/\s+/g, '-');
                            triggerDownload(renderedGifUrl, `${cleanName}-strip.gif`, eventName);
                          }
                        }}
                        disabled={isRenderingGif || !renderedGifUrl}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                      >
                        <span>{isRenderingGif ? 'Making GIF…' : 'Download GIF'}</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPhase('shooting');
                          setCapturedShots([]);
                          setRenderedStripUrl(null);
                          setRenderedGifUrl(null);
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cream/60 hover:text-cream transition-colors cursor-pointer py-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retake photos</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPhase('shooting');
                        setCapturedShots([]);
                        setRenderedStripUrl(null);
                        setRenderedGifUrl(null);
                      }}
                      className="flex-1 rounded-full border border-cream/25 py-3.5 text-sm font-semibold text-cream hover:bg-cream/10 transition-colors cursor-pointer"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (renderedStripUrl) {
                          const cleanName = eventName.toLowerCase().replace(/\s+/g, '-');
                          triggerDownload(renderedStripUrl, `${cleanName}-strip.png`, eventName);
                        }
                      }}
                      disabled={isRendering || !renderedStripUrl}
                      className="flex-[1.4] rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      {isRendering ? 'Rendering…' : 'Download strip'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
