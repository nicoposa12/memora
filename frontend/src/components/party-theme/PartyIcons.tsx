import React from 'react';

export interface PartyIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Mirrored Disco Ball Icon (🪩)
 * Multifaceted spherical mirror ball with silver/cyan/magenta facet reflections,
 * top hanging link chain, and radiant sparkle glints.
 */
export const DiscoBallIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Disco Mirror Ball"
  >
    <defs>
      <radialGradient id="discoGlow" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#e2e8f0" stopOpacity="0.9" />
        <stop offset="65%" stopColor="#f472b6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
      </radialGradient>
      <linearGradient id="facetHighlight" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Hanging Wire Chain */}
    <line x1="14" y1="1" x2="14" y2="4.5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="1 0.8" />
    <circle cx="14" cy="4.5" r="1" fill="#cbd5e1" />

    {/* Main Sphere Body */}
    <circle cx="14" cy="15" r="10" fill="url(#discoGlow)" stroke="#ec4899" strokeWidth="1" />

    {/* Mirror Facet Grid Lines (Latitude) */}
    <ellipse cx="14" cy="11.5" rx="9" ry="2.2" stroke="#94a3b8" strokeWidth="0.6" fill="none" opacity="0.75" />
    <ellipse cx="14" cy="15" rx="10" ry="2.8" stroke="#cbd5e1" strokeWidth="0.7" fill="none" opacity="0.85" />
    <ellipse cx="14" cy="18.5" rx="9" ry="2.2" stroke="#94a3b8" strokeWidth="0.6" fill="none" opacity="0.75" />

    {/* Mirror Facet Grid Lines (Longitude) */}
    <ellipse cx="14" cy="15" rx="3.5" ry="10" stroke="#cbd5e1" strokeWidth="0.6" fill="none" opacity="0.8" />
    <ellipse cx="14" cy="15" rx="7" ry="10" stroke="#94a3b8" strokeWidth="0.6" fill="none" opacity="0.7" />
    <line x1="14" y1="5" x2="14" y2="25" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />

    {/* Facet Sheen Blocks */}
    <rect x="11.5" y="9" width="2" height="2" fill="#ffffff" opacity="0.9" rx="0.3" />
    <rect x="15" y="10.5" width="2.2" height="1.8" fill="#67e8f9" opacity="0.85" rx="0.3" />
    <rect x="9" y="13.5" width="2" height="2" fill="#f472b6" opacity="0.85" rx="0.3" />
    <rect x="13.5" y="14" width="2.5" height="2" fill="#ffffff" opacity="0.95" rx="0.3" />
    <rect x="17.5" y="14.5" width="2" height="2" fill="#67e8f9" opacity="0.8" rx="0.3" />
    <rect x="12" y="17.5" width="2" height="2" fill="#f472b6" opacity="0.85" rx="0.3" />

    {/* Starburst Glints */}
    <path d="M7 8 L7.8 10.5 L10 11 L7.8 11.5 L7 14 L6.2 11.5 L4 11 L6.2 10.5 Z" fill="#ffffff" />
    <circle cx="7" cy="11" r="0.8" fill="#fdf4ff" />

    <path d="M22 17 L22.5 19 L24.5 19.5 L22.5 20 L22 22 L21.5 20 L19.5 19.5 L21.5 19 Z" fill="#67e8f9" opacity="0.9" />
  </svg>
);

/**
 * 2. Party Popper & Confetti Blast Icon (🎉)
 * Angled celebratory popper cone with exploding colorful streamers,
 * geometric confetti, and burst rays.
 */
