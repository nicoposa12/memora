import React from 'react';

export interface WeddingIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Interlocking Wedding Rings Icon (💍)
 * Dual interlocking gold bands with brilliant-cut diamond solitaire,
 * delicate prong mount, and sparkling facet reflections.
 */
export const WeddingRingsIcon: React.FC<WeddingIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Wedding Rings"
  >
    <defs>
      <linearGradient id="goldBandGrad1" x1="4" y1="8" x2="20" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#b8860b" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="goldBandGrad2" x1="10" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="40%" stopColor="#e5c05b" />
        <stop offset="80%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="diamondShine" x1="16" y1="1" x2="22" y2="7" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#e0f2fe" />
        <stop offset="80%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>

    {/* Primary Band (Left, angled) */}
    <ellipse
      cx="11.5"
      cy="16.5"
      rx="7.5"
      ry="7"
      stroke="url(#goldBandGrad1)"
      strokeWidth="2.4"
      fill="none"
      transform="rotate(-15 11.5 16.5)"
    />

    {/* Secondary Band (Right, interlocking) */}
    <ellipse
      cx="17"
      cy="14"
      rx="7"
      ry="6.5"
      stroke="url(#goldBandGrad2)"
      strokeWidth="2.2"
      fill="none"
      transform="rotate(15 17 14)"
    />

    {/* Diamond Solitaire Setting & Prongs */}
    <path d="M17.5 4.5 L19.5 2.5 L21.5 4.5 L20 6.5 Z" fill="url(#diamondShine)" stroke="#ffffff" strokeWidth="0.6" />
    <circle cx="19.5" cy="4.5" r="1.8" fill="#ffffff" opacity="0.9" />

    {/* Diamond Prismatic Glint Rays */}
    <path d="M19.5 0.5 V2.2 M19.5 6.8 V8.5 M15.5 4.5 H17.2 M21.8 4.5 H23.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M16.7 1.7 L17.9 2.9 M21.1 6.1 L22.3 7.3 M22.3 1.7 L21.1 2.9 M17.9 6.1 L16.7 7.3" stroke="#fef08a" strokeWidth="0.7" strokeLinecap="round" />
  </svg>
);

/**
 * 2. Bridal Bouquet & Flowers Icon (💐)
 * Hand-tied arrangement of pastel blush English roses, ivory peonies,
 * and sage leaves secured with flowing satin ribbon.
 */
export const WeddingBouquetIcon: React.FC<WeddingIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Bridal Floral Bouquet"
  >
    <defs>
      <linearGradient id="rosePinkGrad" x1="6" y1="4" x2="20" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff1f2" />
        <stop offset="45%" stopColor="#fecdd3" />
        <stop offset="85%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
      <linearGradient id="goldRibbon" x1="12" y1="18" x2="16" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* Sage Green Foliage Behind */}
    <path d="M8 8 C5 6, 6 2, 10 4 C11 6, 9 8, 8 8 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.6" opacity="0.9" />
    <path d="M19 7 C23 5, 23 2, 19 3 C17 5, 18 7, 19 7 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.6" opacity="0.9" />
    <path d="M14 3 C15 0.5, 17 1, 15 4 Z" fill="#65a30d" stroke="#365314" strokeWidth="0.5" />

    {/* Center Rose Bloom */}
    <circle cx="14" cy="9.5" r="4.8" fill="url(#rosePinkGrad)" stroke="#be123c" strokeWidth="0.8" />
    <path d="M12.5 8 C13.5 6.5, 15.5 7, 15.5 8.5 C15.5 10, 13.5 11, 12 9.5" stroke="#ffffff" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <path d="M14 6 C16 6, 17.5 8, 16.5 10.5" stroke="#fff1f2" strokeWidth="0.8" fill="none" strokeLinecap="round" />

    {/* Left Peony Bloom */}
    <circle cx="8.5" cy="12" r="3.8" fill="#fdf2f8" stroke="#f472b6" strokeWidth="0.7" />
    <path d="M7 11 C8 9.5, 10 10.5, 9.5 12.5 C9 13.5, 7.5 13, 7 11 Z" fill="#fbcfe8" />

    {/* Right White Peony Bloom */}
    <circle cx="19.5" cy="11.5" r="3.8" fill="#fffbeb" stroke="#d4af37" strokeWidth="0.7" />
    <path d="M18.5 10.5 C19.5 9, 21.5 10, 20.5 12 C19.8 13, 18 12.5, 18.5 10.5 Z" fill="#fef3c7" />

    {/* Stems Gathered */}
    <line x1="12" y1="15" x2="13.5" y2="22" stroke="#4d7c0f" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14" y1="15" x2="14" y2="23" stroke="#3f6212" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="15" x2="14.5" y2="22" stroke="#4d7c0f" strokeWidth="1.4" strokeLinecap="round" />

    {/* Flowing Satin Ribbon Tie & Bow */}
    <ellipse cx="14" cy="17" rx="2.5" ry="1.4" fill="url(#goldRibbon)" stroke="#78350f" strokeWidth="0.6" />
    <path d="M12.5 17.5 C10 20, 8.5 24, 9 26" stroke="url(#goldRibbon)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M15.5 17.5 C18 20, 19.5 24, 19 26" stroke="url(#goldRibbon)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * 3. Soaring Wedding Dove of Peace & Devotion (🕊️)
 * Graceful ivory white dove in flight holding an olive sprig.
 */
