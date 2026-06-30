"use client";

import { useEffect, useRef, useState } from "react";

type Formation = "ring" | "grid" | "arrow" | "wave";

const ORDER: Formation[] = ["ring", "grid", "arrow", "wave"];
const CHIPS: { key: Formation; label: string }[] = [
  { key: "ring", label: "Ring" },
  { key: "grid", label: "Grid" },
  { key: "arrow", label: "Arrow" },
  { key: "wave", label: "Wave" },
];
const N = 36;

function pos(i: number, f: Formation): [number, number] {
  const t = i / N;
  if (f === "grid") {
    const cols = 6;
    const c = i % cols;
    const r = Math.floor(i / cols);
    return [18 + c * 12.8, 14 + r * 13.6];
  }
  if (f === "arrow") {
    const half = Math.floor(N / 2);
    if (i < half) {
      const u = i / (half - 1);
      return [22 + u * 54, 16 + u * 34];
    }
    const u2 = (i - half) / (N - half - 1);
    return [22 + u2 * 54, 84 - u2 * 34];
  }
  if (f === "wave") {
    return [8 + t * 84, 50 + 24 * Math.sin(t * Math.PI * 4)];
  }
  const a = t * Math.PI * 2;
  return [50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)];
}

const cornerBase: React.CSSProperties = { position: "absolute", width: 22, height: 22 };

export function HeroFormation() {
  const [formation, setFormation] = useState<Formation>("ring");
  const [alt, setAlt] = useState("ALT 118 m");
  const [acc, setAcc] = useState("ACC 98.4%");
  const userPicked = useRef(false);

  // Auto-cycle formations until the visitor picks one.
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (userPicked.current) return;
      setFormation((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  // Live telemetry readout.
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setAcc("ACC " + (97.6 + Math.random() * 1.9).toFixed(1) + "%");
      setAlt("ALT " + (112 + Math.floor(Math.random() * 12)) + " m");
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const pick = (f: Formation) => {
    userPicked.current = true;
    setFormation(f);
  };

  return (
    <div className="rx-rise" style={{ animationDelay: "0.08s", position: "relative", padding: 16 }}>
      <span style={{ ...cornerBase, top: 0, left: 0, borderTop: "2px solid var(--rx-orange-400)", borderLeft: "2px solid var(--rx-orange-400)" }} />
      <span style={{ ...cornerBase, top: 0, right: 0, borderTop: "2px solid var(--rx-orange-400)", borderRight: "2px solid var(--rx-orange-400)" }} />
      <span style={{ ...cornerBase, bottom: 0, left: 0, borderBottom: "2px solid var(--rx-orange-400)", borderLeft: "2px solid var(--rx-orange-400)" }} />
      <span style={{ ...cornerBase, bottom: 0, right: 0, borderBottom: "2px solid var(--rx-orange-400)", borderRight: "2px solid var(--rx-orange-400)" }} />
      <span className="rx-mono" style={{ position: "absolute", top: 9, left: 34, background: "#0A0A0B", padding: "0 8px", fontSize: 10, letterSpacing: "0.12em", color: "var(--rx-orange-400)" }}>
        SYSTEMS // FORMATION
      </span>
      <span className="rx-mono" style={{ position: "absolute", top: 9, right: 34, background: "#0A0A0B", padding: "0 8px", fontSize: 10, letterSpacing: "0.12em", color: "#9C9A97" }}>
        RTK
      </span>

      <div style={{ border: "1px solid #2A2A2E", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#070708", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(240px 180px at 50% 48%, rgba(232,72,8,.16), transparent 70%)" }} />
          <div className="rx-radar" style={{ position: "absolute", left: "-50%", top: "-50%", width: "200%", height: "200%", background: "conic-gradient(from 0deg, rgba(232,72,8,.24), rgba(232,72,8,0) 40%)", transformOrigin: "50% 50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: N }, (_, i) => {
              const [left, top] = pos(i, formation);
              return (
                <span
                  key={i}
                  className="rx-tw"
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    borderRadius: "50%",
                    background: "var(--rx-orange-400)",
                    boxShadow: "0 0 7px rgba(251,106,46,.9)",
                    transition: "left .9s cubic-bezier(.45,0,.2,1), top .9s cubic-bezier(.45,0,.2,1)",
                    animationDelay: `${(i % 9) * 0.3}s`,
                  }}
                />
              );
            })}
          </div>
          <span className="rx-mono" style={{ position: "absolute", top: 12, left: 14, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, letterSpacing: "0.1em", color: "rgba(255,255,255,.8)" }}>
            <span className="rx-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rx-orange-400)" }} />
            FORMATION · {formation.toUpperCase()}
          </span>
          <div className="rx-mono" style={{ position: "absolute", left: 14, right: 14, bottom: 12, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "rgba(255,255,255,.6)" }}>
            <span>{alt}</span>
            <span>{N} UNITS</span>
            <span>{acc}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {CHIPS.map((chip) => {
          const active = chip.key === formation;
          return (
            <button
              key={chip.key}
              onClick={() => pick(chip.key)}
              className="rx-chip"
              style={{
                padding: "6px 14px",
                border: `1px solid ${active ? "var(--rx-orange-400)" : "#2A2A2E"}`,
                background: active ? "var(--rx-orange-400)" : "transparent",
                color: active ? "#0A0A0B" : "#9C9A97",
                fontSize: 11,
                fontWeight: active ? 700 : 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
