import React from 'react';

interface SchoolIconProps {
  className?: string;
  isLight?: boolean;
  size?: number;
}

/**
 * 1. Varsity School Pennant & Flag
 * Classic high school / campus felt pennant with gold border, brass mast, fluttering ties, and stars.
 * Represents current school year pride and varsity campus life.
 */
export const SchoolPennantIcon: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 32 }) => {
  const pennantBg = isLight ? '#0c1a30' : '#0a1628';
  const pennantTrim = isLight ? '#8a6416' : '#d4af37';
  const mastColor = isLight ? '#5a3d0b' : '#c59d2f';
  const textColor = isLight ? '#fdfaf3' : '#f6eedb';
  const starColor = isLight ? '#a37519' : '#e5c05b';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xs select-none ${className}`}
      aria-label="Varsity Campus Pennant"
    >
      {/* Mast Staff Left */}
      <line x1="8" y1="6" x2="8" y2="42" stroke={mastColor} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="8" cy="6" r="2.5" fill={starColor} />

      {/* Pennant Flag Triangle */}
      <polygon
        points="9.5,9 43,23 9.5,35"
        fill={pennantBg}
        stroke={pennantTrim}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Inner Decorative Accent Border */}
      <polygon
        points="12,12.5 38,23 12,32"
        fill="none"
        stroke={pennantTrim}
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Spine Binding on Left */}
      <rect x="8.5" y="9" width="3.5" height="26" fill={pennantTrim} />

      {/* Fluttering Ribbon Ties on Mast */}
      <path d="M7 13 C4 15, 2 17, 3 20" stroke={starColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M7 31 C4 33, 2 35, 3 38" stroke={starColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Star & Text inside Flag */}
      <text
        x="18"
        y="25.5"
        fill={textColor}
        fontSize="6.5"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        letterSpacing="0.8"
      >
        2026
      </text>
      <circle cx="34" cy="23" r="1.5" fill={starColor} />
    </svg>
  );
};

// Aliased for seamless backward compatibility if imported elsewhere
export const GraduationCapIcon = SchoolPennantIcon;

/**
 * 2. Active Student ID & Campus Pass Badge
 * Realistic photobooth sticker badge with lanyard clip slot, student photo silhouette, barcode, and active semester stamp.
 */
export const StudentIdBadgeIcon: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 46 }) => {
  const cardBg = isLight ? '#ffffff' : '#0d1829';
  const cardBorder = isLight ? '#8a6416' : '#d4af37';
  const headerBg = isLight ? '#0c1a30' : '#d4af37';
  const headerText = isLight ? '#f6eedb' : '#0a1424';
  const textColor = isLight ? '#0c1a30' : '#f6eedb';
  const barcodeColor = isLight ? '#1a2332' : '#d4af37';
  const photoBg = isLight ? '#ede6d6' : '#142338';
  const gold = isLight ? '#a37519' : '#e5c05b';

  const w = size;
  const h = Math.round(size * 1.35);

  return (
    <div
      className={`relative select-none transition-transform hover:scale-105 duration-200 ${className}`}
      style={{ width: w, height: h }}
      title="Student Campus Pass"
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 54 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Badge Card Container */}
        <rect
          x="1.5"
          y="1.5"
          width="51"
          height="71"
          rx="5"
          fill={cardBg}
          stroke={cardBorder}
          strokeWidth="1.5"
        />

        {/* Lanyard Hole Cutout Slot */}
        <rect x="21" y="4" width="12" height="3" rx="1.5" fill={cardBorder} opacity="0.4" />

        {/* Header Ribbon */}
        <rect x="2" y="9.5" width="50" height="13" fill={headerBg} />
        <text
          x="27"
          y="18.5"
          textAnchor="middle"
          fill={headerText}
          fontSize="5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="bold"
          letterSpacing="0.8"
        >
          STUDENT PASS
        </text>

        {/* Photo Box */}
        <rect
          x="6"
          y="26"
          width="18"
          height="21"
          rx="2"
          fill={photoBg}
          stroke={cardBorder}
          strokeWidth="0.8"
        />
        {/* Silhouette Head & Shoulders */}
        <circle cx="15" cy="33" r="3.6" fill={gold} opacity="0.85" />
        <path
          d="M9 44 C9 39.5, 12 38, 15 38 C18 38, 21 39.5, 21 44"
          fill={gold}
          opacity="0.85"
        />

        {/* Student Details Lines - Current School Year */}
        <text
          x="27"
          y="31"
          fill={textColor}
          fontSize="4"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
        >
          SY 2026–27
        </text>
        <text
          x="27"
          y="37"
          fill={gold}
          fontSize="3.6"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
        >
          GRADE 11
        </text>
        <text
          x="27"
          y="43"
          fill={textColor}
          fontSize="3.2"
          fontFamily="monospace"
          opacity="0.75"
        >
          HOMEROOM
        </text>

        {/* Active Campus Hologram Stamp */}
        <circle
          cx="44"
          cy="52"
          r="4.2"
          fill="none"
          stroke={gold}
          strokeWidth="0.9"
          strokeDasharray="1.5 1"
        />
        <text
          x="44"
          y="53.8"
          textAnchor="middle"
          fill={gold}
          fontSize="3.6"
          fontFamily="system-ui, sans-serif"
          fontWeight="bold"
        >
          PASS
        </text>

        {/* Barcode Strip */}
        <g fill={barcodeColor}>
          <rect x="6" y="52" width="1.2" height="12" />
          <rect x="8.5" y="52" width="2" height="12" />
          <rect x="12" y="52" width="0.9" height="12" />
          <rect x="14.2" y="52" width="1.8" height="12" />
          <rect x="17.2" y="52" width="2.4" height="12" />
          <rect x="21" y="52" width="1.1" height="12" />
          <rect x="23.2" y="52" width="1.9" height="12" />
          <rect x="26.5" y="52" width="1" height="12" />
          <rect x="29" y="52" width="2.2" height="12" />
          <rect x="32.5" y="52" width="1.4" height="12" />
          <rect x="35.5" y="52" width="1.8" height="12" />
        </g>
        <text
          x="22"
          y="69"
          textAnchor="middle"
          fill={textColor}
          fontSize="3.6"
          fontFamily="monospace"
          letterSpacing="1"
          opacity="0.8"
        >
          *2026-2027*
        </text>
      </svg>
    </div>
  );
};

/**
 * 3. Everyday School Supplies & Book Stack
 * Layered study textbooks, bookmarks, yellow drafting pencil, and a fresh red apple for the teacher.
 */
export const VintageBookStackIcon: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 42 }) => {
  const gold = isLight ? '#a37519' : '#e5c05b';
  const darkStroke = isLight ? '#0c1a30' : '#050a12';
  const paperEdge = isLight ? '#f4eedf' : '#142033';

  // Book 1 (Bottom): Deep Navy
  const book1Cover = isLight ? '#0c1a30' : '#0a1626';
  // Book 2 (Middle): Crimson Bordeaux
  const book2Cover = isLight ? '#7e1823' : '#881b27';
  // Book 3 (Top): Amber Gold
  const book3Cover = isLight ? '#916916' : '#c89d2d';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm select-none ${className}`}
      aria-label="School Textbooks & Pencil"
    >
      {/* Book 1 (Bottom, Math Textbook) */}
      <rect x="4" y="32" width="44" height="9.5" rx="2" fill={book1Cover} stroke={darkStroke} strokeWidth="1.2" />
      {/* Pages Edge */}
      <rect x="10" y="34" width="36" height="5.5" fill={paperEdge} />
      {/* Spine Details */}
      <rect x="4" y="32" width="7" height="9.5" rx="1.5" fill={book1Cover} stroke={gold} strokeWidth="0.8" />
      <line x1="6.5" y1="34" x2="6.5" y2="39.5" stroke={gold} strokeWidth="0.8" />

      {/* Book 2 (Middle, Literature Notebook) */}
      <rect x="7" y="21" width="39" height="9" rx="2" fill={book2Cover} stroke={darkStroke} strokeWidth="1.2" />
      {/* Pages Edge */}
      <rect x="13" y="23" width="31" height="5" fill={paperEdge} />
      {/* Spine Details */}
      <rect x="7" y="21" width="6.5" height="9" rx="1.5" fill={book2Cover} stroke={gold} strokeWidth="0.8" />
      <line x1="9.5" y1="23" x2="9.5" y2="28" stroke={gold} strokeWidth="0.8" />

      {/* Bookmark Ribbon hanging down from Book 2 */}
      <path
        d="M36 30 C36 33, 38 35, 37 42 L39 40 L41 42 C40 36, 40 33, 39 30 Z"
        fill={gold}
        stroke={darkStroke}
        strokeWidth="0.6"
      />

      {/* Book 3 (Top, Science Journal) */}
      <rect x="10" y="10" width="33" height="8.5" rx="1.8" fill={book3Cover} stroke={darkStroke} strokeWidth="1.2" />
      {/* Pages Edge */}
      <rect x="15" y="12" width="26" height="4.5" fill={paperEdge} />
      {/* Spine Details */}
      <rect x="10" y="10" width="6" height="8.5" rx="1.5" fill={book3Cover} stroke={gold} strokeWidth="0.8" />

      {/* Fresh Apple on top of books */}
      <circle cx="28" cy="6" r="3.2" fill={isLight ? '#991b1b' : '#b91c1c'} stroke={darkStroke} strokeWidth="0.8" />
      {/* Apple Leaf */}
      <path d="M28 3 C29 1.5, 31 1.8, 30.5 3 C30 4.2, 28.5 3.8, 28 3 Z" fill="#15803d" />

      {/* Yellow Student Pencil */}
      <g transform="rotate(-35 8 18)">
        <polygon points="6,15 10,15 8,11" fill="#f59e0b" stroke={darkStroke} strokeWidth="0.5" />
        <rect x="6" y="15" width="4" height="14" fill="#fbbf24" stroke={darkStroke} strokeWidth="0.5" />
        <rect x="6" y="29" width="4" height="2" fill="#d1d5db" stroke={darkStroke} strokeWidth="0.5" />
        <rect x="6" y="31" width="4" height="3" rx="0.5" fill="#f43f5e" stroke={darkStroke} strokeWidth="0.5" />
      </g>
    </svg>
  );
};

