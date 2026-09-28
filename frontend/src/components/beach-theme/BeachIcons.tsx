import React from 'react';

export interface BeachIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Spiral Nautilus & Sea Shell Icon (🌀)
 * Delicate golden-ratio spiral shell with ocean cyan gradient,
 * pearl luster fill, and fine chamber ridge details.
 */
export const SpiralShellIcon: React.FC<BeachIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Spiral Nautilus Shell"
  >
    <defs>
      <linearGradient id="spiralShellGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="45%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="spiralShellFill" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f0fdfa" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
    </defs>
    {/* Outer Shell Spiral Rim */}
    <path
      d="M12 2.5 C6.7 2.5 2.5 6.7 2.5 12 C2.5 17.3 6.7 21.5 12 21.5 C17.3 21.5 21.5 17.3 21.5 12 C21.5 8.7 19.8 5.8 17.2 4.1"
      fill="url(#spiralShellFill)"
      stroke="url(#spiralShellGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Inner Spiral Chambers */}
    <path
      d="M17.2 4.1 C15.4 2.8 13.1 2.4 11.2 3.1 C8 4.2 5.5 7.2 5.5 10.8 C5.5 14.5 8.2 17.5 11.8 17.8 C14.8 18.1 17.6 16.1 18.2 13.2 C18.7 10.8 17.3 8.4 15 7.8 C13.1 7.3 11.2 8.4 10.7 10.2 C10.3 11.6 11.2 13 12.6 13.3 C13.7 13.6 14.7 12.9 15 11.9"
      stroke="#0284c7"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Radial chamber ridges */}
    <path d="M12 2.8 V5.5" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M6.8 5.8 L8.8 7.8" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M3.2 11.5 H6.2" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M6.2 16.8 L8.2 15" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M11.8 18.5 V15.5" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <circle cx="15.2" cy="11.8" r="0.9" fill="#0369a1" />
  </svg>
);

/**
 * 2. Iridescent Pastel Bubbles Cluster Icon (🫧)
 * 3 glossy coastal bubbles featuring lilac/pink and sky-blue iridescent refraction,
 * translucent glow, white specular highlight arcs, and star glints.
 */
export const IridescentBubblesIcon: React.FC<BeachIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Iridescent Bubbles"
  >
    <defs>
      <radialGradient id="bubbleMainGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="25%" stopColor="#fdf4ff" stopOpacity="0.8" />
        <stop offset="55%" stopColor="#f472b6" stopOpacity="0.5" />
        <stop offset="80%" stopColor="#a855f7" stopOpacity="0.38" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
      </radialGradient>
      <radialGradient id="bubbleSmallGrad" cx="30%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
      </radialGradient>
      <radialGradient id="bubbleTinyGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#e879f9" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
      </radialGradient>
    </defs>

    {/* Small Bubble Bottom-Left */}
    <g>
      <circle cx="6.5" cy="18.5" r="5.2" fill="url(#bubbleSmallGrad)" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.85" />
      <path d="M4.2 15.8 A3.8 3.8 0 0 1 7.2 14.5" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.95" />
      <circle cx="8" cy="20.5" r="0.7" fill="#ffffff" opacity="0.8" />
    </g>

    {/* Medium Bubble Top-Right */}
    <g>
      <circle cx="19" cy="7" r="4.2" fill="url(#bubbleTinyGrad)" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.85" />
      <path d="M17.2 4.8 A3 3 0 0 1 20 4.2" stroke="#ffffff" strokeWidth="0.85" strokeLinecap="round" opacity="0.95" />
    </g>

    {/* Main Big Bubble Center */}
    <g>
      <circle cx="13.5" cy="13.5" r="7.8" fill="url(#bubbleMainGrad)" stroke="#38bdf8" strokeWidth="0.95" strokeOpacity="0.9" />
      {/* Specular Highlight Arc */}
      <path d="M9.2 8.8 A6.2 6.2 0 0 1 15.5 7.4" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
      {/* Lower Rim Iridescent Sheen */}
      <path d="M10.8 18.2 A6.2 6.2 0 0 0 16.8 16.8" stroke="#f472b6" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      {/* Micro Sparkle Glint */}
      <path d="M11 11.2 V12.8 M10.2 12 H11.8" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * 3. Plumeria / Frangipani Coastal Flower Icon (🌸)
 * 5 rounded ivory-white petals, warm sun-kissed golden yellow center,
 * and delicate coastal turquoise/slate contour.
 */
