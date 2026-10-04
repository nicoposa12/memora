/**
 * High-Resolution Canvas Rasterizers for 4 Designer Strip Templates
 * Pixel-perfect canvas rendering matching Memora's live photobooth strips.
 */

// Helper to draw rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
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
}

/**
 * 1. CRIMSON ROMANCE ("YOU and ME FOREVER")
 */
export function drawCanvasCrimsonRomance(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[],
  footerCenterY: number
) {
  ctx.save();

  // 1. Top Header (if header area available)
  if (photoRects.length > 0 && photoRects[0].y > 80) {
    const headerCY = photoRects[0].y / 2 + 5;
    ctx.save();
    ctx.textAlign = 'center';

    // Crown / Tag
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.letterSpacing = '5px';
    ctx.fillText('✦ L\'AMOUR TOUJOURS ✦', width / 2, headerCY - 22);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 32px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('CRIMSON ROMANCE', width / 2, headerCY + 14);

    // Subtitle & Hairlines
    const subY = headerCY + 36;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 130, subY);
    ctx.lineTo(width / 2 - 65, subY);
    ctx.moveTo(width / 2 + 65, subY);
    ctx.lineTo(width / 2 + 130, subY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(254, 205, 211, 0.75)';
    ctx.font = 'italic 14px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('Editorial Duo Diptych', width / 2, subY + 4);
    ctx.restore();
  }

  // 2. Draw Photo Frame Outlines (Double Gold Border & Corner Accents)
  for (const rect of photoRects) {
    ctx.save();
    // Outer Gold Foil Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x - 3, rect.y - 3, rect.w + 6, rect.h + 6);

    // Inner Hairline
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rect.x + 3, rect.y + 3, rect.w - 6, rect.h - 6);

    // Corner Ornaments
    const cornerSize = 14;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(rect.x - 8, rect.y - 8 + cornerSize);
    ctx.lineTo(rect.x - 8, rect.y - 8);
    ctx.lineTo(rect.x - 8 + cornerSize, rect.y - 8);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w + 8 - cornerSize, rect.y - 8);
    ctx.lineTo(rect.x + rect.w + 8, rect.y - 8);
    ctx.lineTo(rect.x + rect.w + 8, rect.y - 8 + cornerSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(rect.x - 8, rect.y + rect.h + 8 - cornerSize);
    ctx.lineTo(rect.x - 8, rect.y + rect.h + 8);
    ctx.lineTo(rect.x - 8 + cornerSize, rect.y + rect.h + 8);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.w + 8 - cornerSize, rect.y + rect.h + 8);
    ctx.lineTo(rect.x + rect.w + 8, rect.y + rect.h + 8);
    ctx.lineTo(rect.x + rect.w + 8, rect.y + rect.h + 8 - cornerSize);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Footer: "YOU and ME FOREVER"
  const cy = footerCenterY - 30;

  // Flourish line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, cy - 45);
  ctx.lineTo(width / 2 + 120, cy - 45);
  ctx.stroke();

  // Star symbol
  ctx.fillStyle = '#d4af37';
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', width / 2, cy - 45);

  // Line 1: YOU and ME
  ctx.fillStyle = '#ffffff';
  ctx.font = '300 32px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('YOU and ME', width / 2, cy - 8);

  // Line 2: FOREVER
  ctx.font = 'italic 500 48px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('FOREVER', width / 2, cy + 42);

  // Line 3: Date
  ctx.font = '600 16px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.letterSpacing = '5px';
  ctx.fillText('02 / 14 / 2026', width / 2, cy + 76);

  ctx.restore();
}

/**
 * 2. AESTHETIC AUDIO PLAYER (Spotify / Music Player UI)
 */
