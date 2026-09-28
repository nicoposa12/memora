import React from 'react';

export interface BirthdayIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Birthday Cake Icon (🎂)
 * Dual-tier celebration cake with vanilla & strawberry frosting drips,
 * sugar sprinkles, and three lit candles with glowing amber flames.
 */
export const BirthdayCakeIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Birthday Cake"
  >
    <defs>
      <linearGradient id="cakeBaseGrad" x1="4" y1="12" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
      <linearGradient id="frostingGrad" x1="4" y1="10" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#fce7f3" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
      <radialGradient id="cakeFlameGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#ea580c" />
      </radialGradient>
    </defs>

    {/* Cake Plate / Stand */}
    <ellipse cx="14" cy="24" rx="11" ry="2.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
    <path d="M11 24.5 L10 26 H18 L17 24.5 Z" fill="#94a3b8" />

    {/* Bottom Tier Sponge */}
    <path d="M5 16 C5 14.5, 23 14.5, 23 16 V22 C23 23.5, 5 23.5, 5 22 Z" fill="url(#cakeBaseGrad)" stroke="#ca8a04" strokeWidth="0.8" />

    {/* Middle Cream Layer */}
    <path d="M5 19 C7 19.5, 11 19, 14 19.5 C17 19, 21 19.5, 23 19" stroke="#fda4af" strokeWidth="1.2" strokeLinecap="round" />

    {/* Top Frosting Scallop Drips */}
    <path
      d="M5 16 C5 14, 23 14, 23 16 C23 18, 20.5 17.5, 19.5 19 C18.5 20, 17 18, 16 19 C15 20, 13 18, 12 19 C11 20, 9.5 18, 8.5 19 C7.5 17.5, 5 18, 5 16 Z"
      fill="url(#frostingGrad)"
      stroke="#f43f5e"
      strokeWidth="0.6"
    />

    {/* Sprinkles on Frosting */}
    <circle cx="8" cy="16.5" r="0.6" fill="#38bdf8" />
    <circle cx="11.5" cy="17.2" r="0.6" fill="#ec4899" />
    <circle cx="14" cy="16.2" r="0.6" fill="#84cc16" />
    <circle cx="16.5" cy="17.5" r="0.6" fill="#a855f7" />
    <circle cx="20" cy="16.5" r="0.6" fill="#f97316" />

    {/* Left Candle */}
    <rect x="8.5" y="9" width="1.6" height="5" rx="0.4" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.4" />
    <path d="M9.3 7.5 Q9.8 6.5, 9.3 5.5 Q8.8 6.5, 9.3 7.5 Z" fill="url(#cakeFlameGlow)" />

    {/* Center Candle */}
    <rect x="13.2" y="7.5" width="1.6" height="6.5" rx="0.4" fill="#ec4899" stroke="#be185d" strokeWidth="0.4" />
    <path d="M14 6 Q14.5 5, 14 4 Q13.5 5, 14 6 Z" fill="url(#cakeFlameGlow)" />

    {/* Right Candle */}
    <rect x="17.9" y="9" width="1.6" height="5" rx="0.4" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
    <path d="M18.7 7.5 Q19.2 6.5, 18.7 5.5 Q18.2 6.5, 18.7 7.5 Z" fill="url(#cakeFlameGlow)" />
  </svg>
);

/**
 * 2. Glossy Birthday Balloons Icon (🎈)
 * Cluster of festive balloons (coral red, sunny yellow, sky blue)
 * with glossy highlights, knotted ends, and curly ribbons.
 */
