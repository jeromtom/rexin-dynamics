"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";

/* ---- Button ---------------------------------------------------- */
export function RXButton({
  children,
  variant = "solid",
  size = "sm",
  href,
  onClick,
  fullWidth,
  type,
  disabled,
  style,
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
  size?: "sm" | "lg";
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const className = [
    "rx-btn",
    `rx-btn-${variant}`,
    `rx-btn-${size}`,
    fullWidth ? "rx-btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={className} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={className}
      style={disabled ? { ...style, opacity: 0.6, cursor: "not-allowed" } : style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* ---- Eyebrow (pill label) -------------------------------------- */
export function Eyebrow({
  children,
  dotColor = "var(--rx-accent)",
}: {
  children: ReactNode;
  dotColor?: string;
}) {
  return (
    <span className="rx-eyebrow">
      <span className="rx-eyebrow-dot" style={{ background: dotColor }} />
      {children}
    </span>
  );
}

/* ---- Badge ----------------------------------------------------- */
export function Badge({
  children,
  variant = "outline",
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  variant?: "outline" | "soft";
  tone?: "neutral" | "accent";
  dot?: boolean;
}) {
  const accent = tone === "accent";
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "5px 13px",
    borderRadius: "var(--rx-radius-full)",
    fontFamily: "var(--rx-font-body)",
    fontSize: 12.5,
    fontWeight: 600,
    lineHeight: 1,
    border: "1px solid",
    borderColor: accent ? "var(--rx-accent)" : "var(--rx-border)",
    background:
      variant === "soft"
        ? accent
          ? "var(--rx-accent-tint)"
          : "var(--rx-surface)"
        : "transparent",
    color: accent ? "var(--rx-accent)" : "var(--rx-text-muted)",
  };
  return (
    <span style={style}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent ? "var(--rx-accent)" : "var(--rx-text-muted)",
          }}
        />
      )}
      {children}
    </span>
  );
}

/* ---- Stat (count-up on scroll) --------------------------------- */
export function Stat({
  value,
  unit = "",
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  const numeric = /^[0-9]+(\.[0-9]+)?$/.test(value);
  const target = numeric ? parseFloat(value) : 0;
  const decimals = value.includes(".") ? 1 : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(numeric ? "0" : value);

  useEffect(() => {
    if (!numeric) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(target.toFixed(decimals));
      return;
    }
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const dur = 1200;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        setDisplay((target * e).toFixed(decimals));
        if (t < 1) requestAnimationFrame(step);
        else setDisplay(target.toFixed(decimals));
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [numeric, target, decimals, value]);

  return (
    <span ref={ref} style={{ display: "block" }}>
      <span
        style={{
          fontFamily: "var(--rx-font-display)",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "var(--rx-text)",
        }}
      >
        {display}
        {unit && <span style={{ color: "var(--rx-accent)" }}>{unit}</span>}
      </span>
      <span
        style={{
          display: "block",
          marginTop: 8,
          fontSize: 13,
          color: "var(--rx-text-muted)",
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </span>
  );
}
