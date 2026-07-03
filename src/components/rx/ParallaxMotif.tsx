"use client";

import { useRef, type CSSProperties } from "react";
import { m, useScroll, useTransform } from "motion/react";

/* Decorative motif image that drifts vertically at a slower rate than
   scroll, giving sections depth. Purely presentational (alt="", aria-hidden).

   Reduced motion is handled in CSS (see `.rx-parallax-motif` in
   globals.css), not by branching this component's rendered style on
   useReducedMotion(). motion/react's useReducedMotion() resolves to `null`
   during SSR (the server can never know the client's OS preference) but
   resolves synchronously to the real boolean on the client's very first
   (hydration) render, before React gets a chance to reconcile. Gating the
   `y` transform on it here made the server's HTML
   (`transform: translateY(-strength)` at scrollYProgress 0) and a
   reduced-motion client's first hydrated render (`translateY(0)`) diverge,
   firing a hydration-mismatch warning on every load, but only under
   reduced motion (see .superpowers/sdd/task-2-report.md, "Task 2b").
   Always rendering the animated `y` value keeps server and client output
   identical in both modes; the CSS media query then forces a static
   transform for reduced-motion users at the paint layer, independent of
   and prior to hydration, with no flash and no mismatch. Same pattern
   already used by `.rx-glow-card` in globals.css. */
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
      className={className ? `rx-parallax-motif ${className}` : "rx-parallax-motif"}
      style={{ ...style, y }}
    />
  );
}
