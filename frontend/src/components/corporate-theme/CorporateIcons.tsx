import React from 'react';

export interface CorporateIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Executive Leather Briefcase Icon (💼)
 * Premium executive leather attaché with burnished gold brass lock clasp,
 * top stitch handle, and reinforced corner hardware.
 */
export const BriefcaseIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Executive Briefcase"
  >
    <defs>
      <linearGradient id="briefcaseBody" x1="4" y1="9" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="briefcaseBrass" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Top Leather Handle */}
    <path
      d="M10.5 9 V6 C10.5 4.8, 17.5 4.8, 17.5 6 V9"
      stroke="url(#briefcaseBrass)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Main Briefcase Body */}
    <rect
      x="4"
      y="9"
      width="20"
      height="14.5"
      rx="2.5"
      fill="url(#briefcaseBody)"
      stroke="#3b82f6"
      strokeWidth="0.8"
    />

    {/* Upper Flap Seam */}
    <path
      d="M4 14.5 C7 15.8, 11 16.5, 14 16.5 C17 16.5, 21 15.8, 24 14.5"
      stroke="#60a5fa"
      strokeWidth="0.9"
      strokeDasharray="1.2 0.8"
      fill="none"
      opacity="0.85"
    />

    {/* Center Brass Lock Mechanism */}
    <rect
      x="12.5"
      y="14.5"
      width="3"
      height="3.5"
      rx="0.6"
      fill="url(#briefcaseBrass)"
      stroke="#92400e"
      strokeWidth="0.4"
    />
    <circle cx="14" cy="16.5" r="0.6" fill="#1e293b" />

    {/* Bottom Corner Brass Guards */}
    <path d="M4 20 V22.5 C4 23, 4.5 23.5, 5 23.5 H7.5" stroke="url(#briefcaseBrass)" strokeWidth="0.9" fill="none" />
    <path d="M24 20 V22.5 C24 23, 23.5 23.5, 23 23.5 H20.5" stroke="url(#briefcaseBrass)" strokeWidth="0.9" fill="none" />
  </svg>
);

/**
 * 2. Strategic Partnership Handshake Icon (🤝)
 * Professional handshake signifying closed deals, team synergy,
 * and executive trust with formal suit cuffs and partnership spark.
 */
export const HandshakeIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Partnership Handshake"
  >
    <defs>
      <linearGradient id="handGold" x1="8" y1="12" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="60%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Left Formal Suit Sleeve */}
    <rect x="2.5" y="11" width="5.5" height="7" rx="1.2" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="0.6" />
    <rect x="7" y="11.5" width="1.2" height="6" rx="0.3" fill="#ffffff" />

    {/* Right Charcoal Suit Sleeve */}
    <rect x="20" y="10" width="5.5" height="7" rx="1.2" fill="#1e293b" stroke="#334155" strokeWidth="0.6" />
    <rect x="19.8" y="10.5" width="1.2" height="6" rx="0.3" fill="#ffffff" />

    {/* Clasping Hand Left */}
    <path
      d="M8.2 13.5 L12 16 C12.8 16.6, 14.2 16.2, 14.8 15.2 L15.5 14"
      fill="#fde047"
      stroke="#d97706"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Clasping Hand Right */}
    <path
      d="M19.8 12.5 L16 15.2 C15.2 15.8, 13.8 15.4, 13.2 14.4 L12.5 13.2"
      fill="url(#handGold)"
      stroke="#b45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Interlocking Fingers */}
    <path d="M12.5 14 C13.5 14.8, 15 14.8, 16 14" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />

    {/* Synergy Star above Clasp */}
    <polygon
      points="14,5.5 14.7,7.2 16.5,7.2 15.1,8.3 15.6,10 14,8.9 12.4,10 12.9,8.3 11.5,7.2 13.3,7.2"
      fill="#38bdf8"
    />
  </svg>
);

/**
 * 3. Bar Chart Analytics Icon (📊)
 * High-performance ascending analytics chart with multi-gradient metrics,
 * baseline axis, and upward performance trendline overlay.
 */