export const PartyPopperIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Party Popper"
  >
    {/* Popper Cone Body */}
    <path d="M5 23 L13 15 L7 9 Z" fill="#ec4899" stroke="#be185d" strokeWidth="1" strokeLinejoin="round" />
    {/* Striped patterns on cone */}
    <path d="M6 19 L10 15" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M7 14 L11.5 13" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
    {/* Rim of the cone */}
    <path d="M7 9 C9 11, 11 13, 13 15" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />

    {/* Exploding Streamers */}
    <path d="M14 13 C17 10, 16 7, 21 6" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M12 11 C13 7, 18 8, 20 3" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M15 15 C19 16, 20 12, 25 12" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M13 16 C15 19, 19 18, 22 21" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Flying Confetti Bits */}
    <rect x="17" y="9" width="1.8" height="1.8" fill="#facc15" transform="rotate(25 17 9)" rx="0.3" />
    <circle cx="23" cy="8" r="1" fill="#ec4899" />
    <rect x="22" y="16" width="2" height="1.6" fill="#38bdf8" transform="rotate(-30 22 16)" rx="0.3" />
    <circle cx="16" cy="18" r="0.9" fill="#facc15" />
    <polygon points="17,3 18.2,5 20.5,5 18.8,6.5 19.5,8.8 17,7.2 14.5,8.8 15.2,6.5 13.5,5 15.8,5" fill="#ffffff" transform="scale(0.5) translate(14, 2)" />
  </svg>
);

/**
 * 3. Glossy Balloons Bouquet Icon (🎈)
 * Duo of metallic celebration balloons (neon pink & electric violet)
 * with specular crescent highlights and curling ribbon strings.
 */
export const GlossyBalloonsIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Party Balloons"
  >
    <defs>
      <radialGradient id="balloonPink" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="30%" stopColor="#f472b6" />
        <stop offset="75%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </radialGradient>
      <radialGradient id="balloonPurple" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="35%" stopColor="#c084fc" />
        <stop offset="80%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#5b21b6" />
      </radialGradient>
    </defs>

    {/* Balloon 2 (Back, Violet) */}
    <g>
      <ellipse cx="17.5" cy="10" rx="6.5" ry="7.5" fill="url(#balloonPurple)" stroke="#7c3aed" strokeWidth="0.8" />
      {/* Specular Highlight Arc */}
      <path d="M14.5 5.5 C16 4.5, 19 4.8, 20.5 6" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
      {/* Balloon Knot */}
      <polygon points="17.5,17.5 16,19 19,19" fill="#6d28d9" />
      {/* Ribbon String */}
      <path d="M17.5 19 C18.5 22, 16 24, 17 27" stroke="#c084fc" strokeWidth="0.8" fill="none" opacity="0.8" />
    </g>

    {/* Balloon 1 (Front, Magenta Pink) */}
    <g>
      <ellipse cx="10.5" cy="11.5" rx="6.8" ry="8" fill="url(#balloonPink)" stroke="#db2777" strokeWidth="0.8" />
      {/* Specular Highlight Arc */}
      <path d="M7 6.8 C9 5.5, 12 5.8, 14 7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.95" />
      <circle cx="13.5" cy="14.5" r="0.8" fill="#ffffff" opacity="0.6" />
      {/* Balloon Knot */}
      <polygon points="10.5,19.5 9,21 12,21" fill="#be185d" />
      {/* Curled Ribbon String */}
      <path d="M10.5 21 C9 23, 12 24.5, 10 27" stroke="#f472b6" strokeWidth="0.9" fill="none" />
    </g>
  </svg>
);

/**
 * 4. DJ Studio Headphones Icon (🎧)
 * Cushioned earcups with neon pink outer ring, metal headband,
 * and illuminated sound beat pulse.
 */