/**
 * 4. School Stationery & Hall Pass Badge (Crossed Ruler & Pencil)
 * Replaces graduation diploma scrolls with authentic everyday classroom stationery:
 * Wooden drafting ruler with centimeter ticks, classic yellow HB pencil, pink eraser, and center star.
 */
export const SchoolStationeryIcon: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 36 }) => {
  const rulerBg = isLight ? '#f2e6cb' : '#e6d4aa';
  const rulerStroke = isLight ? '#0c1a30' : '#050a12';
  const tickColor = isLight ? '#5a3d0b' : '#3d2806';
  const pencilYellow = '#fbbf24';
  const eraserPink = '#f43f5e';
  const gold = isLight ? '#8a6416' : '#d4af37';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xs select-none ${className}`}
      aria-label="Classroom Stationery & Ruler"
    >
      {/* 1. Wooden Ruler angled at 30 degrees */}
      <g transform="rotate(30 22 22)">
        <rect x="3" y="18" width="38" height="8" rx="1.5" fill={rulerBg} stroke={rulerStroke} strokeWidth="1" />
        {/* Centimeter / Inch Hash Marks */}
        {[6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 38].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={18}
            x2={x}
            y2={i % 2 === 0 ? 22.5 : 20.5}
            stroke={tickColor}
            strokeWidth="0.75"
          />
        ))}
      </g>

      {/* 2. Classic Yellow Pencil angled at -30 degrees */}
      <g transform="rotate(-30 22 22)">
        {/* Graphite tip */}
        <polygon points="20,4 24,4 22,1" fill="#1e293b" />
        <polygon points="19.5,9 24.5,9 22,4" fill="#fed7aa" stroke={rulerStroke} strokeWidth="0.6" />
        {/* Yellow hexagonal barrel */}
        <rect x="19.5" y="9" width="5" height="24" fill={pencilYellow} stroke={rulerStroke} strokeWidth="0.8" />
        <line x1="22" y1="9" x2="22" y2="33" stroke="#d97706" strokeWidth="0.6" />
        {/* Ferrule band */}
        <rect x="19.5" y="33" width="5" height="3" fill="#cbd5e1" stroke={rulerStroke} strokeWidth="0.8" />
        {/* Pink rubber eraser */}
        <rect x="19.5" y="36" width="5" height="4" rx="1" fill={eraserPink} stroke={rulerStroke} strokeWidth="0.8" />
      </g>

      {/* 3. Center Gold Star Emblem */}
      <circle cx="22" cy="22" r="5.5" fill={isLight ? '#0c1a30' : '#0a1628'} stroke={gold} strokeWidth="1.2" />
      <text
        x="22"
        y="22.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill={gold}
        fontSize="6.5"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        ★
      </text>
    </svg>
  );
};

// Aliased for seamless backward compatibility if imported elsewhere
export const DiplomaScrollIcon = SchoolStationeryIcon;

/**
 * 5. Campus Student Backpack
 * Everyday student life icon: classic canvas varsity backpack with top carry handle,
 * dual shoulder straps, front utility pocket, brass zipper pull, and gold star patch.
 */
export const CampusBackpackIcon: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 36 }) => {
  const packBg = isLight ? '#0c1a30' : '#0c1828';
  const packTrim = isLight ? '#8a6416' : '#d4af37';
  const pocketBg = isLight ? '#162844' : '#142236';
  const darkStroke = isLight ? '#060e1a' : '#040810';
  const gold = isLight ? '#a37519' : '#e5c05b';
  const zipper = isLight ? '#cbd5e1' : '#94a3b8';
  const leatherBase = isLight ? '#854d0e' : '#a16207';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xs select-none ${className}`}
      aria-label="Student Campus Backpack"
    >
      {/* Top Grab Handle */}
      <path
        d="M17 10 C17 5.5, 27 5.5, 27 10"
        stroke={gold}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shoulder Straps Peeking at Top */}
      <path d="M12 14 C10 11, 7.5 13, 8 18" stroke={packTrim} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M32 14 C34 11, 36.5 13, 36 18" stroke={packTrim} strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Main Backpack Body */}
      <path
        d="M13 16 C13 10, 16.5 8, 22 8 C27.5 8, 31 10, 31 16 L33 34 C33 37.5, 30.5 39, 22 39 C13.5 39, 11 37.5, 11 34 Z"
        fill={packBg}
        stroke={darkStroke}
        strokeWidth="1.2"
      />

      {/* Main Top Zipper Arc */}
      <path
        d="M14 16.5 C14 11.5, 17 9.5, 22 9.5 C27 9.5, 30 11.5, 30 16.5"
        stroke={zipper}
        strokeWidth="0.9"
        strokeDasharray="1.2 0.8"
        fill="none"
      />

      {/* Leather Contrast Bottom Panel */}
      <path
        d="M11.2 33 C11.2 36.5, 13.5 38.8, 22 38.8 C30.5 38.8, 32.8 36.5, 32.8 33 L33 34 C33 37.5, 30.5 39, 22 39 C13.5 39, 11 37.5, 11 34 Z"
        fill={leatherBase}
        stroke={darkStroke}
        strokeWidth="0.8"
      />

      {/* Front Utility Pocket */}
      <path
        d="M14 23 C14 21, 16.5 20, 22 20 C27.5 20, 30 21, 30 23 L30.5 33 C30.5 35.5, 28 36, 22 36 C16 36, 13.5 35.5, 13.5 33 Z"
        fill={pocketBg}
        stroke={packTrim}
        strokeWidth="1"
      />

      {/* Front Pocket Horizontal Zipper Track */}
      <line x1="16" y1="23" x2="28" y2="23" stroke={zipper} strokeWidth="1" strokeDasharray="1.5 0.8" />
      {/* Zipper Pull Tag */}
      <circle cx="25" cy="23" r="1.1" fill={gold} />
      <path d="M25 24 L25 26.5" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />

      {/* Varsity Star Patch on Front Pocket */}
      <rect x="18.5" y="26.5" width="7" height="6" rx="1.5" fill={packBg} stroke={gold} strokeWidth="0.8" />
      <polygon points="22,27.5 22.8,29.3 24.8,29.3 23.2,30.4 23.8,32.2 22,31 20.2,32.2 20.8,30.4 19.2,29.3 21.2,29.3" fill={gold} />

      {/* Side Mesh Pockets */}
      <path d="M10.5 25 C9.2 26, 9.2 31, 11 33" stroke={packTrim} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M33.5 25 C34.8 26, 34.8 31, 33 33" stroke={packTrim} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const SchoolBackpackIcon = CampusBackpackIcon;

