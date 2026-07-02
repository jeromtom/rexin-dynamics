"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const DAYS = ["D01", "D02", "D03", "D04", "D05", "D06", "D07"];
const stageOf = (i: number) => (i === 0 ? "SCOPE" : i === 6 ? "LIVE" : "BUILD");

/* Seven days as formation units lighting up in sequence. The sequence
   starts when scrolled into view. Reduced motion gets the static strip. */
export function SprintTimeline() {
  const [day, setDay] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (r) {
      setReduce(true);
      return;
    }
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduce) return;
    const id = setInterval(() => setDay((d) => (d + 1) % 7), 1000);
    return () => clearInterval(id);
  }, [started, reduce]);

  if (reduce) {
    return (
      <div className="rx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "#9C9A97" }}>
        D01 SCOPE&nbsp;&nbsp;<span style={{ color: "var(--rx-orange-400)" }}>{"//"}</span>&nbsp;&nbsp;D02–06 BUILD&nbsp;&nbsp;<span style={{ color: "var(--rx-orange-400)" }}>{"//"}</span>&nbsp;&nbsp;D07 LIVE
      </div>
    );
  }

  return (
    <div ref={rootRef} style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {DAYS.map((d, i) => (
          <Fragment key={d}>
            {i > 0 && (
              <span
                aria-hidden
                style={{
                  flex: 1,
                  height: 1,
                  background: i <= day ? "var(--rx-orange-400)" : "#2A2A2E",
                  transition: "background .35s ease",
                }}
              />
            )}
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flex: "0 0 auto",
                background: i <= day ? "var(--rx-orange-400)" : "#2A2A2E",
                boxShadow: i === day ? "0 0 9px rgba(251,106,46,.9)" : "none",
                transition: "background .35s ease, box-shadow .35s ease",
              }}
            />
          </Fragment>
        ))}
      </div>
      <div className="rx-mono" style={{ marginTop: 10, fontSize: 11, letterSpacing: "0.12em", color: "#9C9A97" }}>
        <span style={{ color: "var(--rx-orange-400)" }}>{DAYS[day]}</span> · {stageOf(day)}
        <span style={{ color: "#6E6961" }}>
          &nbsp;&nbsp;{"//"}&nbsp;&nbsp;{day === 0 ? "SCOPED WITH YOU" : day === 6 ? "SHIPPED TO PRODUCTION" : "BUILD & REVIEW"}
        </span>
      </div>
    </div>
  );
}