export const PlumeriaFlowerIcon: React.FC<BeachIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Plumeria Blossom"
  >
    <defs>
      <radialGradient id="plumeriaCenterGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#fef08a" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* 5 Overlapping Petals */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 12 12)`}>
        <path
          d="M12 12 C9.8 8.8 9.3 4.2 12 2.4 C14.7 4.2 14.2 8.8 12 12 Z"
          fill="#ffffff"
          stroke="#0f766e"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path d="M12 11 L12 5.5" stroke="#fde047" strokeWidth="0.6" strokeLinecap="round" />
      </g>
    ))}
    {/* Sun-Kissed Center Glow */}
    <circle cx="12" cy="12" r="4.8" fill="url(#plumeriaCenterGrad)" />
    <circle cx="12" cy="12" r="1.4" fill="#d97706" />
    <circle cx="12" cy="12" r="0.7" fill="#78350f" />
  </svg>
);

/**
 * 4. Fan Scallop Sea Shell Icon (🐚)
 * Fluted shell with radiating ridges, scalloped top crown,
 * coastal pearl gradient, and base tab.
 */
export const ScallopShellIcon: React.FC<BeachIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Scallop Sea Shell"
  >
    <defs>
      <linearGradient id="scallopShellGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#f0fdfa" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
    </defs>
    {/* Base Hinge Tab */}
    <path d="M8 20 L16 20 L15 22 L9 22 Z" fill="#0284c7" opacity="0.8" />
    {/* Scalloped Fan Body */}
    <path
      d="M10 20 C6 18 2.2 14 2.2 9 C2.2 5 6 2.5 12 2.5 C18 2.5 21.8 5 21.8 9 C21.8 14 18 18 14 20 Z"
      fill="url(#scallopShellGrad)"
      stroke="#0284c7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Radiating Ribs */}
    <path d="M12 20 L12 2.8" stroke="#0284c7" strokeWidth="1" strokeLinecap="round" />
    <path d="M11 20 C9.5 15 7.5 9 6 4.5" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M13 20 C14.5 15 16.5 9 18 4.5" stroke="#38bdf8" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M10 20 C8 16 4.5 12 3 8" stroke="#38bdf8" strokeWidth="0.7" strokeLinecap="round" />
    <path d="M14 20 C16 16 19.5 12 21 8" stroke="#38bdf8" strokeWidth="0.7" strokeLinecap="round" />
    {/* Crown Flute Highlights */}
    <path d="M3.2 8.5 C4.8 6.5 7.8 4 12 4 C16.2 4 19.2 6.5 20.8 8.5" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.9" />
  </svg>
);

/**
 * 5. Ocean Wave Crest Curl Icon (🌊)
 * Stylized coastal wave curl with white seafoam froth tips,
 * azure gradient body, and lower swell arc.
 */
export const OceanWaveIcon: React.FC<BeachIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Ocean Wave Crest"
  >
    <defs>
      <linearGradient id="oceanWaveGrad" x1="2" y1="19" x2="20" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="55%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </linearGradient>
    </defs>
    {/* Main Wave Curl */}
    <path
      d="M2 19 C6 19 9 17 12 13 C14 10 16 6 19 6 C21 6 22 7.5 21.5 9 C21 10.5 19.5 11 18 10.5 C17 10 16.5 9 17 8 C15.5 8.5 14 11 12.5 13.5 C10.5 17 7 19.5 2 20 Z"
      fill="url(#oceanWaveGrad)"
      stroke="#0369a1"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Foam Spray Tips */}
    <path
      d="M18.8 6 C19.5 4.5 21 4.5 21.5 5.5 C22 6.5 21 7.5 19.5 7.5"
      fill="#ffffff"
      stroke="#0284c7"
      strokeWidth="0.6"
    />
    <circle cx="16.5" cy="5.2" r="0.9" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    <circle cx="14.8" cy="7" r="0.7" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    <circle cx="22" cy="7.5" r="0.8" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    {/* White Foam Swell Accent */}
    <path
      d="M3 20.8 C7 20.8 10 19.2 13 15.8"
      stroke="#ffffff"
      strokeWidth="0.9"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

/**
 * 6. Dainty Starfish Icon (𓇼)
 * 5-point organic sea star in warm coral-amber sand,
 * delicate suction pearl dots, and fine contour.
 */
export const StarfishIcon: React.FC<BeachIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Coastal Starfish"
  >
    <defs>
      <radialGradient id="starfishGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="65%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </radialGradient>
    </defs>
    {/* 5-Armed Starfish Body */}
    <path
      d="M12 2.5 C12.8 6 14 8.5 17 8.5 C19.5 8.5 22.5 9 21.5 11.5 C20 14 17 15 17.5 18 C18 20.5 15.5 22 13.5 20.5 C12 19 12 17 10.5 20.5 C8.5 22 6 20.5 6.5 18 C7 15 4 14 2.5 11.5 C1.5 9 4.5 8.5 7 8.5 C10 8.5 11.2 6 12 2.5 Z"
      fill="url(#starfishGrad)"
      stroke="#c2410c"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Center Texture Pearl Dot */}
    <circle cx="12" cy="12" r="1.3" fill="#ffedd5" stroke="#c2410c" strokeWidth="0.5" />
    {/* Tiny suction dots along arms */}
    <circle cx="12" cy="6" r="0.6" fill="#ffffff" />
    <circle cx="12" cy="8.5" r="0.6" fill="#ffffff" />
    <circle cx="17" cy="10.5" r="0.6" fill="#ffffff" />
    <circle cx="15" cy="12.5" r="0.6" fill="#ffffff" />
    <circle cx="16" cy="16.5" r="0.6" fill="#ffffff" />
    <circle cx="8" cy="16.5" r="0.6" fill="#ffffff" />
    <circle cx="7" cy="10.5" r="0.6" fill="#ffffff" />
  </svg>
);

/**
 * 7. Sea Sparkles & Pearl Dots Icon (⋆｡°)
 * 4-point sparkle star, micro bubbles, and pearls.
 */
export const SeaSparkleIcon: React.FC<BeachIconProps & { variant?: 'star' | 'dots' | 'cluster' }> = ({
  className = '',
  size = 14,
  variant = 'cluster',
  style,
}) => {
  if (variant === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`select-none ${className}`} style={style}>
        <path d="M8 1 L9.4 6.6 L15 8 L9.4 9.4 L8 15 L6.6 9.4 L1 8 L6.6 6.6 Z" fill="#0284c7" />
        <circle cx="8" cy="8" r="1" fill="#ffffff" />
      </svg>
    );
  }
  if (variant === 'dots') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`select-none ${className}`} style={style}>
        <circle cx="4" cy="5" r="1.6" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.6" />
        <circle cx="11" cy="10" r="2.2" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.75" />
        <circle cx="10" cy="9" r="0.6" fill="#0284c7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={`select-none ${className}`} style={style}>
      {/* 4-point sparkle */}
      <path d="M9 2 L10.2 6.8 L15 8 L10.2 9.2 L9 14 L7.8 9.2 L3 8 L7.8 6.8 Z" fill="#0284c7" opacity="0.9" />
      <circle cx="9" cy="8" r="1" fill="#ffffff" />
      {/* Small pearl bubble */}
      <circle cx="15.5" cy="13.5" r="2" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.7" />
      <circle cx="14.8" cy="12.8" r="0.5" fill="#38bdf8" />
      {/* Micro star */}
      <path d="M4 14 L4.5 15.5 L6 16 L4.5 16.5 L4 18 L3.5 16.5 L2 16 L3.5 15.5 Z" fill="#f59e0b" opacity="0.85" />
    </svg>
  );
};

/**
 * BeachPhotoAccents
 * Renders the exact left & right margin beach embellishments flanking each photo slot,
 * precisely matching the user's hand-drawn green markings:
 * - Photo 1 (top): Spiral Shell + Sparkles on left; Iridescent Bubbles + Plumeria on right
 * - Photo 2: Wave swirl + Plumeria on left; Starfish + Spiral Shell on right
 * - Photo 3: Scallop Shell + Starfish on left; Coastal Cluster (Wave, Bubbles, Clam Shell) on right
 * - Photo 4: Iridescent Bubbles + Spiral Shell on left; Scallop, Plumeria & Starfish on right
 */
export const BeachPhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
  totalPhotos = 4,
}) => {
  // Normalize pIdx if fewer or more photos exist
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Top Left Photo 1: Spiral Shell + Pearl Sparkle */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-xs">
            <SpiralShellIcon size={19} />
          </div>
          <div className="absolute -left-2 top-5 z-20 pointer-events-none drop-shadow-xs">
            <SeaSparkleIcon variant="dots" size={11} />
          </div>
          {/* Bottom Left Photo 1: Iridescent Bubbles */}
          <div className="absolute -left-3.5 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <IridescentBubblesIcon size={19} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Top Left Photo 2: Star Sparkle */}
          <div className="absolute -left-2 top-0.5 z-20 pointer-events-none">
            <SeaSparkleIcon variant="star" size={11} />
          </div>
          {/* Mid Left Photo 2: Ocean Wave Swirl (matching vertical green stroke) */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <OceanWaveIcon size={19} />
          </div>
          {/* Bottom Left Photo 2: Plumeria Flower */}
          <div className="absolute -left-3.5 -bottom-2 z-20 pointer-events-none transform -rotate-[12deg] drop-shadow-xs">
            <PlumeriaFlowerIcon size={17} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Top Left Photo 3: Sparkle */}
          <div className="absolute -left-2 top-1 z-20 pointer-events-none">
            <SeaSparkleIcon variant="star" size={10} />
          </div>
          {/* Mid Left Photo 3: Scallop Shell */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <ScallopShellIcon size={18} />
          </div>
          {/* Bottom Left Photo 3: Starfish */}
          <div className="absolute -left-3.5 -bottom-2 z-20 pointer-events-none transform -rotate-[14deg] drop-shadow-xs">
            <StarfishIcon size={17} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Top Left Photo 4: Iridescent Bubbles + Pearl */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <IridescentBubblesIcon size={18} />
          </div>
          <div className="absolute -left-2 top-5 z-20 pointer-events-none">
            <SeaSparkleIcon variant="dots" size={10} />
          </div>
          {/* Mid/Bottom Left Photo 4: Spiral Shell */}
          <div className="absolute -left-3.5 -bottom-1.5 z-20 pointer-events-none transform rotate-[14deg] drop-shadow-xs">
            <SpiralShellIcon size={17} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Top Right Photo 1: Iridescent Bubbles + Star */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-xs">
            <IridescentBubblesIcon size={19} />
          </div>
          <div className="absolute -right-2 top-5 z-20 pointer-events-none">
            <SeaSparkleIcon variant="dots" size={11} />
          </div>
          {/* Bottom Right Photo 1: Plumeria Flower */}
          <div className="absolute -right-3.5 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-xs">
            <PlumeriaFlowerIcon size={18} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Top Right Photo 2: Starfish */}
          <div className="absolute -right-3.5 top-0 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <StarfishIcon size={16} />
          </div>
          {/* Mid Right Photo 2: Spiral Shell */}
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-xs">
            <SpiralShellIcon size={17} />
          </div>
          {/* Bottom Right Photo 2: Pearls */}
          <div className="absolute -right-2 -bottom-1 z-20 pointer-events-none">
            <SeaSparkleIcon variant="dots" size={11} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Right Margin Photo 3: The rich vertical green cluster from user's drawing */}
          <div className="absolute -right-3.5 top-0 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <OceanWaveIcon size={18} />
          </div>
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-xs">
            <IridescentBubblesIcon size={19} />
          </div>
          <div className="absolute -right-3.5 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <ScallopShellIcon size={17} />
          </div>
          <div className="absolute -right-1.5 bottom-5 z-20 pointer-events-none">
            <SeaSparkleIcon variant="star" size={10} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Top Right Photo 4: Scallop Shell + Bubbles */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-xs">
            <ScallopShellIcon size={17} />
          </div>
          <div className="absolute -right-2 top-5 z-20 pointer-events-none">
            <SeaSparkleIcon variant="dots" size={11} />
          </div>
          {/* Mid Right Photo 4: Plumeria Flower */}
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <PlumeriaFlowerIcon size={17} />
          </div>
          {/* Bottom Right Photo 4: Starfish & Wave Sparkle */}
          <div className="absolute -right-3.5 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <StarfishIcon size={17} />
          </div>
        </>
      )}
    </>
  );
};

/**
 * 8. Coastal Wave Footer Divider Icon (🌊 ~~~~)
 * Handcrafted horizontal ocean wave ribbon replacing text inscriptions.
 * Features 4 flowing curling wave crests with foam spray tips,
 * dual aqua-azure gradient stroke, and flanking pearl sparkles.
 */
export const CoastalWaveFooterIcon: React.FC<{ className?: string; width?: number; height?: number }> = ({
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
    aria-label="Ocean Wave Divider"
  >
    <defs>
      <linearGradient id="footerWaveGrad" x1="10" y1="9" x2="110" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="25%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="75%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="footerSwellGrad" x1="15" y1="12" x2="105" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Flanking Sparkle Left */}
    <path d="M6 9 L7 6 L8 9 L11 10 L8 11 L7 14 L6 11 L3 10 Z" fill="#38bdf8" opacity="0.85" />
    <circle cx="11.5" cy="6.5" r="0.9" fill="#0284c7" opacity="0.75" />

    {/* Secondary Lower Swell */}
    <path
      d="M16 13 C23 13, 27 10, 34 10 C41 10, 45 14, 52 14 C59 14, 63 9.5, 70 9.5 C77 9.5, 81 14, 88 14 C95 14, 99 11, 104 11"
      stroke="url(#footerSwellGrad)"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Primary Flowing Wave Crests (4 rhythmic curls matching the drawn waves) */}
    <path
      d="M14 11 C18 11, 21 8, 25 5.5 C27.5 4, 30 4.5, 30.5 6 C31 7.2, 29.5 8.5, 27.5 8 C25.5 7.5, 25 6.5, 25.5 5.5 C22 8, 26 12, 33 12 C39 12, 42 7.5, 47 5 C49.5 3.8, 52 4.2, 52.5 5.8 C53 7, 51.5 8.2, 49.5 7.8 C47.5 7.4, 47 6.2, 47.5 5 C44 7.5, 48 12, 55 12 C61 12, 64 7.5, 69 5 C71.5 3.8, 74 4.2, 74.5 5.8 C75 7, 73.5 8.2, 71.5 7.8 C69.5 7.4, 69 6.2, 69.5 5 C66 7.5, 70 12, 77 12 C83 12, 86 7.5, 91 5 C93.5 3.8, 96 4.2, 96.5 5.8 C97 7, 95.5 8.2, 93.5 7.8 C91.5 7.4, 91 6.2, 91.5 5 C88 7.5, 92 12, 99 12 C103 12, 105 10, 107 9.5"
      stroke="url(#footerWaveGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* White Foam Spray Droplets on Crests */}
    <circle cx="30" cy="4.5" r="0.9" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    <circle cx="52" cy="4.2" r="0.9" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    <circle cx="74" cy="4.2" r="0.9" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />
    <circle cx="96" cy="4.2" r="0.9" fill="#ffffff" stroke="#0284c7" strokeWidth="0.4" />

    {/* Flanking Sparkle Right */}
    <circle cx="108.5" cy="6.5" r="0.9" fill="#0284c7" opacity="0.75" />
    <path d="M114 9 L115 6 L116 9 L119 10 L116 11 L115 14 L114 11 L111 10 Z" fill="#38bdf8" opacity="0.85" />
  </svg>
);
