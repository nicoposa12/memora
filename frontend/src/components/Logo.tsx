import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'badge' | 'glyph';
}

/**
 * Memora Minimalist Humanized Logo
 * Combines a photobooth camera silhouette, candid flash star, and a joyful wink & smile.
 */
export function Logo({ className = "w-7 h-7", size, variant = 'badge' }: LogoProps) {
  if (variant === 'glyph') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        {/* Shutter Button */}
        <rect x="29" y="19" width="13" height="4.5" rx="2.25" fill="currentColor" />

        {/* Flash Sparkle */}
        <path
          d="M 72 26 Q 72 32 78 32 Q 72 32 72 38 Q 72 32 66 32 Q 72 32 72 26 Z"
          fill="currentColor"
        />

        {/* Camera Viewfinder */}
        <rect
          x="18"
          y="26"
          width="64"
          height="50"
          rx="15"
          stroke="currentColor"
          strokeWidth="5.5"
        />

        {/* Left Eye: Camera Lens */}
        <circle cx="40" cy="46" r="9" stroke="currentColor" strokeWidth="5" />
        <circle cx="42.5" cy="43.5" r="2.5" fill="currentColor" />

        {/* Right Eye: Candid Photobooth Wink */}
        <path
          d="M 57 47 Q 64 39 71 47"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Joyful Smile Arc */}
        <path
          d="M 34 61 Q 50 72 66 61"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="memoraBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4623a" />
          <stop offset="100%" stopColor="#e44317" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Badge in Signature Memora Coral */}
      <rect width="100" height="100" rx="28" fill="url(#memoraBadgeGrad)" />

      {/* Shutter Button */}
      <rect x="29" y="19" width="13" height="4.5" rx="2.25" fill="#fffdf7" />

      {/* Photobooth Flash Sparkle */}
      <path
        d="M 72 26 Q 72 32 78 32 Q 72 32 72 38 Q 72 32 66 32 Q 72 32 72 26 Z"
        fill="#fffdf7"
      />

      {/* Camera Body / Viewfinder */}
      <rect
        x="18"
        y="26"
        width="64"
        height="50"
        rx="15"
        stroke="#fffdf7"
        strokeWidth="5"
      />

      {/* Left Eye: Camera Lens with Catchlight */}
      <circle cx="40" cy="46" r="9" stroke="#fffdf7" strokeWidth="4.5" />
      <circle cx="42.5" cy="43.5" r="2.5" fill="#fffdf7" />

      {/* Right Eye: Joyful Candid Photobooth Wink */}
      <path
        d="M 57 47 Q 64 39 71 47"
        stroke="#fffdf7"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Warm Human Smile */}
      <path
        d="M 34 61 Q 50 72 66 61"
        stroke="#fffdf7"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