export const BirthdayBalloonsIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Birthday Balloons"
  >
    <defs>
      <linearGradient id="balloonCyan" x1="4" y1="6" x2="14" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="balloonGold" x1="14" y1="4" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id="balloonRed" x1="8" y1="3" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
    </defs>

    {/* Cyan Balloon (Back Left) */}
    <ellipse cx="9" cy="11" rx="5.5" ry="7" fill="url(#balloonCyan)" />
    <path d="M8 17.5 L10 17.5 L9 18.5 Z" fill="#0284c7" />
    <path d="M9 18.5 Q7 21, 10 24" stroke="#0284c7" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    {/* Cyan Highlight */}
    <ellipse cx="6.8" cy="8" rx="1.4" ry="2.6" fill="#ffffff" opacity="0.6" transform="rotate(-20 6.8 8)" />

    {/* Gold Balloon (Back Right) */}
    <ellipse cx="19" cy="10" rx="5.5" ry="7" fill="url(#balloonGold)" />
    <path d="M18 16.5 L20 16.5 L19 17.5 Z" fill="#ca8a04" />
    <path d="M19 17.5 Q21 20, 18 24" stroke="#ca8a04" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    {/* Gold Highlight */}
    <ellipse cx="16.8" cy="7" rx="1.4" ry="2.6" fill="#ffffff" opacity="0.6" transform="rotate(-20 16.8 7)" />

    {/* Primary Red/Coral Balloon (Front Center) */}
    <ellipse cx="14" cy="9.5" rx="6.5" ry="8" fill="url(#balloonRed)" stroke="#9f1239" strokeWidth="0.6" />
    <path d="M12.8 17 L15.2 17 L14 18.2 Z" fill="#9f1239" />
    {/* Primary Highlight */}
    <ellipse cx="11.5" cy="6" rx="1.8" ry="3.2" fill="#ffffff" opacity="0.75" transform="rotate(-25 11.5 6)" />
    <circle cx="15.5" cy="5.2" r="0.8" fill="#ffffff" opacity="0.5" />

    {/* Curled Festive Ribbons */}
    <path d="M14 18.2 Q11 20.5, 13.5 22.5 Q15 23.5, 13 24.5" stroke="#e11d48" strokeWidth="0.9" fill="none" strokeLinecap="round" />
  </svg>
);

/**
 * 3. Gift Box Icon (🎁)
 * Dimensional present wrapped in satin ribbon with an ornate double bow.
 */
export const GiftBoxIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Gift Box"
  >
    <defs>
      <linearGradient id="giftBoxGrad" x1="4" y1="10" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
      <linearGradient id="giftRibbonGrad" x1="8" y1="4" x2="20" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>

    {/* Box Body */}
    <rect x="5.5" y="12" width="17" height="12" rx="1.8" fill="url(#giftBoxGrad)" stroke="#be185d" strokeWidth="0.8" />

    {/* Box Lid */}
    <rect x="4.5" y="9.5" width="19" height="3.8" rx="1.2" fill="url(#giftBoxGrad)" stroke="#be185d" strokeWidth="0.8" />

    {/* Vertical Ribbon */}
    <rect x="12.4" y="9.5" width="3.2" height="14.5" fill="url(#giftRibbonGrad)" stroke="#a16207" strokeWidth="0.5" />

    {/* Horizontal Ribbon on Lid */}
    <rect x="4.5" y="10.4" width="19" height="2" fill="url(#giftRibbonGrad)" opacity="0.9" />

    {/* Double Loop Ribbon Bow */}
    {/* Left Loop */}
    <ellipse cx="10.5" cy="7" rx="3.5" ry="2.4" fill="url(#giftRibbonGrad)" stroke="#a16207" strokeWidth="0.6" transform="rotate(-20 10.5 7)" />
    {/* Right Loop */}
    <ellipse cx="17.5" cy="7" rx="3.5" ry="2.4" fill="url(#giftRibbonGrad)" stroke="#a16207" strokeWidth="0.6" transform="rotate(20 17.5 7)" />
    {/* Center Knot */}
    <circle cx="14" cy="7.8" r="1.6" fill="#fde047" stroke="#a16207" strokeWidth="0.6" />

    {/* Glint on Bow */}
    <circle cx="10" cy="6.2" r="0.7" fill="#ffffff" />
    <circle cx="18" cy="6.2" r="0.7" fill="#ffffff" />
  </svg>
);

/**
 * 4. Party Popper Icon (🎉)
 * Diagonal party cone blasting streamers, metallic confetti, and sparks.
 */