export const BarChartAnalyticsIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Analytics Bar Chart"
  >
    {/* Baseline Grid */}
    <line x1="3.5" y1="23.5" x2="24.5" y2="23.5" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />

    {/* Bar 1 (Quarter 1) */}
    <rect x="5" y="16.5" width="3.5" height="7" rx="0.8" fill="#93c5fd" stroke="#3b82f6" strokeWidth="0.6" />

    {/* Bar 2 (Quarter 2) */}
    <rect x="10" y="12.5" width="3.5" height="11" rx="0.8" fill="#60a5fa" stroke="#2563eb" strokeWidth="0.6" />

    {/* Bar 3 (Quarter 3) */}
    <rect x="15" y="8.5" width="3.5" height="15" rx="0.8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.6" />

    {/* Bar 4 (Quarter 4 - Peak Output) */}
    <rect x="20" y="4.5" width="3.5" height="19" rx="0.8" fill="#2563eb" stroke="#1e40af" strokeWidth="0.6" />

    {/* Upward Curved Performance Trendline */}
    <path
      d="M6.5 15 L11.5 11 L16.5 7 L21.5 3.5"
      stroke="#10b981"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Goal Target Point */}
    <circle cx="21.5" cy="3.5" r="1.5" fill="#34d399" stroke="#059669" strokeWidth="0.6" />
  </svg>
);

/**
 * 4. Strategic Target & Bullseye Icon (🎯)
 * Precision circular target rings in corporate sapphire and vibrant coral
 * with precision center glint and incoming dart.
 */
export const TargetBullseyeIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Precision Target Bullseye"
  >
    {/* Outer Sapphire Ring */}
    <circle cx="14" cy="14" r="11" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.4" />

    {/* Middle White/Azure Ring */}
    <circle cx="14" cy="14" r="7.5" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.1" />

    {/* Inner Bullseye Red */}
    <circle cx="14" cy="14" r="4.2" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" />

    {/* Dead Center Gold Node */}
    <circle cx="14" cy="14" r="1.5" fill="#fef08a" />

    {/* Incoming Strategy Dart */}
    <line x1="23" y1="5" x2="15.2" y2="12.8" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" />
    <polygon points="21.5,4 24.5,3.5 23.5,6.5" fill="#ef4444" />
    <polygon points="23.5,6.5 24.5,9.5 21.5,8.5" fill="#2563eb" />
  </svg>
);

/**
 * 5. Executive Championship Trophy Cup Icon (🏆)
 * Polished 24k gold executive award chalice with sculpted handles,
 * engraved achievement star, and weighted navy pedestal with brass nameplate.
 */
export const TrophyCupIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Executive Trophy Cup"
  >
    <defs>
      <linearGradient id="trophyGoldGrad" x1="8" y1="5" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Left Trophy Handle */}
    <path
      d="M8.5 7.5 C5.5 7.5, 5.5 12.5, 8.5 13.5"
      stroke="#f59e0b"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Right Trophy Handle */}
    <path
      d="M19.5 7.5 C22.5 7.5, 22.5 12.5, 19.5 13.5"
      stroke="#f59e0b"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Main Trophy Chalice Body */}
    <path
      d="M8.5 5.5 H19.5 V12.5 C19.5 15.8, 17 18, 14 18 C11 18, 8.5 15.8, 8.5 12.5 V5.5 Z"
      fill="url(#trophyGoldGrad)"
      stroke="#92400e"
      strokeWidth="0.8"
    />

    {/* Engraved Achievement Star on Chalice */}
    <polygon
      points="14,8.5 14.6,10 16.2,10 14.9,11 15.4,12.5 14,11.5 12.6,12.5 13.1,11 11.8,10 13.4,10"
      fill="#ffffff"
      opacity="0.9"
    />

    {/* Stem Connector */}
    <rect x="12.5" y="18" width="3" height="3" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />

    {/* Heavy Executive Pedestal */}
    <rect x="8.5" y="21" width="11" height="4" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="0.6" />
    {/* Brass Nameplate */}
    <rect x="10.5" y="22" width="7" height="1.8" rx="0.4" fill="#fbbf24" />
  </svg>
);