export const DJHeadphonesIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="DJ Headphones"
  >
    {/* Headband Arc */}
    <path
      d="M5.5 16 C5.5 9.5, 9.3 4.5, 14 4.5 C18.7 4.5, 22.5 9.5, 22.5 16"
      stroke="#ec4899"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M7 14 C7.5 9.5, 10.5 6.5, 14 6.5 C17.5 6.5, 20.5 9.5, 21 14"
      stroke="#38bdf8"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Left Earcup */}
    <rect x="3" y="14" width="5" height="9" rx="2.5" fill="#1e293b" stroke="#ec4899" strokeWidth="1.2" />
    <rect x="5.5" y="15.5" width="2" height="6" rx="1" fill="#f472b6" opacity="0.9" />

    {/* Right Earcup */}
    <rect x="20" y="14" width="5" height="9" rx="2.5" fill="#1e293b" stroke="#ec4899" strokeWidth="1.2" />
    <rect x="20.5" y="15.5" width="2" height="6" rx="1" fill="#f472b6" opacity="0.9" />

    {/* Soundwave Pulse in Center */}
    <line x1="11" y1="18.5" x2="11" y2="19.5" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
    <line x1="12.5" y1="17" x2="12.5" y2="21" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
    <line x1="14" y1="15.5" x2="14" y2="22.5" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="15.5" y1="17" x2="15.5" y2="21" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
    <line x1="17" y1="18.5" x2="17" y2="19.5" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 5. Camera & Radiant Flash Burst Icon (📸)
 * Retro flash camera with radiant flash starburst rays.
 */
export const CameraFlashIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Camera Flash"
  >
    {/* Camera Body */}
    <rect x="4" y="10" width="20" height="14" rx="3" fill="#18181b" stroke="#ec4899" strokeWidth="1.2" />
    <path d="M9 10 L10.5 7.5 H17.5 L19 10" fill="#18181b" stroke="#ec4899" strokeWidth="1.2" />

    {/* Lens with Neon Reflection */}
    <circle cx="14" cy="17" r="4.5" fill="#090a0f" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="14" cy="17" r="2.2" fill="#ec4899" opacity="0.8" />
    <circle cx="15.2" cy="15.8" r="0.8" fill="#ffffff" />

    {/* Flash Strobe Unit (Top Left) */}
    <rect x="6.5" y="11.5" width="3" height="2" rx="0.5" fill="#facc15" />

    {/* Radiant Flash Starburst Rays (Top Right Burst) */}
    <path d="M21 4 L22 6.5 L24.5 7 L22 7.5 L21 10 L20 7.5 L17.5 7 L20 6.5 Z" fill="#ffffff" />
    <circle cx="21" cy="7" r="1.2" fill="#fde047" />
    <line x1="24" y1="4" x2="26" y2="2" stroke="#facc15" strokeWidth="1" strokeLinecap="round" />
    <line x1="18" y1="4" x2="16" y2="2" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 6. Vinyl Record / CD Icon (💿)
 * Matte black vinyl with groove rings, glossy reflection arcs,
 * and hot pink center label.
 */
export const VinylRecordIcon: React.FC<PartyIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Vinyl Record"
  >
    {/* Outer Vinyl Edge */}
    <circle cx="14" cy="14" r="12" fill="#090a0f" stroke="#ec4899" strokeWidth="1" />

    {/* Sound Grooves */}
    <circle cx="14" cy="14" r="10" stroke="#27272a" strokeWidth="0.7" fill="none" />
    <circle cx="14" cy="14" r="8" stroke="#3f3f46" strokeWidth="0.7" fill="none" opacity="0.6" />
    <circle cx="14" cy="14" r="6" stroke="#27272a" strokeWidth="0.7" fill="none" />

    {/* Specular Light Reflection Cones */}
    <path d="M14 14 L8 3.6 A12 12 0 0 1 14 2 Z" fill="#ffffff" opacity="0.15" />
    <path d="M14 14 L20 24.4 A12 12 0 0 1 14 26 Z" fill="#ffffff" opacity="0.15" />
    <path d="M14 14 L24.4 8 A12 12 0 0 1 26 14 Z" fill="#38bdf8" opacity="0.15" />

    {/* Neon Center Label */}
    <circle cx="14" cy="14" r="4.2" fill="#ec4899" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="14" cy="14" r="1.4" fill="#090a0f" stroke="#facc15" strokeWidth="0.6" />
  </svg>
);

