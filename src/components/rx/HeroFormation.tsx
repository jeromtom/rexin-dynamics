"use client";

import { useEffect, useRef, useState } from "react";
import { ParticleField } from "./ParticleField";

type Formation = "drone" | "ring" | "grid" | "arrow" | "wave";

const ORDER: Formation[] = ["drone", "ring", "grid", "arrow", "wave"];
const CHIPS: { key: Formation; label: string }[] = [
  { key: "drone", label: "Drone" },
  { key: "ring", label: "Ring" },
  { key: "grid", label: "Grid" },
  { key: "arrow", label: "Arrow" },
  { key: "wave", label: "Wave" },
];
const N = 36;

// Round to 4 decimal places. Percentage values computed from Math.cos/Math.sin
// carry 15+ significant digits, but CSS percentage/length values are stored
// internally by the browser as 32-bit floats, so the server-rendered HTML
// string gets down-cast to ~6 significant digits when parsed. Without this
// rounding, React's client-side render recomputes the full-precision string,
// which no longer matches what the DOM reports post-parse, causing a
// hydration mismatch on every load (see task-2-report.md for evidence).
// Rounding here makes the server and client strings identical.
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function pos(i: number, f: Formation): [number, number] {
  const t = i / N;
  if (f === "grid") {
    const cols = 6;
    const c = i % cols;
    const r = Math.floor(i / cols);
    return [round4(18 + c * 12.8), round4(14 + r * 13.6)];
  }
  if (f === "arrow") {
    const half = Math.floor(N / 2);
    if (i < half) {
      const u = i / (half - 1);
      return [round4(22 + u * 54), round4(16 + u * 34)];
    }
    const u2 = (i - half) / (N - half - 1);
    return [round4(22 + u2 * 54), round4(84 - u2 * 34)];
  }
  if (f === "wave") {
    return [round4(8 + t * 84), round4(50 + 24 * Math.sin(t * Math.PI * 4))];
  }
  const a = t * Math.PI * 2;
  return [round4(50 + 38 * Math.cos(a)), round4(50 + 38 * Math.sin(a))];
}

const cornerBase: React.CSSProperties = { position: "absolute", width: 22, height: 22 };

export function HeroFormation() {
  const [formation, setFormation] = useState<Formation>("drone");
  const [mode, setMode] = useState<"particles" | "dots">("dots");
  const [alt, setAlt] = useState("ALT 118 m");
  const [acc, setAcc] = useState("ACC 98.4%");
  const userPicked = useRef(false);
  const htmlFormation = formation === "drone" ? "ring" : formation;

  // Auto-cycle formations until the visitor picks one.
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setMode("particles");
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
          {mode === "particles" ? (
            <ParticleField formation={formation} onFail={() => setMode("dots")} />
          ) : (
            <div style={{ position: "absolute", inset: 0 }}>
              {Array.from({ length: N }, (_, i) => {
                const [left, top] = pos(i, htmlFormation);
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
          )}
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
