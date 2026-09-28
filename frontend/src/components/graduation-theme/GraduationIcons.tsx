import React from 'react';

export interface GraduationIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Mortarboard Graduation Cap Icon (🎓)
 * Academic mortarboard with beveled quad skullcap, golden button at the apex,
 * and a flowing golden bullion tassel draped gracefully over the brim.
 */
export const GraduationCapIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Graduation Cap"
  >
    <defs>
      <linearGradient id="gradCapTop" x1="3" y1="4" x2="25" y2="13" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="45%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="gradTasselGold" x1="14" y1="8" x2="24" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Skullcap Base */}
    <path
      d="M7 10.5 V15 C7 18.5, 21 18.5, 21 15 V10.5"
      fill="#0a1128"
      stroke="#d4af37"
      strokeWidth="0.8"
    />
    <path
      d="M9 15.5 C9 17.5, 19 17.5, 19 15.5"
      stroke="#b45309"
      strokeWidth="0.6"
      strokeDasharray="1 1"
      fill="none"
    />

    {/* Mortarboard Diamond Board */}
    <polygon
      points="14,4.2 25,8.8 14,13.4 3,8.8"
      fill="url(#gradCapTop)"
      stroke="#d4af37"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />

    {/* Diamond Board Underlayer Trim */}
    <polygon
      points="14,4.9 24,9 14,12.8 4,9"
      fill="none"
      stroke="#475569"
      strokeWidth="0.5"
      opacity="0.6"
    />

    {/* Apex Gold Button */}
    <ellipse cx="14" cy="8.8" rx="1.6" ry="1.1" fill="url(#gradTasselGold)" stroke="#78350f" strokeWidth="0.4" />

    {/* Flowing Gold Bullion Tassel */}
    <path
      d="M14 8.8 C17.5 9.5, 21.5 11.2, 22.5 14 C22.8 15, 22.8 16.5, 22.5 18"
      stroke="url(#gradTasselGold)"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tassel Ring / Knot */}
    <circle cx="22.5" cy="18" r="1.1" fill="#fef08a" stroke="#b45309" strokeWidth="0.4" />
    {/* Tassel Bullion Fringe */}
    <path
      d="M21.5 19 L21 23 M22.5 19.2 L22.5 24 M23.5 19 L24 23"
      stroke="url(#gradTasselGold)"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 2. Academic Honors Trophy Cup Icon (🏆)
 * Polished gold honors trophy with twin sculpted handles, embossed laurel wreath,
 * and weighted midnight navy pedestal with engraved gold achievement nameplate.
 */
export const GraduationTrophyIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Honors Trophy Cup"
  >
    <defs>
      <linearGradient id="gradTrophyGold" x1="8" y1="4" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="75%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* Left Trophy Handle */}
    <path
      d="M8.5 7 C5 7, 5 12, 8.5 13"
      stroke="url(#gradTrophyGold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Right Trophy Handle */}
    <path
      d="M19.5 7 C23 7, 23 12, 19.5 13"
      stroke="url(#gradTrophyGold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Chalice Body */}
    <path
      d="M8.5 5 H19.5 V12 C19.5 15.5, 17 17.5, 14 17.5 C11 17.5, 8.5 15.5, 8.5 12 V5 Z"
      fill="url(#gradTrophyGold)"
      stroke="#78350f"
      strokeWidth="0.8"
    />

    {/* Honors Star Embossed in Center */}
    <polygon
      points="14,8 14.7,9.5 16.3,9.5 15,10.5 15.5,12 14,11 12.5,12 13,10.5 11.7,9.5 13.3,9.5"
      fill="#ffffff"
      opacity="0.9"
    />

    {/* Stem Connector */}
    <rect x="12.5" y="17.5" width="3" height="3" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />

    {/* Weighted Pedestal */}
    <rect x="8" y="20.5" width="12" height="4.5" rx="1" fill="#0a1128" stroke="#d4af37" strokeWidth="0.8" />
    {/* Engraved Plaque */}
    <rect x="10.5" y="21.8" width="7" height="1.8" rx="0.4" fill="#fde047" />
  </svg>
);

/**
 * 3. Rolled Diploma Parchment Scroll Icon (📜)
 * Rolled sheepskin commencement diploma with shaded parchment curl,
 * tied with a rich crimson ribbon band, bow knot, and dangling satin tails.
 */