/**
 * 7. Electric Neon Lightning Bolt Icon (⚡)
 * Sharp high-voltage lightning bolt with gradient yellow-magenta glow.
 */
export const NeonLightningIcon: React.FC<PartyIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Neon Lightning"
  >
    <defs>
      <linearGradient id="boltGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="85%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    {/* Lightning Bolt */}
    <polygon
      points="13,2 6,13 12,13 10,22 18,10 12,10"
      fill="url(#boltGrad)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 8. Neon Flame Icon (🔥)
 * 3-tongue electric party flame with warm yellow/orange core and magenta rim.
 */
export const NeonFlameIcon: React.FC<PartyIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Party Flame"
  >
    <defs>
      <linearGradient id="flameOuter" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#facc15" />
      </linearGradient>
    </defs>
    {/* Outer Flame */}
    <path
      d="M12 2 C12 6, 8 8, 8 13 C8 17.4 10.5 21 14 21 C17.5 21 20 17.5 20 13.5 C20 9, 16 7, 16 4 C15 7, 13 8, 12 2 Z"
      fill="url(#flameOuter)"
      stroke="#f43f5e"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Inner Yellow Core */}
    <path
      d="M12 11 C11 13, 10 14.5, 10 16.5 C10 18.8 11.5 20 13.5 20 C15.5 20 17 18.5 17 16 C17 14, 15 13, 14 11 C13 13, 12.5 13, 12 11 Z"
      fill="#fef08a"
    />
  </svg>
);

/**
 * 9. Beamed Music Notes Icon (🎵 / 🎶)
 * Dynamic beamed eighth notes with neon pink body and cyan accent glows.
 */
export const MusicNotesIcon: React.FC<PartyIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Music Notes"
  >
    {/* Note 1 */}
    <ellipse cx="6" cy="18" rx="3" ry="2.2" fill="#ec4899" transform="rotate(-15 6 18)" />
    <line x1="8.5" y1="17" x2="8.5" y2="7" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" />

    {/* Note 2 */}
    <ellipse cx="17" cy="14" rx="3" ry="2.2" fill="#ec4899" transform="rotate(-15 17 14)" />
    <line x1="19.5" y1="13" x2="19.5" y2="4" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" />

    {/* Connecting Beam */}
    <polygon points="8,7 20,3 20,6 8,10" fill="#38bdf8" />

    {/* Sound ripple glints */}
    <circle cx="21" cy="2.5" r="0.8" fill="#facc15" />
    <circle cx="4" cy="14" r="0.6" fill="#38bdf8" />
  </svg>
);

/**
 * 10. Dynamic Dancing Silhouette Icon (💃 / 🕺)
 * Stylized energetic nightclub dancer in silhouette with celebratory rhythm lines.
 */
export const DancingSilhouetteIcon: React.FC<PartyIconProps & { variant?: 'dancer1' | 'dancer2' }> = ({
  className = '',
  size = 20,
  variant = 'dancer1',
  style,
}) => {
  if (variant === 'dancer2') {
    // Male groove dancer pose with arms up in celebration
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
        style={style}
        aria-label="Dancing Groove Silhouette"
      >
        {/* Head */}
        <circle cx="12" cy="4" r="2.4" fill="#38bdf8" />
        {/* Raised Arms celebrating */}
        <path d="M5 8 C7 5, 9 6, 12 7 C15 6, 17 5, 19 8" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Body Torso */}
        <path d="M12 7 L12 16" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
        {/* Hips & Legs in dance step */}
        <path d="M12 16 L8 24 M12 16 L16 23 L18 25" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Rhythm glow pulses */}
        <circle cx="4" cy="6" r="0.9" fill="#facc15" />
        <circle cx="20" cy="6" r="0.9" fill="#ec4899" />
      </svg>
    );
  }

  // Female dancer silhouette with flowing party dress and arms raised
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
      style={style}
      aria-label="Dancing Silhouette"
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.2" fill="#ec4899" />
      {/* Expressive Raised Arms */}
      <path d="M6 7 C8 4, 11 5, 12 6.5 C13 5, 16 4, 18 6.5" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Bodice */}
      <path d="M11 6.5 L13 6.5 L13 12 L11 12 Z" fill="#ec4899" />
      {/* Flared Flowing Party Dress */}
      <path d="M11 12 L7 21 C10 22.5, 14 22.5, 17 21 L13 12 Z" fill="#f43f5e" stroke="#ec4899" strokeWidth="0.8" />
      {/* Dancing Legs */}
      <path d="M10.5 21 L9.5 26 M13.5 21 L14.5 26" stroke="#f472b6" strokeWidth="1.4" strokeLinecap="round" />
      {/* Star sparkle accent */}
      <circle cx="5" cy="5" r="0.8" fill="#facc15" />
    </svg>
  );
};

