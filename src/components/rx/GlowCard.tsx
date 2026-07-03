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
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
    el.classList.add("rx-glow-on");
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
