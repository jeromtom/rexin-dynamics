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