export const BirthdayPartyPopperIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
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
    <defs>
      <linearGradient id="popperGrad" x1="4" y1="24" x2="16" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>

    {/* Popper Cone */}
    <path d="M4 24 L16 11 L19 14 L8 26 Z" fill="url(#popperGrad)" stroke="#9333ea" strokeWidth="0.8" />
    {/* Stripes on Cone */}
    <path d="M7 21 L12 16" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10 24 L15 19" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

    {/* Streamers */}
    <path d="M16 11 Q20 4, 25 7 Q22 10, 24 13" stroke="#f43f5e" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M19 14 Q24 16, 26 11 Q23 8, 25 5" stroke="#0ea5e9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M17 9 Q19 5, 23 4" stroke="#eab308" strokeWidth="1.1" fill="none" strokeLinecap="round" />

    {/* Confetti Specks & Discs */}
    <circle cx="21" cy="7" r="1" fill="#ec4899" />
    <circle cx="26" cy="15" r="1.1" fill="#eab308" />
    <circle cx="19" cy="4" r="0.8" fill="#10b981" />
    <circle cx="23" cy="10" r="0.9" fill="#8b5cf6" />
    <rect x="22" y="16" width="1.5" height="1.5" fill="#f97316" transform="rotate(25 22 16)" />
    <rect x="14" y="6" width="1.4" height="1.4" fill="#38bdf8" transform="rotate(-15 14 6)" />
  </svg>
);

/**
 * 5. Party Face Smiley Icon (🥳)
 * Cheerful celebration face with party horn, polka-dot festive hat, and confetti.
 */
export const PartyFaceIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Party Face"
  >
    <defs>
      <linearGradient id="faceGrad" x1="6" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="hatGrad" x1="12" y1="2" x2="22" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>

    {/* Face Circle */}
    <circle cx="14" cy="16" r="9" fill="url(#faceGrad)" stroke="#d97706" strokeWidth="0.8" />

    {/* Rosy Cheeks */}
    <ellipse cx="9" cy="18.5" rx="1.8" ry="1" fill="#f43f5e" opacity="0.4" />
    <ellipse cx="19" cy="18.5" rx="1.8" ry="1" fill="#f43f5e" opacity="0.4" />

    {/* Happy Closed Eyes (Curves) */}
    <path d="M8.5 14.5 Q10 13, 11.5 14.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M16.5 14.5 Q18 13, 19.5 14.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Smiling Mouth */}
    <path d="M11.5 19.5 Q14 22.5, 16.5 19.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Party Horn Noisemaker blowing from mouth */}
    <path d="M14 20 L21 21.5 L20.5 23 L13.5 21 Z" fill="#ec4899" stroke="#be185d" strokeWidth="0.5" />
    {/* Horn Swirl */}
    <path d="M21 21.5 Q24 20, 23 23 Q21 24, 22.5 25" stroke="#ec4899" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Party Cone Hat */}
    <path d="M10 10 L16 1.5 L20 8.5 Z" fill="url(#hatGrad)" stroke="#6366f1" strokeWidth="0.6" />
    {/* Hat Pompom */}
    <circle cx="16" cy="1.5" r="1.5" fill="#f43f5e" />
    {/* Hat Polka Dots */}
    <circle cx="13" cy="6" r="0.8" fill="#facc15" />
    <circle cx="16" cy="5.5" r="0.8" fill="#ffffff" />
    <circle cx="17.5" cy="7.5" r="0.7" fill="#f43f5e" />

    {/* Floating Confetti Sparks */}
    <circle cx="5" cy="11" r="0.8" fill="#38bdf8" />
    <circle cx="23" cy="11" r="0.8" fill="#f43f5e" />
    <circle cx="6" cy="20" r="0.7" fill="#a855f7" />
  </svg>
);

/**
 * 6. Birthday Sparkles Icon (✨)
 * Shimmering multi-point starburst and diamond cross glints in festive gold.
 */