export const DiplomaScrollIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Diploma Scroll"
  >
    <defs>
      <linearGradient id="diplomaParchment" x1="4" y1="5" x2="24" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="60%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      <linearGradient id="diplomaCrimson" x1="11" y1="8" x2="17" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="60%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
    </defs>

    {/* Diagonal Parchment Cylinder */}
    <g transform="rotate(-28 14 14)">
      {/* Scroll Cylinder Body */}
      <rect
        x="6"
        y="9"
        width="16"
        height="10"
        rx="2"
        fill="url(#diplomaParchment)"
        stroke="#d97706"
        strokeWidth="0.8"
      />

      {/* Left Curled End */}
      <ellipse cx="6" cy="14" rx="2" ry="5" fill="#fde68a" stroke="#b45309" strokeWidth="0.7" />
      <ellipse cx="6" cy="14" rx="1.2" ry="3.2" fill="#d97706" opacity="0.4" />

      {/* Right Curled End */}
      <ellipse cx="22" cy="14" rx="2" ry="5" fill="#fef3c7" stroke="#b45309" strokeWidth="0.7" />

      {/* Calligraphy Script Lines */}
      <line x1="9" y1="12" x2="13" y2="12" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="14" x2="12.5" y2="14" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      <line x1="9" y1="16" x2="13" y2="16" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />

      {/* Crimson Ribbon Tie */}
      <rect x="13.2" y="9" width="3.2" height="10" rx="0.5" fill="url(#diplomaCrimson)" />
      {/* Gold Ribbon Borders */}
      <line x1="13.2" y1="9" x2="13.2" y2="19" stroke="#fde047" strokeWidth="0.4" />
      <line x1="16.4" y1="9" x2="16.4" y2="19" stroke="#fde047" strokeWidth="0.4" />

      {/* Crimson Bow Knot */}
      <circle cx="14.8" cy="14" r="1.3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.4" />

      {/* Dangling Ribbon Tails */}
      <polygon points="14.8,14 11.5,21.5 13.5,21 14.8,19" fill="#b91c1c" />
      <polygon points="14.8,14 17.5,21.5 15.8,21 14.8,19" fill="#991b1b" />
    </g>
  </svg>
);

/**
 * 4. Academic Honor Medal Icon (🎖️)
 * Striped military/academic ribbon neck suspension supporting a circular
 * golden medallion with embossed laurels and achievement star.
 */
export const HonorMedalIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Honor Medal"
  >
    <defs>
      <linearGradient id="medalGoldDisc" x1="9" y1="13" x2="19" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Ribbon Neck Ribbon - Left Flange */}
    <polygon points="9,3 12,3 14,13 11,13" fill="#1e3a8a" />
    {/* Ribbon Neck Ribbon - Center Crimson Stripe */}
    <polygon points="12,3 16,3 15,13 13,13" fill="#b91c1c" />
    {/* Ribbon Neck Ribbon - Right Flange */}
    <polygon points="16,3 19,3 17,13 14,13" fill="#1e3a8a" />

    {/* Gold Ribbon Accent Stripes */}
    <line x1="12" y1="3" x2="13.2" y2="13" stroke="#fde047" strokeWidth="0.6" />
    <line x1="16" y1="3" x2="14.8" y2="13" stroke="#fde047" strokeWidth="0.6" />

    {/* Connecting Suspension Ring */}
    <circle cx="14" cy="13.5" r="1.8" stroke="#d97706" strokeWidth="0.8" fill="none" />

    {/* Circular Gold Medallion Disc */}
    <circle cx="14" cy="19.5" r="6" fill="url(#medalGoldDisc)" stroke="#78350f" strokeWidth="0.8" />
    <circle cx="14" cy="19.5" r="4.6" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="1 0.8" fill="none" />

    {/* Center Embossed Achievement Star */}
    <polygon
      points="14,16.5 14.8,18.2 16.6,18.2 15.2,19.3 15.7,21 14,20 12.3,21 12.8,19.3 11.4,18.2 13.2,18.2"
      fill="#ffffff"
      stroke="#b45309"
      strokeWidth="0.3"
    />
  </svg>
);

/**
 * 5. Dimensional Academic Star Icon (⭐)
 * Faceted 5-point lustrous gold honor star with beveled directional shading,
 * diamond central spark, and radiant celebratory glints.
 */
