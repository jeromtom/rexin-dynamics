# Phase 1 Sitewide Motion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll-linked motion and micro-interactions across the rexindynamics.com homepage per the approved spec at `docs/superpowers/specs/2026-07-02-phase1-motion-pass-design.md`.

**Architecture:** One new dependency (`motion`), loaded through a `LazyMotion` provider that wraps the homepage. Six small client components in `src/components/rx/` plus CSS additions in `globals.css`. `src/app/page.tsx` is edited to use them. Server HTML stays equal to today's static content; all effects attach after mount.

**Tech Stack:** Next.js 15 (static export), React 19, TypeScript, `motion` (motion/react), hand-rolled CSS in `src/app/globals.css`.

## Global Constraints

- Exactly ONE new dependency: `motion`. Nothing else gets installed.
- Every animated component must fall back to static rendering under `prefers-reduced-motion: reduce` (use `useReducedMotion` from `motion/react`, or a CSS `@media` gate for CSS-only effects).
- SSR-safe: no `opacity: 0` or hidden state in server-rendered markup. Hidden initial states are applied only after mount or via `whileInView`/`animate` on client-split content.
- Do not modify: `next.config.ts`, `wrangler.jsonc`, `HeroFormation.tsx`, `GlobeNetwork.tsx`, `SprintTimeline.tsx`, any file under `src/app/privacy|terms|refund-cancellation|return|shipping|bank-details`, any copy/text content.
- The existing `.rx-rise` IntersectionObserver system in `page.tsx` stays untouched.
- Design tokens only: colors come from `--rx-*` CSS variables (accent is `var(--rx-accent)`, orange glow rgba is `rgba(232,72,8,…)` as used elsewhere in `globals.css`).
- **This repo has no test runner** (no `test` script in `package.json`). The verification cycle for every task is: `npm run lint && npm run build` must pass, plus a manual visual check in `npm run dev` (http://localhost:3000). Do not add a test framework.
- Work on branch `feat/motion-pass-phase1` (already created). Commit after every task.
- All commits end with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

## Codebase orientation (read once before starting)

- `src/app/page.tsx` is the entire homepage, one file, inline styles + `rx-*` utility classes.
- `src/app/globals.css` holds the design system. Ambient animations live inside `@media (prefers-reduced-motion: no-preference)` at lines 364-380. New CSS goes after the FAQ block at the end of the file.
- `src/components/rx/primitives.tsx` exports `RXButton`, `Eyebrow`, `Badge`, `Stat`. **`Stat` already counts up on scroll** (spec section "CountUp" is satisfied by it; Task 8 only verifies this).
- Breakpoint helpers: `.rx-stack`, `.rx-stack-2`, `.rx-hide-sm`, `.rx-show-sm` switch at `max-width: 820px`.

---

### Task 1: Install `motion` and add the LazyMotion provider

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/components/rx/RXMotion.tsx`
- Modify: `src/app/page.tsx` (imports at top; wrap the root div, currently lines 212-221)

**Interfaces:**
- Produces: `RXMotion({ children })` provider component. All later tasks import `m`, hooks from `"motion/react"` and rely on this provider being an ancestor. Because the provider uses `strict`, later tasks MUST use `m.div`/`m.span`/`m.img`, never `motion.div`.

- [ ] **Step 1: Install the dependency**

Run: `npm install motion`
Expected: `package.json` gains `"motion": "^12.x"` in dependencies, install succeeds.

- [ ] **Step 2: Create the provider**

```tsx
// src/components/rx/RXMotion.tsx
"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/* Loads motion's dom-animation feature bundle lazily; `strict` guarantees
   only the lightweight `m` components are used site-wide. */
export function RXMotion({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
```

- [ ] **Step 3: Wrap the homepage**

In `src/app/page.tsx`, add to the imports:

```tsx
import { RXMotion } from "@/components/rx/RXMotion";
```

Wrap the returned root element (`<div className="rx-root" …>` through its closing `</div>`) so the component returns:

```tsx
return (
  <RXMotion>
    <div
      className="rx-root"
      ...unchanged...
    </div>
  </RXMotion>
);
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: both pass. Then `npm run dev`, load http://localhost:3000, page renders identically to before.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/rx/RXMotion.tsx src/app/page.tsx
git commit -m "Add motion dependency behind a LazyMotion provider"
```

---

### Task 2: SplitHeading word-reveal for section headings

**Files:**
- Create: `src/components/rx/SplitHeading.tsx`
- Modify: `src/app/page.tsx` (the eight section `<h2 className="rx-h2">` headings: About ~line 369, Services ~398, Process ~471, Global ~515, Team ~584, Backed ~625, FAQ ~663, Contact ~702)

**Interfaces:**
- Consumes: `RXMotion` provider from Task 1 (uses `m.span`).
- Produces: `SplitHeading({ children: string, className?, style? })` rendering an `<h2>`. Later tasks do not depend on it.

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/SplitHeading.tsx
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

/* Section heading that reveals word by word (rise + deblur) when scrolled
   into view. Server output and the reduced-motion path are a plain <h2>,
   so SEO text and no-JS rendering are unchanged. */
export function SplitHeading({
  children,
  className = "rx-h2",
  style,
}: {
  children: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => setMounted(true), []);

  if (!mounted || reduce) {
    return (
      <h2 ref={ref} className={className} style={style}>
        {children}
      </h2>
    );
  }

  const words = children.split(" ");
  return (
    <h2 ref={ref} className={className} style={style} aria-label={children}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <m.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
            animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.5, delay: i * 0.045, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {w}
          </m.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
```

- [ ] **Step 2: Apply to the section headings in `page.tsx`**

Add the import:

```tsx
import { SplitHeading } from "@/components/rx/SplitHeading";
```

Replace each of these (exact current strings, all currently `<h2 className="rx-h2">…</h2>`):

```tsx
<SplitHeading>We ship AI for the world. We fund robotics for the future.</SplitHeading>
<SplitHeading>Two engines, one company.</SplitHeading>
<SplitHeading>From first call to production.</SplitHeading>
<SplitHeading>Built for international business.</SplitHeading>
<SplitHeading>People behind the systems</SplitHeading>
<SplitHeading>In good company.</SplitHeading>
<SplitHeading>Questions, answered.</SplitHeading>
```

The Contact heading keeps its white color via the style prop:

```tsx
<SplitHeading style={{ color: "#fff" }}>Ready when you are.</SplitHeading>
```

Do NOT touch the `<h1>` in the hero.

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`, then in `npm run dev`: scroll the page; each heading reveals word by word once, headings read normally afterwards. With macOS Reduce Motion on, headings are plain static text.

- [ ] **Step 4: Commit**

```bash
git add src/components/rx/SplitHeading.tsx src/app/page.tsx
git commit -m "Reveal section headings word by word on scroll"
```

---

### Task 3: ParallaxMotif scroll-linked background depth

**Files:**
- Create: `src/components/rx/ParallaxMotif.tsx`
- Modify: `src/app/page.tsx` (four motif `<img>` placements: About image card ~line 384, Global section ~510, Contact section ~697, footer ~776). The hero motif (~line 317) and the MVP card motif (~line 488) are NOT changed.

**Interfaces:**
- Consumes: `RXMotion` provider (uses `m.img`).
- Produces: `ParallaxMotif({ strength?, style?, className? })`, drop-in replacement for the decorative motif `<img>` elements.

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/ParallaxMotif.tsx
"use client";

import { useRef, type CSSProperties } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";

/* Decorative motif image that drifts vertically at a slower rate than
   scroll, giving sections depth. Purely presentational (alt="", aria-hidden). */
export function ParallaxMotif({
  strength = 60,
  style,
  className,
}: {
  strength?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <m.img
      ref={ref}
      src="/assets/motif/motif_lines_orange.svg"
      alt=""
      aria-hidden
      className={className}
      style={{ ...style, y: reduce ? 0 : y }}
    />
  );
}
```

- [ ] **Step 2: Apply in `page.tsx`**

Add the import:

```tsx
import { ParallaxMotif } from "@/components/rx/ParallaxMotif";
```

Replace these four `<img src="/assets/motif/motif_lines_orange.svg" …>` elements (each preceded by an eslint-disable comment that should be removed along with the img, since `ParallaxMotif` contains the img internally):

About image card (was `className="rx-drift"`; parallax replaces the drift here per spec):

```tsx
<ParallaxMotif strength={36} style={{ position: "absolute", inset: "-10% -4% auto -4%", width: "108%", opacity: 0.85 }} />
```

Global section background:

```tsx
<ParallaxMotif strength={80} style={{ position: "absolute", inset: "-20% 0 auto 0", width: "100%", opacity: 0.1, pointerEvents: "none" }} />
```

Contact section background:

```tsx
<ParallaxMotif strength={80} style={{ position: "absolute", inset: "auto 0 -30% 0", width: "100%", opacity: 0.16, pointerEvents: "none" }} />
```

Footer:

```tsx
<ParallaxMotif strength={50} style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0.28, pointerEvents: "none" }} />
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`, then in dev: scrolling past About/Global/Contact/footer, the orange lines drift slower than the page (visible depth). Reduce Motion: lines are static. Hero motif still uses its old drift.

- [ ] **Step 4: Commit**

```bash
git add src/components/rx/ParallaxMotif.tsx src/app/page.tsx
git commit -m "Add scroll parallax to section motif backgrounds"
```

---

### Task 4: GlowCard cursor-tracking glow and tilt

**Files:**
- Create: `src/components/rx/GlowCard.tsx`
- Modify: `src/app/globals.css` (append after the FAQ block; also edit `.rx-service-card:hover` at lines 512-516)
- Modify: `src/app/page.tsx` (7 service cards in the two `.map()` loops ~lines 420-431 and 450-461; 2 team cards ~line 591)

**Interfaces:**
- Consumes: nothing from other tasks (hand-rolled, no motion import).
- Produces: `GlowCard({ children, className?, style?, tilt? })` rendering a single `<div className={"rx-glow-card " + className}>`. It REPLACES the card's outer `<div>` (do not nest a new div inside; grid layouts depend on the card being the direct grid child).

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/GlowCard.tsx
"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/* Card wrapper with a cursor-tracking border glow and a subtle 3D tilt.
   Mouse pointers only; touch and pen get the plain card. Reduced motion
   is handled in CSS (.rx-glow-card rules). */
export function GlowCard({
  children,
  className = "",
  style,
  tilt = 2.5,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    ref.current?.classList.add("rx-glow-on");
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
    el.style.setProperty("--tilt-x", `${(y / r.height - 0.5) * -2 * tilt}deg`);
    el.style.setProperty("--tilt-y", `${(x / r.width - 0.5) * 2 * tilt}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("rx-glow-on");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`rx-glow-card ${className}`.trim()}
      style={style}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Add the CSS**

Append to `src/app/globals.css`:

```css
/* Glow cards (cursor-tracking glow + tilt; Task 4 of motion pass) */
.rx-glow-card {
  position: relative;
  transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 0.18s ease;
}
.rx-glow-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    320px circle at var(--gx, 50%) var(--gy, 50%),
    rgba(232, 72, 8, 0.14),
    transparent 65%
  );
  transition: opacity 0.25s ease;
}
.rx-glow-card.rx-glow-on::after { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .rx-glow-card { transform: none !important; }
  .rx-glow-card::after { display: none; }
}
```

Also in `globals.css`, edit `.rx-service-card:hover` (currently lines 512-516): remove the `transform: translateY(-2px);` line (the tilt replaces the lift; keep the background and box-shadow lines).

- [ ] **Step 3: Apply in `page.tsx`**

Add the import:

```tsx
import { GlowCard } from "@/components/rx/GlowCard";
```

In BOTH service card loops (`aiServices.map` and `airServices.map`), replace the outer element:

```tsx
{aiServices.map((card) => (
  <GlowCard key={card.title} className="rx-service-card">
    ...existing inner content unchanged...
  </GlowCard>
))}
```

(and identically for `airServices.map`.)

For the two team cards, replace the outer `<div key={m.name} className="rx-rise rx-team-card" style={{…}}>` with `<GlowCard key={m.name} className="rx-rise rx-team-card" style={{…same style object…}}>` and the matching closing tag. The `style` prop carries over verbatim.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`, then in dev: hovering a service or team card shows an orange glow following the cursor and a slight tilt; the card grid hairline layout (1px gaps) is unchanged; in responsive mode with touch emulation there is no glow/tilt. Reduce Motion: flat cards.

- [ ] **Step 5: Commit**

```bash
git add src/components/rx/GlowCard.tsx src/app/globals.css src/app/page.tsx
git commit -m "Add cursor glow and tilt to service and team cards"
```

---

### Task 5: EngageSequence sticky scroll for "How we engage"

**Files:**
- Create: `src/components/rx/EngageSequence.tsx`
- Modify: `src/app/page.tsx` (the four-step grid inside `#process`, currently the `<div className="rx-rise rx-stack" …>` at lines 476-484 wrapping `engageSteps.map`)

**Interfaces:**
- Consumes: `RXMotion` provider (uses `m.div`); `engageSteps` array from `page.tsx` (shape `{ n: string; title: string; body: string }`).
- Produces: `EngageSequence({ steps })`. The MVP card below it is unaffected.

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/EngageSequence.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, type MotionValue } from "motion/react";

type Step = { n: string; title: string; body: string };

/* Desktop: the four engagement steps pin in the viewport and light up one
   at a time while the visitor scrolls through a 220vh range, with a progress
   line underneath. Mobile and reduced-motion: the plain static grid (same
   markup as before this component existed). */
export function EngageSequence({ steps }: { steps: Step[] }) {
  const [desktop, setDesktop] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 821px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        setActive(Math.min(steps.length - 1, Math.floor(v * steps.length)));
      }),
    [scrollYProgress, steps.length],
  );

  const grid = (highlight: number | null) => (
    <div
      className="rx-stack"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 1,
        background: "var(--rx-border)",
        border: "1px solid var(--rx-border)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {steps.map((s, i) => {
        const on = highlight === null || i === highlight;
        return (
          <div
            key={s.n}
            style={{
              background: "var(--rx-surface)",
              padding: "26px 24px",
              opacity: on ? 1 : 0.45,
              transition: "opacity 0.35s ease",
            }}
          >
            <div
              className="rx-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                color: on ? "var(--rx-accent)" : "var(--rx-text-muted)",
                marginBottom: 12,
                transition: "color 0.35s ease",
              }}
            >
              {s.n}
            </div>
            <h3 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 700, fontSize: 18, margin: "0 0 8px", letterSpacing: "-0.01em", color: "var(--rx-text)" }}>
              {s.title}
            </h3>
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--rx-text-muted)", lineHeight: 1.6 }}>{s.body}</p>
          </div>
        );
      })}
    </div>
  );

  /* ref is attached in both branches so useScroll always has its target */
  if (!desktop || reduce) return <div ref={ref}>{grid(null)}</div>;

  return (
    <div ref={ref} style={{ height: "220vh" }}>
      <div style={{ position: "sticky", top: 140 }}>
        {grid(active)}
        <Progress value={scrollYProgress} />
      </div>
    </div>
  );
}

