import React from 'react';
import { Orb } from 'react-ai-orb';
import type { OrbPalette } from 'react-ai-orb';

// Every "waiting" moment on the landing page uses this Orb instead of a plain spinner (founder ask,
// 29 Sept 2026). react-ai-orb was already added to package.json — this file is the one place its
// brand palette lives, so every use case (button, inline label, standalone panel) looks consistent.
//
// Built from the site's own Copper & Ink tokens (tailwind.config.js: ink #1C1917, copper #B4501A /
// hover #8F3F12), not one of the library's presets, so it doesn't clash with the rest of the page.
const COPPER_INK_PALETTE: OrbPalette = {
  mainBgStart: '#1C1917',
  mainBgEnd: '#3A2415',
  shadowColor1: 'rgba(180,80,26,0)',
  shadowColor2: 'rgba(180,80,26,0.35)',
  shadowColor3: 'rgba(180,80,26,0.65)',
  shadowColor4: 'rgba(143,63,18,0.85)',
  shapeAStart: '#B4501A',
  shapeAEnd: 'rgba(180,80,26,0)',
  shapeBStart: '#D97B4A',
  shapeBMiddle: '#B4501A',
  shapeBEnd: 'rgba(143,63,18,0)',
  shapeCStart: 'rgba(180,80,26,0.5)',
  shapeCMiddle: 'rgba(180,80,26,0.7)',
  shapeCEnd: 'rgba(180,80,26,1)',
  shapeDStart: 'rgba(28,25,23,0.5)',
  shapeDMiddle: 'rgba(143,63,18,0.7)',
  shapeDEnd: 'rgba(180,80,26,0.8)',
};

// The library's own `size` prop is a multiplier off an 82px base orb — this wrapper takes real
// pixels instead, so call sites (a 20px inline icon vs. a 140px standalone panel) don't need to
// know that detail. `shadow` is off by default: the library's drop shadow reads as a heavy dark
// halo at small inline sizes (next to button text); turn it on for a bigger, standalone use.
export const LoadingOrb = ({
  size = 24,
  shadow = false,
  className = '',
}: {
  size?: number;
  shadow?: boolean;
  className?: string;
}) => (
  <span className={`inline-flex shrink-0 items-center justify-center ${className}`} role="status" aria-label="Loading">
    <Orb palette={COPPER_INK_PALETTE} size={size / 82} noShadow={!shadow} animationSpeedBase={1.4} />
  </span>
);
