/**
 * AR Virtual Props Definition and Vector Canvas Renderers.
 * High-definition, infinitely scalable vector rendering for live camera and snapshot composites.
 */

export type ARPropType =
  | 'none'
  | 'shades_classic'
  | 'shades_pixel'
  | 'shades_heart'
  | 'hat_cowboy'
  | 'royal_crown'
  | 'hat_party'
  | 'mustache_retro';

export interface ARPropOption {
  id: ARPropType;
  label: string;
  emoji: string;
  category: 'glasses' | 'hat' | 'face' | 'none';
}

export const AR_PROP_OPTIONS: ARPropOption[] = [
  { id: 'none', label: 'Normal', emoji: '✨', category: 'none' },
  { id: 'shades_classic', label: 'Classic Shades', emoji: '🕶️', category: 'glasses' },
  { id: 'hat_cowboy', label: 'Cowboy Hat', emoji: '🤠', category: 'hat' },
  { id: 'shades_pixel', label: '8-Bit Shades', emoji: '😎', category: 'glasses' },
  { id: 'royal_crown', label: 'Royal Crown', emoji: '👑', category: 'hat' },
  { id: 'shades_heart', label: 'Heart Shades', emoji: '❤️', category: 'glasses' },
  { id: 'hat_party', label: 'Party Hat', emoji: '🎉', category: 'hat' },
  { id: 'mustache_retro', label: 'Mustache', emoji: '🥸', category: 'face' },
];

export interface DetectedFaceAnchors {
  // Center of eyes / nose bridge
  eyeCenterX: number;
  eyeCenterY: number;
  // Eye distance across face
  eyeSpan: number;
  // Angle of head tilt in radians
  rollAngle: number;
  // Top of forehead for hats/crowns
  foreheadX: number;
  foreheadY: number;
  // Philtrum / below nose for mustache
  mouthX: number;
  mouthY: number;
}

/**
 * Draw Classic Black Wayfarer Shades
 */