export const WeddingDoveIcon: React.FC<WeddingIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Wedding Dove"
  >
    <defs>
      <linearGradient id="doveShading" x1="6" y1="4" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#fafaf9" />
        <stop offset="85%" stopColor="#e7e5e4" />
        <stop offset="100%" stopColor="#d6d3d1" />
      </linearGradient>
    </defs>

    {/* Olive Sprig in Beak */}
    <path d="M5.5 15.5 C4 14, 2.5 15, 3.5 16.5 C4.5 17.5, 6 16.5, 5.5 15.5 Z" fill="#65a30d" stroke="#3f6212" strokeWidth="0.5" />
    <path d="M6 16.5 C5 18, 6.5 19, 7.5 18 C8.2 17, 7 16, 6 16.5 Z" fill="#84cc16" stroke="#3f6212" strokeWidth="0.5" />
    <path d="M5 16 L8 17" stroke="#4d7c0f" strokeWidth="0.9" strokeLinecap="round" />

    {/* Dove Body & Tail */}
    <path
      d="M7.5 16 C9 14, 11 14.5, 13 16 C16 18, 19 19, 24 16 C22 19, 19.5 22, 16 21 C12 20, 10 18, 7.5 16 Z"
      fill="url(#doveShading)"
      stroke="#b8860b"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Soaring Upward Wing */}
    <path
      d="M12 15 C13 10, 15 4, 21 3 C20 7, 18 10, 18 13 C18 14.5, 16 15.5, 14 15 Z"
      fill="url(#doveShading)"
      stroke="#b8860b"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    {/* Wing Feather Grooves */}
    <path d="M16 6 C15.5 9, 15.5 12, 14.5 14" stroke="#d6d3d1" strokeWidth="0.7" strokeLinecap="round" />
    <path d="M18.5 5 C17.8 8, 17.5 11, 16.5 13" stroke="#d6d3d1" strokeWidth="0.7" strokeLinecap="round" />

    {/* Dove Head & Golden Beak */}
    <circle cx="8" cy="14.8" r="2.2" fill="#ffffff" stroke="#b8860b" strokeWidth="0.7" />
    <polygon points="5.5,15.2 7.2,14.3 7.2,16.1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.4" />
    <circle cx="8.2" cy="14.4" r="0.45" fill="#44403c" />
  </svg>
);

/**
 * 4. Champagne Toast Flutes Icon (🥂)
 * Dual crystal flutes clinking together with golden sparkling champagne,
 * rising carbonation bubbles, and starburst clink rays.
 */
