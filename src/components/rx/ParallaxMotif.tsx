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
