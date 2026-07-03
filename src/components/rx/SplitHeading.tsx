"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
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
        <Fragment key={`${w}-${i}`}>
          <span
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
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </h2>
  );
}