function Progress({ value }: { value: MotionValue<number> }) {
  return (
    <div style={{ height: 2, background: "var(--rx-border)", borderRadius: 999, marginTop: 14, overflow: "hidden" }}>
      <m.div style={{ height: "100%", background: "var(--rx-accent)", transformOrigin: "0 50%", scaleX: value }} />
    </div>
  );
}
```

- [ ] **Step 2: Apply in `page.tsx`**

Add the import:

```tsx
import { EngageSequence } from "@/components/rx/EngageSequence";
```

Replace the whole step-grid block (the `<div className="rx-rise rx-stack" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", … }}>` containing `engageSteps.map(…)`, and its closing `</div>`) with:

```tsx
<div className="rx-rise">
  <EngageSequence steps={engageSteps} />
</div>
```

The `engageSteps` constant stays where it is at the top of `page.tsx`. The MVP card `<div className="rx-rise rx-night rx-mvp-card" …>` below is untouched.

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`, then in dev at desktop width: scrolling into "How we engage" pins the grid; steps 01-04 light up in order while the others dim; the orange progress line fills; after the range, the page continues to the MVP card. At 375 px: plain static 1-column grid, no pinning. Reduce Motion: static grid at all widths.

- [ ] **Step 4: Commit**

```bash
git add src/components/rx/EngageSequence.tsx src/app/page.tsx
git commit -m "Pin the engagement steps and light them up on scroll"
```

---

### Task 6: Magnetic primary CTAs

**Files:**
- Create: `src/components/rx/Magnetic.tsx`
- Modify: `src/app/page.tsx` (hero "Get in touch" ~line 344, MVP card "Start your sprint" ~line 501, header desktop "Get in touch" ~line 263)

**Interfaces:**
- Consumes: `RXMotion` provider (uses `m.div`, `useSpring`).
- Produces: `Magnetic({ children })`, an inline-block wrapper around a single `RXButton`.

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/Magnetic.tsx
"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useReducedMotion, useSpring } from "motion/react";

/* Wrapper that lets a CTA drift a few pixels toward the mouse cursor and
   spring back on leave. Mouse only; inert for touch and reduced motion. */
export function Magnetic({ children, pull = 0.24 }: { children: ReactNode; pull?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 320, damping: 22 });
  const y = useSpring(0, { stiffness: 320, damping: 22 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * pull);
    y.set((e.clientY - (r.top + r.height / 2)) * pull);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      style={{ display: "inline-block", x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  );
}
```