/**
 * 5. Campus Shield & Star Crest Seal
 * Refined school insignia with laurel wreath, open notebook, and active school year emblem.
 */
export const AcademicCrestSeal: React.FC<SchoolIconProps> = ({ className = '', isLight = false, size = 36 }) => {
  const gold = isLight ? '#a37519' : '#d4af37';
  const navy = isLight ? '#0c1a30' : '#f6eedb';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Campus Life Crest"
    >
      {/* Outer Dotted Ring */}
      <circle cx="22" cy="22" r="20" stroke={gold} strokeWidth="1" strokeDasharray="2 1.5" opacity="0.6" />
      {/* Inner Ring */}
      <circle cx="22" cy="22" r="17" stroke={gold} strokeWidth="1.2" />

      {/* Laurel Leaves Left */}
      <path
        d="M14 26 C13 22, 14 17, 18 13 C18 15, 17 18, 17 21 C17 23, 15 25, 14 26 Z"
        fill={gold}
        opacity="0.85"
      />
      <path
        d="M12 21 C11 18, 12 14, 15 11 C15 13, 14 16, 14 18 C14 20, 13 21, 12 21 Z"
        fill={gold}
        opacity="0.7"
      />

      {/* Laurel Leaves Right */}
      <path
        d="M30 26 C31 22, 30 17, 26 13 C26 15, 27 18, 27 21 C27 23, 29 25, 30 26 Z"
        fill={gold}
        opacity="0.85"
      />
      <path
        d="M32 21 C33 18, 32 14, 29 11 C29 13, 30 16, 30 18 C30 20, 31 21, 32 21 Z"
        fill={gold}
        opacity="0.7"
      />

      {/* Center Open Notebook */}
      <path
        d="M17 22 C19 20.5, 21.5 21, 22 22 C22.5 21, 25 20.5, 27 22 V28 C25 26.5, 22.5 27, 22 28 C21.5 27, 19 26.5, 17 28 Z"
        fill={gold}
        opacity="0.9"
      />
      <line x1="22" y1="22" x2="22" y2="28" stroke={navy} strokeWidth="0.8" />

      {/* Top Academic Star */}
      <polygon points="22,8 23.2,11.5 27,11.5 24,13.8 25.2,17.2 22,15 18.8,17.2 20,13.8 17,11.5 20.8,11.5" fill={gold} />

      {/* Bottom Ribbon */}
      <text
        x="22"
        y="36"
        textAnchor="middle"
        fill={navy}
        fontSize="3.6"
        fontFamily="sans-serif"
        fontWeight="bold"
        letterSpacing="0.8"
      >
        CAMPUS
      </text>
    </svg>
  );
};