export const ChampagneToastIcon: React.FC<WeddingIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Champagne Toast"
  >
    <defs>
      <linearGradient id="champagneGold" x1="0" y1="6" x2="0" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>

    {/* Left Flute (Tilted right) */}
    <g transform="rotate(18 10 14)">
      {/* Bowl */}
      <path d="M8 4 H13 V11 C13 14, 8 14, 8 11 Z" fill="url(#champagneGold)" opacity="0.85" />
      <path d="M8 3.5 H13 V11 C13 14, 8 14, 8 11 Z" stroke="#d4af37" strokeWidth="1" fill="none" />
      {/* Stem */}
      <line x1="10.5" y1="14" x2="10.5" y2="22" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
      {/* Base */}
      <ellipse cx="10.5" cy="22.5" rx="3.5" ry="1.2" fill="#fffbeb" stroke="#d4af37" strokeWidth="1" />
      {/* Liquid Bubbles */}
      <circle cx="9.8" cy="8" r="0.6" fill="#ffffff" />
      <circle cx="11.2" cy="6" r="0.5" fill="#ffffff" />
      <circle cx="10" cy="10" r="0.7" fill="#ffffff" />
    </g>

    {/* Right Flute (Tilted left) */}
    <g transform="rotate(-18 18 14)">
      {/* Bowl */}
      <path d="M15 4 H20 V11 C20 14, 15 14, 15 11 Z" fill="url(#champagneGold)" opacity="0.85" />
      <path d="M15 3.5 H20 V11 C20 14, 15 14, 15 11 Z" stroke="#d4af37" strokeWidth="1" fill="none" />
      {/* Stem */}
      <line x1="17.5" y1="14" x2="17.5" y2="22" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
      {/* Base */}
      <ellipse cx="17.5" cy="22.5" rx="3.5" ry="1.2" fill="#fffbeb" stroke="#d4af37" strokeWidth="1" />
      {/* Liquid Bubbles */}
      <circle cx="16.8" cy="7.5" r="0.6" fill="#ffffff" />
      <circle cx="18.5" cy="9.5" r="0.5" fill="#ffffff" />
      <circle cx="17.2" cy="11" r="0.6" fill="#ffffff" />
    </g>

    {/* Clink Sparkle Glint */}
    <path d="M14 2 L14.7 4.2 L17 5 L14.7 5.8 L14 8 L13.3 5.8 L11 5 L13.3 4.2 Z" fill="#ffffff" stroke="#facc15" strokeWidth="0.5" />
    <circle cx="14" cy="5" r="0.9" fill="#fef08a" />
  </svg>
);

/**
 * 5. Romantic Wedding Candle Icon (🕯️)
 * Ivory pillar candle with warm golden flickering flame, wax drip, and gentle glow.
 */
export const WeddingCandleIcon: React.FC<WeddingIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Wedding Candle"
  >
    <defs>
      <linearGradient id="candleBody" x1="10" y1="10" x2="18" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#fafaf9" />
        <stop offset="100%" stopColor="#f5f5f4" />
      </linearGradient>
      <radialGradient id="candleFlame" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#dc2626" />
      </radialGradient>
      <radialGradient id="candleHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient Glow Halo */}
    <circle cx="14" cy="7" r="7" fill="url(#candleHalo)" />

    {/* Candle Stand (Gold Plate) */}
    <ellipse cx="14" cy="23.5" rx="7.5" ry="2" fill="#d4af37" stroke="#92400e" strokeWidth="0.8" />
    <ellipse cx="14" cy="22.8" rx="6" ry="1.5" fill="#fef08a" opacity="0.6" />

    {/* Candle Pillar Body */}
    <path
      d="M10.5 12 C10.5 11.2, 17.5 11.2, 17.5 12 V22.5 C17.5 23.3, 10.5 23.3, 10.5 22.5 Z"
      fill="url(#candleBody)"
      stroke="#d4af37"
      strokeWidth="0.9"
    />
    <ellipse cx="14" cy="12" rx="3.5" ry="1" fill="#fffbeb" stroke="#d4af37" strokeWidth="0.7" />

    {/* Candle Wick */}
    <line x1="14" y1="12" x2="14" y2="9" stroke="#44403c" strokeWidth="1" strokeLinecap="round" />

    {/* Flickering Teardrop Flame */}
    <path
      d="M14 3 C12 6, 12 8, 14 9 C16 8, 16 6, 14 3 Z"
      fill="url(#candleFlame)"
      stroke="#ea580c"
      strokeWidth="0.5"
    />
    <circle cx="14" cy="7.5" r="0.8" fill="#ffffff" />
  </svg>
);