- [ ] **Step 2: Apply in `page.tsx`**

Add the import:

```tsx
import { Magnetic } from "@/components/rx/Magnetic";
```

Wrap exactly these three buttons (leave every other button alone):

Hero:

```tsx
<Magnetic><RXButton variant="solid" size="lg" href="#contact">Get in touch</RXButton></Magnetic>
```

MVP card:

```tsx
<Magnetic><RXButton variant="solid" size="lg" href="#contact" style={{ marginTop: 6 }}>Start your sprint</RXButton></Magnetic>
```

Header (keep the responsive class on the button itself):

```tsx
<Magnetic><RXButton variant="solid" size="sm" href="#contact" className="rx-hide-sm">Get in touch</RXButton></Magnetic>
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npm run build`, then in dev: the three CTAs drift a few px toward the cursor while hovered and spring back; clicks still navigate to `#contact`; header layout does not shift. Reduce Motion: buttons do not move.

- [ ] **Step 4: Commit**

```bash
git add src/components/rx/Magnetic.tsx src/app/page.tsx
git commit -m "Make primary CTAs magnetic on hover"
```

---

### Task 7: FAQ open/close animation (CSS only)

**Files:**
- Modify: `src/app/globals.css` (edit the `/* FAQ disclosure */` block at lines 601-614 and append new rules)

