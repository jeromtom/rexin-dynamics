# Site Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear three logged technical follow-ups: async LazyMotion feature loading, the HeroFormation hydration warning, and a formatting-only prettier pass on page.tsx. Spec: `docs/superpowers/specs/2026-07-04-site-hardening-design.md`.

**Architecture:** Three independent, small tasks on branch `feat/site-hardening` (stacked on `feat/geo-currency-globe`). No new dependencies, no visual or copy changes. Analytics is a documented dashboard action for Jerom, not code — no task for it.

**Tech Stack:** Next.js 15 static export, React 19, motion (already installed), prettier via npx.

## Global Constraints

- NO new npm dependencies (prettier runs via npx, not added to package.json).
- NO visual or copy changes; the site must render identically (except the hydration warning disappearing).
- No test runner exists and none may be added. Verification per task: `npm run lint && npm run build`, plus the browser checks named in the task. Dev server port may differ from 3000; kill it after use.
- Work on branch `feat/site-hardening` (already created).
- Commit message bodies end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: Async LazyMotion feature loading

**Files:**
- Create: `src/lib/motion-features.ts`
- Modify: `src/components/rx/RXMotion.tsx`

**Interfaces:**
- Consumes: existing `RXMotion` provider (wraps the homepage; `strict` mode).
- Produces: nothing new for other tasks.

- [ ] **Step 1: Record the baseline.** Run `npm run build` and note the reported First Load JS for route `/` (expect ~172 kB).

- [ ] **Step 2: Create the feature module**

```ts
// src/lib/motion-features.ts
import { domAnimation } from "motion/react";

/* Loaded async by RXMotion so the motion feature bundle stays out of
   first-load JS. Must be the default export (LazyMotion contract). */
export default domAnimation;
```

- [ ] **Step 3: Switch RXMotion to async features**

```tsx
// src/components/rx/RXMotion.tsx
"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/* domAnimation is loaded on demand (see src/lib/motion-features.ts);
   `strict` still guarantees only lightweight `m` components are used. */
export function RXMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={() => import("@/lib/motion-features").then((m) => m.default)} strict>
      {children}
    </LazyMotion>
  );
}
```

- [ ] **Step 4: Verify.** `npm run lint && npm run build` pass; First Load JS for `/` is lower than the Step 1 baseline (expected drop roughly 15-20 kB — record the exact numbers in your report). In the dev server: heading word reveals, motif parallax, engage-sequence pinning, and magnetic CTAs all still work after load; nothing flashes hidden while the feature chunk loads. Kill the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion-features.ts src/components/rx/RXMotion.tsx
git commit -m "Load motion features async to cut first-load JS"
```

---

### Task 2: HeroFormation hydration warning — diagnose and fix

**Files:**
- Modify: to be determined by diagnosis (expected: `src/components/rx/HeroFormation.tsx`, possibly `src/app/page.tsx`)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: nothing for other tasks.

This is a debugging task — use superpowers:systematic-debugging. Do NOT guess a fix.

- [ ] **Step 1: Reproduce.** `npm run dev`, open the site in the browser with the console open, capture the EXACT hydration warning text and which DOM node/attribute React names. Check with default theme, then dark, then reduced motion.

- [ ] **Step 2: Diagnose.** Identify the server-rendered value vs client value that differ. Candidates to rule in/out (do not assume): the `rx-radar` conic-gradient inline style serialization, `aspectRatio` style serialization, `Array.from` dot positions, something in the parent chain in `page.tsx`, or browser-extension DOM injection (test in an incognito/extension-free profile before blaming the code).

- [ ] **Step 3: Fix the root cause.** Make the server and client render the same thing. `suppressHydrationWarning` is allowed ONLY if the mismatch is genuinely non-deterministic and cannot be made deterministic, applied to the narrowest element, with a comment stating the cause. If diagnosis shows the warning comes from browser extensions and NOT the code, make no change and report that finding with evidence.

- [ ] **Step 4: Verify.** Zero hydration warnings on a fresh dev load in all three modes from Step 1; hero visually identical (screenshot before/after at 1440px). `npm run lint && npm run build` pass. Kill the dev server.

- [ ] **Step 5: Commit** (skip if Step 3 concluded no code change)

```bash
git add <files changed>
git commit -m "Fix HeroFormation hydration mismatch"
```

---

### Task 3: Prettier pass on page.tsx (formatting only)

**Files:**
- Modify: `src/app/page.tsx` (formatting only)

**Interfaces:** none.

- [ ] **Step 1: Format.** `npx prettier --write src/app/page.tsx` (no config file exists; plain prettier defaults).

- [ ] **Step 2: Prove it is formatting-only.** `git diff -w -- src/app/page.tsx` must output NOTHING (whitespace-ignoring diff empty). If it outputs anything, prettier changed semantics-adjacent text (e.g. string wrapping) — inspect and report DONE_WITH_CONCERNS rather than committing a semantic change.

- [ ] **Step 3: Verify.** `npm run lint && npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "Format page.tsx with prettier (no semantic changes)"
```

---

### Task 4: Verification pass

- [ ] **Step 1:** `npm run lint && npm run build` clean; record final First Load JS for `/`.
- [ ] **Step 2:** Browser smoke pass: desktop full-page scroll (all motion features work), 375 px (no overflow), reduced motion (static site), console clean of hydration warnings and of any NEW errors (known: sandboxed-WebGL noise from GlobeNetwork in headless browsers).
- [ ] **Step 3:** Push: `git push -u origin feat/site-hardening`. No PR, no merge — Jerom walks the diff.