export const AcademicStarsIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Academic Star"
  >
    <defs>
      <linearGradient id="academicStarLight" x1="14" y1="3" x2="24" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* 5-Pointed Star Silhouette */}
    <polygon
      points="14,3.5 16.8,10.2 24,10.8 18.5,15.2 20.3,22.2 14,18 7.7,22.2 9.5,15.2 4,10.8 11.2,10.2"
      fill="url(#academicStarLight)"
      stroke="#b45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Bevel Shading lines from apex to center (14, 14) */}
    <line x1="14" y1="14" x2="14" y2="3.5" stroke="#ffffff" strokeWidth="0.9" opacity="0.9" />
    <line x1="14" y1="14" x2="24" y2="10.8" stroke="#92400e" strokeWidth="0.7" opacity="0.8" />
    <line x1="14" y1="14" x2="20.3" y2="22.2" stroke="#78350f" strokeWidth="0.7" opacity="0.8" />
    <line x1="14" y1="14" x2="7.7" y2="22.2" stroke="#78350f" strokeWidth="0.7" opacity="0.8" />
    <line x1="14" y1="14" x2="4" y2="10.8" stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />

    {/* Center High-Luster Node */}
    <circle cx="14" cy="14" r="1.3" fill="#ffffff" />
  </svg>
);

/**
 * 6. Shimmering Gold Sparkles Icon (✨)
 * Refined 4-point diamond glints in radiant gold, cream, or amber.
 */