**Interfaces:**
- Consumes: existing `details`/`summary` markup in `page.tsx` (NOT modified; JSON-LD and semantics stay).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Update the FAQ CSS**

In the existing `/* FAQ disclosure */` block, DELETE this rule (the open state now rotates the plus instead of swapping it for an en dash):

```css
.rx-faq details[open] summary::after { content: "\2013"; }
```

Then append:

```css
/* FAQ open/close animation (progressive enhancement; browsers without
   ::details-content or interpolate-size just open instantly as before) */
.rx-faq summary::after { transition: transform 0.25s ease, color 0.25s ease; }
.rx-faq details[open] summary::after {
  transform: rotate(45deg);
  color: var(--rx-accent);
}
@media (prefers-reduced-motion: no-preference) {
  @supports (interpolate-size: allow-keywords) {
    .rx-faq { interpolate-size: allow-keywords; }
    .rx-faq details::details-content {
      opacity: 0;
      block-size: 0;
      overflow: hidden;
      transition:
        content-visibility 0.3s allow-discrete,
        opacity 0.3s ease,
        block-size 0.3s ease;
    }
    .rx-faq details[open]::details-content {
      opacity: 1;
      block-size: auto;
    }
  }
}
@media (prefers-reduced-motion: reduce) {
  .rx-faq summary::after { transition: none; }
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint && npm run build`, then in dev (Chrome): FAQ answers slide open and closed smoothly; the plus sign rotates to an X and turns orange when open. Confirm the answer text is still present in view-source (semantics intact).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "Animate FAQ disclosure open and close"
```

---

### Task 8: Full verification pass

**Files:**
- No code changes expected (fixes only if checks fail).

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Clean build**

Run: `npm run lint && npm run build`
Expected: zero errors. Note the first-load JS size that `next build` reports for `/` and confirm the increase over `main` is under ~30 KB gzipped (the motion budget from the spec). To compare: `git stash list` is not needed; just run `git checkout main -- package.json package-lock.json` is NOT allowed — instead read the build output on this branch and compare against a fresh `npm run build` on `main` in a separate `git worktree` if the number looks suspicious.

- [ ] **Step 2: Manual checklist in `npm run dev`**

Desktop (wide window):
- Headings reveal word by word once per section.
- Hero stats still count up (existing `Stat` behavior, satisfies the spec's CountUp item; no new code was needed).
- Motif lines in About/Global/Contact/footer parallax on scroll; hero motif still drifts.
- Service and team cards glow toward the cursor and tilt slightly.
- "How we engage" pins and steps light up 01 to 04 with the progress line, then releases to the MVP card.
- The three primary CTAs are magnetic; all buttons still navigate.
- FAQ items animate open/closed; plus rotates to X.
- Theme toggle: everything above looks right in BOTH light and dark themes.

375 px (responsive mode):
- No pinning in "How we engage" (static stacked grid).
- No glow/tilt/magnetic effects with touch emulation.
- Nothing overflows horizontally.

macOS Reduce Motion ON (System Settings > Accessibility > Display):
- Page reads like the pre-change site: static headings, static motifs, no tilt, no magnetic drift, instant FAQ, no pinning.

- [ ] **Step 3: Commit any fixes and push**

```bash
git push -u origin feat/motion-pass-phase1
```

Then walk Jerom through the full diff (his standing preference) before any PR/merge.
