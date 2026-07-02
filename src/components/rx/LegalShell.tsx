"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

import { useTheme } from "@/components/theme-provider";
import { RXIcon } from "@/components/rx/RXIcon";
import { RXButton, Eyebrow } from "@/components/rx/primitives";

const legalLinks = [
  { href: "/terms/", label: "Terms & Conditions" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/refund-cancellation/", label: "Refund & Cancellation" },
  { href: "/return/", label: "Return Policy" },
  { href: "/shipping/", label: "Shipping Policy" },
  { href: "/bank-details/", label: "Bank Transfer Details" },
];

/* Shared shell for legal / policy pages: rx header, day-theme reading
   column, night footer. Content is styled by .rx-legal in globals.css. */
export function LegalShell({
  eyebrow = "Legal",
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isNight = mounted && resolvedTheme === "dark";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div
      className="rx-root"
      style={{ fontFamily: "var(--rx-font-body)", background: "var(--rx-bg)", color: "var(--rx-text)", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--rx-header-bg)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--rx-header-border)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 var(--rx-section-x)", height: 66, display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex" }} aria-label="Rexin Dynamics home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isNight ? "/assets/logos/logo_horizontal_white.svg" : "/assets/logos/logo_horizontal_primary.svg"}
              alt="Rexin Dynamics"
              style={{ height: 19 }}
            />
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span className="rx-hide-sm rx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--rx-text-muted)" }}>
              {eyebrow.toUpperCase()}
            </span>
            <button
              onClick={toggleTheme}
              className="rx-icon-btn"
              aria-label={isNight ? "Switch to light mode" : "Switch to dark mode"}
              title={isNight ? "Switch to light mode" : "Switch to dark mode"}
            >
              <RXIcon name={isNight ? "sun" : "moon"} size={18} />
            </button>
            <RXButton variant="outline" size="sm" href="/">
              Back to home
            </RXButton>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, width: "100%", maxWidth: 860, margin: "0 auto", padding: "52px var(--rx-section-x) 84px" }}>
        <div className="rx-rise">
          <div style={{ marginBottom: 14 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 className="rx-h2">{title}</h1>
          {intro && (
            <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.65, color: "var(--rx-text-muted)" }}>{intro}</p>
          )}
        </div>
        <div className="rx-legal rx-rise" style={{ animationDelay: "0.06s" }}>{children}</div>
        <div style={{ marginTop: 48, paddingTop: 26, borderTop: "1px solid var(--rx-border)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600, color: "var(--rx-accent)" }}>
            ← Back to home
          </Link>
        </div>
      </main>

      <footer className="rx-night" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid #1f1f22", background: "#0A0A0B", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0.22, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "40px var(--rx-section-x) 32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 40px", alignItems: "center", justifyContent: "space-between" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logos/logo_horizontal_white.svg" alt="Rexin Dynamics" style={{ height: 18 }} />
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }} aria-label="Legal">
              {legalLinks.map((l) => (
                <a key={l.href} href={l.href} className="rx-footlink" style={{ fontSize: 13 }}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #2A2A2E", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
            <span suppressHydrationWarning style={{ fontSize: 12.5, color: "#6E6961" }}>
              © {new Date().getFullYear()} Rexin Dynamics Private Limited · Kochi, Kerala
            </span>
            <span className="rx-mono" style={{ fontSize: 11.5, color: "#6E6961" }}>www.rexindynamics.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