/**
 * 6. Botanical Olive Sprig & Leaves Icon (🌿)
 * Delicately curved botanical foliage branch with soft sage leaves and gold accents.
 */
export const BotanicalLeavesIcon: React.FC<WeddingIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Botanical Olive Leaves"
  >
    {/* Stem Arch */}
    <path d="M4 21 C8 17, 13 11, 19 4" stroke="#65a30d" strokeWidth="1.3" strokeLinecap="round" />

    {/* Pair 1 (Bottom) */}
    <path d="M7 17 C5 15, 6 12, 9 14 C9.5 15.5, 8.5 17, 7 17 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.6" />
    <path d="M9 16 C11 18, 14 17, 13 14 C11.5 13.5, 10 14.5, 9 16 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.6" />

    {/* Pair 2 (Middle) */}
    <path d="M11 13 C9 11, 10 8, 13 10 C13.5 11.5, 12.5 13, 11 13 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.6" />
    <path d="M13 12 C15 14, 18 13, 17 10 C15.5 9.5, 14 10.5, 13 12 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.6" />

    {/* Pair 3 (Upper) */}
    <path d="M15 9 C13 7, 14 4, 17 6 C17.5 7.5, 16.5 9, 15 9 Z" fill="#bef264" stroke="#4d7c0f" strokeWidth="0.6" />
    <path d="M17 8 C19 10, 22 9, 21 6 C19.5 5.5, 18 6.5, 17 8 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.6" />

    {/* Tip Leaf */}
    <path d="M19 4 C17 2, 19 0.5, 21 2 C21.5 3, 20.5 4, 19 4 Z" fill="#d9f99d" stroke="#4d7c0f" strokeWidth="0.6" />
  </svg>
);

/**
 * 7. Soft Pearl Wedding Heart Icon (🤍)
 * Sculpted dimensional heart with soft pearl/champagne gradient and gold border.
 */
export const WeddingHeartIcon: React.FC<WeddingIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Pearl Wedding Heart"
  >
    <defs>
      <linearGradient id="pearlHeartGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fffbeb" />
        <stop offset="80%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
    </defs>
    <path
      d="M12 21 C12 21, 3 14, 3 8.5 C3 5.5, 5.5 3, 8.5 3 C10.5 3, 11.5 4, 12 5 C12.5 4, 13.5 3, 15.5 3 C18.5 3, 21 5.5, 21 8.5 C21 14, 12 21, 12 21 Z"
      fill="url(#pearlHeartGrad)"
      stroke="#b8860b"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Specular curved highlight */}
    <path
      d="M6 7 C6 5.5, 7.5 4.5, 9 4.5"
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * 8. Outlined Floating Small Hearts Icon (♡)
 * Duo of delicate romantic outline hearts floating together.
 */