export function drawCanvasMusicPlayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[],
  footerCenterY: number,
  customTitle?: string
) {
  ctx.save();

  // 1. Top Audio Header (if header area available)
  if (photoRects.length > 0 && photoRects[0].y > 100) {
    const headerCY = photoRects[0].y / 2 + 10;
    
    // Left: Mini vinyl spool + ORIGINAL SOUNDTRACK
    ctx.save();
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.letterSpacing = '3px';
    ctx.fillText('ORIGINAL SOUNDTRACK', photoRects[0].x, headerCY - 16);

    // Right: STEREO // 48kHz badge + SIDE A
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('SIDE A', photoRects[0].x + photoRects[0].w, headerCY - 16);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText('STEREO // 48kHz   •', photoRects[0].x + photoRects[0].w - 85, headerCY - 16);

    // Audio Frequency Metering Line
    const dividerY = headerCY + 18;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(photoRects[0].x, dividerY);
    ctx.lineTo(photoRects[0].x + photoRects[0].w, dividerY);
    ctx.stroke();

    // Center equalizer tick bars
    const centerDividerX = width / 2;
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(centerDividerX - 10, dividerY - 4, 3, 8);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(centerDividerX - 4, dividerY - 7, 3, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerDividerX + 2, dividerY - 10, 3, 20);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(centerDividerX + 8, dividerY - 5, 3, 10);
    ctx.restore();
  }

  // 2. Photo Frame Accents (Corner Viewfinders & Track Tags)
  photoRects.forEach((rect, idx) => {
    // Crisp outer border
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 3;
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4, 12);
      ctx.stroke();
    } else {
      ctx.strokeRect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4);
    }

    // Viewfinder brackets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '22px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⌜', rect.x + 12, rect.y + 30);
    ctx.fillText('⌞', rect.x + 12, rect.y + rect.h - 14);
    ctx.textAlign = 'right';
    ctx.fillText('⌝', rect.x + rect.w - 12, rect.y + 30);
    ctx.fillText('⌟', rect.x + rect.w - 12, rect.y + rect.h - 14);

    ctx.restore();
  });

  // 3. Audio Player Card in Footer
  const isGrid = photoRects.length > 1 && photoRects[1].x > photoRects[0].x;
  const cardW = isGrid
    ? (photoRects[1].x + photoRects[1].w - photoRects[0].x)
    : (photoRects.length > 0 ? photoRects[0].w : width - 160);
  const cardH = 175;
  const cardX = isGrid ? photoRects[0].x : (width - cardW) / 2;
  const cardY = footerCenterY - cardH / 2 - 5;

  // Background Card: Sleek Matte Obsidian
  ctx.save();
  ctx.fillStyle = '#101116';
  roundRect(ctx, cardX, cardY, cardW, cardH, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Row 1: Minimalist Album Artwork Thumbnail
  const thumbSize = 46;
  const thumbX = cardX + 24;
  const thumbY = cardY + 20;

  // Square disc jacket
  ctx.fillStyle = '#181920';
  roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Subtle concentric vinyl groove
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(thumbX + thumbSize / 2, thumbY + thumbSize / 2, 16, 0, Math.PI * 2);
  ctx.stroke();

  // Center music glyph
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('♫', thumbX + thumbSize / 2, thumbY + thumbSize / 2 + 6);

  // Track Title & Subtitle
  const textX = thumbX + thumbSize + 18;
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(customTitle || 'Original Soundtrack', textX, thumbY + 20);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText('Memora Sound Archive', textX, thumbY + 38);

  // Row 2: Slimline Progress Scrubber Bar
  const barY = cardY + 84;
  const barX = cardX + 24;
  const barW = cardW - 48;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  roundRect(ctx, barX, barY, barW, 4, 2);
  ctx.fill();

  // Progress fill (42%)
  const fillW = barW * 0.42;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, barX, barY, fillW, 4, 2);
  ctx.fill();

  // Timestamps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('01:28', barX, barY + 18);
  ctx.textAlign = 'right';
  ctx.fillText('03:45', barX + barW, barY + 18);

  // Row 3: Essential Transport Controls (Prev, Play, Next)
  const ctrlY = cardY + 128;
  const ctrlCenterX = width / 2;

  // Previous
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⏮', ctrlCenterX - 56, ctrlY);

  // Hero Play Circle
  ctx.beginPath();
  ctx.arc(ctrlCenterX, ctrlY - 5, 17, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(ctrlCenterX - 4, ctrlY - 12);
  ctx.lineTo(ctrlCenterX + 7, ctrlY - 5);
  ctx.lineTo(ctrlCenterX - 4, ctrlY + 2);
  ctx.closePath();
  ctx.fill();

  // Next
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⏭', ctrlCenterX + 56, ctrlY);

  // Row 4: Subtle Inscription
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 24, cardY + cardH - 24);
  ctx.lineTo(cardX + cardW - 24, cardY + cardH - 24);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('MEMORA AUDIO ARCHIVE', cardX + cardW / 2, cardY + cardH - 10);

  ctx.restore();
}

/**
 * 3. GINGHAM SWEET STRAWBERRY (Coquette Red & White Checkerboard)
 */