export const GraduationSparklesIcon: React.FC<{
  className?: string;
  variant?: 'star' | 'cross' | 'cluster';
  size?: number;
  color?: string;
}> = ({ className = '', variant = 'star', size = 12, color = '#fde047' }) => {
  if (variant === 'cross') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${className}`}
      >
        <path d="M8 1 V15 M1 8 H15" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="8" r="1.5" fill="#ffffff" />
      </svg>
    );
  }

  if (variant === 'cluster') {
    return (
      <svg
        width={size * 1.5}
        height={size}
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${className}`}
      >
        <path d="M6 8 C6 4, 8 2, 8 2 C8 2, 10 4, 10 8 C10 12, 8 14, 8 14 C8 14, 6 12, 6 8 Z" fill={color} />
        <path d="M8 6 C4 6, 2 8, 2 8 C2 8, 4 10, 8 10 C12 10, 14 8, 14 8 C14 8, 12 6, 8 6 Z" fill={color} />
        <circle cx="18" cy="5" r="2" fill="#ffffff" />
        <circle cx="19" cy="12" r="1.2" fill="#f59e0b" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-xs ${className}`}
    >
      <path
        d="M8 0 C8 5, 11 8, 16 8 C11 8, 8 11, 8 16 C8 11, 5 8, 0 8 C5 8, 8 5, 8 0 Z"
        fill={color}
      />
      <circle cx="8" cy="8" r="1.5" fill="#ffffff" />
    </svg>
  );
};

/**
 * 7. Hardcover Academic Book Stack Icon (📚)
 * Stack of bound hardcover collegiate volumes in midnight navy, crimson, and gold,
 * with embossed foil spine bands and silk bookmark ribbon.
 */
export const GraduationBookStackIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Academic Books"
  >
    {/* Bottom Volume (Midnight Navy) */}
    <rect x="3.5" y="19" width="19.5" height="5.5" rx="1.2" fill="#0a1128" stroke="#d4af37" strokeWidth="0.8" />
    <rect x="21" y="20" width="2" height="3.5" fill="#fef3c7" />
    <line x1="6.5" y1="19.5" x2="6.5" y2="24" stroke="#d4af37" strokeWidth="0.8" />
    <line x1="9.5" y1="19.5" x2="9.5" y2="24" stroke="#d4af37" strokeWidth="0.8" />

    {/* Middle Volume (Crimson Scholar) */}
    <rect x="5" y="12.5" width="18" height="5.5" rx="1.2" fill="#991b1b" stroke="#f59e0b" strokeWidth="0.8" />
    <rect x="21" y="13.5" width="2" height="3.5" fill="#fef3c7" />
    <line x1="7.5" y1="13" x2="7.5" y2="17.5" stroke="#fde047" strokeWidth="0.7" />
    <line x1="10" y1="13" x2="10" y2="17.5" stroke="#fde047" strokeWidth="0.7" />

    {/* Top Volume (Royal Gold) */}
    <rect x="4" y="6" width="17" height="5.5" rx="1.2" fill="#d97706" stroke="#fde047" strokeWidth="0.8" />
    <rect x="19" y="7" width="2" height="3.5" fill="#fef3c7" />
    <line x1="6.5" y1="6.5" x2="6.5" y2="11" stroke="#fef08a" strokeWidth="0.7" />
    <line x1="9" y1="6.5" x2="9" y2="11" stroke="#fef08a" strokeWidth="0.7" />

    {/* Hanging Bookmark Ribbon */}
    <path
      d="M14 11.5 V16.5 L15.5 15.5 L17 16.5 V11.5"
      fill="#ef4444"
      stroke="#b91c1c"
      strokeWidth="0.4"
    />
  </svg>
);

/**
 * 8. Graduation Confetti Popper Icon (🎉)
 * Celebratory golden party horn exploding with gold and royal sapphire confetti,
 * festive curling ribbons, and academic honor stars.
 */
export const GraduationConfettiIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Graduation Confetti"
  >
    <defs>
      <linearGradient id="gradPopperGrad" x1="4" y1="24" x2="15" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>

    {/* Party Cone Popper */}
    <polygon points="3,25 7,13 17,21" fill="url(#gradPopperGrad)" stroke="#78350f" strokeWidth="0.8" />
    <path d="M7 13 C10 16, 14 18, 17 21" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Popper Stripes */}
    <line x1="5.5" y1="17.5" x2="10.5" y2="22.5" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
    <line x1="8" y1="15" x2="13.5" y2="20" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />

    {/* Confetti Explosion Streamers & Stars */}
    <circle cx="16" cy="7" r="1.5" fill="#fde047" />
    <circle cx="23" cy="11" r="1.2" fill="#ef4444" />
    <circle cx="21" cy="18" r="1.3" fill="#3b82f6" />
    <circle cx="12" cy="5" r="1.1" fill="#10b981" />

    {/* Golden Streamers */}
    <path
      d="M15 11 C18 7, 21 6, 24 4"
      stroke="#f59e0b"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M17 14 C21 13, 24 14, 26 12"
      stroke="#38bdf8"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Exploding Star */}
    <polygon
      points="20,4 20.6,5.3 22,5.3 20.9,6.2 21.3,7.5 20,6.6 18.7,7.5 19.1,6.2 18,5.3 19.4,5.3"
      fill="#fde047"
    />
  </svg>
);

/**
 * 9. Rosette Ribbon Achievement Badge Icon (🏅)
 * Pleated ruffled circular rosette ribbon with dual cascading satin tails,
 * framing a central polished gold medallion with laurel wreaths.
 */
export const AchievementBadgeIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Achievement Badge"
  >
    <defs>
      <linearGradient id="badgeGoldDisc" x1="9" y1="5" x2="19" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Left Cascading Satin Tail */}
    <polygon points="12,14 8,24.5 12,23" fill="#1e3a8a" stroke="#1e293b" strokeWidth="0.5" />
    <polygon points="12,14 10,23.5 12,23" fill="#3b82f6" />

    {/* Right Cascading Satin Tail */}
    <polygon points="16,14 20,24.5 16,23" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.5" />
    <polygon points="16,14 18,23.5 16,23" fill="#ef4444" />

    {/* Outer Rosette Pleated Petals (12 points) */}
    <polygon
      points="14,2 16.5,3.5 19.5,3.2 21.2,5.5 24,6.5 24.5,9.5 26,11.5 24.5,14 24,17 21.2,18 19.5,20.2 16.5,20 14,21.5 11.5,20 8.5,20.2 6.8,18 4,17 3.5,14 2,11.5 3.5,9.5 4,6.5 6.8,5.5 8.5,3.2 11.5,3.5"
      fill="#0a1128"
      stroke="#d4af37"
      strokeWidth="0.8"
    />

    {/* Inner Polished Gold Medallion */}
    <circle cx="14" cy="11.5" r="6" fill="url(#badgeGoldDisc)" stroke="#92400e" strokeWidth="0.7" />
    <circle cx="14" cy="11.5" r="4.8" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1.2 0.8" fill="none" opacity="0.8" />

    {/* Center Honor Star */}
    <polygon
      points="14,8.5 14.8,10.2 16.6,10.2 15.2,11.3 15.7,13 14,12 12.3,13 12.8,11.3 11.4,10.2 13.2,10.2"
      fill="#ffffff"
    />
  </svg>
);

/**
 * 10. Airborne Cap Toss with Flowing Tassel Icon (🎓)
 * Dynamic graduation cap captured in mid-flight toss with soaring trajectory lines,
 * windblown bullion tassel, and commencement celebratory sparks.
 */
export const CapTossTasselIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Cap Toss Celebration"
  >
    <defs>
      <linearGradient id="tossCapTop" x1="4" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="60%" stopColor="#0a1128" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>

    {/* Upward Flight Motion Trails */}
    <path d="M5 23 C7 19, 10 17, 13 15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 1.5" strokeLinecap="round" />
    <path d="M8 25 C10 21, 13 19, 16 17" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2 1.5" strokeLinecap="round" />

    {/* Tilted Airborne Mortarboard */}
    <g transform="rotate(-18 14 12)">
      {/* Skullcap */}
      <path d="M8 10 V14 C8 17, 20 17, 20 14 V10" fill="#0a1128" stroke="#d4af37" strokeWidth="0.8" />

      {/* Diamond Board */}
      <polygon points="14,4 24,8.5 14,13 4,8.5" fill="url(#tossCapTop)" stroke="#d4af37" strokeWidth="0.9" />

      {/* Center Gold Button */}
      <ellipse cx="14" cy="8.5" rx="1.5" ry="1.1" fill="#fde047" stroke="#b45309" strokeWidth="0.4" />

      {/* Flying Windblown Tassel */}
      <path
        d="M14 8.5 C18 7, 23 9, 25 13 L26 18"
        stroke="#fde047"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="26" cy="18" r="1.1" fill="#f59e0b" />
      <path d="M25 19 L25 23 M26 19 L26.5 24 M27 19 L27.5 23" stroke="#f59e0b" strokeWidth="0.8" strokeLinecap="round" />
    </g>

    {/* High-Trajectory Sparks */}
    <polygon points="23,3 23.5,4.2 24.8,4.2 23.8,5 24.2,6.2 23,5.4 21.8,6.2 22.2,5 21.2,4.2 22.5,4.2" fill="#fde047" />
    <circle cx="3" cy="12" r="1.1" fill="#fde047" />
  </svg>
);

/**
 * 11. Executive Diploma Signing Fountain Pen Icon (🖊️)
 * Classic gold-nib fountain pen angled at 45° for signing commencement diplomas
 * and honor scrolls, with polished navy barrel and engraved 18k nib detailing.
 */
export const FountainPenIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Diploma Signing Pen"
  >
    <defs>
      <linearGradient id="penGoldNib" x1="4" y1="24" x2="10" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Pen Upper Barrel (Navy Blue) */}
    <polygon
      points="13,11 15,9 23,17 21,19"
      fill="#0a1128"
      stroke="#1e3a8a"
      strokeWidth="0.6"
    />

    {/* Pen Cap Section (Navy Blue with Gold Clip) */}
    <polygon
      points="17,7 19,5 25,11 23,13"
      fill="#1e293b"
      stroke="#d4af37"
      strokeWidth="0.8"
    />
    {/* Gold Pocket Clip */}
    <line x1="20" y1="5.5" x2="24.5" y2="10" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />

    {/* Center Gold Ring Band */}
    <line x1="16" y1="8" x2="22" y2="14" stroke="#fde047" strokeWidth="1.4" />

    {/* Pen Grip Section */}
    <polygon
      points="9,15 11,13 13,11 11,9"
      fill="#1e293b"
      stroke="#475569"
      strokeWidth="0.5"
    />

    {/* 18k Two-Tone Gold Nib */}
    <polygon
      points="4,24 8,18 12,14 10,12 6,16"
      fill="url(#penGoldNib)"
      stroke="#b45309"
      strokeWidth="0.7"
    />

    {/* Nib Slit & Breather Hole */}
    <line x1="4" y1="24" x2="8.5" y2="17.5" stroke="#78350f" strokeWidth="0.7" strokeLinecap="round" />
    <circle cx="8.5" cy="17.5" r="0.7" fill="#78350f" />

    {/* Gold Ink Stroke Signature Sparkle */}
    <path d="M2.5 25.5 C4.5 25, 7 26, 8.5 25.5" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * 12. Commencement Celebration Streamers Icon (🎊)
 * Festive celebration ribbons and party streamers exploding with gold & crimson confetti
 * marking the commencement grand finale.
 */
export const CelebrationStreamersIcon: React.FC<GraduationIconProps> = ({
  className = '',
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Commencement Celebration"
  >
    {/* Left Undulating Gold Streamer */}
    <path
      d="M5 24 C5 17, 10 16, 8 10 C6 4, 12 4, 13 2"
      stroke="#f59e0b"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Right Undulating Sapphire/Crimson Streamer */}
    <path
      d="M23 24 C23 17, 18 16, 20 10 C22 4, 16 4, 15 2"
      stroke="#3b82f6"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Center Crimson Twisting Ribbon */}
    <path
      d="M14 26 C12 21, 16 19, 14 14 C12 9, 15 7, 14 3"
      stroke="#ef4444"
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Floating Confetti Discs & Diamonds */}
    <circle cx="7" cy="14" r="1.3" fill="#fde047" />
    <circle cx="21" cy="14" r="1.3" fill="#fde047" />
    <polygon points="14,1 14.5,2.2 15.8,2.2 14.8,3 15.2,4.2 14,3.4 12.8,4.2 13.2,3 12.2,2.2 13.5,2.2" fill="#ffffff" />
    <circle cx="10" cy="8" r="1.1" fill="#3b82f6" />
    <circle cx="18" cy="8" r="1.1" fill="#ef4444" />
    <circle cx="14" cy="20" r="1.4" fill="#f59e0b" />
  </svg>
);

/**
 * 13. Graduation Ceremonial Diploma & Laurel Footer Divider (📜 🎓 📜)
 * Prestigious 120x18 SVG footer divider featuring a central tied diploma scroll,
 * flanked by twin academic laurel branches and golden honor stars with precision rules.
 */
export const GraduationDiplomaFooterIcon: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className = '', width = 120, height = 18 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-105 duration-200 ${className}`}
    aria-label="Graduation Honors Divider"
  >
    <defs>
      <linearGradient id="gradDivRuleLeft" x1="10" y1="9" x2="48" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#d4af37" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
      <linearGradient id="gradDivRuleRight" x1="72" y1="9" x2="110" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#d4af37" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Far Left Star Node */}
    <polygon points="10,9 10.6,7.5 12,7.3 10.9,6.2 11.2,4.8 10,5.6 8.8,4.8 9.1,6.2 8,7.3 9.4,7.5" fill="#d4af37" />

    {/* Left Horizontal Precision Rule */}
    <line x1="14" y1="9" x2="42" y2="9" stroke="url(#gradDivRuleLeft)" strokeWidth="0.9" strokeLinecap="round" />

    {/* Left Laurel Branch */}
    <path
      d="M43 9 C45 7.5, 48 7, 50 9 C48 10.5, 45 10.5, 43 9 Z"
      fill="#d4af37"
      opacity="0.85"
    />
    <path
      d="M47 6.5 C49 5.5, 52 5.5, 53 7.5 C51 8.5, 48 8, 47 6.5 Z"
      fill="#fde047"
      opacity="0.9"
    />

    {/* Center Diploma Scroll */}
    <g transform="translate(52, 2.5)">
      {/* Scroll Parchment Cylinder */}
      <rect x="2" y="3.5" width="12" height="6.5" rx="1.5" fill="#fef3c7" stroke="#b45309" strokeWidth="0.6" />
      <ellipse cx="2" cy="6.7" rx="1.2" ry="3.2" fill="#fde68a" stroke="#b45309" strokeWidth="0.5" />
      <ellipse cx="14" cy="6.7" rx="1.2" ry="3.2" fill="#fffbeb" stroke="#b45309" strokeWidth="0.5" />

      {/* Crimson Ribbon Band */}
      <rect x="7" y="3.5" width="2.4" height="6.5" fill="#b91c1c" />
      <line x1="7" y1="3.5" x2="7" y2="10" stroke="#fde047" strokeWidth="0.3" />
      <line x1="9.4" y1="3.5" x2="9.4" y2="10" stroke="#fde047" strokeWidth="0.3" />

      {/* Center Gold Seal / Knot */}
      <circle cx="8.2" cy="6.7" r="1.1" fill="#fde047" stroke="#78350f" strokeWidth="0.4" />

      {/* Mini Ribbon Tails */}
      <polygon points="8.2,7.2 6.5,11.5 8,11 8.2,10" fill="#991b1b" />
      <polygon points="8.2,7.2 10,11.5 8.5,11 8.2,10" fill="#7f1d1d" />
    </g>

    {/* Right Laurel Branch */}
    <path
      d="M77 9 C75 7.5, 72 7, 70 9 C72 10.5, 75 10.5, 77 9 Z"
      fill="#d4af37"
      opacity="0.85"
    />
    <path
      d="M73 6.5 C71 5.5, 68 5.5, 67 7.5 C69 8.5, 72 8, 73 6.5 Z"
      fill="#fde047"
      opacity="0.9"
    />

    {/* Right Horizontal Precision Rule */}
    <line x1="78" y1="9" x2="106" y2="9" stroke="url(#gradDivRuleRight)" strokeWidth="0.9" strokeLinecap="round" />

    {/* Far Right Star Node */}
    <polygon points="110,9 110.6,7.5 112,7.3 110.9,6.2 111.2,4.8 110,5.6 108.8,4.8 109.1,6.2 108,7.3 109.4,7.5" fill="#d4af37" />
  </svg>
);