/**
 * 6. Innovation Idea Lightbulb Icon (💡)
 * Radiant incandescent/LED idea bulb with luminous golden core,
 * tungsten filament, brass screw socket, and creative innovation rays.
 */
export const LightbulbIdeaIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Innovation Idea Lightbulb"
  >
    <defs>
      <radialGradient id="bulbAmberCore" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="80%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
    </defs>

    {/* Glowing Glass Bulb Body */}
    <path
      d="M14 4 C9.8 4, 6.5 7.4, 6.5 11.5 C6.5 14.2, 8 16.5, 10.2 17.8 C10.8 18.2, 11.2 18.8, 11.2 19.5 V20.5 H16.8 V19.5 C16.8 18.8, 17.2 18.2, 17.8 17.8 C20 16.5, 21.5 14.2, 21.5 11.5 C21.5 7.4, 18.2 4, 14 4 Z"
      fill="url(#bulbAmberCore)"
      stroke="#b45309"
      strokeWidth="0.9"
    />

    {/* Tungsten Coil Filament */}
    <path
      d="M12 14 L13 11 L14 13 L15 11 L16 14"
      stroke="#fef08a"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Base Screw Threads */}
    <line x1="11.5" y1="21.5" x2="16.5" y2="21.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="12" y1="23" x2="16" y2="23" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12.5 24.5 C12.5 25.3, 15.5 25.3, 15.5 24.5" fill="#334155" />

    {/* Creative Innovation Radiant Rays */}
    <line x1="14" y1="1" x2="14" y2="2.5" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="4.5" y1="5.5" x2="6" y2="7" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="23.5" y1="5.5" x2="22" y2="7" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="3.8" y2="12" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="26" y1="12" x2="24.2" y2="12" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 7. Collaborative Team Synergy Icon (👥)
 * Executive leadership team silhouettes in royal sapphire and charcoal gradients,
 * unified by an overarching strategic collaboration arc.
 */
export const TeamSynergyIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Executive Team Synergy"
  >
    {/* Left Colleague (Slate/Cyan) */}
    <circle cx="8" cy="11.5" r="2.8" fill="#64748b" stroke="#475569" strokeWidth="0.5" />
    <path d="M3.5 21.5 C3.5 18.5, 5.5 17, 8.5 17 C9.5 17, 10.3 17.3, 11 17.8" fill="#475569" />

    {/* Right Colleague (Slate/Cyan) */}
    <circle cx="20" cy="11.5" r="2.8" fill="#64748b" stroke="#475569" strokeWidth="0.5" />
    <path d="M17 17.8 C17.7 17.3, 18.5 17, 19.5 17 C22.5 17, 24.5 18.5, 24.5 21.5" fill="#475569" />

    {/* Center Leader (Sapphire/Royal Blue) */}
    <circle cx="14" cy="9" r="3.5" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
    <path
      d="M9 19.5 C9 15.5, 11.2 14, 14 14 C16.8 14, 19 15.5, 19 19.5"
      fill="#1e40af"
      stroke="#1d4ed8"
      strokeWidth="0.6"
    />
    {/* Leader Tie / Collar Detail */}
    <polygon points="14,14 14.6,16.5 14,18.5 13.4,16.5" fill="#60a5fa" />

    {/* Synergy Strategic Arc */}
    <path
      d="M6 23.5 C10 25.5, 18 25.5, 22 23.5"
      stroke="#38bdf8"
      strokeWidth="1.2"
      strokeDasharray="2 1.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * 8. High-Trajectory Growth Arrow Icon (📈)
 * Upward market breakout graph with gridlines, energetic green/emerald trendline,
 * and prominent growth arrow pointing to new summits.
 */