export const FloatingHeartsIcon: React.FC<WeddingIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Floating Hearts"
  >
    {/* Large Heart */}
    <path
      d="M9 16 C9 16, 3 11, 3 7 C3 4.8, 4.8 3, 7 3 C8.5 3, 9.2 3.8, 9.5 4.5 C9.8 3.8, 10.5 3, 12 3 C14.2 3, 16 4.8, 16 7 C16 11, 9 16, 9 16 Z"
      fill="#fff7ed"
      stroke="#d4af37"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Mini Floating Heart */}
    <path
      d="M18 13 C18 13, 14.5 9.5, 14.5 7 C14.5 5.5, 15.7 4.5, 17 4.5 C17.8 4.5, 18.2 5, 18.5 5.5 C18.8 5, 19.2 4.5, 20 4.5 C21.3 4.5, 22.5 5.5, 22.5 7 C22.5 9.5, 18 13, 18 13 Z"
      fill="#fef2f2"
      stroke="#f472b6"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 9. Wedding Sparkles & Starbursts Icon (✨)
 * Elegant 4-point diamond starburst and glints in warm gold and diamond white.
 */
export const WeddingSparklesIcon: React.FC<WeddingIconProps & { variant?: 'star' | 'cross' }> = ({
  className = '',
  size = 14,
  variant = 'star',
  style,
}) => {
  if (variant === 'cross') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none transition-transform hover:scale-120 duration-200 ${className}`}
        style={style}
        aria-label="Wedding Cross Sparkle"
      >
        <line x1="8" y1="1" x2="8" y2="15" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="1" y1="8" x2="15" y2="8" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="8" r="1.5" fill="#ffffff" stroke="#b8860b" strokeWidth="0.6" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform hover:scale-120 duration-200 ${className}`}
      style={style}
      aria-label="Wedding Diamond Starburst"
    >
      <path
        d="M9 1 L10.8 6.5 L17 9 L10.8 11.5 L9 17 L7.2 11.5 L1 9 L7.2 6.5 Z"
        fill="#fef08a"
        stroke="#b8860b"
        strokeWidth="0.8"
      />
      <circle cx="9" cy="9" r="1.8" fill="#ffffff" />
    </svg>
  );
};

/**
 * 10. Wedding Photo Margin Embellishments Component
 * Places all user-specified wedding elements:
 * - Wedding rings (💍)
 * - Bouquet / flowers (💐)
 * - Heart (🤍)
 * - Dove (🕊️)
 * - Sparkles (✨)
 * - Leaves (🌿)
 * - Champagne glasses (🥂)
 * - Candle (🕯️)
 * - Small hearts (♡)
 * along the left and right margins flanking each photo slot!
 */