/**
 * 14. Graduation Photo Frame Accents (Corner Embellishments)
 * Distributes all 12 bespoke graduation icons across the 4 photo slots:
 * - Slot 0 (COMMENCEMENT): Mortarboard Cap (🎓), Fountain Pen (🖊️), Sparkles (✨), Star (⭐)
 * - Slot 1 (GRADUATES): Honor Medal (🎖️), Book Stack (📚), Achievement Badge (🏅), Sparkles (✨)
 * - Slot 2 (CAP TOSS): Mid-Air Cap Toss (🎓), Confetti Burst (🎉), Celebration Streamers (🎊), Tassel
 * - Slot 3 (ALUMNI): Honors Trophy (🏆), Diploma Scroll (📜), Achievement Badge (🏅), Honor Star (⭐)
 */
export const GraduationPhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
}) => {
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Left: Mortarboard Graduation Cap + Gold Sparkle */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <GraduationCapIcon size={21} />
          </div>
          <div className="absolute -left-2 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="star" size={10} color="#fde047" />
          </div>
          {/* Bottom Left Photo 1: Executive Fountain Pen */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <FountainPenIcon size={19} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Left: Ceremonial Honor Medal */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <HonorMedalIcon size={21} />
          </div>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="cross" size={9} color="#d4af37" />
          </div>
          {/* Bottom Left Photo 2: Hardcover Academic Book Stack */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <GraduationBookStackIcon size={19} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Left: Airborne Cap Toss */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <CapTossTasselIcon size={21} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="star" size={10} color="#fde047" />
          </div>
          {/* Bottom Left Photo 3: Confetti Explosion */}
          <div className="absolute -left-3 -bottom-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <GraduationConfettiIcon size={19} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Left: Honors Trophy Cup */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <GraduationTrophyIcon size={21} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="cross" size={9} color="#d4af37" />
          </div>
          {/* Bottom Left Photo 4: Tied Diploma Scroll */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <DiplomaScrollIcon size={19} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Right: Academic Honor Star + Sparkles */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-md">
            <AcademicStarsIcon size={20} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="star" size={10} color="#fde047" />
          </div>
          {/* Bottom Right Photo 1: Diploma Scroll */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg]">
            <DiplomaScrollIcon size={18} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Right: Rosette Ribbon Achievement Badge */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <AchievementBadgeIcon size={21} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="cross" size={9} color="#fde047" />
          </div>
          {/* Bottom Right Photo 2: Shimmer Cluster */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <GraduationSparklesIcon variant="cluster" size={12} color="#d4af37" />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Right: Celebration Streamers & Bells */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <CelebrationStreamersIcon size={20} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="star" size={10} color="#fde047" />
          </div>
          {/* Bottom Right Photo 3: Honor Star */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <AcademicStarsIcon size={18} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Right: Achievement Badge */}
          <div className="absolute -right-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <AchievementBadgeIcon size={21} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <GraduationSparklesIcon variant="star" size={10} color="#fde047" />
          </div>
          {/* Bottom Right Photo 4: Academic Star */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <AcademicStarsIcon size={19} />
          </div>
        </>
      )}
    </>
  );
};
