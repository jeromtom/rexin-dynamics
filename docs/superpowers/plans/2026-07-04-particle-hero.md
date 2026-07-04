# Particle Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** WebGL particle swarm inside the hero HUD panel per `docs/superpowers/specs/2026-07-04-particle-hero-design.md`: five formations including a drone silhouette, morphing, cursor scatter, strict fallbacks.

**Architecture:** New self-contained `src/components/rx/ParticleField.tsx` owning all three.js code (dynamically imported). `HeroFormation.tsx` swaps its dot layer for ParticleField, adds the Drone chip, and keeps the HTML dots as the reduced-motion/WebGL-failure fallback.

**Tech Stack:** three (already installed, dynamic import), React 19, Next.js 15 static export.

## Global Constraints

- NO new dependencies. three must NOT enter first-load JS (dynamic import inside useEffect only; verify the build's First Load JS for `/` is unchanged from baseline, currently ~173 kB).
- No copy changes outside adding the "Drone" chip label. Corner brackets, labels, radar, telemetry, chip behavior (auto-cycle until user pick) unchanged.
- Reduced motion: ParticleField never mounts; existing static HTML dots render (current behavior preserved).
- WebGL/import failure: fall back to today's animated HTML dots (drone formation maps to ring there).
- Brand palette only: #FB6A2E core, #E84808 falloff.
- No test runner; verification is `npm run lint && npm run build` + browser checks with your browser tools (dev server port may vary; kill it after).
- Branch `feat/particle-hero` (created). Push at the end; do NOT merge to main.
- Commit bodies end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

## Codebase orientation

- `src/components/rx/HeroFormation.tsx`: `Formation` union (`"ring" | "grid" | "arrow" | "wave"`), `ORDER`, `CHIPS`, `pos(i, f)` for the 36 HTML dots, auto-cycle every 3600ms gated on reduced motion, telemetry interval, HUD chrome. The dot layer is the `<div style={{ position: "absolute", inset: 0 }}>` containing the `Array.from({length: N})` spans.
- `GlobeNetwork.tsx` shows the established dynamic-import pattern (`import("globe.gl").then(...)` inside useEffect with a `cancelled` flag and full cleanup).
- Reduced-motion detection pattern used repo-wide: `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.

---

### Task 1: `ParticleField.tsx`

**Files:**
- Create: `src/components/rx/ParticleField.tsx`

**Interfaces:**
- Produces: `ParticleField({ formation, onFail }: { formation: "drone" | "ring" | "grid" | "arrow" | "wave"; onFail?: () => void })` — a `<div>` filling its parent (`position:absolute; inset:0`), rendering the WebGL canvas inside. Task 2 relies on this exact signature.

This task has creative latitude in the visual tuning (exact easing constants, jitter amplitudes, sprite size) but the following structure is required. Complete reference implementation follows; refine constants by eye during browser verification, keeping the structure and all lifecycle guarantees.

- [ ] **Step 1: Create the component**

```tsx
// src/components/rx/ParticleField.tsx
"use client";

import { useEffect, useRef } from "react";

export type ParticleFormation = "drone" | "ring" | "grid" | "arrow" | "wave";

/* World-space is a 4:3 panel, x in [-2,2], y in [-1.5,1.5], z small.
   Formation generators return N xyz triplets. */
function makeTargets(f: ParticleFormation, n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const jz = () => (Math.random() - 0.5) * 0.25; // depth jitter
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let x = 0, y = 0, z = jz();
    if (f === "ring") {
      const a = t * Math.PI * 2;
      const r = 1.15 + (Math.random() - 0.5) * 0.06;
      x = Math.cos(a) * r * 1.15;
      y = Math.sin(a) * r;
    } else if (f === "grid") {
      const cols = Math.ceil(Math.sqrt(n * (4 / 3)));
      const rows = Math.ceil(n / cols);
      const c = i % cols, r = Math.floor(i / cols);
      x = -1.7 + (c / (cols - 1)) * 3.4 + (Math.random() - 0.5) * 0.05;
      y = 1.2 - (r / (rows - 1)) * 2.4 + (Math.random() - 0.5) * 0.05;
    } else if (f === "arrow") {
      const half = i < n / 2;
      const u = half ? (i / (n / 2)) : (i - n / 2) / (n / 2);
      x = -1.5 + u * 3.0;
      y = (half ? 1 : -1) * (1.25 - u * 1.15);
      x += (Math.random() - 0.5) * 0.08;
      y += (Math.random() - 0.5) * 0.08;
    } else if (f === "wave") {
      x = -1.9 + t * 3.8;
      y = Math.sin(t * Math.PI * 4) * 0.85 + (Math.random() - 0.5) * 0.1;
      z = Math.cos(t * Math.PI * 4) * 0.2;
    } else {
      // drone: top-down quadcopter. Allocation: 20% body, 20% arms, 60% rotors.
      const seg = i / n;
      if (seg < 0.2) {
        // body: filled ellipse at center
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        x = Math.cos(a) * r * 0.42;
        y = Math.sin(a) * r * 0.3;
      } else if (seg < 0.4) {
        // arms: four diagonals from body edge to rotor centers
        const arm = i % 4;
        const u = 0.3 + Math.random() * 0.7;
        const sx = arm % 2 === 0 ? 1 : -1;
        const sy = arm < 2 ? 1 : -1;
        x = sx * u * 1.05 + (Math.random() - 0.5) * 0.05;
        y = sy * u * 0.8 + (Math.random() - 0.5) * 0.05;
      } else {
        // rotors: rings at the four arm tips
        const rotor = i % 4;
        const sx = rotor % 2 === 0 ? 1 : -1;
        const sy = rotor < 2 ? 1 : -1;
        const a = Math.random() * Math.PI * 2;
        const r = 0.34 + (Math.random() - 0.5) * 0.04;
        x = sx * 1.05 + Math.cos(a) * r;
        y = sy * 0.8 + Math.sin(a) * r;
      }
    }
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
  }
  return out;
}

function makeSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(251,106,46,1)");
  grad.addColorStop(0.35, "rgba(232,72,8,0.55)");
  grad.addColorStop(1, "rgba(232,72,8,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/* WebGL particle swarm for the hero HUD panel. Owns the whole three.js
   lifecycle; parent decides mounting (never mounted under reduced motion)
   and falls back to HTML dots when onFail fires. */
export function ParticleField({
  formation,
  onFail,
}: {
  formation: ParticleFormation;
  onFail?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const formationRef = useRef(formation);
  formationRef.current = formation;
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    import("three")
      .then((THREE) => {
        if (cancelled || !hostRef.current) return;
        try {
          const N = window.innerWidth <= 820 ? 1400 : 2800;
          const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          const w = host.clientWidth || 640;
          const h = host.clientHeight || 480;
          renderer.setSize(w, h);
          renderer.domElement.style.position = "absolute";
          renderer.domElement.style.inset = "0";
          host.appendChild(renderer.domElement);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
          camera.position.z = 4.2;

          const positions = new Float32Array(N * 3);
          const seeds = new Float32Array(N); // per-particle phase for drift + stagger
          let targets = makeTargets(formationRef.current, N);
          positions.set(targets);
          for (let i = 0; i < N; i++) {
            seeds[i] = Math.random() * Math.PI * 2;
            // start scattered for an assembly moment on load
            positions[i * 3] += (Math.random() - 0.5) * 5;
            positions[i * 3 + 1] += (Math.random() - 0.5) * 4;
          }

          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          const tex = new THREE.CanvasTexture(makeSprite());
          const mat = new THREE.PointsMaterial({
            size: 0.055,
            map: tex,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
          });
          const points = new THREE.Points(geo, mat);
          scene.add(points);

          // pointer scatter state (mouse only), in world coords on z=0 plane
          const pointer = { x: 0, y: 0, active: false };
          const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = host.getBoundingClientRect();
            const ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
            const ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
            // camera at z=4.2 looking at origin: world extent at z=0
            const halfH = Math.tan((45 * Math.PI) / 360) * 4.2;
            const halfW = halfH * (r.width / r.height);
            pointer.x = ndcX * halfW;
            pointer.y = ndcY * halfH;
            pointer.active = true;
          };
          const onLeave = () => { pointer.active = false; };
          host.addEventListener("pointermove", onMove);
          host.addEventListener("pointerleave", onLeave);

          let currentFormation = formationRef.current;
          let raf = 0;
          let running = true;
          const clock = new THREE.Clock();

          const tick = () => {
            if (cancelled) return;
            raf = requestAnimationFrame(tick);
            if (!running) return;
            const t = clock.getElapsedTime();
            if (formationRef.current !== currentFormation) {
              currentFormation = formationRef.current;
              targets = makeTargets(currentFormation, N);
            }
            const arr = geo.getAttribute("position") as { array: Float32Array; needsUpdate: boolean };
            const p = arr.array;
            for (let i = 0; i < N; i++) {
              const ix = i * 3, iy = ix + 1, iz = ix + 2;
              const k = 0.045 + (seeds[i] % 1) * 0.035; // per-particle stagger
              let tx = targets[ix] + Math.sin(t * 0.8 + seeds[i]) * 0.03;
              let ty = targets[iy] + Math.cos(t * 0.7 + seeds[i] * 1.3) * 0.03;
              if (pointer.active) {
                const dx = p[ix] - pointer.x;
                const dy = p[iy] - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 0.55) {
                  const d = Math.sqrt(d2) || 0.001;
                  const push = (0.75 - d) * 0.55;
                  tx = p[ix] + (dx / d) * push;
                  ty = p[iy] + (dy / d) * push;
                }
              }
              p[ix] += (tx - p[ix]) * k;
              p[iy] += (ty - p[iy]) * k;
              p[iz] += (targets[iz] - p[iz]) * k;
            }
            arr.needsUpdate = true;
            points.rotation.y = Math.sin(t * 0.22) * 0.16; // gentle sway
            renderer.render(scene, camera);
          };
          raf = requestAnimationFrame(tick);

          // pause offscreen / hidden tab
          const io = "IntersectionObserver" in window
            ? new IntersectionObserver((es) => { running = es.some((e) => e.isIntersecting); }, { threshold: 0.05 })
            : null;
          io?.observe(host);
          const onVis = () => { running = !document.hidden; };
          document.addEventListener("visibilitychange", onVis);

          const onResize = () => {
            const ww = host.clientWidth || 640;
            const hh = host.clientHeight || 480;
            renderer.setSize(ww, hh);
            camera.aspect = ww / hh;
            camera.updateProjectionMatrix();
          };
          window.addEventListener("resize", onResize);

          cleanup = () => {
            cancelAnimationFrame(raf);
            io?.disconnect();
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("resize", onResize);
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
            geo.dispose();
            mat.dispose();
            tex.dispose();
            renderer.dispose();
            renderer.domElement.remove();
          };
        } catch {
          onFailRef.current?.();
        }
      })
      .catch(() => {
        if (!cancelled) onFailRef.current?.();
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // mount-once by design: formation changes flow through formationRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-hidden />;
}
```

- [ ] **Step 2: Verify it compiles standalone.** `npm run lint && npm run build` (component not yet used; build proves types). Record First Load JS for `/` (must equal the pre-task baseline).

- [ ] **Step 3: Commit**

```bash
git add src/components/rx/ParticleField.tsx
git commit -m "Add WebGL particle field for the hero panel"
```

---

### Task 2: HeroFormation integration + fallbacks

**Files:**
- Modify: `src/components/rx/HeroFormation.tsx`

**Interfaces:**
- Consumes: `ParticleField`, `ParticleFormation` from Task 1.

- [ ] **Step 1: Extend formations.** Change the `Formation` type to include `"drone"`; `ORDER = ["drone", "ring", "grid", "arrow", "wave"]`; `CHIPS` gains `{ key: "drone", label: "Drone" }` first; initial state `useState<Formation>("drone")`. The HTML-dot `pos()` stays untouched; when the HTML fallback renders, map `"drone"` to `"ring"` (`const htmlFormation = formation === "drone" ? "ring" : formation;`).

- [ ] **Step 2: Mount logic.** Add state `mode: "particles" | "dots"`, initial `"dots"`; on mount (in the existing first useEffect where `reduce` is read): if NOT reduced motion, set `mode` to `"particles"`. Render inside the panel div (the `aspectRatio: "4 / 3"` container):
  - `mode === "particles"`: `<ParticleField formation={formation} onFail={() => setMode("dots")} />` in place of the dots layer.
  - `mode === "dots"`: the existing dots layer exactly as today, using `htmlFormation`.
  The radar sweep, gradient, FORMATION label and telemetry row stay in both modes. Server render = dots (matches today's HTML; no hydration change: the swap to particles happens client-side after mount, and the panel is a night-styled box either way).

- [ ] **Step 3: Verify in the browser.** `npm run lint && npm run build` (First Load JS for `/` unchanged); dev server with your browser tools:
  1. Desktop: particles assemble into the drone on load; auto-cycle morphs through all five; clicking chips morphs and stops the cycle; cursor scatter works and recovers; scrolling the page stays smooth.
  2. 375px + touch emulation: swarm renders (reduced count), no scatter on touch, no overflow.
  3. Reduced-motion emulation: static HTML dots, no canvas element in the DOM.
  4. Simulate WebGL failure (evaluate `HTMLCanvasElement.prototype.getContext = () => null` before load, or use a headless flag that disables WebGL): HTML dots render, chips still work, Drone chip shows the ring layout.
  5. Console: no new errors (known: GlobeNetwork WebGL noise in sandboxed browsers).
  Record observations; screenshot the drone formation.

- [ ] **Step 4: Commit**

```bash
git add src/components/rx/HeroFormation.tsx
git commit -m "Swap hero dots for the particle swarm with dot fallbacks"
```

---

### Task 3: Final review + push (controller-run)

- [ ] Whole-branch review (most capable model) incl. its own browser pass and performance sanity (fps impression, CPU while idle offscreen).
- [ ] Push `feat/particle-hero`. Do NOT merge; Jerom reviews on the dev server.