export function drawCanvasGinghamStrawberry(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[],
  footerCenterY: number
) {
  ctx.save();

  // 1. Draw Gingham Background Pattern
  const checkSize = 32;
  const numX = Math.ceil(width / checkSize);
  const numY = Math.ceil(height / checkSize);

  // Base white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Horizontal red stripes
  ctx.fillStyle = 'rgba(225, 29, 72, 0.35)';
  for (let y = 0; y < numY; y += 2) {
    ctx.fillRect(0, y * checkSize, width, checkSize);
  }

  // Vertical red stripes
  for (let x = 0; x < numX; x += 2) {
    ctx.fillRect(x * checkSize, 0, checkSize, height);
  }

  // 2. White Mats around each photo
  for (const rect of photoRects) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, rect.x - 12, rect.y - 12, rect.w + 24, rect.h + 24, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  // 3. Top Strawberry Sticker
  if (photoRects.length > 0) {
    const p1 = photoRects[0];
    const sX = p1.x + 10;
    const sY = Math.max(30, p1.y - 30);
    ctx.save();
    ctx.translate(sX, sY);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.scale(1.5, 1.5);
    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    // Berry Body
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(-14, 14, -14, -6, 0, -10);
    ctx.bezierCurveTo(14, -6, 14, 14, 0, 20);
    ctx.closePath();
    ctx.fill();
    // Calyx Green
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(0, -10, 8, 0, Math.PI);
    ctx.fill();
    ctx.restore();
  }

  // 4. Ribbon Bow Sticker
  if (photoRects.length >= 2) {
    const isGrid = photoRects[1].x > photoRects[0].x;
    ctx.save();
    if (isGrid) {
      // Place on outer top-left of photo 0
      const p1 = photoRects[0];
      ctx.translate(p1.x - 10, p1.y + 24);
      ctx.rotate((-12 * Math.PI) / 180);
    } else {
      const p2 = photoRects[1];
      ctx.translate(p2.x - 6, p2.y + p2.h / 2);
    }
    ctx.scale(1.6, 1.6);
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    // Red bow loops
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(-10, 0, 10, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(10, 0, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Knot
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5. Cherries Sticker
  if (photoRects.length >= 3) {
    const isGrid = photoRects[1].x > photoRects[0].x;
    ctx.save();
    if (isGrid) {
      // Place on outer bottom-right of last photo
      const last = photoRects[photoRects.length - 1];
      ctx.translate(last.x + last.w + 10, last.y + last.h - 28);
    } else {
      const p3 = photoRects[2];
      ctx.translate(p3.x + p3.w + 6, p3.y + p3.h / 2);
    }
    ctx.scale(1.4, 1.4);
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    // Cherry 1
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(-8, 6, 8, 0, Math.PI * 2);
    ctx.arc(8, 4, 8, 0, Math.PI * 2);
    ctx.fill();
    // Stems
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(0, -14, 4, -18);
    ctx.moveTo(8, -2);
    ctx.quadraticCurveTo(2, -14, 4, -18);
    ctx.stroke();
    ctx.restore();
  }

  // 5b. Ribbon Bow & Strawberry on Photo 4 (4-Pose Strip)
  if (photoRects.length >= 4) {
    const isGrid = photoRects[1].x > photoRects[0].x;
    if (!isGrid) {
      const p4 = photoRects[3];
      // Ribbon bow on left edge of Photo 4
      ctx.save();
      ctx.translate(p4.x - 6, p4.y + p4.h / 2);
      ctx.rotate((-12 * Math.PI) / 180);
      ctx.scale(1.4, 1.4);
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(-10, 0, 10, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(10, 0, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Mini strawberry on bottom-right of Photo 4
      ctx.save();
      ctx.translate(p4.x + p4.w - 10, p4.y + p4.h - 10);
      ctx.rotate((12 * Math.PI) / 180);
      ctx.scale(1.1, 1.1);
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, -12, -14, 24, 28, 10);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      roundRect(ctx, -10, -12, 20, 24, 8);
      ctx.fill();
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(0, -12, 5, 0, Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  // 6. Bottom "Sweet" Die-Cut Wordmark
  const cy = footerCenterY - 15;
  ctx.save();
  ctx.translate(width / 2, cy);
  ctx.rotate((-2 * Math.PI) / 180);

  // White pill backing
  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#fee2e2';
  ctx.lineWidth = 4;
  roundRect(ctx, -75, -28, 150, 56, 28);
  ctx.fill();
  ctx.stroke();

  // "Sweet" text
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#e11d48';
  ctx.font = 'italic bold 36px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Sweet', 0, 0);

  ctx.restore();

  ctx.restore();
}

let cachedIdolImages: HTMLImageElement[] | null = null;
function getIdolImages(): HTMLImageElement[] {
  if (typeof window === 'undefined') return [];
  if (!cachedIdolImages) {
    cachedIdolImages = [new Image(), new Image(), new Image()];
    cachedIdolImages[0].crossOrigin = 'anonymous';
    cachedIdolImages[0].src = '/templates/kpop/idol_pose_1.png';
    cachedIdolImages[1].crossOrigin = 'anonymous';
    cachedIdolImages[1].src = '/templates/kpop/idol_pose_2.png';
    cachedIdolImages[2].crossOrigin = 'anonymous';
    cachedIdolImages[2].src = '/templates/kpop/idol_pose_3.png';
  }
  return cachedIdolImages;
}

/**
 * 4. HARU PASTEL CANDY STRIPES ("사랑해요 / Saranghaeyo")
 */
export function drawCanvasHaruCandyStripes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[],
  footerCenterY: number
) {
  ctx.save();

  // 1. Draw Sky Blue & White Vertical Candy Stripes
  const stripeW = 28;
  const numStripes = Math.ceil(width / stripeW);
  for (let i = 0; i < numStripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#bae6fd' : '#ffffff';
    ctx.fillRect(i * stripeW, 0, stripeW, height);
  }

  // 2. White Mats around each photo
  for (const rect of photoRects) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    roundRect(ctx, rect.x - 10, rect.y - 10, rect.w + 20, rect.h + 20, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';
  }

  // 3. Top-Left Pastel Star Sticker
  if (photoRects.length > 0) {
    const p1 = photoRects[0];
    ctx.save();
    ctx.translate(p1.x + 8, Math.max(30, p1.y - 25));
    ctx.rotate((14 * Math.PI) / 180);
    ctx.scale(1.5, 1.5);
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const pts = [
      [0, -14],
      [4, -4],
      [14, -3],
      [6, 4],
      [9, 14],
      [0, 8],
      [-9, 14],
      [-6, 4],
      [-14, -3],
      [-4, -4],
    ];
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 4. Top-Right Retro Toy Camera Sticker
  if (photoRects.length > 0) {
    const isGrid = photoRects.length > 1 && photoRects[1].x > photoRects[0].x;
    const topTarget = isGrid ? photoRects[1] : photoRects[0];
    ctx.save();
    ctx.translate(topTarget.x + topTarget.w - 12, Math.max(30, topTarget.y - 25));
    ctx.rotate((-8 * Math.PI) / 180);
    ctx.scale(1.3, 1.3);
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 8;
    // Camera body
    ctx.fillStyle = '#f3e8ff';
    ctx.strokeStyle = '#7e22ce';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -18, -12, 36, 24, 6);
    ctx.fill();
    ctx.stroke();
    // Lens
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#c084fc';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 5. Korean Idol / Artist Companion Cutouts
  const idols = getIdolImages();
  if (photoRects[0] && idols[0] && idols[0].complete && idols[0].naturalWidth > 0) {
    const rect = photoRects[0];
    const imgH = rect.h * 0.64;
    const imgW = (imgH * idols[0].naturalWidth) / idols[0].naturalHeight;
    ctx.save();
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(rect.x, rect.y, rect.w, rect.h, 6);
    } else {
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    ctx.clip();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 6;
    ctx.drawImage(idols[0], rect.x + rect.w - imgW, rect.y + rect.h - imgH, imgW, imgH);
    ctx.restore();
  }
  if (photoRects[1] && idols[1] && idols[1].complete && idols[1].naturalWidth > 0) {
    const rect = photoRects[1];
    const imgH = rect.h * 0.64;
    const imgW = (imgH * idols[1].naturalWidth) / idols[1].naturalHeight;
    ctx.save();
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(rect.x, rect.y, rect.w, rect.h, 6);
    } else {
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    ctx.clip();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 6;
    ctx.drawImage(idols[1], rect.x, rect.y + rect.h - imgH, imgW, imgH);
    ctx.restore();
  }
  if (photoRects[2] && idols[2] && idols[2].complete && idols[2].naturalWidth > 0) {
    const rect = photoRects[2];
    const imgH = rect.h * 0.66;
    const imgW = (imgH * idols[2].naturalWidth) / idols[2].naturalHeight;
    ctx.save();
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(rect.x, rect.y, rect.w, rect.h, 6);
    } else {
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    ctx.clip();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 6;
    ctx.drawImage(idols[2], rect.x + rect.w - imgW, rect.y + rect.h - imgH, imgW, imgH);
    ctx.restore();

    // Red Rose Corsage Sticker on Photo 3 (Bottom-Left)
    const roseX = rect.x + 28;
    const roseY = rect.y + rect.h - 22;
    ctx.save();
    ctx.translate(roseX, roseY);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9f1239';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5b. Korean Idol Cutout & Pastel Star on Photo 4 (4-Pose Strip)
  if (photoRects[3] && idols[1] && idols[1].complete && idols[1].naturalWidth > 0) {
    const isGrid = photoRects.length > 1 && photoRects[1].x > photoRects[0].x;
    if (!isGrid) {
      const rect = photoRects[3];
      const imgH = rect.h * 0.64;
      const imgW = (imgH * idols[1].naturalWidth) / idols[1].naturalHeight;
      ctx.save();
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(rect.x, rect.y, rect.w, rect.h, 6);
      } else {
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
      }
      ctx.clip();
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur = 6;
      // Draw on left of Photo 4 so it alternates: R, L, R, L
      ctx.drawImage(idols[1], rect.x, rect.y + rect.h - imgH, imgW, imgH);
      ctx.restore();

      // Pastel Star Sticker on right of Photo 4
      const starX = rect.x + rect.w + 6;
      const starY = rect.y + rect.h / 2;
      ctx.save();
      ctx.translate(starX, starY);
      ctx.rotate((12 * Math.PI) / 180);
      ctx.scale(1.2, 1.2);
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const pts = [
        [0, -12], [3, -3], [12, -2], [5, 3], [7, 12],
        [0, 7], [-7, 12], [-5, 3], [-12, -2], [-3, -3]
      ];
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // 6. Footer: "Saranghaeyo" + "사랑해요" (Hangul)
  const cy = footerCenterY - 15;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';

  // "Saranghaeyo"
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 16px "Comic Sans MS", cursive, sans-serif';
  ctx.fillText('Saranghaeyo', width / 2, cy - 20);

  // "사랑해요" (Hangul)
  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 36px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 6;
  ctx.fillText('사랑해요', width / 2, cy + 18);
  ctx.shadowColor = 'transparent';

  // Pink Heart Doodles
  ctx.fillStyle = '#f43f5e';
  ctx.font = '22px sans-serif';
  ctx.fillText('💕', width / 2 + 85, cy + 16);

  // Purple Squiggle wave below
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  const startX = width / 2 - 60;
  ctx.moveTo(startX, cy + 42);
  ctx.bezierCurveTo(startX + 30, cy + 34, startX + 40, cy + 50, startX + 70, cy + 42);
  ctx.bezierCurveTo(startX + 100, cy + 34, startX + 110, cy + 50, startX + 120, cy + 42);
  ctx.stroke();

  ctx.restore();
}

// Cache for vintage template images
let cachedVintageImages: {
  paperBg?: HTMLImageElement;
  burntNewspaper?: HTMLImageElement;
  bust?: HTMLImageElement;
  car?: HTMLImageElement;
  roses?: HTMLImageElement;
  lantern?: HTMLImageElement;
} = {};

function getVintageImages() {
  if (typeof window === 'undefined') return cachedVintageImages;
  if (!cachedVintageImages.paperBg) {
    const p = new Image();
    p.crossOrigin = 'anonymous';
    p.src = '/templates/vintage/paper_bg.jpg';
    cachedVintageImages.paperBg = p;
  }
  if (!cachedVintageImages.burntNewspaper) {
    const n = new Image();
    n.crossOrigin = 'anonymous';
    n.src = '/templates/vintage/burnt_newspaper.jpg';
    cachedVintageImages.burntNewspaper = n;
  }
  if (!cachedVintageImages.bust) {
    const b = new Image();
    b.crossOrigin = 'anonymous';
    b.src = '/templates/vintage/bust.jpg';
    cachedVintageImages.bust = b;
  }
  if (!cachedVintageImages.car) {
    const c = new Image();
    c.crossOrigin = 'anonymous';
    c.src = '/templates/vintage/car.jpg';
    cachedVintageImages.car = c;
  }
  if (!cachedVintageImages.roses) {
    const r = new Image();
    r.crossOrigin = 'anonymous';
    r.src = '/templates/vintage/roses.jpg';
    cachedVintageImages.roses = r;
  }
  if (!cachedVintageImages.lantern) {
    const l = new Image();
    l.crossOrigin = 'anonymous';
    l.src = '/templates/vintage/lantern.jpg';
    cachedVintageImages.lantern = l;
  }
  return cachedVintageImages;
}

function drawCanvasWashiTape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number = 70,
  h: number = 22,
  angleRad: number = 0,
  color: string = 'rgba(214, 197, 165, 0.85)'
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.shadowColor = 'rgba(44, 30, 20, 0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  const hw = w / 2;
  const hh = h / 2;
  ctx.moveTo(-hw, -hh);
  ctx.lineTo(hw, -hh);
  ctx.lineTo(hw - 4, -hh / 2);
  ctx.lineTo(hw, 0);
  ctx.lineTo(hw - 4, hh / 2);
  ctx.lineTo(hw, hh);
  ctx.lineTo(-hw, hh);
  ctx.lineTo(-hw + 4, hh / 2);
  ctx.lineTo(-hw, 0);
  ctx.lineTo(-hw + 4, -hh / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCanvasVintageTicket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 130,
  h: number = 55,
  angleRad: number = -0.05
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angleRad);
  ctx.shadowColor = 'rgba(44, 30, 20, 0.25)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  // Pink body
  ctx.fillStyle = '#df8f97';
  ctx.strokeStyle = '#c4777a';
  ctx.lineWidth = 1.5;
  const hw = w / 2;
  const hh = h / 2;
  ctx.fillRect(-hw, -hh, w, h);
  ctx.strokeRect(-hw, -hh, w, h);

  // Perforated notches on left & right
  ctx.fillStyle = '#f6efe3';
  ctx.beginPath();
  ctx.arc(-hw, 0, 7, 0, Math.PI * 2);
  ctx.arc(hw, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Vertical number
  ctx.fillStyle = '#5a151f';
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  ctx.save();
  ctx.translate(-hw + 18, 0);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('72411', 0, 4);
  ctx.restore();

  // Dividing line
  ctx.strokeStyle = 'rgba(90, 21, 31, 0.3)';
  ctx.beginPath();
  ctx.moveTo(-hw + 28, -hh + 5);
  ctx.lineTo(-hw + 28, hh - 5);
  ctx.stroke();

  // Words
  ctx.fillStyle = '#4a0d16';
  ctx.textAlign = 'left';
  ctx.font = 'italic 11px "Playfair Display", Georgia, serif';
  ctx.fillText("It's a", -hw + 36, -hh + 17);
  ctx.font = '900 13px "Playfair Display", Georgia, serif';
  ctx.fillText('BEAUTIFUL', -hw + 36, -hh + 31);
  ctx.font = 'italic 11px "Playfair Display", Georgia, serif';
  ctx.fillText('Life', -hw + 36, -hh + 45);

  ctx.restore();
}

function drawCanvasCalligraphyLove(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string = 'You are my love'
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Cursive text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#2c1e14';
  ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
  ctx.fillText(text, 0, 0);

  // Left flourish swash
  ctx.strokeStyle = '#2c1e14';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const textWidth = ctx.measureText(text).width;
  const leftEnd = -textWidth / 2 - 15;
  ctx.moveTo(leftEnd - 60, 4);
  ctx.quadraticCurveTo(leftEnd - 35, -12, leftEnd - 15, 0);
  ctx.stroke();

  // Right flourish swash
  const rightStart = textWidth / 2 + 15;
  ctx.beginPath();
  ctx.moveTo(rightStart, 0);
  ctx.quadraticCurveTo(rightStart + 20, 12, rightStart + 60, -4);
  ctx.stroke();

  ctx.restore();
}

function drawCanvasEtchedButterfly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number = 44,
  angleRad: number = 0.1
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.strokeStyle = '#2c1e14';
  ctx.lineWidth = 1.4;
  ctx.fillStyle = 'rgba(255, 253, 248, 0.7)';

  const hs = size / 2;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-hs * 0.8, -hs * 0.8, -hs * 1.4, -hs * 0.2, -hs * 0.6, hs * 0.4);
  ctx.bezierCurveTo(-hs * 0.4, hs * 0.7, -hs * 0.1, hs * 0.5, 0, hs * 0.2);
  ctx.fill();
  ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(hs * 0.8, -hs * 0.8, hs * 1.4, -hs * 0.2, hs * 0.6, hs * 0.4);
  ctx.bezierCurveTo(hs * 0.4, hs * 0.7, hs * 0.1, hs * 0.5, 0, hs * 0.2);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.fillStyle = '#2c1e14';
  ctx.beginPath();
  ctx.ellipse(0, hs * 0.1, 2.5, hs * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Antennae
  ctx.beginPath();
  ctx.moveTo(0, -hs * 0.2);
  ctx.quadraticCurveTo(-hs * 0.3, -hs * 0.5, -hs * 0.4, -hs * 0.6);
  ctx.moveTo(0, -hs * 0.2);
  ctx.quadraticCurveTo(hs * 0.3, -hs * 0.5, hs * 0.4, -hs * 0.6);
  ctx.stroke();

  ctx.restore();
}

/**
 * 5. VINTAGE ARCHIVAL DUO / POSTCARD RASTERIZER
 */
export function drawCanvasVintagePostcard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photoRects: { x: number; y: number; w: number; h: number }[],
  footerCenterY: number,
  caption?: string,
  isDiagonalDuo: boolean = false
) {
  const images = getVintageImages();

  ctx.save();

  // 1. Draw Aged Paper Texture Background (paper_bg.jpg)
  if (images.paperBg && images.paperBg.complete && images.paperBg.naturalWidth > 0) {
    ctx.save();
    ctx.drawImage(images.paperBg, 0, 0, width, height);
    ctx.restore();
  } else {
    ctx.fillStyle = '#f6efe3';
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Outer Double Hairline Frame (Letterpress Styling)
  ctx.strokeStyle = 'rgba(44, 30, 20, 0.45)';
  ctx.lineWidth = 2;
  roundRect(ctx, 24, 24, width - 48, height - 48, 8);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(44, 30, 20, 0.22)';
  ctx.lineWidth = 1;
  roundRect(ctx, 32, 32, width - 64, height - 64, 6);
  ctx.stroke();

  // 3. Vintage Photo Mounts & Washi Tape for each photo
  photoRects.forEach((rect, idx) => {
    ctx.save();
    // Inner fine border around photo
    ctx.strokeStyle = 'rgba(44, 30, 20, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rect.x - 2, rect.y - 2, rect.w + 4, rect.h + 4);

    // Corner photo mount brackets
    ctx.fillStyle = '#8c735d';
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⌜', rect.x + 8, rect.y + 22);
    ctx.fillText('⌞', rect.x + 8, rect.y + rect.h - 10);
    ctx.textAlign = 'right';
    ctx.fillText('⌝', rect.x + rect.w - 8, rect.y + 22);
    ctx.fillText('⌟', rect.x + rect.w - 8, rect.y + rect.h - 10);
    ctx.restore();

    // Washi Tape corner mounts
    if (idx === 0) {
      drawCanvasWashiTape(ctx, rect.x + rect.w - 15, rect.y - 4, 65, 20, 0.12);
    } else if (idx === 1) {
      drawCanvasWashiTape(ctx, rect.x + 15, rect.y - 4, 65, 20, -0.12);
    } else {
      drawCanvasWashiTape(ctx, rect.x + rect.w - 15, rect.y + rect.h + 4, 60, 18, -0.08);
    }
  });

  // 4. Diagonal Staggered Duo Composition (Screenshot 1 Junk Journal Flatlay)
  if (isDiagonalDuo && photoRects.length >= 2) {
    const p1 = photoRects[0];
    const p2 = photoRects[1];

    // Top-Left Photo 1: Classical Marble Bust Cutout
    if (images.bust && images.bust.complete && images.bust.naturalWidth > 0) {
      ctx.save();
      const bustW = 120;
      const bustH = 140;
      ctx.translate(p1.x - 30, p1.y - 40);
      ctx.rotate(-0.06);
      ctx.drawImage(images.bust, 0, 0, bustW, bustH);
      ctx.restore();
    }

    // Top-Right Archival Postmark & Burnt Newspaper Clipping
    const trX = p2.x;
    const trY = p1.y;
    const trW = p2.w;
    const trH = p1.h;

    ctx.save();
    // Burnt Newspaper Clipping background
    if (images.burntNewspaper && images.burntNewspaper.complete && images.burntNewspaper.naturalWidth > 0) {
      ctx.save();
      ctx.shadowColor = 'rgba(44, 30, 20, 0.25)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.drawImage(images.burntNewspaper, trX, trY, trW, trH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#f2e9dc';
      roundRect(ctx, trX, trY, trW, trH, 4);
      ctx.fill();
    }

    // Kraft Washi Tape on top of newspaper
    drawCanvasWashiTape(ctx, trX + 45, trY, 65, 20, -0.07);

    // Copperplate Etched Butterfly resting on top-right of newspaper
    drawCanvasEtchedButterfly(ctx, trX + trW - 35, trY + 28, 48, 0.12);

    // Postage Stamp Body
    const stampW = 95;
    const stampH = 115;
    const stampX = trX + (trW - stampW) / 2 + 25;
    const stampY = trY + 30;

    ctx.save();
    ctx.translate(stampX + stampW / 2, stampY + stampH / 2);
    ctx.rotate(0.04);
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(-stampW / 2, -stampH / 2, stampW, stampH);
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);

    // Dashed inner border
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = 'rgba(140, 115, 93, 0.6)';
    ctx.strokeRect(-stampW / 2 + 6, -stampH / 2 + 6, stampW - 12, stampH - 12);
    ctx.setLineDash([]);

    ctx.fillStyle = '#3d2b1f';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('POSTAGE', 0, -stampH / 2 + 22);

    // Star Motif
    ctx.font = '20px serif';
    ctx.fillText('✦', 0, 8);

    ctx.font = 'bold 13px "Playfair Display", Georgia, serif';
    ctx.fillText('25¢', -18, stampH / 2 - 14);
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('USA', 18, stampH / 2 - 14);
    ctx.restore();

    // Circular Postal Postmark Seal
    const postmarkX = stampX - 25;
    const postmarkY = stampY + stampH / 2;
    ctx.save();
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(postmarkX, postmarkY, 46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(postmarkX, postmarkY, 39, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#3d2b1f';
    ctx.textAlign = 'center';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('MEMORA', postmarkX, postmarkY - 14);
    ctx.font = 'bold 14px "Playfair Display", serif';
    ctx.fillText('ARCHIVE', postmarkX, postmarkY + 4);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('EST. 2026', postmarkX, postmarkY + 20);

    // Wavy cancellation lines
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.55)';
    ctx.lineWidth = 1.8;
    for (let wave = -16; wave <= 16; wave += 10) {
      ctx.beginPath();
      const waveStartX = postmarkX + 48;
      ctx.moveTo(waveStartX, postmarkY + wave);
      ctx.bezierCurveTo(
        waveStartX + 20, postmarkY + wave - 8,
        waveStartX + 40, postmarkY + wave + 8,
        waveStartX + 65, postmarkY + wave
      );
      ctx.stroke();
    }
    ctx.restore();

    // Issue Label below postmark
    ctx.fillStyle = '#8c735d';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('№ 01 • ORIGINAL ARCHIVE PRINT', trX + trW / 2, trY + trH - 18);
    ctx.restore();

    // Center Bridge: Retro Blue Car & Calligraphy "You are my love"
    const centerCY = (p1.y + p1.h + p2.y) / 2;
    if (images.car && images.car.complete && images.car.naturalWidth > 0) {
      ctx.save();
      const carW = 140;
      const carH = 90;
      ctx.translate(p1.x + 20, centerCY - carH / 2);
      ctx.rotate(-0.04);
      ctx.drawImage(images.car, 0, 0, carW, carH);
      ctx.restore();
    }
    drawCanvasCalligraphyLove(ctx, width / 2 + 50, centerCY, 'You are my love');

    // Bottom-Left Block: Pressed Yellow Roses Herbarium, Pink Ticket & Editorial Note
    const blX = p1.x;
    const blY = p2.y;
    const blW = p1.w;
    const blH = p2.h;

    ctx.save();
    // Background card
    ctx.fillStyle = '#f2e9dc';
    roundRect(ctx, blX, blY, blW, blH, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pressed Dried Yellow Roses Botanical specimen
    if (images.roses && images.roses.complete && images.roses.naturalWidth > 0) {
      ctx.save();
      const roseW = blW * 0.55;
      const roseH = blH * 1.1;
      ctx.translate(blX - 10, blY + blH - roseH + 10);
      ctx.drawImage(images.roses, 0, 0, roseW, roseH);
      ctx.restore();
    }

    // Pink Admission Ticket Stub ("72411 It's a Beautiful Life")
    drawCanvasVintageTicket(ctx, blX + blW - 145, blY + blH - 65, 140, 58, -0.05);

    // Editorial Note Typography
    const midX = blX + blW * 0.65;
    const midY = blY + blH * 0.35;

    // Diamond rule
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(midX - 60, midY - 45);
    ctx.lineTo(midX - 10, midY - 45);
    ctx.moveTo(midX + 10, midY - 45);
    ctx.lineTo(midX + 60, midY - 45);
    ctx.stroke();

    ctx.fillStyle = '#8c735d';
    ctx.textAlign = 'center';
    ctx.font = '13px serif';
    ctx.fillText('◇', midX, midY - 41);

    // Heading
    ctx.fillStyle = '#2c1e14';
    ctx.font = 'bold 18px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('MEMORA ARCHIVE', midX, midY - 18);

    // Caption
    const quoteText = caption && caption.trim()
      ? caption.trim()
      : 'Captured moments preserved in silver and light.';
    ctx.fillStyle = '#4a3728';
    ctx.font = 'italic 15px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`“${quoteText}”`, midX, midY + 12);

    // Archival series
    ctx.strokeStyle = 'rgba(61, 43, 31, 0.25)';
    ctx.beginPath();
    ctx.moveTo(midX - 45, midY + 36);
    ctx.lineTo(midX + 45, midY + 36);
    ctx.stroke();

    ctx.fillStyle = '#8c735d';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('SERIES 24 • KEEPSAKE', midX, midY + 54);
    ctx.restore();

    // Bottom-Right Photo 2: Weathered Brass Lantern
    if (images.lantern && images.lantern.complete && images.lantern.naturalWidth > 0) {
      ctx.save();
      const lanternW = 110;
      const lanternH = 140;
      ctx.translate(p2.x + p2.w - lanternW + 25, p2.y + p2.h - lanternH + 25);
      ctx.rotate(0.04);
      ctx.drawImage(images.lantern, 0, 0, lanternW, lanternH);
      ctx.restore();
    }
  } else {
    // Vertical Strip Vintage Inscriptions & Accents
    // Top Header
    if (photoRects.length > 0 && photoRects[0].y > 80) {
      const topY = photoRects[0].y / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8c735d';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText('✦ ARCHIVAL POSTCARD ✦', width / 2, topY - 14);

      ctx.fillStyle = '#2c1e14';
      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.fillText('MEMORA VINTAGE PRESS', width / 2, topY + 14);
      ctx.restore();
    }

    // Accents on photos for vertical strips
    if (photoRects.length >= 1 && images.bust && images.bust.complete) {
      ctx.save();
      ctx.translate(photoRects[0].x - 20, photoRects[0].y - 30);
      ctx.rotate(-0.06);
      ctx.drawImage(images.bust, 0, 0, 95, 110);
      ctx.restore();
    }

    if (photoRects.length >= 2 && images.car && images.car.complete) {
      ctx.save();
      ctx.translate(photoRects[1].x - 25, photoRects[1].y + photoRects[1].h - 60);
      ctx.rotate(-0.04);
      ctx.drawImage(images.car, 0, 0, 110, 70);
      ctx.restore();
    }

    if (photoRects.length >= 3) {
      drawCanvasVintageTicket(ctx, photoRects[2].x + photoRects[2].w - 110, photoRects[2].y + photoRects[2].h - 40, 120, 50, 0.06);
      drawCanvasEtchedButterfly(ctx, photoRects[2].x + 35, photoRects[2].y + 15, 36, -0.08);
    }

    if (photoRects.length >= 4) {
      if (images.roses && images.roses.complete) {
        ctx.save();
        ctx.translate(photoRects[3].x - 20, photoRects[3].y + photoRects[3].h - 130);
        ctx.drawImage(images.roses, 0, 0, 110, 150);
        ctx.restore();
      }
      if (images.lantern && images.lantern.complete) {
        ctx.save();
        ctx.translate(photoRects[3].x + photoRects[3].w - 85, photoRects[3].y + photoRects[3].h - 95);
        ctx.rotate(0.04);
        ctx.drawImage(images.lantern, 0, 0, 95, 120);
        ctx.restore();
      }
    }

    // Bottom Footer
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8c735d';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('EST. 2026 — ◆ — PRINTED ARCHIVE', width / 2, footerCenterY);

    ctx.fillStyle = '#2c1e14';
    ctx.font = 'bold 16px "Playfair Display", Georgia, serif';
    ctx.fillText('MEMORA', width / 2, footerCenterY + 24);
    ctx.restore();
  }

  ctx.restore();
}