export const GrowthArrowIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Growth Market Arrow"
  >
    {/* Grid Backdrop Card */}
    <rect x="3" y="3" width="22" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />

    {/* Subtle Metric Gridlines */}
    <line x1="6" y1="10" x2="22" y2="10" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2 1.5" />
    <line x1="6" y1="16" x2="22" y2="16" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2 1.5" />

    {/* Gradient Shaded Area beneath the trendline */}
    <path d="M6 20 L11 15.5 L16 17 L21.5 7.5 V20 H6 Z" fill="#ecfdf5" opacity="0.9" />

    {/* Primary Emerald Growth Trendline */}
    <path
      d="M6 20 L11 15.5 L16 17 L21 7.5"
      stroke="#10b981"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Prominent Arrowhead */}
    <polygon points="17,7 22,6.5 21.5,11.5" fill="#10b981" />

    {/* Breakout Data Node */}
    <circle cx="21" cy="7.5" r="1.5" fill="#34d399" />
  </svg>
);

/**
 * 9. Corporate Headquarters Skyscraper Icon (🏢)
 * Architectural modern corporate glass tower with illuminated geometric window grids,
 * entrance portal canopy, and spire aviation beacon.
 */
export const BuildingSkyscraperIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Corporate Headquarters Skyscraper"
  >
    <defs>
      <linearGradient id="skyscraperGrad" x1="10" y1="4" x2="23" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>

    {/* Rooftop Spire & Beacon */}
    <line x1="16.5" y1="1" x2="16.5" y2="4.5" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="16.5" cy="1" r="0.9" fill="#ef4444" />

    {/* Left Annex Tower */}
    <rect x="5" y="10" width="7" height="15" rx="1" fill="#475569" stroke="#334155" strokeWidth="0.8" />
    <rect x="6.5" y="12" width="1.5" height="1.8" rx="0.3" fill="#fef08a" />
    <rect x="9.5" y="12" width="1.5" height="1.8" rx="0.3" fill="#ffffff" />
    <rect x="6.5" y="15.5" width="1.5" height="1.8" rx="0.3" fill="#ffffff" />
    <rect x="9.5" y="15.5" width="1.5" height="1.8" rx="0.3" fill="#fef08a" />
    <rect x="6.5" y="19" width="1.5" height="1.8" rx="0.3" fill="#fef08a" />
    <rect x="9.5" y="19" width="1.5" height="1.8" rx="0.3" fill="#ffffff" />

    {/* Main Architectural Tower */}
    <rect
      x="10.5"
      y="4.5"
      width="12.5"
      height="20.5"
      rx="1.2"
      fill="url(#skyscraperGrad)"
      stroke="#1e3a8a"
      strokeWidth="0.8"
    />

    {/* Main Tower Illuminated Windows */}
    {/* Floor 4 */}
    <rect x="12" y="6.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    <rect x="15.5" y="6.5" width="2" height="2" rx="0.3" fill="#fef08a" />
    <rect x="19" y="6.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    {/* Floor 3 */}
    <rect x="12" y="10.5" width="2" height="2" rx="0.3" fill="#fef08a" />
    <rect x="15.5" y="10.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    <rect x="19" y="10.5" width="2" height="2" rx="0.3" fill="#fef08a" />
    {/* Floor 2 */}
    <rect x="12" y="14.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    <rect x="15.5" y="14.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    <rect x="19" y="14.5" width="2" height="2" rx="0.3" fill="#fef08a" />
    {/* Floor 1 */}
    <rect x="12" y="18.5" width="2" height="2" rx="0.3" fill="#fef08a" />
    <rect x="15.5" y="18.5" width="2" height="2" rx="0.3" fill="#ffffff" />
    <rect x="19" y="18.5" width="2" height="2" rx="0.3" fill="#ffffff" />

    {/* Ground Level Entrance Canopy */}
    <rect x="14.5" y="22.5" width="4.5" height="2.5" rx="0.4" fill="#67e8f9" />
  </svg>
);

