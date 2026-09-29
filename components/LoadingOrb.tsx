import React from 'react';
import { ThinkingOrb } from 'thinking-orbs';

// Every "waiting" moment on the landing page uses this Orb instead of a plain spinner (founder ask,
// 29 Sept 2026). Switched 1 Oct from react-ai-orb to thinking-orbs (github.com/Jakubantalik/thinking-orbs):
// the first library's coloured gradient blob visually competed with the site's own copper CTAs.
// thinking-orbs is strictly monochrome (light dots on dark, dark dots on light) by design, so it never
// clashes with whatever colour it's sitting on — it just needs telling which one it's on, since its
// own "auto" theme detection reads the PAGE's light/dark mode, not the background of the one button
// or panel it happens to be placed on.
//
// `onDark`: true when the Orb sits on a dark/saturated background (a copper or green button) and
// needs light dots to read against it; false (default) for a plain white/paper card, which wants
// dark ink dots. `state` picks one of the library's 9 named animations — see thinking-orbs' README
// for the full list; chosen per call site to loosely match what's actually happening.
export const LoadingOrb = ({
  size = 20,
  onDark = false,
  state = 'working',
  className = '',
}: {
  size?: number;
  onDark?: boolean;
  state?: 'working' | 'searching' | 'solving' | 'listening' | 'connecting' | 'weaving' | 'composing' | 'breathing' | 'shaping';
  className?: string;
}) => (
  <ThinkingOrb state={state} size={size} theme={onDark ? 'dark' : 'light'} className={className} />
);