/**
 * 11. Party Stars & Sparkles Icon (✨ / ⭐)
 * 4-point sparkle star, 5-point star, and micro radiant glints.
 */
export const PartySparklesIcon: React.FC<PartyIconProps & { variant?: 'star' | 'glitter' | 'cross' }> = ({
  className = '',
  size = 14,
  variant = 'glitter',
  style,
}) => {
  if (variant === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`select-none ${className}`} style={style}>
        <polygon points="8,1 10,6 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6,6" fill="#facc15" stroke="#f59e0b" strokeWidth="0.6" />
      </svg>
    );
  }
  if (variant === 'cross') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`select-none ${className}`} style={style}>
        <path d="M8 1 L9.2 6.5 L15 8 L9.2 9.5 L8 15 L6.8 9.5 L1 8 L6.8 6.5 Z" fill="#ec4899" />
        <circle cx="8" cy="8" r="1" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={`select-none ${className}`} style={style}>
      <path d="M8 1 L9.2 6.5 L15 8 L9.2 9.5 L8 15 L6.8 9.5 L1 8 L6.8 6.5 Z" fill="#38bdf8" />
      <circle cx="8" cy="8" r="0.9" fill="#ffffff" />
      <circle cx="14" cy="3" r="1" fill="#facc15" />
      <circle cx="3" cy="14" r="0.8" fill="#ec4899" />
    </svg>
  );
};

/**
 * 12. Party Photo Margin Embellishments Component
 * Places the curated party elements (disco ball, headphones, camera flash,
 * vinyl CD, dancing silhouettes, lightning, flame, balloons, stars)
 * directly flanking each photo slot along the left and right margins!
 */
export const PartyPhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
  totalPhotos = 4,
}) => {
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Left: Disco Ball hanging + Sparkles */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <DiscoBallIcon size={20} />
          </div>
          <div className="absolute -left-2 top-6 z-20 pointer-events-none">
            <PartySparklesIcon variant="star" size={11} />
          </div>
          {/* Bottom Left Photo 1: Neon Lightning Bolt */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <NeonLightningIcon size={17} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Left: DJ Headphones + Floating Music Notes */}
          <div className="absolute -left-3.5 top-0 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <DJHeadphonesIcon size={20} />
          </div>
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform rotate-[8deg]">
            <MusicNotesIcon size={17} />
          </div>
          {/* Bottom Left Photo 2: Neon Sparkles */}
          <div className="absolute -left-2 -bottom-1.5 z-20 pointer-events-none">
            <PartySparklesIcon variant="cross" size={11} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Left: Spinning Vinyl Record + Neon Flame */}
          <div className="absolute -left-3.5 -top-1 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-md">
            <VinylRecordIcon size={19} />
          </div>
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <PartySparklesIcon variant="star" size={10} />
          </div>
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <NeonFlameIcon size={17} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Left: Party Popper exploding confetti + Lightning */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <PartyPopperIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <PartySparklesIcon variant="cross" size={10} />
          </div>
          <div className="absolute -left-3 -bottom-1.5 z-20 pointer-events-none transform rotate-[14deg] drop-shadow-xs">
            <NeonLightningIcon size={18} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Right: Camera Flash + Micro Sparkles */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <CameraFlashIcon size={19} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <PartySparklesIcon variant="star" size={10} />
          </div>
          {/* Bottom Right Photo 1: Beamed Music Note */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg]">
            <MusicNotesIcon size={17} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Right: Dancing Silhouette + Sparkles */}
          <div className="absolute -right-3.5 top-0 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <DancingSilhouetteIcon variant="dancer1" size={20} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <PartySparklesIcon variant="cross" size={10} />
          </div>
          {/* Bottom Right Photo 2: Neon Flame */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <NeonFlameIcon size={17} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Right: Dancing Silhouette 2 + Music Notes */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <DancingSilhouetteIcon variant="dancer2" size={20} />
          </div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform rotate-[8deg]">
            <MusicNotesIcon size={16} />
          </div>
          {/* Bottom Right Photo 3: Gold Star */}
          <div className="absolute -right-2 -bottom-1.5 z-20 pointer-events-none">
            <PartySparklesIcon variant="star" size={12} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Right: Glossy Balloons + Flame + Disco Ball */}
          <div className="absolute -right-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <GlossyBalloonsIcon size={20} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <PartySparklesIcon variant="star" size={10} />
          </div>
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <DiscoBallIcon size={18} />
          </div>
        </>
      )}
    </>
  );
};

