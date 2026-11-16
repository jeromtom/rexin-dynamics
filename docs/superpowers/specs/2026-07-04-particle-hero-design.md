# Particle Hero (Phase 2)

**Date:** 2026-07-04
**Status:** Approved by Jerom ("yes build it on another branch") based on the described concept
**Scope:** `src/components/rx/HeroFormation.tsx` + new `src/components/rx/ParticleField.tsx`, branch `feat/particle-hero` off main. Branch stays unmerged until Jerom reviews it live.

## Concept

Replace the 36 HTML dots inside the hero's HUD panel with a WebGL particle swarm (a few thousand glowing orange particles) that assembles into formations, dissolves and re-forms on formation change, and scatters away from the cursor. Everything around it stays: corner brackets, SYSTEMS // FORMATION and RTK labels, radar sweep, formation chips, telemetry readout, auto-cycle behavior.

## Design

### Formations (5, in auto-cycle order)

`drone` (new, default) → `ring` → `grid` → `arrow` → `wave`. A "Drone" chip is added before the existing four. The drone formation is a top-down quadcopter silhouette: center body cluster, four diagonal arms, four rotor rings at the arm tips. Ring/grid/arrow/wave echo the current 2D layouts, re-expressed as 3D point targets with slight depth jitter.

### Particle engine (`ParticleField.tsx`)

- three.js imported dynamically inside `useEffect` (the repo already ships three for globe.gl; dynamic import keeps it out of first-load JS, same pattern as GlobeNetwork).
- `THREE.Points` + additive-blended soft round sprite (radial-gradient `CanvasTexture`), brand orange (#FB6A2E core, #E84808 falloff), transparent, no depth write.
- Particle count: 2800 desktop, 1400 when viewport ≤ 820px.
- Morphing: each particle eases toward its formation target (`pos += (target - pos) * k` with per-particle stagger and a small time-based drift so the swarm never looks frozen).
- Cursor interaction (mouse only): pointer position raycast onto the swarm plane; particles within a radius are pushed away and spring back when the cursor leaves.
- Lifecycle: renderer paused when the panel is offscreen (IntersectionObserver) or the tab is hidden; DPR capped at 1.5; full disposal on unmount (geometry, material, texture, renderer).

### Interface

`ParticleField({ formation, onFail })` — `formation` is the same union HeroFormation already uses plus `"drone"`; `onFail()` is called if WebGL context creation or the three import throws, letting the parent fall back.

### Fallbacks (must-keep)

- `prefers-reduced-motion`: ParticleField is never mounted; HeroFormation renders today's static HTML dots (existing behavior).
- WebGL/import failure (`onFail`): HeroFormation falls back to the current animated HTML dots exactly as they are today, including the drone chip mapping to `ring` in that mode (the HTML `pos()` has no drone layout; falling back to ring is acceptable).
- No copy changes; telemetry and chips keep their behavior (auto-cycle stops on user pick, as today).

## Acceptance

- Desktop: particles form the drone silhouette on load, morph smoothly between all five formations (auto-cycle and chip clicks), scatter from the cursor and recover; ~60fps on a typical laptop (no visible jank while scrolling the rest of the page).
- 375px: reduced count, still smooth, no horizontal overflow, touch does not scatter (mouse-only).
- Reduced motion: identical to today's static hero.
- `npm run lint && npm run build` pass; first-load JS for `/` unchanged (three stays dynamically imported).
- Branch pushed; NOT merged; Jerom reviews on the dev server.

## Out of scope

Sound, gyroscope/tilt input, replacing the globe, any other hero copy/layout changes.
