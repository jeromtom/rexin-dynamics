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