/**
 * 7. School Academic Laurel & Mortarboard Cap Footer Divider (🌿 🎓 🌿)
 * Classical collegiate laurel wreath garland flanking an academic graduation
 * mortarboard cap with golden tassel and stars, anchoring the photo strip footer.
 */
export const SchoolAcademicFooterIcon: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  isLight?: boolean;
}> = ({ className = '', width = 120, height = 18, isLight = false }) => {
  const gold = isLight ? '#8a6416' : '#d4af37';
  const goldBright = isLight ? '#a37519' : '#fde047';
  const goldDark = isLight ? '#5a3d0b' : '#b8860b';
  const capColor = isLight ? '#0c1a30' : '#0a1628';
  const capBorder = isLight ? '#8a6416' : '#d4af37';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-xs transition-transform hover:scale-105 duration-200 ${className}`}
      aria-label="School Academic Crest Divider"
    >
      <defs>
        <linearGradient id="schoolLaurelGold" x1="10" y1="9" x2="110" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gold} stopOpacity="0.25" />
          <stop offset="25%" stopColor={gold} />
          <stop offset="50%" stopColor={goldBright} />
          <stop offset="75%" stopColor={gold} />
          <stop offset="100%" stopColor={gold} stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Far Left Academic Star */}
      <polygon points="8,9 8.6,7.5 10,7.3 8.9,6.2 9.2,4.8 8,5.6 6.8,4.8 7.1,6.2 6,7.3 7.4,7.5" fill={gold} />

      {/* Left Laurel Garland Branch */}
      <path d="M12 9 C22 9, 34 7, 45 9" stroke={goldDark} strokeWidth="1" strokeLinecap="round" />
      {/* Pairs of Laurel Leaves Left */}
      <path d="M18 8.5 C16 6.5, 18 4.5, 20 6.5 C20.5 7.8, 19 8.5, 18 8.5 Z" fill={gold} opacity="0.85" />
      <path d="M23 10 C22 12, 24 13.2, 25 11.5 C25.5 10.5, 24.5 9.8, 23 10 Z" fill={goldBright} opacity="0.9" />
      <path d="M29 8.2 C27 6.2, 29 4.2, 31 6.2 C31.5 7.5, 30 8.2, 29 8.2 Z" fill={gold} opacity="0.85" />
      <path d="M34 10 C33 12, 35 13.2, 36 11.5 C36.5 10.5, 35.5 9.8, 34 10 Z" fill={goldBright} opacity="0.9" />
      <path d="M40 8 C38 6, 40 4, 42 6 C42.5 7.3, 41 8, 40 8 Z" fill={gold} opacity="0.85" />

      {/* Left Flanking Star near cap */}
      <polygon points="46,9 46.8,7.3 48.5,7 47.2,5.8 47.6,4.2 46,5.1 44.4,4.2 44.8,5.8 43.5,7 45.2,7.3" fill={goldBright} />

      {/* Center Academic Graduation Cap (Mortarboard) */}
      <polygon
        points="60,3.5 71,7.5 60,11.5 49,7.5"
        fill={capColor}
        stroke={capBorder}
        strokeWidth="0.8"
      />
      {/* Mortarboard Skull Base */}
      <path
        d="M53.5 9 V12 C53.5 13.8, 66.5 13.8, 66.5 12 V9"
        fill={capColor}
        stroke={capBorder}
        strokeWidth="0.7"
      />
      {/* Cap Center Button */}
      <circle cx="60" cy="7.5" r="1.1" fill={goldBright} />
      {/* Golden Draping Tassel */}
      <path
        d="M60 7.5 Q66 7.5, 68 10.5 Q69 12.5, 68.5 14.5"
        stroke={goldBright}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="68.5" cy="14.8" r="1" fill={goldBright} />

      {/* Right Flanking Star near cap */}
      <polygon points="74,9 74.8,7.3 76.5,7 75.2,5.8 75.6,4.2 74,5.1 72.4,4.2 72.8,5.8 71.5,7 73.2,7.3" fill={goldBright} />

      {/* Right Laurel Garland Branch */}
      <path d="M75 9 C86 7, 98 9, 108 9" stroke={goldDark} strokeWidth="1" strokeLinecap="round" />
      {/* Pairs of Laurel Leaves Right */}
      <path d="M80 8 C79 6, 81 4, 82 6 C82.5 7.3, 81 8, 80 8 Z" fill={gold} opacity="0.85" />
      <path d="M86 10 C85 12, 87 13.2, 88 11.5 C88.5 10.5, 87.5 9.8, 86 10 Z" fill={goldBright} opacity="0.9" />
      <path d="M91 8.2 C90 6.2, 92 4.2, 93 6.2 C93.5 7.5, 92 8.2, 91 8.2 Z" fill={gold} opacity="0.85" />
      <path d="M97 10 C96 12, 98 13.2, 99 11.5 C99.5 10.5, 98.5 9.8, 97 10 Z" fill={goldBright} opacity="0.9" />
      <path d="M102 8.5 C101 6.5, 103 4.5, 104 6.5 C104.5 7.8, 103 8.5, 102 8.5 Z" fill={gold} opacity="0.85" />

      {/* Far Right Academic Star */}
      <polygon points="112,9 112.6,7.5 114,7.3 112.9,6.2 113.2,4.8 112,5.6 110.8,4.8 111.1,6.2 110,7.3 111.4,7.5" fill={gold} />
    </svg>
  );
};

