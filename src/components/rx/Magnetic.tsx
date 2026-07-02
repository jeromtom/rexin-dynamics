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