export const BirthdaySparklesIcon: React.FC<BirthdayIconProps & { variant?: 'star' | 'cross' }> = ({
  className = '',
  size = 18,
  variant = 'star',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-120 duration-200 ${className}`}
    style={style}
    aria-label="Birthday Sparkles"
  >
    <defs>
      <linearGradient id="bdaySparkleGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#fef08a" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {variant === 'star' ? (
      <>
        {/* Main 4-point Diamond Starburst */}
        <path
          d="M12 2 C12 7.5, 16.5 12, 22 12 C16.5 12, 12 16.5, 12 22 C12 16.5, 7.5 12, 2 12 C7.5 12, 12 7.5, 12 2 Z"
          fill="url(#bdaySparkleGrad)"
        />
        {/* Secondary diagonal micro glints */}
        <path d="M5.5 5.5 L6.5 7 L8 6.5 L7 8 L8.5 9.5 L7 9 L6.5 10.5 L6 9 L4.5 8.5 L6 7.5 Z" fill="#facc15" />
        <circle cx="18" cy="18" r="1.5" fill="#fde047" />
        <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
      </>
    ) : (
      <>
        {/* 8-point Cross Starburst */}
        <path d="M12 1 V23 M1 12 H23" stroke="url(#bdaySparkleGrad)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 4.5 L19.5 19.5 M19.5 4.5 L4.5 19.5" stroke="#facc15" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
        <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
      </>
    )}
  </svg>
);

/**
 * 7. Confetti Burst Icon (🎊)
 * Dynamic burst of metallic ribbons and geometric celebration confetti.
 */
export const ConfettiBurstIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Confetti Burst"
  >
    {/* Swirling Streamers */}
    <path d="M8 6 Q14 2, 16 9 Q18 16, 22 13" stroke="#f43f5e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M6 18 Q9 12, 14 15 Q19 18, 24 10" stroke="#0ea5e9" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M11 24 Q15 18, 20 22" stroke="#eab308" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Confetti Discs & Diamonds */}
    <circle cx="8" cy="12" r="1.5" fill="#eab308" />
    <circle cx="18" cy="7" r="1.3" fill="#10b981" />
    <circle cx="13" cy="9" r="1.1" fill="#ec4899" />
    <circle cx="21" cy="19" r="1.4" fill="#a855f7" />
    <circle cx="7" cy="22" r="1.2" fill="#38bdf8" />

    <rect x="18" y="12" width="2" height="2" fill="#f97316" transform="rotate(30 18 12)" />
    <rect x="11" cy="15" width="2" height="2" fill="#eab308" transform="rotate(-20 11 15)" />
    <rect x="23" y="16" width="1.8" height="1.8" fill="#ec4899" transform="rotate(45 23 16)" />
  </svg>
);

/**
 * 8. Birthday Candles Icon (🕯️)
 * Trio of festive birthday candles with spiral wax stripes and glowing teardrop flames.
 */
export const BirthdayCandlesIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Birthday Candles"
  >
    <defs>
      <radialGradient id="candleFlameGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="75%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#dc2626" />
      </radialGradient>
    </defs>

    {/* Left Candle (Blue) */}
    <rect x="5.5" y="12" width="4" height="13" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.6" />
    <path d="M5.5 15 L9.5 17 M5.5 19 L9.5 21" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
    <path d="M7.5 12 V10" stroke="#475569" strokeWidth="0.8" />
    <path d="M7.5 10 Q8.5 7, 7.5 5 Q6.5 7, 7.5 10 Z" fill="url(#candleFlameGlow)" />

    {/* Center Candle (Pink, Taller) */}
    <rect x="12" y="10" width="4" height="15" rx="1" fill="#f472b6" stroke="#be185d" strokeWidth="0.6" />
    <path d="M12 13 L16 15 M12 17 L16 19 M12 21 L16 23" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
    <path d="M14 10 V8" stroke="#475569" strokeWidth="0.8" />
    <path d="M14 8 Q15.2 4.5, 14 3 Q12.8 4.5, 14 8 Z" fill="url(#candleFlameGlow)" />

    {/* Right Candle (Yellow) */}
    <rect x="18.5" y="12" width="4" height="13" rx="1" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
    <path d="M18.5 15 L22.5 17 M18.5 19 L22.5 21" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
    <path d="M20.5 12 V10" stroke="#475569" strokeWidth="0.8" />
    <path d="M20.5 10 Q21.5 7, 20.5 5 Q19.5 7, 20.5 10 Z" fill="url(#candleFlameGlow)" />
  </svg>
);

/**
 * 9. Birthday Cupcake Icon (🍰 / Cupcake)
 * Gourmet celebration cupcake with pleated gold cup, whipped icing swirl,
 * sprinkles, and a lit party candle.
 */
export const BirthdayCupcakeIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Birthday Cupcake"
  >
    <defs>
      <linearGradient id="cupGrad" x1="6" y1="17" x2="22" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id="icingGrad" x1="5" y1="10" x2="23" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#fed7aa" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
    </defs>

    {/* Pleated Foil Cup */}
    <path d="M6.5 17 L8.5 26 H19.5 L21.5 17 Z" fill="url(#cupGrad)" stroke="#a16207" strokeWidth="0.7" />
    {/* Pleat Lines */}
    <path d="M10 17 L11.2 26 M14 17 L14 26 M18 17 L16.8 26" stroke="#ca8a04" strokeWidth="0.7" />

    {/* Bottom Swirl Frosting */}
    <ellipse cx="14" cy="17" rx="8" ry="3.2" fill="url(#icingGrad)" stroke="#ea580c" strokeWidth="0.6" />

    {/* Upper Whipped Swirls */}
    <path
      d="M7 16 C7 12, 11 11, 14 11 C17 11, 21 12, 21 16 C20 15, 17 13, 14 13 C11 13, 8 15, 7 16 Z"
      fill="#ffedd5"
    />
    <ellipse cx="14" cy="12.5" rx="5" ry="2.2" fill="#fff7ed" stroke="#fb923c" strokeWidth="0.5" />
    {/* Top Tip */}
    <path d="M11 12.5 Q14 8, 14.5 9 Q15 10, 17 12.5 Z" fill="#ffffff" />

    {/* Candle on Cupcake */}
    <rect x="13.2" y="5.5" width="1.6" height="4.5" rx="0.4" fill="#ec4899" stroke="#be185d" strokeWidth="0.4" />
    <path d="M14 4 Q14.6 2.5, 14 1.5 Q13.4 2.5, 14 4 Z" fill="#f59e0b" />

    {/* Sprinkles */}
    <circle cx="10" cy="15" r="0.6" fill="#38bdf8" />
    <circle cx="13" cy="16.5" r="0.6" fill="#ec4899" />
    <circle cx="17" cy="14.5" r="0.6" fill="#10b981" />
  </svg>
);

/**
 * 10. Festive Stars Icon (⭐)
 * Gilded 5-point celebration star with beveled facet lighting and warm glow.
 */
export const FestiveStarsIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-120 duration-200 ${className}`}
    style={style}
    aria-label="Festive Star"
  >
    <defs>
      <linearGradient id="starGoldGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef08a" />
        <stop offset="70%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    <path
      d="M12 2 L15.1 8.3 L22 9.3 L17 14.2 L18.2 21.1 L12 17.8 L5.8 21.1 L7 14.2 L2 9.3 L8.9 8.3 Z"
      fill="url(#starGoldGrad)"
      stroke="#b45309"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Inner highlight facet */}
    <path d="M12 4.5 L14.2 9 L19 9.7 L15.5 13 L12 11 Z" fill="#ffffff" opacity="0.45" />
  </svg>
);