/**
 * 13. Party Soundwave & Disco Beat Equalizer Footer Divider (⚡ ılıılı ⚡)
 * Replaces the plain text line in the footer with a sleek glowing soundwave equalizer.
 */
export const PartyEqualizerFooterIcon: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 110,
  height = 16,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-105 duration-200 ${className}`}
    aria-label="Party Soundwave Equalizer"
  >
    <defs>
      <linearGradient id="eqGrad" x1="10" y1="9" x2="110" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="25%" stopColor="#f43f5e" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="75%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>

    {/* Flanking Sparkle Left */}
    <path d="M6 9 L7.2 6.5 L10 6 L7.5 5.5 L7 3 L6.5 5.5 L4 6 L6.8 6.5 Z" fill="#ec4899" />
    <circle cx="12" cy="9" r="1" fill="#facc15" />

    {/* Equalizer Frequency Bars */}
    <line x1="18" y1="7" x2="18" y2="11" stroke="#ec4899" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="22" y1="5" x2="22" y2="13" stroke="#ec4899" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="26" y1="3" x2="26" y2="15" stroke="#f43f5e" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="30" y1="6" x2="30" y2="12" stroke="#f43f5e" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="34" y1="2" x2="34" y2="16" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="38" y1="7" x2="38" y2="11" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="42" y1="4" x2="42" y2="14" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />

    {/* Center Disco Sparkle Peak */}
    <line x1="46" y1="1" x2="46" y2="17" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="50" y1="4" x2="50" y2="14" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="54" y1="2" x2="54" y2="16" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="58" y1="6" x2="58" y2="12" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="62" y1="1" x2="62" y2="17" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="66" y1="5" x2="66" y2="13" stroke="#f43f5e" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="70" y1="2" x2="70" y2="16" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="74" y1="7" x2="74" y2="11" stroke="#facc15" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="78" y1="4" x2="78" y2="14" stroke="#ec4899" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="82" y1="1" x2="82" y2="17" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="86" y1="6" x2="86" y2="12" stroke="#ec4899" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="90" y1="3" x2="90" y2="15" stroke="#ec4899" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="94" y1="5" x2="94" y2="13" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="98" y1="7" x2="98" y2="11" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="102" y1="8" x2="102" y2="10" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />

    {/* Flanking Sparkle Right */}
    <circle cx="108" cy="9" r="1" fill="#facc15" />
    <path d="M114 9 L115.2 6.5 L118 6 L115.5 5.5 L115 3 L114.5 5.5 L112 6 L114.8 6.5 Z" fill="#38bdf8" />
  </svg>
);