export const WeddingPhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
  totalPhotos = 4,
}) => {
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Left: Wedding Rings + Sparkle */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <WeddingRingsIcon size={21} />
          </div>
          <div className="absolute -left-2 top-7 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="star" size={11} />
          </div>
          {/* Bottom Left Photo 1: Botanical Olive Branch */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <BotanicalLeavesIcon size={17} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Left: Clinking Champagne Flutes + Floating Hearts */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <ChampagneToastIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <FloatingHeartsIcon size={16} />
          </div>
          {/* Bottom Left Photo 2: Golden Starburst Sparkle */}
          <div className="absolute -left-2 -bottom-1.5 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="cross" size={11} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Left: Bridal Flower Bouquet */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <WeddingBouquetIcon size={21} />
          </div>
          <div className="absolute -left-2 top-6 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="star" size={10} />
          </div>
          {/* Bottom Left Photo 3: Pearl Heart */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <WeddingHeartIcon size={17} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Left: Romantic Candle + Floating Hearts */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <WeddingCandleIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <FloatingHeartsIcon size={15} />
          </div>
          {/* Bottom Left Photo 4: Botanical Leaves */}
          <div className="absolute -left-3 -bottom-1.5 z-20 pointer-events-none transform rotate-[14deg] drop-shadow-xs">
            <BotanicalLeavesIcon size={17} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Right: Botanical Leaves + Pearl Heart */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-md">
            <BotanicalLeavesIcon size={19} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="cross" size={10} />
          </div>
          {/* Bottom Right Photo 1: Pearl Heart */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <WeddingHeartIcon size={17} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Right: Romantic Candle + Olive Leaves */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <WeddingCandleIcon size={20} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="star" size={11} />
          </div>
          {/* Bottom Right Photo 2: Champagne Flutes */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <ChampagneToastIcon size={18} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Right: Soaring Peace Dove */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <WeddingDoveIcon size={21} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <FloatingHeartsIcon size={15} />
          </div>
          {/* Bottom Right Photo 3: Gold Wedding Rings */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <WeddingRingsIcon size={18} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Right: Bridal Bouquet + Champagne Flutes */}
          <div className="absolute -right-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <WeddingBouquetIcon size={20} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <WeddingSparklesIcon variant="star" size={10} />
          </div>
          {/* Bottom Right Photo 4: Clinking Flutes */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <ChampagneToastIcon size={18} />
          </div>
        </>
      )}
    </>
  );
};

/**
 * 11. Wedding Botanical Ribbon & Crest Footer Divider (🌿 💍 🌿)
 * Elegant botanical olive wreath crest with intertwined golden wedding rings
 * and shimmering diamond glints, anchoring the photobooth strip footer.
 */
export const WeddingBotanicalFooterIcon: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 120,
  height = 18,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-105 duration-200 ${className}`}
    aria-label="Wedding Botanical Crest Divider"
  >
    <defs>
      <linearGradient id="crestGold" x1="0" y1="9" x2="120" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
        <stop offset="25%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="75%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Left Botanical Garland Branch */}
    <path d="M12 9 C22 9, 36 7, 48 9" stroke="#b8860b" strokeWidth="1" strokeLinecap="round" />
    <path d="M22 8 C20 6, 22 4, 24 6 C24.5 7.2, 23 8, 22 8 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M28 10 C27 12, 29 13, 30 11.5 C30.5 10.5, 29.5 9.8, 28 10 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M36 8 C34 6, 36 4, 38 6 C38.5 7.2, 37 8, 36 8 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M42 10 C41 12, 43 13, 44 11.5 C44.5 10.5, 43.5 9.8, 42 10 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.5" />

    {/* Left Flanking Sparkle */}
    <path d="M8 9 L9 7 L11 6.5 L9.5 6 L9 4 L8.5 6 L7 6.5 L8.5 7 Z" fill="#d4af37" />

    {/* Center Interlocking Wedding Rings Crest */}
    <ellipse cx="57" cy="9" rx="4.5" ry="4.2" stroke="#d4af37" strokeWidth="1.4" fill="none" />
    <ellipse cx="63" cy="9" rx="4.5" ry="4.2" stroke="#b8860b" strokeWidth="1.4" fill="none" />
    {/* Diamond Solitaire Glint on Center Crest */}
    <circle cx="57" cy="4.8" r="1" fill="#ffffff" stroke="#d4af37" strokeWidth="0.5" />
    <path d="M57 2.5 V3.8 M57 5.8 V7 M55 4.8 H56.2 M57.8 4.8 H59" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" />

    {/* Right Botanical Garland Branch */}
    <path d="M72 9 C84 7, 98 9, 108 9" stroke="#b8860b" strokeWidth="1" strokeLinecap="round" />
    <path d="M76 10 C75 12, 77 13, 78 11.5 C78.5 10.5, 77.5 9.8, 76 10 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M82 8 C84 6, 82 4, 80 6 C79.5 7.2, 81 8, 82 8 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M90 10 C89 12, 91 13, 92 11.5 C92.5 10.5, 91.5 9.8, 90 10 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M96 8 C98 6, 96 4, 94 6 C93.5 7.2, 95 8, 96 8 Z" fill="#a3e635" stroke="#4d7c0f" strokeWidth="0.5" />

    {/* Right Flanking Sparkle */}
    <path d="M112 9 L113 7 L115 6.5 L113.5 6 L113 4 L112.5 6 L111 6.5 L112.5 7 Z" fill="#d4af37" />
  </svg>
);
