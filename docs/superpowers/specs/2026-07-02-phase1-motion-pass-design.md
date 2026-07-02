# Phase 1: Sitewide Motion and Micro-interactions

**Date:** 2026-07-02
**Status:** Approved by Jerom (design review in Claude Code session)
**Scope:** rexindynamics.com homepage (`src/app/page.tsx`) presentation layer only

## Goal

Give the whole homepage a stronger sense of craft and motion ("wow factor") between the hero and the footer, without changing copy, layout structure, or the existing design language (orange accent, mono labels, night sections). This is Phase 1 of a two-phase plan; Phase 2 (a WebGL particle hero) is sketched at the end and designed in detail later.

## Constraints and ground rules

1. **One new dependency:** `motion` (imported from `motion/react`), loaded via `LazyMotion` with selective feature imports. Target cost: roughly 15-25 KB gzipped.
2. **Reduced motion:** every new effect checks `useReducedMotion` (or the existing media-query pattern) and falls back to the current static rendering.
3. **Static export unchanged:** all new work is client-side. No changes to `next.config.ts`, Wrangler, or the build pipeline.
4. **Existing systems stay:** the `.rx-rise` IntersectionObserver fade-up system remains for simple reveals. New components replace it only where scroll-linking is genuinely needed.
5. **Diff discipline:** roughly one new file per component in `src/components/rx/`, plus targeted edits in `page.tsx` and `globals.css`. No deletions of existing components.

## Components

### 1. `SplitHeading` (`src/components/rx/SplitHeading.tsx`)

Wraps section h2 text and reveals it line by line (slight rise, blur-out) when scrolled into view. Applied to the About, Services, Process, Global, Team, Backed, FAQ, and Contact headings. Falls back to plain static text under reduced motion or before JS mounts (SSR-safe: server output is the plain heading; the split happens on mount).

### 2. `CountUp` (`src/components/rx/CountUp.tsx`)

Numeric stats count up from zero when they enter the viewport, then stay. Used for the hero stats 100+, 50+, and 5+. The "24/7" stat stays static (not a single number). Builds on the existing `Stat` primitive rather than replacing it.

### 3. `ParallaxMotif` (`src/components/rx/ParallaxMotif.tsx`)

Wraps the orange motif-lines image and translates it vertically at a slower rate than scroll (scroll-linked via `useScroll` + `useTransform`). Used in: the About image card, the Global section background, the Contact section background, and the footer. Replaces the static/`rx-drift` placements in those spots; the hero keeps its current drift.

### 4. `GlowCard` (`src/components/rx/GlowCard.tsx`)

Cursor-tracking border glow plus a subtle 3D tilt on hover. Hand-rolled (pointer events writing CSS custom properties; no library). Applied to the seven service cards and the two team cards. Touch devices get no tilt and no glow (pointer: fine media check).

### 5. `EngageSequence` (`src/components/rx/EngageSequence.tsx`)

The "How we engage" four-step grid becomes a sticky scroll sequence on desktop: the block pins in the viewport and the steps light up one at a time as the visitor scrolls through the pinned range. Inactive steps dim; the active step gets the orange index treatment and a progress line advances 01 through 04. On mobile (and under reduced motion) it renders the current static grid unchanged.

This is the boldest change in Phase 1. If pinning feels wrong in practice, the agreed fallback is a simpler highlight-on-scroll without pinning.

### 6. `Magnetic` (`src/components/rx/Magnetic.tsx`)

Wrapper that makes primary CTAs ("Get in touch" in hero and header, "Start your sprint") gently translate toward the cursor within a small radius and spring back on leave. Desktop pointer only.

### 7. FAQ polish (edits in `page.tsx` + `globals.css`)

Animate `details` open/close height and rotate a chevron on the summary row. Keeps the semantic `details`/`summary` markup (the FAQ JSON-LD and SEO behaviour are untouched).

## What deliberately does not change

Hero layout and copy, `HeroFormation`, `GlobeNetwork`, `SprintTimeline`, the header, all section copy, and all legal pages. Phase 1 is presentation only.

## Error handling

No network or data concerns; the failure mode is purely visual. Guards:

- Reduced-motion fallback in every component.
- SSR-safe: effects attach in `useEffect` or motion hooks; server HTML equals the current static content.
- If `motion` fails to hydrate for any reason, content is still visible (no opacity-0 initial states on server-rendered markup; initial hidden states are applied only after mount, matching the existing `rx-js` class pattern).

## Testing and verification

- `npm run lint && npm run build` pass.
- Manual pass in the dev server at desktop width and 375 px.
- Manual pass with macOS "Reduce Motion" enabled: page reads identically to today.
- Diff walkthrough with Jerom before merge (his standing preference).

## Phase 2 sketch (separate PR, not in scope here)

Reuse the already-shipped `three` dependency to build a `ParticleHero`: a few thousand particles forming a drone silhouette that disperses and reforms on formation change and reacts to the cursor. It would replace `HeroFormation`'s dot grid while keeping the formation chips and telemetry readout. To be designed in detail after Phase 1 ships and the new motion has been reviewed live.