function drawClassicShades(ctx: CanvasRenderingContext2D, width: number) {
  const h = width * 0.44;
  const halfW = width / 2;

  ctx.save();
  // Frame shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Left Lens & Frame
  ctx.fillStyle = '#0f1117';
  ctx.strokeStyle = '#1e2230';
  ctx.lineWidth = width * 0.035;

  const eyeW = width * 0.43;
  const eyeH = h * 0.85;
  const bridgeW = width * 0.14;

  // Outer Bridge
  ctx.beginPath();
  ctx.rect(-bridgeW / 2, -h * 0.35, bridgeW, h * 0.22);
  ctx.fill();

  // Left Eye Frame (rounded polygon)
  const drawFramePoly = (cx: number) => {
    ctx.beginPath();
    ctx.roundRect(cx - eyeW / 2, -h * 0.45, eyeW, eyeH, [
      eyeW * 0.18,
      eyeW * 0.18,
      eyeW * 0.35,
      eyeW * 0.35,
    ]);
    ctx.fill();
    ctx.stroke();

    // Dark Tint Lens Interior
    ctx.save();
    ctx.fillStyle = '#090a0f';
    ctx.beginPath();
    ctx.roundRect(cx - eyeW / 2 + 4, -h * 0.45 + 4, eyeW - 8, eyeH - 8, [
      eyeW * 0.15,
      eyeW * 0.15,
      eyeW * 0.3,
      eyeW * 0.3,
    ]);
    ctx.fill();

    // Gloss reflection flare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - eyeW * 0.28, -h * 0.38);
    ctx.lineTo(cx - eyeW * 0.12, -h * 0.38);
    ctx.lineTo(cx - eyeW * 0.32, h * 0.25);
    ctx.lineTo(cx - eyeW * 0.44, h * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  drawFramePoly(-halfW * 0.55);
  drawFramePoly(halfW * 0.55);

  // Silver Rivet Accents on temples
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(-halfW + 7, -h * 0.32, 2.5, 1.5, -0.2, 0, Math.PI * 2);
  ctx.ellipse(halfW - 7, -h * 0.32, 2.5, 1.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw 8-Bit Pixel Thug Life Shades
 */
function drawPixelShades(ctx: CanvasRenderingContext2D, width: number) {
  const pixel = Math.max(3, Math.round(width / 24));
  const h = pixel * 6;
  const halfW = (pixel * 24) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#050505';

  // Bridge
  ctx.fillRect(-pixel * 2, -pixel, pixel * 4, pixel);

  // Left frame blocks
  const drawPixelLens = (offsetX: number) => {
    // Top bar
    ctx.fillRect(offsetX, -pixel * 2, pixel * 9, pixel);
    // Body steps
    ctx.fillRect(offsetX, -pixel, pixel * 9, pixel);
    ctx.fillRect(offsetX, 0, pixel * 9, pixel);
    ctx.fillRect(offsetX + pixel, pixel, pixel * 7, pixel);
    ctx.fillRect(offsetX + pixel * 2, pixel * 2, pixel * 5, pixel);

    // White reflection pixels
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(offsetX + pixel, -pixel, pixel, pixel);
    ctx.fillRect(offsetX + pixel * 2, -pixel, pixel, pixel);
    ctx.fillRect(offsetX + pixel * 2, 0, pixel, pixel);
    ctx.fillStyle = '#050505';
  };

  drawPixelLens(-halfW);
  drawPixelLens(halfW - pixel * 9);

  ctx.restore();
}

/**
 * Draw Retro Heart Shades
 */
function drawHeartShades(ctx: CanvasRenderingContext2D, width: number) {
  const h = width * 0.45;
  const halfW = width / 2;
  const heartW = width * 0.42;

  ctx.save();
  ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  const drawHeart = (cx: number) => {
    ctx.save();
    ctx.translate(cx, 0);

    // Gold Outer Rim
    ctx.fillStyle = '#e11d48';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = width * 0.025;

    ctx.beginPath();
    const scale = heartW / 36;
    ctx.moveTo(0, h * 0.35);
    ctx.bezierCurveTo(-18 * scale, 0, -20 * scale, -18 * scale, 0, -18 * scale);
    ctx.bezierCurveTo(20 * scale, -18 * scale, 18 * scale, 0, 0, h * 0.35);
    ctx.fill();
    ctx.stroke();

    // Darker cherry center
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    const innerScale = scale * 0.85;
    ctx.moveTo(0, h * 0.28);
    ctx.bezierCurveTo(-18 * innerScale, 0, -20 * innerScale, -18 * innerScale, 0, -18 * innerScale);
    ctx.bezierCurveTo(20 * innerScale, -18 * innerScale, 18 * innerScale, 0, 0, h * 0.28);
    ctx.fill();

    // Sparkle flare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-heartW * 0.22, -h * 0.2, heartW * 0.08, heartW * 0.04, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Bridge
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-width * 0.08, -h * 0.1, width * 0.16, width * 0.03);

  drawHeart(-halfW * 0.52);
  drawHeart(halfW * 0.52);

  ctx.restore();
}

/**
 * Draw Realistic Western Cowboy Hat
 */
function drawCowboyHat(ctx: CanvasRenderingContext2D, width: number) {
  const hatWidth = width * 1.55;
  const crownW = hatWidth * 0.52;
  const crownH = hatWidth * 0.48;

  ctx.save();
  // Realistic paper drop shadow onto forehead
  ctx.shadowColor = 'rgba(30, 20, 10, 0.65)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  // 1. Hat Crown
  const crownGrad = ctx.createLinearGradient(-crownW / 2, -crownH, crownW / 2, 0);
  crownGrad.addColorStop(0, '#78350f');
  crownGrad.addColorStop(0.5, '#92400e');
  crownGrad.addColorStop(1, '#451a03');

  ctx.fillStyle = crownGrad;
  ctx.beginPath();
  // Pinched cattleman crease at top
  ctx.moveTo(-crownW * 0.42, 0);
  ctx.bezierCurveTo(-crownW * 0.48, -crownH * 0.7, -crownW * 0.35, -crownH, -crownW * 0.12, -crownH * 0.94);
  ctx.bezierCurveTo(-crownW * 0.04, -crownH * 0.86, crownW * 0.04, -crownH * 0.86, crownW * 0.12, -crownH * 0.94);
  ctx.bezierCurveTo(crownW * 0.35, -crownH, crownW * 0.48, -crownH * 0.7, crownW * 0.42, 0);
  ctx.closePath();
  ctx.fill();

  // Crown Crease Shadow
  ctx.fillStyle = 'rgba(30, 15, 5, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, -crownH * 0.9);
  ctx.lineTo(-crownW * 0.08, -crownH * 0.3);
  ctx.lineTo(crownW * 0.08, -crownH * 0.3);
  ctx.closePath();
  ctx.fill();

  // 2. Leather Hatband with Gold Buckle
  ctx.fillStyle = '#29180b';
  ctx.beginPath();
  ctx.ellipse(0, -crownH * 0.06, crownW * 0.44, crownH * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Buckle
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-crownW * 0.08, -crownH * 0.11, crownW * 0.16, crownH * 0.1);
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-crownW * 0.05, -crownH * 0.09, crownW * 0.1, crownH * 0.06);

  // 3. Sweeping Curved Brim
  const brimGrad = ctx.createLinearGradient(0, -crownH * 0.1, 0, crownH * 0.25);
  brimGrad.addColorStop(0, '#92400e');
  brimGrad.addColorStop(0.5, '#78350f');
  brimGrad.addColorStop(1, '#451a03');

  ctx.fillStyle = brimGrad;
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;

  ctx.beginPath();
  // Outer sweeping curl
  ctx.moveTo(-hatWidth / 2, -crownH * 0.12);
  ctx.bezierCurveTo(-hatWidth * 0.35, crownH * 0.24, hatWidth * 0.35, crownH * 0.24, hatWidth / 2, -crownH * 0.12);
  ctx.bezierCurveTo(hatWidth * 0.4, crownH * 0.08, -hatWidth * 0.4, crownH * 0.08, -hatWidth / 2, -crownH * 0.12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Gilded Royal Crown
 */
function drawRoyalCrown(ctx: CanvasRenderingContext2D, width: number) {
  const crownW = width * 1.05;
  const crownH = crownW * 0.55;
  const halfW = crownW / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(234, 179, 8, 0.55)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  const goldGrad = ctx.createLinearGradient(0, -crownH, 0, 0);
  goldGrad.addColorStop(0, '#fef08a');
  goldGrad.addColorStop(0.4, '#eab308');
  goldGrad.addColorStop(1, '#a16207');

  ctx.fillStyle = goldGrad;
  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 2.5;

  // Crown with 5 peaks
  ctx.beginPath();
  ctx.moveTo(-halfW, 0);
  ctx.lineTo(-halfW, -crownH * 0.6);
  ctx.lineTo(-halfW * 0.55, -crownH * 0.35);
  ctx.lineTo(-halfW * 0.25, -crownH * 0.85);
  ctx.lineTo(0, -crownH * 0.4);
  ctx.lineTo(halfW * 0.25, -crownH * 0.85);
  ctx.lineTo(halfW * 0.55, -crownH * 0.35);
  ctx.lineTo(halfW, -crownH * 0.6);
  ctx.lineTo(halfW, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Peak Pearls
  const peakX = [-halfW, -halfW * 0.25, 0, halfW * 0.25, halfW];
  const peakY = [-crownH * 0.6, -crownH * 0.85, -crownH * 0.4, -crownH * 0.85, -crownH * 0.6];
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < peakX.length; i++) {
    ctx.beginPath();
    ctx.arc(peakX[i], peakY[i], crownW * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }

  // Headband Velvet & Rubies
  ctx.fillStyle = '#881337';
  ctx.beginPath();
  ctx.roundRect(-halfW + 4, -crownH * 0.2, crownW - 8, crownH * 0.16, 4);
  ctx.fill();

  // Red and Cyan Jewels
  const jewelX = [-halfW * 0.6, -halfW * 0.2, halfW * 0.2, halfW * 0.6];
  for (let j = 0; j < jewelX.length; j++) {
    ctx.fillStyle = j % 2 === 0 ? '#ef4444' : '#06b6d4';
    ctx.beginPath();
    ctx.arc(jewelX[j], -crownH * 0.12, crownW * 0.03, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Festive Party Hat
 */
function drawPartyHat(ctx: CanvasRenderingContext2D, width: number) {
  const hatW = width * 0.72;
  const hatH = hatW * 1.35;
  const halfW = hatW / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(236, 72, 153, 0.45)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;

  // Party Cone Body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, -hatH);
  ctx.lineTo(-halfW, 0);
  ctx.bezierCurveTo(-halfW * 0.5, hatW * 0.1, halfW * 0.5, hatW * 0.1, halfW, 0);
  ctx.closePath();
  ctx.clip();

  // Striped pattern fill
  ctx.fillStyle = '#ec4899';
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(0, -hatH);
  ctx.lineTo(-halfW * 0.5, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(0, -hatH);
  ctx.lineTo(halfW * 0.5, 0);
  ctx.lineTo(halfW, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Fluffy Pom-Pom on Top
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -hatH, hatW * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw Handlebar Mustache
 */
function drawHandlebarMustache(ctx: CanvasRenderingContext2D, width: number) {
  const stacheW = width * 0.85;
  const halfW = stacheW / 2;
  const h = stacheW * 0.32;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#1c1917';

  // Left wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-halfW * 0.4, -h * 0.6, -halfW * 0.85, -h * 0.4, -halfW, -h * 0.1);
  ctx.bezierCurveTo(-halfW * 0.85, h * 0.5, -halfW * 0.4, h * 0.3, 0, h * 0.1);
  ctx.closePath();
  ctx.fill();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(halfW * 0.4, -h * 0.6, halfW * 0.85, -h * 0.4, halfW, -h * 0.1);
  ctx.bezierCurveTo(halfW * 0.85, h * 0.5, halfW * 0.4, h * 0.3, 0, h * 0.1);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Universal AR Prop Dispatcher:
 * Renders the chosen prop at the detected face coordinates on any canvas.
 */
export function renderARPropOnCanvas(
  ctx: CanvasRenderingContext2D,
  prop: ARPropType,
  anchors: DetectedFaceAnchors
) {
  if (prop === 'none') return;

  ctx.save();

  switch (prop) {
    case 'shades_classic': {
      ctx.translate(anchors.eyeCenterX, anchors.eyeCenterY);
      ctx.rotate(anchors.rollAngle);
      drawClassicShades(ctx, anchors.eyeSpan * 2.15);
      break;
    }

    case 'shades_pixel': {
      ctx.translate(anchors.eyeCenterX, anchors.eyeCenterY);
      ctx.rotate(anchors.rollAngle);
      drawPixelShades(ctx, anchors.eyeSpan * 2.1);
      break;
    }

    case 'shades_heart': {
      ctx.translate(anchors.eyeCenterX, anchors.eyeCenterY);
      ctx.rotate(anchors.rollAngle);
      drawHeartShades(ctx, anchors.eyeSpan * 2.2);
      break;
    }

    case 'hat_cowboy': {
      ctx.translate(anchors.foreheadX, anchors.foreheadY);
      ctx.rotate(anchors.rollAngle);
      drawCowboyHat(ctx, anchors.eyeSpan * 2.2);
      break;
    }

    case 'royal_crown': {
      ctx.translate(anchors.foreheadX, anchors.foreheadY);
      ctx.rotate(anchors.rollAngle);
      drawRoyalCrown(ctx, anchors.eyeSpan * 2.0);
      break;
    }

    case 'hat_party': {
      ctx.translate(anchors.foreheadX, anchors.foreheadY);
      ctx.rotate(anchors.rollAngle);
      drawPartyHat(ctx, anchors.eyeSpan * 1.8);
      break;
    }

    case 'mustache_retro': {
      ctx.translate(anchors.mouthX, anchors.mouthY);
      ctx.rotate(anchors.rollAngle);
      drawHandlebarMustache(ctx, anchors.eyeSpan * 1.1);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}
