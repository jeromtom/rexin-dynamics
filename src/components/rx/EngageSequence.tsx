"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, type MotionValue } from "motion/react";

type Step = { n: string; title: string; body: string };

/** Desktop pins the sequence; mobile and reduced-motion visitors see the same static content. */
export function EngageSequence({ steps }: { steps: Step[] }) {
  const [desktop, setDesktop] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 821px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(
    () => scrollYProgress.on("change", (value) => setActive(Math.min(steps.length - 1, Math.floor(value * steps.length)))),
    [scrollYProgress, steps.length],
  );

  const pinned = desktop && !reduce;

  return (
    <div ref={ref} className="rd-process-track">
      <div className="rd-process-sticky">
        <ol className="rd-process-grid">
          {steps.map((step, index) => {
            const isActive = !pinned || index === active;
            return (
              <li className={isActive ? "is-active" : ""} key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            );
          })}
        </ol>
        {pinned ? <Progress value={scrollYProgress} /> : null}
      </div>
    </div>
  );
}

function Progress({ value }: { value: MotionValue<number> }) {
  return <div className="rd-process-progress"><m.div style={{ scaleX: value }} /></div>;
}
