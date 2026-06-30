"use client";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/theme-provider";
import { RXIcon, type RXIconName } from "@/components/rx/RXIcon";
import { RXButton, Eyebrow, Badge, Stat } from "@/components/rx/primitives";
import { HeroFormation } from "@/components/rx/HeroFormation";
import { GlobeNetwork } from "@/components/rx/GlobeNetwork";

const MAX_W = 1200;

const navItems = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#global", label: "Global" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

const heroStats = [
  { idx: "01", value: "100", unit: "+", label: "projects shipped" },
  { idx: "02", value: "50", unit: "+", label: "clients & partners" },
  { idx: "03", value: "24/7", unit: "", label: "support in your timezone" },
  { idx: "04", value: "5", unit: "+", label: "currencies billed" },
];

type ServiceCard = { icon: RXIconName; tag: string; title: string; body: string };

const aiServices: ServiceCard[] = [
  { icon: "cpu", tag: "WORLDWIDE", title: "AI automation", body: "We connect your tools and let agents run the busywork: data entry, follow-ups, routing and reporting, with a human in the loop where it matters." },
  { icon: "code", tag: "WORLDWIDE", title: "Website development", body: "Fast, modern websites and web apps, designed and built to ship. From marketing sites to full product front-ends." },
  { icon: "radio", tag: "24/7", title: "Voice agents", body: "AI voice agents that answer calls, qualify leads and book appointments around the clock, in a natural voice." },
  { icon: "message", tag: "24/7", title: "WhatsApp agents", body: "WhatsApp automation that replies instantly, routes conversations and follows up, right where your customers already are." },
];

const airServices: ServiceCard[] = [
  { icon: "drone", tag: "MISSION", title: "Custom drone builds", body: "Mission-specific multirotor and fixed-wing platforms, from concept and airframe to payload integration and field testing." },
  { icon: "target", tag: "MISSION", title: "Autonomous flight R&D", body: "Long-horizon research in autonomous flight, swarming and control systems, advanced with select partners." },
  { icon: "grid", tag: "MISSION", title: "Workshops & labs", body: "Hands-on programs in building, tuning and flying, for schools, colleges and engineering teams." },
];

type Currency = { code: string; name: string; region: string; sym: string; emoji: string };
const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", region: "the United States", sym: "$", emoji: "💵" },
  { code: "CAD", name: "Canadian Dollar", region: "Canada", sym: "C$", emoji: "💵" },
  { code: "AED", name: "UAE Dirham", region: "the United Arab Emirates", sym: "", emoji: "" },
  { code: "GBP", name: "Pound Sterling", region: "the United Kingdom", sym: "£", emoji: "💷" },
  { code: "EUR", name: "Euro", region: "the Eurozone", sym: "€", emoji: "💶" },
  { code: "INR", name: "Indian Rupee", region: "India", sym: "₹", emoji: "" },
];

const topics = [
  "AI automation",
  "Website development",
  "Voice agent",
  "WhatsApp agent",
  "Drone / aerial robotics",
  "Something else",
];

