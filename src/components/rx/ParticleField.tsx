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
      x = -1.7 + (c / (cols - 1)) * 3.4 + (Math.random() - 0.5) * 0.02;
      y = 1.2 - (r / (rows - 1)) * 2.4 + (Math.random() - 0.5) * 0.02;
      z = 0; // grid reads as a crisp lattice: no depth jitter
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
  onReady,
  onFail,
}: {
  formation: ParticleFormation;
  onReady?: () => void;
  onFail?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const formationRef = useRef(formation);
  formationRef.current = formation;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    // three ships no .d.ts and there's no @types/three; the dynamic import
    // specifier itself (not its result) triggers TS7016, so no `as` cast on
    // the expression can fix it. Suppress locally rather than adding a
    // project-wide `declare module "three"` or touching tsconfig.
    // @ts-expect-error - see comment above; THREE is untyped (effectively `any`) below
    import("three")
      .then((THREE) => {
        if (cancelled || !hostRef.current) return;
        // declared outside the try so the catch below can best-effort dispose
        // it even if a later line in the try throws after creation.
        let renderer: InstanceType<typeof THREE.WebGLRenderer> | undefined;
        try {
          const N = window.innerWidth <= 820 ? 1400 : 2800;
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
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
          let firstFrame = false;
          // three@0.185 deprecated THREE.Clock; use a plain timestamp instead.
          const t0 = performance.now();

          const tick = () => {
            if (cancelled) return;
            raf = requestAnimationFrame(tick);
            if (!running) return;
            const t = (performance.now() - t0) / 1000;
            if (formationRef.current !== currentFormation) {
              currentFormation = formationRef.current;
              targets = makeTargets(currentFormation, N);
            }
            // grid must read as a crisp lattice: damp the ambient drift so
            // jitter stays well under the lattice's ~0.057 spacing.
            const driftAmp = currentFormation === "grid" ? 0.03 * 0.25 : 0.03;
            const arr = geo.getAttribute("position") as { array: Float32Array; needsUpdate: boolean };
            const p = arr.array;
            for (let i = 0; i < N; i++) {
              const ix = i * 3, iy = ix + 1, iz = ix + 2;
              const k = 0.045 + (seeds[i] % 1) * 0.035; // per-particle stagger
              let tx = targets[ix] + Math.sin(t * 0.8 + seeds[i]) * driftAmp;
              let ty = targets[iy] + Math.cos(t * 0.7 + seeds[i] * 1.3) * driftAmp;
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
            renderer!.render(scene, camera);
            if (!firstFrame) {
              firstFrame = true;
              onReadyRef.current?.();
            }
          };
          raf = requestAnimationFrame(tick);

          // pause offscreen / hidden tab. Two independent booleans so a
          // tab-visibility change never clobbers the intersection verdict
          // (and vice versa) — resuming a background tab while the hero is
          // scrolled away must not resume rendering it offscreen.
          let onscreen = true;
          let tabVisible = !document.hidden;
          const updateRunning = () => { running = onscreen && tabVisible; };
          const io = "IntersectionObserver" in window
            ? new IntersectionObserver((es) => {
                onscreen = es.some((e) => e.isIntersecting);
                updateRunning();
              }, { threshold: 0.05 })
            : null;
          io?.observe(host);
          const onVis = () => { tabVisible = !document.hidden; updateRunning(); };
          document.addEventListener("visibilitychange", onVis);
          updateRunning();

          const onResize = () => {
            const ww = host.clientWidth || 640;
            const hh = host.clientHeight || 480;
            renderer!.setSize(ww, hh);
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
            renderer!.dispose();
            renderer!.domElement.remove();
          };
        } catch {
          // best-effort cleanup: renderer may already exist (and own a live
          // WebGL context + canvas in the DOM) even if a later line in this
          // try block is what threw.
          try {
            renderer?.dispose();
            renderer?.domElement?.remove();
          } catch {
            /* noop */
          }
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
  }, []);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} aria-hidden />;
}
