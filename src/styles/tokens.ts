// ZERØ MERIDIAN Design Tokens — all rgba(), zero hex codes

export const colors = {
  // Page canvas
  background: 'rgba(255, 255, 255, 1)',
  
  // Card/panel surfaces
  card: 'rgba(248, 249, 252, 1)',
  cardHover: 'rgba(241, 243, 249, 1)',
  modal: 'rgba(234, 237, 245, 1)',
  tooltip: 'rgba(226, 230, 242, 1)',
  
  // Accent (primary brand) — deep navy blue
  accent: 'rgba(15, 40, 180, 1)',
  accentDim: 'rgba(15, 40, 180, 0.08)',
  accentMid: 'rgba(15, 40, 180, 0.40)',
  accentGlow: 'rgba(15, 40, 180, 0.06)',
  
  // Positive/bullish — forest green
  positive: 'rgba(0, 160, 100, 1)',
  positiveDim: 'rgba(0, 160, 100, 0.08)',
  positiveMid: 'rgba(0, 160, 100, 0.40)',
  
  // Negative/bearish — crimson
  negative: 'rgba(210, 40, 80, 1)',
  negativeDim: 'rgba(210, 40, 80, 0.08)',
  negativeMid: 'rgba(210, 40, 80, 0.40)',
  
  // Warning/caution — dark amber
  warning: 'rgba(200, 130, 0, 1)',
  warningDim: 'rgba(200, 130, 0, 0.08)',
  warningMid: 'rgba(200, 130, 0, 0.40)',
  
  // Text hierarchy
  textPrimary: 'rgba(10, 14, 40, 1)',
  textSecondary: 'rgba(60, 70, 110, 1)',
  textMuted: 'rgba(120, 130, 165, 1)',
  textFaint: 'rgba(180, 188, 210, 1)',
  
  // Borders
  borderFaint: 'rgba(15, 40, 100, 0.06)',
  borderMuted: 'rgba(15, 40, 100, 0.10)',
  borderStrong: 'rgba(15, 40, 100, 0.18)',
  borderAccent: 'rgba(15, 40, 180, 0.40)',
  
  // Overlay
  backdrop: 'rgba(10, 14, 40, 0.5)',
} as const;

export const shadows = {
  card: '0 1px 4px rgba(15,40,100,0.08), 0 0 0 1px rgba(15,40,100,0.06)',
  elevated: '0 4px 16px rgba(15,40,100,0.10), 0 0 0 1px rgba(15,40,100,0.07)',
  float: '0 8px 32px rgba(15,40,100,0.12), 0 0 0 1px rgba(15,40,100,0.08)',
  focusRing: '0 0 0 3px rgba(15,40,180,0.15)',
  glowAccent: '0 0 20px rgba(15,40,180,0.12)',
  glowPositive: '0 0 20px rgba(0,160,100,0.12)',
  glowNegative: '0 0 20px rgba(210,40,80,0.12)',
  sidebar: '2px 0 8px rgba(15,40,100,0.06)',
} as const;

export const typography = {
  fontFamily: "'JetBrains Mono', monospace",
  tabularNums: { fontVariantNumeric: 'tabular-nums' } as React.CSSProperties,
} as const;

export const radii = {
  card: 12,
  button: 8,
  badge: 6,
  modal: 16,
} as const;

// Spring configs for framer-motion
export const springs = {
  fast: { type: 'spring' as const, stiffness: 500, damping: 30 },
  medium: { type: 'spring' as const, stiffness: 300, damping: 25 },
  soft: { type: 'spring' as const, stiffness: 200, damping: 20 },
} as const;

import React from 'react';