/**
 * 11. Satin Ribbon Bow Icon (🎀)
 * Elegant crimson/coral tied satin ribbon bow with trailing tails.
 */
export const SatinRibbonBowIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Satin Ribbon Bow"
  >
    <defs>
      <linearGradient id="ribbonPinkGrad" x1="4" y1="6" x2="24" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fda4af" />
        <stop offset="40%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
    </defs>

    {/* Left Loop */}
    <path
      d="M13 11 C8 6, 4 9, 6 13 C8 15, 12 12.5, 13 11 Z"
      fill="url(#ribbonPinkGrad)"
      stroke="#9f1239"
      strokeWidth="0.8"
    />
    <path d="M7 11 Q10 9, 12 11" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

    {/* Right Loop */}
    <path
      d="M15 11 C20 6, 24 9, 22 13 C20 15, 16 12.5, 15 11 Z"
      fill="url(#ribbonPinkGrad)"
      stroke="#9f1239"
      strokeWidth="0.8"
    />
    <path d="M21 11 Q18 9, 16 11" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

    {/* Left Trailing Ribbon Tail */}
    <path
      d="M12.5 13 C11 17, 7 21, 6 23 L9 22 C11 20, 13 16, 13.5 13.5 Z"
      fill="url(#ribbonPinkGrad)"
      stroke="#9f1239"
      strokeWidth="0.7"
    />

    {/* Right Trailing Ribbon Tail */}
    <path
      d="M15.5 13 C17 17, 21 21, 22 23 L19 22 C17 20, 15 16, 14.5 13.5 Z"
      fill="url(#ribbonPinkGrad)"
      stroke="#9f1239"
      strokeWidth="0.7"
    />

    {/* Center Knot */}
    <ellipse cx="14" cy="11.8" rx="2.4" ry="2.2" fill="#fb7185" stroke="#9f1239" strokeWidth="0.8" />
  </svg>
);

