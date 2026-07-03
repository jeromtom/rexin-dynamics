# Site Hardening Round

**Date:** 2026-07-04
**Status:** Proceeding under Jerom's "items 4 and 5" instruction (2026-07-04); scoping defaults chosen while he was away, flagged in Parked Decisions
**Scope:** Small technical debt round on `rexin-dynamics/`, branch `feat/site-hardening` stacked on `feat/geo-currency-globe`

## Goal

Clear the technical follow-ups logged by the motion-pass and geo reviews: cut the motion bundle overage with async LazyMotion feature loading, fix the pre-existing HeroFormation hydration warning, and normalize page.tsx formatting. Analytics ships as a documented dashboard action (no code). No visual or copy changes of any kind.

## Items

### 1. Async LazyMotion feature loading

Today `src/components/rx/RXMotion.tsx` statically imports `domAnimation`, so the full motion feature bundle ships in first-load JS (final review measured 172 kB vs 131 kB on main). Fix per motion's documented async pattern:

- New `src/lib/motion-features.ts`: `import { domAnimation } from "motion/react"; export default domAnimation;`
- `RXMotion.tsx`: `features={() => import("@/lib/motion-features").then((m) => m.default)}`, keeping `strict`.
- Acceptance: `npm run build` first-load JS for `/` drops measurably (expected roughly 15-20 kB); all motion effects (heading reveals, parallax, engage sequence, magnetic CTAs) still work in the browser after the feature bundle loads; content is never hidden while it loads (LazyMotion renders static-first by design).

### 2. HeroFormation hydration warning (diagnose, then fix)

A React hydration-mismatch warning traced to `HeroFormation` appears on every dev page load (pre-existing; observed repeatedly during both feature rounds). The component's initial state looks SSR-safe on reading, so the cause is NOT assumed in this spec. Implementation must:

1. Reproduce in the dev server and capture the exact console message and the DOM attribute/text it names.
2. Diagnose the root cause (candidates to rule in/out: the `rx-radar` conic-gradient div, browser-extension DOM injection, the `aspectRatio` style serialization, a parent in `page.tsx`).
3. Fix the root cause. `suppressHydrationWarning` is acceptable only if the mismatch is caused by something genuinely non-deterministic that cannot be made deterministic, and only on the narrowest element.
4. Acceptance: zero hydration warnings on dev load with default theme, dark theme, and reduced motion; hero renders identically before/after (screenshot comparison).

### 3. Prettier pass on page.tsx (formatting-only commit)

The RXMotion wrap left `page.tsx` with two indentation baselines (final review: opening-tag `>` misaligned, inner JSX not re-indented). Fix:

- Run `npx prettier --write src/app/page.tsx` (repo has no prettier config; use defaults with `--print-width 100` OFF — plain defaults — so future runs are reproducible).
- Commit MUST be formatting-only: `git diff -w feat/geo-currency-globe -- src/app/page.tsx` (ignoring whitespace) must be empty for this commit, verified before committing. Own commit, clearly labeled, so Jerom can skim it separately in his diff walkthrough.
- Acceptance: lint + build pass; no semantic diff.

### 4. Analytics: Cloudflare Web Analytics via dashboard (no code)

rexindynamics.com is proxied through Cloudflare (same-origin `/cdn-cgi/trace` works in production), so Cloudflare Web Analytics can be enabled with automatic beacon injection from the dashboard: free, cookieless, no consent banner, zero page-weight in the repo. Action for Jerom (documented here, not code):

1. Cloudflare dashboard (dev.jeromtom account) → Analytics & Logs → Web Analytics → Add site → rexindynamics.com → enable automatic setup.
2. Data appears in the same dashboard; no deploy needed.

If custom events (e.g. contact-form clicks) are wanted later, that becomes a code item with the manual beacon snippet; out of scope now.

## Parked decisions (awaiting Jerom)

- **Hero claims wording:** he stated Rexin has no clients yet; the hero claims "100+ projects shipped" and "50+ clients & partners". Options offered (keep as consolidated freelance track record / soften wording / remove stats row). NO copy change in this round.
- **Merging:** `feat/motion-pass-phase1` and `feat/geo-currency-globe` await his diff walkthrough; this round stacks on the geo branch rather than merging without him.
- **Particle hero (Phase 2)** and **blog**: separate future specs; hero next after this round per the original phased agreement, blog deferred.

## Error handling / testing

No new runtime surfaces beyond item 1's dynamic import, which motion handles internally (static-first render until features load; a failed chunk load leaves content visible without animation). Verification per item as listed, plus `npm run lint && npm run build` and a browser smoke pass (desktop, 375 px, reduced motion) at the end.

## Out of scope

Copy changes, new sections, particle hero, blog, custom analytics events, OG image redesign (existing og-image.jpg is live and serving).