/**
 * 10. Executive Achievement Star Medallion Icon (⭐)
 * Dimensional, beveled 5-pointed gold star medallion with center glint
 * and dual ceremonial royal sapphire ribbon tails.
 */
export const AchievementStarIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Executive Achievement Star Medallion"
  >
    <defs>
      <linearGradient id="achieveStarGold" x1="6" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Left Royal Ribbon Tail */}
    <polygon points="12,18 8.5,25 12.5,23" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />

    {/* Right Navy Ribbon Tail */}
    <polygon points="16,18 19.5,25 15.5,23" fill="#1e3a8a" stroke="#1e293b" strokeWidth="0.5" />

    {/* 5-Pointed Star Silhouette */}
    <polygon
      points="14,4 16.5,10.2 23,10.5 18,14.5 19.8,21 14,17.2 8.2,21 10,14.5 5,10.5 11.5,10.2"
      fill="url(#achieveStarGold)"
      stroke="#b45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* Bevel Shading Lines radiating from center (14, 13.5) */}
    <line x1="14" y1="13.5" x2="14" y2="4" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
    <line x1="14" y1="13.5" x2="23" y2="10.5" stroke="#b45309" strokeWidth="0.6" opacity="0.7" />
    <line x1="14" y1="13.5" x2="19.8" y2="21" stroke="#92400e" strokeWidth="0.6" opacity="0.8" />
    <line x1="14" y1="13.5" x2="8.2" y2="21" stroke="#92400e" strokeWidth="0.6" opacity="0.8" />
    <line x1="14" y1="13.5" x2="5" y2="10.5" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />

    {/* Center Diamond Sparkle */}
    <circle cx="14" cy="13.5" r="1.2" fill="#ffffff" />
  </svg>
);

/**
 * 11. Keynote Stage Microphone Icon (🎤)
 * Professional wireless dynamic handheld keynote stage microphone angled at -45°
 * with silver sound mesh grille, blue active LED ring, and audio broadcast waves.
 */