/**
 * 12. Celebration Glasses Icon (🥂)
 * Clinking champagne flutes with golden bubbles and celebration toast spark.
 */
export const CelebrationGlassesIcon: React.FC<BirthdayIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-115 duration-200 ${className}`}
    style={style}
    aria-label="Celebration Glasses"
  >
    <defs>
      <linearGradient id="champagneGold" x1="6" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>

    {/* Toast Spark Starburst */}
    <path d="M14 4 L14.8 6.5 L17 7.2 L15.2 8.5 L15.6 11 L14 9.5 L12.4 11 L12.8 8.5 L11 7.2 L13.2 6.5 Z" fill="#fde047" />

    {/* Left Flute (Angled Right) */}
    <g transform="rotate(18 10 14)">
      {/* Bowl */}
      <path d="M8 6 L12 6 C12.5 11, 11 15, 10 16 C9 15, 7.5 11, 8 6 Z" fill="rgba(254, 240, 138, 0.45)" stroke="#ca8a04" strokeWidth="0.8" />
      {/* Champagne Fluid */}
      <path d="M8.3 9 L11.7 9 C12 12, 11 14.5, 10 15.2 C9 14.5, 8 12, 8.3 9 Z" fill="url(#champagneGold)" />
      {/* Stem & Base */}
      <line x1="10" y1="16" x2="10" y2="23" stroke="#ca8a04" strokeWidth="0.9" />
      <line x1="7" y1="23" x2="13" y2="23" stroke="#ca8a04" strokeWidth="0.9" strokeLinecap="round" />
    </g>

    {/* Right Flute (Angled Left) */}
    <g transform="rotate(-18 18 14)">
      {/* Bowl */}
      <path d="M16 6 L20 6 C20.5 11, 19 15, 18 16 C17 15, 15.5 11, 16 6 Z" fill="rgba(254, 240, 138, 0.45)" stroke="#d97706" strokeWidth="0.8" />
      {/* Champagne Fluid */}
      <path d="M16.3 9 L19.7 9 C20 12, 19 14.5, 18 15.2 C17 14.5, 16 12, 16.3 9 Z" fill="url(#champagneGold)" />
      {/* Stem & Base */}
      <line x1="18" y1="16" x2="18" y2="23" stroke="#d97706" strokeWidth="0.9" />
      <line x1="15" y1="23" x2="21" y2="23" stroke="#d97706" strokeWidth="0.9" strokeLinecap="round" />
    </g>

    {/* Floating Bubbles */}
    <circle cx="12" cy="7" r="0.7" fill="#ffffff" />
    <circle cx="16" cy="6.5" r="0.7" fill="#ffffff" />
    <circle cx="14" cy="2" r="0.9" fill="#fde047" />
  </svg>
);

/**
 * 13. Birthday Photo Margin Accents
 * Positioned along the left & right margins of the photobooth strip slots.
 */
export const BirthdayPhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
}) => {
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Left: Party Popper + Sparkle */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <BirthdayPartyPopperIcon size={20} />
          </div>
          <div className="absolute -left-2 top-7 z-20 pointer-events-none">
            <BirthdaySparklesIcon variant="star" size={11} />
          </div>
          {/* Bottom Left Photo 1: Confetti Specks */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <ConfettiBurstIcon size={18} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Left: Birthday Candles + Party Face */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <BirthdayCandlesIcon size={20} />
          </div>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <BirthdaySparklesIcon variant="cross" size={10} />
          </div>
          {/* Bottom Left Photo 2: Party Face */}
          <div className="absolute -left-3 -bottom-2.5 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <PartyFaceIcon size={19} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Left: Birthday Cupcake + Star */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <BirthdayCupcakeIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <FestiveStarsIcon size={12} />
          </div>
          {/* Bottom Left Photo 3: Confetti Burst */}
          <div className="absolute -left-3 -bottom-1.5 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <ConfettiBurstIcon size={17} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Left: Gift Box + Party Face + Sparkle */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <GiftBoxIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <PartyFaceIcon size={16} />
          </div>
          {/* Bottom Left Photo 4: Golden Star */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[14deg] drop-shadow-xs">
            <FestiveStarsIcon size={15} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Right: Glossy Balloons + Festive Star */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-md">
            <BirthdayBalloonsIcon size={21} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <BirthdaySparklesIcon variant="cross" size={10} />
          </div>
          {/* Bottom Right Photo 1: Satin Ribbon Bow */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <SatinRibbonBowIcon size={18} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Right: Celebration Cake + Glasses */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <BirthdayCakeIcon size={20} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <BirthdaySparklesIcon variant="star" size={11} />
          </div>
          {/* Bottom Right Photo 2: Toast Glasses */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <CelebrationGlassesIcon size={18} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Right: Celebration Cake + Ribbon */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <BirthdayCakeIcon size={20} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <FestiveStarsIcon size={12} />
          </div>
          {/* Bottom Right Photo 3: Celebration Glasses */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <CelebrationGlassesIcon size={18} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Right: Balloons + Party Popper */}
          <div className="absolute -right-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <BirthdayBalloonsIcon size={21} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <BirthdaySparklesIcon variant="star" size={10} />
          </div>
          {/* Bottom Right Photo 4: Party Popper */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <BirthdayPartyPopperIcon size={19} />
          </div>
        </>
      )}
    </>
  );
};

/**
 * 14. Birthday Bunting & Cake Footer Divider (🎂 ⭐ 🎂)
 * Festive pennant garland with central birthday cake crest and celebration stars.
 */
export const BirthdayBuntingFooterIcon: React.FC<{ className?: string; width?: number; height?: number }> = ({
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
    aria-label="Birthday Bunting Divider"
  >
    <defs>
      <linearGradient id="buntingGold" x1="0" y1="9" x2="120" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
        <stop offset="25%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="75%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Left Pennant String */}
    <path d="M8 6 Q28 10, 48 7" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />
    {/* Pennant Flags Left */}
    <polygon points="12,7 18,7 15,13" fill="#f43f5e" />
    <polygon points="20,8 26,8 23,14" fill="#38bdf8" />
    <polygon points="28,8 34,8 31,14" fill="#facc15" />
    <polygon points="36,8 42,8 39,13.5" fill="#a855f7" />

    {/* Center Birthday Cake Crest */}
    <rect x="54" y="8" width="12" height="7" rx="1.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
    <path d="M54 11 C56 12, 60 12, 62 11 C64 12, 66 11, 66 11" stroke="#f43f5e" strokeWidth="1" strokeLinecap="round" />
    <rect x="59.3" y="4.5" width="1.4" height="3.5" rx="0.3" fill="#38bdf8" />
    <circle cx="60" cy="3.5" r="1.2" fill="#f59e0b" />

    {/* Flanking Stars */}
    <path d="M49 9 L49.7 7.2 L51.5 7 L50.1 5.8 L50.5 4 L49 5 L47.5 4 L47.9 5.8 L46.5 7 L48.3 7.2 Z" fill="#facc15" />
    <path d="M71 9 L71.7 7.2 L73.5 7 L72.1 5.8 L72.5 4 L71 5 L69.5 4 L69.9 5.8 L68.5 7 L70.3 7.2 Z" fill="#facc15" />

    {/* Right Pennant String */}
    <path d="M72 7 Q92 10, 112 6" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />
    {/* Pennant Flags Right */}
    <polygon points="78,8 84,8 81,13.5" fill="#a855f7" />
    <polygon points="86,8 92,8 89,14" fill="#facc15" />
    <polygon points="94,8 100,8 97,14" fill="#38bdf8" />
    <polygon points="102,7 108,7 105,13" fill="#f43f5e" />
  </svg>
);
