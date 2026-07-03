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