export const MicrophoneKeynoteIcon: React.FC<CorporateIconProps> = ({ className = '', size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-xs transition-transform hover:scale-110 duration-200 ${className}`}
    style={style}
    aria-label="Keynote Stage Microphone"
  >
    <defs>
      <linearGradient id="micMesh" x1="14" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>

    {/* Audio Broadcast Resonance Waves */}
    <path d="M21 5.5 C23 7.5, 24 9.5, 24 12" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M23.5 3 C26.5 6, 27 9, 27 12" stroke="#60a5fa" strokeWidth="1" strokeLinecap="round" fill="none" />

    {/* Mic Grille Capsule */}
    <circle cx="18" cy="10" r="4.5" fill="url(#micMesh)" stroke="#334155" strokeWidth="0.8" />
    {/* Grille Mesh Texture */}
    <line x1="15" y1="10" x2="21" y2="10" stroke="#94a3b8" strokeWidth="0.7" />
    <line x1="18" y1="7" x2="18" y2="13" stroke="#94a3b8" strokeWidth="0.7" />

    {/* Active Transmitter LED Ring */}
    <rect
      x="13.2"
      y="12.5"
      width="4"
      height="1.5"
      rx="0.5"
      fill="#38bdf8"
      transform="rotate(-45 15.2 13.2)"
    />

    {/* Matte Metallic Handle */}
    <polygon
      points="14.8,13.8 13.2,15.4 6.5,22.2 8.2,23.8 15,17 16.5,15.5"
      fill="#1e293b"
      stroke="#0f172a"
      strokeWidth="0.8"
    />

    {/* Base Antenna Cap */}
    <circle cx="7.3" cy="23" r="1.2" fill="#3b82f6" />
  </svg>
);

/**
 * 12. Polished Corporate Sparkles Icon (✨)
 * Refined 4-point executive diamond starburst in royal blue, bright cyan, or gold.
 */
export const CorporateSparklesIcon: React.FC<{
  className?: string;
  variant?: 'star' | 'cross' | 'cluster';
  size?: number;
  color?: string;
}> = ({ className = '', variant = 'star', size = 12, color = '#2563eb' }) => {
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
        <circle cx="8" cy="8" r="1.5" fill="#fde047" />
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
        <circle cx="18" cy="5" r="2" fill="#38bdf8" />
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
 * 13. Corporate Skyline & Achievement Medallion Footer Divider (🏢 ⭐ 🏢)
 * Architectural skyline silhouette flanking an executive golden achievement star medallion
 * with horizontal precision rules, anchoring the photobooth strip footer.
 */
export const CorporateSkylineFooterIcon: React.FC<{
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
    aria-label="Corporate Summit Divider"
  >
    <defs>
      <linearGradient id="corpDivGrad" x1="10" y1="9" x2="110" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
        <stop offset="25%" stopColor="#2563eb" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="75%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
      </linearGradient>
    </defs>

    {/* Far Left Precision Spark */}
    <polygon points="8,9 8.6,7.5 10,7.3 8.9,6.2 9.2,4.8 8,5.6 6.8,4.8 7.1,6.2 6,7.3 7.4,7.5" fill="#2563eb" />

    {/* Left Architectural Skyline Profile */}
    <path
      d="M12 13 H20 V9 H26 V6 H32 V11 H38 V8 H44 V13 H48"
      stroke="#2563eb"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    />
    {/* Left Divider Baseline */}
    <line x1="12" y1="13" x2="48" y2="13" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />

    {/* Left Flanking Diamond Glint */}
    <path d="M52 9 L53 7.5 L54.5 7 L53.3 6.2 L53.6 5 L52 5.8 L50.4 5 L50.7 6.2 L49.5 7 L51 7.5 Z" fill="#38bdf8" />

    {/* Center Executive Achievement Star Medallion */}
    <polygon
      points="60,3.5 62,8 67,8.2 63,11.2 64.5,16 60,13 55.5,16 57,11.2 53,8.2 58,8"
      fill="#f59e0b"
      stroke="#d97706"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="9.5" r="1.5" fill="#fef08a" />

    {/* Right Flanking Diamond Glint */}
    <path d="M68 9 L69 7.5 L70.5 7 L69.3 6.2 L69.6 5 L68 5.8 L66.4 5 L66.7 6.2 L65.5 7 L67 7.5 Z" fill="#38bdf8" />

    {/* Right Architectural Skyline Profile */}
    <path
      d="M72 13 H76 V8 H82 V11 H88 V6 H94 V9 H100 V13 H108"
      stroke="#2563eb"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    />
    {/* Right Divider Baseline */}
    <line x1="72" y1="13" x2="108" y2="13" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />

    {/* Far Right Precision Spark */}
    <polygon points="112,9 112.6,7.5 114,7.3 112.9,6.2 113.2,4.8 112,5.6 110.8,4.8 111.1,6.2 110,7.3 111.4,7.5" fill="#2563eb" />
  </svg>
);

/**
 * 14. Corporate Photo Frame Accents (Corner Embellishments)
 * Distributes all 12 suggested corporate icons gracefully across the 4 photo slots:
 * - Slot 0 (Keynote): Keynote Mic (🎤), Idea Lightbulb (💡), Growth Arrow (📈), Sparkles (✨)
 * - Slot 1 (Team Synergy): Team Synergy (👥), Strategic Handshake (🤝), Precision Target (🎯), Sparkles (✨)
 * - Slot 2 (Networking): Executive Briefcase (💼), Analytics Chart (📊), Partnership Handshake (🤝), Sparkles (✨)
 * - Slot 3 (Summit / Gala): Skyscraper Tower (🏢), Championship Trophy (🏆), Achievement Star (⭐), Sparkles (✨)
 */
export const CorporatePhotoAccents: React.FC<{ photoIndex: number; totalPhotos?: number }> = ({
  photoIndex,
}) => {
  const idx = photoIndex % 4;

  return (
    <>
      {/* ================= LEFT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Left: Keynote Stage Microphone + Cyan Glint */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <MicrophoneKeynoteIcon size={20} />
          </div>
          <div className="absolute -left-2 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="star" size={10} color="#38bdf8" />
          </div>
          {/* Bottom Left Photo 1: Growth Arrow Graph */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <GrowthArrowIcon size={19} />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Left: Collaborative Team Synergy */}
          <div className="absolute -left-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <TeamSynergyIcon size={21} />
          </div>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="cross" size={9} color="#2563eb" />
          </div>
          {/* Bottom Left Photo 2: Precision Target Bullseye */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-xs">
            <TargetBullseyeIcon size={19} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Left: Executive Briefcase */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[8deg] drop-shadow-md">
            <BriefcaseIcon size={20} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="star" size={10} color="#f59e0b" />
          </div>
          {/* Bottom Left Photo 3: Analytics Bar Chart */}
          <div className="absolute -left-3 -bottom-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-xs">
            <BarChartAnalyticsIcon size={19} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Left: Corporate Headquarters Skyscraper */}
          <div className="absolute -left-3.5 -top-2 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <BuildingSkyscraperIcon size={21} />
          </div>
          <div className="absolute -left-2.5 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="cross" size={9} color="#38bdf8" />
          </div>
          {/* Bottom Left Photo 4: Achievement Star Medallion */}
          <div className="absolute -left-3 -bottom-2 z-20 pointer-events-none transform rotate-[12deg] drop-shadow-xs">
            <AchievementStarIcon size={19} />
          </div>
        </>
      )}

      {/* ================= RIGHT MARGIN EMBELLISHMENTS ================= */}
      {idx === 0 && (
        <>
          {/* Photo 1 Right: Innovation Idea Lightbulb + Sparkles */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform rotate-[10deg] drop-shadow-md">
            <LightbulbIdeaIcon size={20} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="star" size={10} color="#f59e0b" />
          </div>
          {/* Bottom Right Photo 1: Gold Star Sparkle */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[8deg]">
            <CorporateSparklesIcon variant="cluster" size={12} color="#2563eb" />
          </div>
        </>
      )}

      {idx === 1 && (
        <>
          {/* Photo 2 Right: Strategic Partnership Handshake */}
          <div className="absolute -right-3.5 -top-1 z-20 pointer-events-none transform rotate-[6deg] drop-shadow-md">
            <HandshakeIcon size={21} />
          </div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="cross" size={9} color="#38bdf8" />
          </div>
          {/* Bottom Right Photo 2: Achievement Glint */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <AchievementStarIcon size={17} />
          </div>
        </>
      )}

      {idx === 2 && (
        <>
          {/* Photo 3 Right: Growth Arrow + Handshake */}
          <div className="absolute -right-3.5 -top-1.5 z-20 pointer-events-none transform -rotate-[6deg] drop-shadow-md">
            <GrowthArrowIcon size={19} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="star" size={10} color="#2563eb" />
          </div>
          {/* Bottom Right Photo 3: Closed Deal Handshake */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-xs">
            <HandshakeIcon size={18} />
          </div>
        </>
      )}

      {idx === 3 && (
        <>
          {/* Photo 4 Right: Championship Trophy Cup */}
          <div className="absolute -right-3.5 -top-2 z-20 pointer-events-none transform rotate-[8deg] drop-shadow-md">
            <TrophyCupIcon size={21} />
          </div>
          <div className="absolute -right-2 top-6 z-20 pointer-events-none">
            <CorporateSparklesIcon variant="star" size={10} color="#f59e0b" />
          </div>
          {/* Bottom Right Photo 4: Golden Achievement Star */}
          <div className="absolute -right-3 -bottom-2 z-20 pointer-events-none transform -rotate-[10deg] drop-shadow-md">
            <AchievementStarIcon size={19} />
          </div>
        </>
      )}
    </>
  );
};