const sectionPad = "90px 28px";

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"ai" | "air">("ai");
  const [currency, setCurrency] = useState("USD");
  const [sent, setSent] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Hero spotlight follows the cursor (night/show context only).
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const hero = heroRef.current;
    const bloom = bloomRef.current;
    if (!hero || !bloom) return;
    const move = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      bloom.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`;
      bloom.style.opacity = "1";
    };
    const leave = () => {
      bloom.style.opacity = "0";
    };
    hero.addEventListener("mousemove", move);
    hero.addEventListener("mouseleave", leave);
    return () => {
      hero.removeEventListener("mousemove", move);
      hero.removeEventListener("mouseleave", leave);
    };
  }, []);

  const isNight = mounted && resolvedTheme === "dark";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const topic = String(data.get("topic") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(topic ? `Enquiry: ${topic}` : "Enquiry via rexindynamics.com");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    );
    window.location.href = `mailto:contact@rexindynamics.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div
      className="rx-root"
      style={{
        fontFamily: "var(--rx-font-body)",
        background: "var(--rx-bg)",
        color: "var(--rx-text)",
        minHeight: "100vh",
      }}
    >
      {/* ===== Header ===== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--rx-header-bg)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--rx-header-border)",
          transition: "border-color .3s ease",
        }}
      >
        <div style={{ maxWidth: MAX_W, margin: "0 auto", padding: "0 28px", height: 66, display: "flex", alignItems: "center", gap: 22 }}>
          <a href="#top" style={{ display: "flex" }} aria-label="Rexin Dynamics home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isNight ? "/assets/logos/logo_horizontal_white.svg" : "/assets/logos/logo_horizontal_primary.svg"}
              alt="Rexin Dynamics"
              style={{ height: 19 }}
            />
          </a>
          <nav className="rx-hide-sm" style={{ display: "flex", gap: 2, marginLeft: 4 }}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rx-navlink">
                {item.label}
              </a>
            ))}
          </nav>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span className="rx-hide-sm rx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--rx-text-muted)" }}>
              KOCHI, KERALA
            </span>
            <button
              onClick={toggleTheme}
              className="rx-icon-btn"
              aria-label={isNight ? "Switch to light mode" : "Switch to dark mode"}
              title={isNight ? "Switch to light mode" : "Switch to dark mode"}
            >
              <RXIcon name={isNight ? "sun" : "moon"} size={18} />
            </button>
            <RXButton variant="solid" size="sm" href="#contact">
              Get in touch
            </RXButton>
          </div>
        </div>
      </header>

      {/* ===== Hero (always night) ===== */}
      <section
        id="top"
        ref={heroRef}
        className="rx-night"
        style={{ position: "relative", overflow: "hidden", background: "#0A0A0B", color: "#fff" }}
      >
        <div
          ref={bloomRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 520,
            height: 520,
            margin: "-260px 0 0 -260px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,72,8,.2), transparent 62%)",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity .45s ease",
            zIndex: 0,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden className="rx-drift" style={{ position: "absolute", inset: "-14% -6% auto -6%", width: "112%", opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1200px 480px at 74% 2%, rgba(232,72,8,.22), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6, background: "repeating-linear-gradient(to bottom, rgba(255,255,255,.025) 0 1px, transparent 1px 3px)" }} />

        <div style={{ position: "relative", maxWidth: MAX_W, margin: "0 auto", padding: "24px 28px 78px" }}>
          <div className="rx-mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 24, borderBottom: "1px solid #1a1a1d", fontSize: 11, letterSpacing: "0.12em", color: "#6E6961", flexWrap: "wrap" }}>
            <span>REXIN&nbsp;DYNAMICS&nbsp;&nbsp;<span style={{ color: "#9C9A97" }}>{"//"}</span>&nbsp;&nbsp;KOCHI, KERALA · INDIA</span>
          </div>

          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: "1.12fr .88fr", gap: "48px 56px", alignItems: "center", marginTop: 52 }}>
            <div className="rx-rise">
              <div style={{ marginBottom: 20 }}>
                <Eyebrow dotColor="var(--rx-orange-400)">AI · Automation · Robotics</Eyebrow>
              </div>
              <h1 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 900, fontSize: "clamp(40px,5.6vw,72px)", lineHeight: 0.97, letterSpacing: "-0.026em", margin: 0, maxWidth: "14ch" }}>
                Built to fly.
                <br />
                <span style={{ color: "var(--rx-orange-400)" }}>Engineered to think.</span>
              </h1>
              <p style={{ margin: "22px 0 0", fontSize: 18, lineHeight: 1.6, color: "#cfcdc9", maxWidth: "47ch" }}>
                Rexin Dynamics builds AI automation, websites, and voice and WhatsApp agents for businesses around the world. We put the proceeds into a harder mission: autonomous drones and the agentic AI behind them. Engineered in Kerala, delivered globally.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
                <RXButton variant="solid" size="lg" href="#contact">Get in touch</RXButton>
                <RXButton variant="outline" size="lg" href="#services">View services</RXButton>
              </div>
            </div>

            <HeroFormation />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 1, marginTop: 58, background: "#1a1a1d", border: "1px solid #1a1a1d", borderRadius: 12, overflow: "hidden" }}>
            {heroStats.map((s) => (
              <div key={s.idx} style={{ background: "#0A0A0B", padding: "22px 24px" }}>
                <div className="rx-mono" style={{ fontSize: 10.5, color: "#6E6961", marginBottom: 10 }}>{s.idx}</div>
                <Stat value={s.value} unit={s.unit} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section id="about" style={{ padding: sectionPad, borderTop: "1px solid var(--rx-border)" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: ".92fr 1.08fr", gap: 56, alignItems: "center" }}>
            <div className="rx-rise">
              <div style={{ marginBottom: 14 }}><Eyebrow>About</Eyebrow></div>
              <h2 className="rx-h2">We ship AI for the world. We fund robotics for the future.</h2>
              <p style={{ margin: "20px 0 0", fontSize: 16.5, lineHeight: 1.65, color: "var(--rx-text)" }}>
                Rexin Dynamics is an engineering-led studio in Kochi, Kerala. For companies around the world we design and ship AI automation, websites, and voice and WhatsApp agents that go straight into production.
              </p>
              <p style={{ margin: "14px 0 0", fontSize: 16.5, lineHeight: 1.65, color: "var(--rx-text-muted)" }}>
                Everything we earn funds the harder mission: indigenous autonomous drones, flight systems and the agentic AI behind them. Getting closer to Physical AI.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
                <Badge variant="outline" tone="neutral">Made in India</Badge>
                <Badge variant="soft" tone="accent" dot>Backed by IPTIF · IIT Palakkad</Badge>
              </div>
            </div>
            <div className="rx-rise" style={{ animationDelay: "0.08s", position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid var(--rx-border)" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#070708" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden className="rx-drift" style={{ position: "absolute", inset: "-10% -4% auto -4%", width: "108%", opacity: 0.85 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(232,72,8,.16), transparent 55%)" }} />
                <span className="rx-mono" style={{ position: "absolute", bottom: 14, left: 14, fontSize: 10.5, letterSpacing: "0.12em", color: "rgba(255,255,255,.82)" }}>LAB // KOCHI · R&D</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section id="services" style={{ padding: "0 28px 90px" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-rise" style={{ maxWidth: 680 }}>
            <div style={{ marginBottom: 14 }}><Eyebrow>What we do</Eyebrow></div>
            <h2 className="rx-h2">Two engines, one company.</h2>
            <p style={{ margin: "16px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "var(--rx-text-muted)", maxWidth: "54ch" }}>
              AI and software pay the bills today. Aerial robotics is where we are headed. Both run on the same engineering discipline.
            </p>
          </div>

          <div className="rx-rise" style={{ display: "inline-flex", gap: 6, padding: 5, background: "var(--rx-surface)", border: "1px solid var(--rx-border)", borderRadius: "var(--rx-radius-full)", marginTop: 28 }}>
            {(["ai", "air"] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "9px 18px",
                    border: 0,
                    borderRadius: "var(--rx-radius-full)",
                    fontFamily: "var(--rx-font-body)",
                    fontSize: 14,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    background: active ? "var(--rx-accent)" : "transparent",
                    color: active ? "var(--rx-on-accent)" : "var(--rx-text-muted)",
                    whiteSpace: "nowrap",
                    transition: "background .15s, color .15s",
                  }}
                >
                  {t === "ai" ? "AI & Software" : "Aerial Robotics"}
                </button>
              );
            })}
          </div>

          <div
            className="rx-rise rx-stack"
            style={{
              display: "grid",
              gridTemplateColumns: tab === "ai" ? "repeat(2,1fr)" : "repeat(3,1fr)",
              gap: 1,
              marginTop: 22,
              background: "var(--rx-border)",
              border: "1px solid var(--rx-border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {(tab === "ai" ? aiServices : airServices).map((card) => (
              <div key={card.title} className="rx-service-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 12, background: "var(--rx-accent-tint)", color: "var(--rx-accent)" }}>
                    <RXIcon name={card.icon} size={22} />
                  </span>
                  <span className="rx-mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--rx-text-muted)" }}>{card.tag}</span>
                </div>
                <h3 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 700, fontSize: 21, margin: "6px 0 0", letterSpacing: "-0.01em", color: "var(--rx-text)" }}>{card.title}</h3>
                <p style={{ margin: 0, fontSize: 14.5, color: "var(--rx-text-muted)", lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Global ===== */}
      <section id="global" style={{ position: "relative", overflow: "hidden", padding: sectionPad, borderTop: "1px solid var(--rx-border)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden style={{ position: "absolute", inset: "-20% 0 auto 0", width: "100%", opacity: 0.1, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div className="rx-rise">
              <div style={{ marginBottom: 14 }}><Eyebrow>Global</Eyebrow></div>
              <h2 className="rx-h2">Built for international business.</h2>
              <p style={{ margin: "18px 0 0", fontSize: 16.5, lineHeight: 1.65, color: "var(--rx-text)", maxWidth: "46ch" }}>
                Most of our clients are outside India. We invoice in your currency and settle through local bank accounts, so working with Rexin feels local wherever you are.
              </p>
              <p className="rx-mono" style={{ margin: "18px 0 6px", fontSize: 11, letterSpacing: "0.12em", color: "var(--rx-text-muted)" }}>SELECT A CURRENCY</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CURRENCIES.map((c) => {
                  const active = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      className="rx-chip"
                      style={{
                        padding: "10px 15px",
                        border: `1px solid ${active ? "var(--rx-accent)" : "var(--rx-border)"}`,
                        background: active ? "var(--rx-accent)" : "transparent",
                        color: active ? "var(--rx-on-accent)" : "var(--rx-text)",
                        fontWeight: active ? 700 : 600,
                        fontSize: 13,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c.sym ? `${c.sym} ${c.code}` : c.code}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rx-rise" style={{ animationDelay: "0.08s", position: "relative", overflow: "hidden", background: "var(--rx-surface)", border: "1px solid var(--rx-border)", borderRadius: 20, padding: 34, minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
              <div className="rx-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--rx-accent)" }}>INVOICE CURRENCY</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--rx-font-display)", fontWeight: 900, fontSize: "clamp(54px,8vw,82px)", lineHeight: 1, letterSpacing: "-0.02em", color: "var(--rx-text)" }}>{cur.code}</span>
                {cur.emoji && <span style={{ fontSize: 46, lineHeight: 1, alignSelf: "center" }}>{cur.emoji}</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--rx-text)" }}>{cur.name}</div>
              <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--rx-text-muted)", maxWidth: "34ch" }}>
                Billed to clients in {cur.region} and settled into our {cur.code} business account. No conversion headaches on your side.
              </p>
            </div>
            <GlobeNetwork />
          </div>
        </div>
      </section>

      {/* ===== Team ===== */}
      <section id="team" style={{ padding: "0 28px 90px" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-rise" style={{ marginBottom: 36 }}>
            <div style={{ marginBottom: 14 }}><Eyebrow>Team</Eyebrow></div>
            <h2 className="rx-h2">People behind the systems</h2>
          </div>
          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              { name: "Jerom Tom", role: "CEO · FOUNDER", desc: "Leads the vision and strategy.", img: "/team-jerom.png", email: "jerom@rexindynamics.com" },
              { name: "Junaid CK", role: "CTO · FOUNDER", desc: "Develops the software and flight systems.", img: "/team-junaid.png", email: "junaid@rexindynamics.com" },
            ].map((m, i) => (
              <div key={m.name} className="rx-rise" style={{ animationDelay: i ? "0.07s" : undefined, background: "var(--rx-surface)", border: "1px solid var(--rx-border)", borderRadius: 20, padding: 22, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ flex: "0 0 auto", width: 104, height: 104, borderRadius: 16, overflow: "hidden", background: "var(--rx-surface-2)", border: "1px solid var(--rx-border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={`${m.name}, ${m.role.split(" · ")[0]} of Rexin Dynamics`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div className="rx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--rx-accent)", marginBottom: 6 }}>{m.role}</div>
                  <h3 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 700, fontSize: 22, margin: 0, color: "var(--rx-text)" }}>{m.name}</h3>
                  <p style={{ margin: "6px 0 12px", fontSize: 14, color: "var(--rx-text-muted)", lineHeight: 1.55 }}>{m.desc}</p>
                  <a href={`mailto:${m.email}`} className="rx-mono" style={{ fontSize: 12, color: "var(--rx-text-muted)" }}>{m.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Backed by ===== */}
      <section id="backed" style={{ padding: "0 28px 96px" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-rise" style={{ marginBottom: 36, maxWidth: 680 }}>
            <div style={{ marginBottom: 14 }}><Eyebrow>Backed by</Eyebrow></div>
            <h2 className="rx-h2">In good company.</h2>
            <p style={{ margin: "16px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "var(--rx-text-muted)", maxWidth: "56ch" }}>
              We are incubated and supported by institutions building India&apos;s deep-tech future. They back the engineering behind our path to Physical AI.
            </p>
          </div>
          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              { href: "https://iptif.tech/entrepreneurship-development/entrepreneur-residence-eir", logo: "/IPTIF Logo.png", alt: "IPTIF, IIT Palakkad", title: "IPTIF, IIT Palakkad", tag: "DISHA-EIR PROGRAM", body: "Incubated through IIT Palakkad's Technology Innovation Foundation under the DISHA Entrepreneur-in-Residence program, backing our founders and the engineering behind our aerial systems.", cta: "Visit IPTIF" },
              { href: "https://www.buimercindiafoundation.org/", logo: "/Buimerc.png", alt: "Buimerc India Foundation", title: "Buimerc India Foundation", tag: "FOUNDATION PARTNER", body: "Backing our work on indigenous aerial systems and applied AI, and our mission to build Made-in-India autonomous flight from Kerala.", cta: "Visit Buimerc" },
            ].map((b, i) => (
              <a key={b.title} href={b.href} target="_blank" rel="noopener noreferrer" className="rx-backed-card rx-rise" style={{ animationDelay: i ? "0.07s" : undefined }}>
                <div style={{ background: "#fff", height: 138, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderBottom: "1px solid var(--rx-border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.logo} alt={b.alt} style={{ maxHeight: 66, maxWidth: "80%", width: "auto" }} />
                </div>
                <div style={{ padding: "26px 28px 28px" }}>
                  <h3 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: "-0.01em", color: "var(--rx-text)" }}>{b.title}</h3>
                  <div className="rx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--rx-accent)", margin: "8px 0 12px" }}>{b.tag}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--rx-text-muted)" }}>{b.body}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 14, fontWeight: 600, color: "var(--rx-accent)" }}>
                    {b.cta} <RXIcon name="arrowUpRight" size={16} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Contact (always night) ===== */}
      <section id="contact" className="rx-night" style={{ position: "relative", overflow: "hidden", padding: sectionPad, borderTop: "1px solid #1f1f22", background: "#0A0A0B", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden style={{ position: "absolute", inset: "auto 0 -30% 0", width: "100%", opacity: 0.16, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: MAX_W, margin: "0 auto" }}>
          <div className="rx-stack-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div className="rx-rise">
              <div style={{ marginBottom: 14 }}><Eyebrow dotColor="var(--rx-orange-400)">Contact</Eyebrow></div>
              <h2 className="rx-h2" style={{ color: "#fff" }}>Ready when you are.</h2>
              <p style={{ margin: "18px 0 30px", fontSize: 16.5, lineHeight: 1.65, color: "#cfcdc9", maxWidth: "42ch" }}>
                A short message with context is enough to start. Wherever you are in the world, we reply fast.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { icon: "mail" as const, k: "EMAIL", v: "contact@rexindynamics.com", href: "mailto:contact@rexindynamics.com" },
                  { icon: "phone" as const, k: "PHONE", v: "+91 89215 88769", href: "tel:+918921588769" },
                ].map((c) => (
                  <a key={c.k} href={c.href} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: 11, background: "#17171a", border: "1px solid #2A2A2E", color: "var(--rx-orange-400)" }}>
                      <RXIcon name={c.icon} size={18} />
                    </span>
                    <span>
                      <span className="rx-mono" style={{ display: "block", fontSize: 10.5, letterSpacing: "0.12em", color: "#6E6961" }}>{c.k}</span>
                      <span style={{ fontSize: 15, color: "#fff" }}>{c.v}</span>
                    </span>
                  </a>
                ))}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: 11, background: "#17171a", border: "1px solid #2A2A2E", color: "var(--rx-orange-400)", flex: "0 0 auto" }}>
                    <RXIcon name="mapPin" size={18} />
                  </span>
                  <span>
                    <span className="rx-mono" style={{ display: "block", fontSize: 10.5, letterSpacing: "0.12em", color: "#6E6961" }}>REGISTERED ADDRESS</span>
                    <span style={{ fontSize: 15, color: "#cfcdc9", lineHeight: 1.5 }}>Kodinjiyil, Palakuzha, Muvattupuzha,<br />Ernakulam, Kerala 686662</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rx-rise" style={{ animationDelay: "0.08s", background: "#0e0e10", border: "1px solid #1f1f22", borderRadius: 20, padding: 28 }}>
              {!sent ? (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span className="rx-field-label">Name</span>
                    <input name="name" placeholder="Your name" className="rx-input" required />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span className="rx-field-label">Email</span>
                    <input name="email" type="email" placeholder="you@company.com" className="rx-input" required />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span className="rx-field-label">What&apos;s this about?</span>
                    <select name="topic" className="rx-input" defaultValue="">
                      <option value="" disabled>Choose a topic</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span className="rx-field-label">Message</span>
                    <textarea name="message" rows={3} placeholder="A line or two of context" className="rx-textarea" style={{ resize: "vertical" }} />
                  </label>
                  <RXButton variant="solid" size="lg" type="submit" fullWidth>Send message</RXButton>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 320, gap: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "rgba(232,72,8,.14)", color: "var(--rx-orange-400)" }}>
                    <RXIcon name="check" size={26} />
                  </span>
                  <h3 style={{ fontFamily: "var(--rx-font-display)", fontWeight: 700, fontSize: 22, margin: 0, color: "#fff" }}>Message received.</h3>
                  <p style={{ margin: 0, fontSize: 15, color: "#9C9A97", maxWidth: "32ch" }}>Thanks for reaching out. Your email client should have opened, we&apos;ll reply shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer (always night) ===== */}
      <footer className="rx-night" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid #1f1f22", background: "#0A0A0B", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/motif/motif_lines_orange.svg" alt="" aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "100%", opacity: 0.28, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: MAX_W, margin: "0 auto", padding: "64px 28px 36px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between" }}>
            <div style={{ maxWidth: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logos/logo_horizontal_white.svg" alt="Rexin Dynamics" style={{ height: 22 }} />
              <p style={{ margin: "20px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#9C9A97" }}>
                We build AI automation, websites and agents for businesses worldwide, and autonomous drones on our path to Physical AI. Engineered in Kerala, India.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <a href="https://linkedin.com/company/rexin-dynamics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rx-mono" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", border: "1px solid #2A2A2E", color: "#9C9A97", fontSize: 13, fontWeight: 600 }}>in</a>
                <a href="https://instagram.com/rexindynamics" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rx-mono" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", border: "1px solid #2A2A2E", color: "#9C9A97", fontSize: 11, fontWeight: 600 }}>IG</a>
              </div>
            </div>
            <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", marginBottom: 16 }}>Explore</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {navItems.filter((n) => n.href !== "#global").map((n) => (
                    <a key={n.href} href={n.href} className="rx-footlink">{n.label}</a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", marginBottom: 16 }}>Legal</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <a href="/terms/" className="rx-footlink">Terms &amp; Conditions</a>
                  <a href="/privacy/" className="rx-footlink">Privacy Policy</a>
                  <a href="/refund-cancellation/" className="rx-footlink">Refund &amp; Cancellation</a>
                  <a href="/return/" className="rx-footlink">Return Policy</a>
                  <a href="/shipping/" className="rx-footlink">Shipping Policy</a>
                  <a href="/bank-details/" className="rx-footlink">Bank Transfer Details</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #2A2A2E", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6E6961" }}>© {new Date().getFullYear()} Rexin Dynamics Private Limited · Kochi, Kerala</span>
            <span className="rx-mono" style={{ fontSize: 12, color: "#6E6961" }}>www.rexindynamics.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
