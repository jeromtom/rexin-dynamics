"use client";

import { useEffect, useState, type FormEvent } from "react";

import { EngageSequence } from "@/components/rx/EngageSequence";
import { RXIcon, type RXIconName } from "@/components/rx/RXIcon";
import { useTheme } from "@/components/theme-provider";
import { currencyForCountry, detectCountry } from "@/lib/geo";

const navItems = [
  { href: "#systems", label: "Systems" },
  { href: "#process", label: "Process" },
  { href: "#operations", label: "Operations" },
  { href: "#company", label: "Company" },
];

type Service = {
  title: string;
  description: string;
  topic: string;
  status?: "Available" | "R&D";
  note?: string;
};

type ServiceLine = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  icon: RXIconName;
  services: Service[];
};

const serviceLines: ServiceLine[] = [
  {
    id: "automations",
    number: "01",
    label: "Digital systems",
    title: "Automations & agents",
    description:
      "Operational systems that connect the tools your team already uses and keep routine work moving with clear human checkpoints.",
    icon: "cpu",
    services: [
      {
        title: "AI workflow automation",
        description:
          "Map a repeatable process, connect its inputs and outputs, and build the automation around the decisions that still need a person.",
        topic: "Automations & Agents",
        status: "Available",
      },
      {
        title: "Voice & WhatsApp agents",
        description:
          "Conversational agents for calls and WhatsApp workflows, designed around the specific handoff, qualification, or follow-up path you need.",
        topic: "Automations & Agents",
        status: "Available",
      },
    ],
  },
  {
    id: "products",
    number: "02",
    label: "Digital systems",
    title: "Websites & products",
    description:
      "Clear public-facing sites and focused web products, designed as usable systems rather than decorative launches.",
    icon: "code",
    services: [
      {
        title: "Websites & web apps",
        description:
          "Websites and web applications with an information structure, interface, and deployment path matched to the work they need to do.",
        topic: "Websites & Products",
        status: "Available",
      },
      {
        title: "Rapid MVP Sprint",
        description:
          "One scoped and deployable workflow in seven days, once requirements are agreed. It is a focused delivery term, not an open-ended product build.",
        topic: "Rapid MVP Sprint",
        status: "Available",
        note: "One workflow · seven days · deployable scope",
      },
    ],
  },
  {
    id: "aerial",
    number: "03",
    label: "Aerial systems",
    title: "Aerial systems",
    description:
      "Practical aerial engagements and longer-horizon flight research are intentionally separated, so the delivery path is clear from the start.",
    icon: "drone",
    services: [
      {
        title: "Custom aerial platforms",
        description:
          "Mission-specific aerial platforms developed around the airframe, payload, and operating conditions that define the work.",
        topic: "Aerial Systems",
        status: "Available",
      },
      {
        title: "Drone light shows",
        description:
          "Aerial-light-show engagements planned around the event brief, flight area, choreography, and operational requirements.",
        topic: "Aerial Systems",
        status: "Available",
      },
      {
        title: "Workshops & labs",
        description:
          "Hands-on aerial-systems sessions for schools, colleges, and engineering teams, shaped to the participants and available facilities.",
        topic: "Aerial Systems",
        status: "Available",
      },
      {
        title: "Autonomous-flight R&D",
        description:
          "Exploratory work in autonomous flight, control, and related aerial systems. This is research work, scoped separately from available engagements.",
        topic: "Aerial Systems R&D",
        status: "R&D",
      },
    ],
  },
];

const currencies = [
  { code: "USD", name: "US dollar" },
  { code: "CAD", name: "Canadian dollar" },
  { code: "AED", name: "UAE dirham" },
  { code: "GBP", name: "Pound sterling" },
  { code: "EUR", name: "Euro" },
  { code: "INR", name: "Indian rupee" },
  { code: "AUD", name: "Australian dollar" },
  { code: "SGD", name: "Singapore dollar" },
  { code: "NZD", name: "New Zealand dollar" },
  { code: "CHF", name: "Swiss franc" },
];

const processSteps = [
  { n: "01", title: "Frame the work", body: "Start with the operating problem, constraints, and the decision that defines success." },
  { n: "02", title: "Set the scope", body: "Turn the brief into a defined delivery path, with terms and dependencies made explicit." },
  { n: "03", title: "Build the system", body: "Design, engineering, and review proceed against the agreed workflow or aerial brief." },
  { n: "04", title: "Deploy & hand over", body: "Put the agreed deliverable into use and document the handover, next steps, or research boundary." },
];

const topics = ["Automations & Agents", "Websites & Products", "Rapid MVP Sprint", "Aerial Systems", "Aerial Systems R&D", "General inquiry"];

const faqs = [
  { q: "What is included in a Rapid MVP Sprint?", a: "The sprint is one scoped, deployable workflow delivered in seven days after requirements are agreed. The exact workflow is defined before the sprint begins." },
  { q: "How are aerial engagements different from aerial R&D?", a: "Custom aerial platforms, drone light shows, workshops, and labs are available engagements. Autonomous-flight work is R&D and is scoped separately as exploratory work." },
  { q: "Which invoice currencies are supported?", a: "USD, CAD, AED, GBP, EUR, INR, AUD, SGD, NZD, and CHF are supported. The operations console can preselect a supported currency from a visitor's country when available." },
  { q: "How do we start a project?", a: "Send the operating context, desired outcome, and any timing or technical constraints. Rexin will use that to determine whether the work fits an available engagement or an R&D discussion." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

function Schematic() {
  return (
    <svg className="rd-schematic" viewBox="0 0 720 300" fill="none" aria-hidden="true">
      <path d="M0 74H132L172 114H348L388 74H534L580 120H720" />
      <path d="M0 220H82L118 184H306L350 228H496L552 176H720" />
      <path d="M170 0V114M170 184v116M550 0v120M550 176v124" strokeDasharray="4 7" />
      <circle cx="170" cy="114" r="8" />
      <circle cx="550" cy="176" r="8" />
      <circle cx="350" cy="228" r="5" className="rd-schematic-accent" />
      <circle cx="580" cy="120" r="5" className="rd-schematic-accent" />
      <path d="M350 114v114M306 184l44-70 38 70" className="rd-schematic-soft" />
    </svg>
  );
}

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [visitorCountry, setVisitorCountry] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("General inquiry");
  const [sent, setSent] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let active = true;
    void detectCountry().then((country) => {
      if (!active || !country) return;
      setVisitorCountry(country);
      const detectedCurrency = currencyForCountry(country);
      if (!detectedCurrency) return;
      setCurrency(detectedCurrency);
    });
    return () => { active = false; };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const activeCurrency = currencies.find((item) => item.code === currency) ?? currencies[5];
  const chooseCurrency = (code: string) => { setCurrency(code); };
  const prepareInquiry = (topic: string) => { setSelectedTopic(topic); setSent(false); };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const topic = String(form.get("topic") ?? "General inquiry");
    const message = String(form.get("message") ?? "");
    const subject = `Rexin Dynamics inquiry: ${topic}`;
    const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;
    window.location.href = `mailto:contact@rexindynamics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="rd-page">
      <a className="rd-skip-link" href="#main">Skip to content</a>
      <header className="rd-header">
        <div className="rd-shell rd-header-inner">
          <a className="rd-brand" href="#top" aria-label="Rexin Dynamics home" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={isDark ? "/assets/logos/logo_horizontal_white.svg" : "/assets/logos/logo_horizontal_primary.svg"} alt="Rexin Dynamics" />
          </a>
          <nav className="rd-desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="rd-header-actions">
            <button className="rd-theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}>
              <RXIcon name={isDark ? "sun" : "moon"} size={15} /><span>{isDark ? "Light" : "Dark"}</span>
            </button>
            <a className="rd-header-contact" href="#contact">Start a brief</a>
            <button className="rd-menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((open) => !open)}>
              <RXIcon name={menuOpen ? "x" : "menu"} size={20} />
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav id="mobile-navigation" className="rd-mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
            <a href="#contact" onClick={() => setMenuOpen(false)}>Start a brief</a>
          </nav>
        ) : null}
      </header>

      <main id="main">
        <section id="top" className="rd-hero" aria-labelledby="hero-title">
          <div className="rd-shell rd-hero-inner">
            <div className="rd-hero-marker">RDX / 01 — KOCHI, INDIA</div>
            <div className="rd-hero-copy">
              <p className="rd-kicker">Digital + aerial engineering</p>
              <h1 id="hero-title">Systems for work.<br />Systems for flight.</h1>
              <p className="rd-lede">Rexin Dynamics designs focused digital systems and aerial systems from Kochi, Kerala. The work begins with the operating constraint, then moves toward a defined delivery path.</p>
            </div>
            <div className="rd-hero-split">
              <article className="rd-hero-discipline">
                <div className="rd-discipline-topline"><span>01</span><span>Digital systems</span></div>
                <h2>Automate operations. Ship useful products.</h2>
                <p>AI workflow automation, voice and WhatsApp agents, websites, web apps, and a tightly scoped MVP Sprint.</p>
                <a href="#systems">Explore digital systems <RXIcon name="arrowUpRight" size={16} /></a>
              </article>
              <article className="rd-hero-discipline">
                <div className="rd-discipline-topline"><span>02</span><span>Aerial systems</span></div>
                <h2>Build for the air. Research with intent.</h2>
                <p>Custom aerial platforms, drone light shows, workshops and labs, plus separately scoped autonomous-flight R&D.</p>
                <a href="#systems">Explore aerial systems <RXIcon name="arrowUpRight" size={16} /></a>
              </article>
            </div>
          </div>
          <Schematic />
        </section>

        <section id="systems" className="rd-section rd-systems" aria-labelledby="systems-title">
          <div className="rd-shell">
            <div className="rd-section-heading">
              <p className="rd-kicker">Commercial systems</p>
              <h2 id="systems-title">Three clear lines of work.</h2>
              <p>Choose a delivery path for available work, or start an R&D discussion where the outcome still needs to be explored.</p>
            </div>
            <div className="rd-system-lines">
              {serviceLines.map((line) => (
                <article key={line.id} className={`rd-system-line rd-system-line--${line.id}`}>
                  <div className="rd-system-summary">
                    <div className="rd-system-number">{line.number}</div><RXIcon name={line.icon} size={24} />
                    <p className="rd-system-label">{line.label}</p><h3>{line.title}</h3><p>{line.description}</p>
                  </div>
                  <div className="rd-offer-list">
                    {line.services.map((service) => (
                      <div className="rd-offer" key={service.title}>
                        <div className="rd-offer-meta">{service.status ? <span data-status={service.status.toLowerCase()}>{service.status}</span> : null}{service.note ? <span>{service.note}</span> : null}</div>
                        <h4>{service.title}</h4><p>{service.description}</p>
                        <a href="#contact" onClick={() => prepareInquiry(service.topic)}>Discuss this scope <RXIcon name="arrowUpRight" size={15} /></a>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="rd-section rd-process" aria-labelledby="process-title">
          <div className="rd-shell">
            <div className="rd-process-heading"><div><p className="rd-kicker">Delivery sequence</p><h2 id="process-title">Work moves through a clear sequence.</h2></div><p>On desktop, follow the sequence as the brief progresses. On smaller screens and for reduced motion, the same steps remain static and readable.</p></div>
            <EngageSequence steps={processSteps} />
          </div>
        </section>

        <section id="operations" className="rd-section rd-operations" aria-labelledby="operations-title">
          <div className="rd-shell">
            <div className="rd-section-heading rd-operations-heading"><p className="rd-kicker">Operations console</p><h2 id="operations-title">Currency routing, without the noise.</h2><p>Supported invoice currencies are listed here. When available, a country-level signal preselects the matching supported currency; nothing is stored.</p></div>
            <div className="rd-operations-console">
              <div className="rd-currency-panel" aria-label="Supported invoice currencies">
                <div className="rd-console-head"><span>Invoice currency</span><span>{visitorCountry ? `Country signal / ${visitorCountry}` : "Manual selection"}</span></div>
                <div className="rd-active-currency"><span>{activeCurrency.code}</span><p>{activeCurrency.name}</p></div>
                <div className="rd-currency-list">
                  {currencies.map((item) => <button key={item.code} type="button" aria-pressed={currency === item.code} className={currency === item.code ? "is-active" : ""} onClick={() => chooseCurrency(item.code)}><span>{item.code}</span><span>{item.name}</span></button>)}
                </div>
                <p className="rd-currency-note">Choose a supported invoice currency before sending a brief. Availability is confirmed when the scope is reviewed.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="company" className="rd-section rd-company" aria-labelledby="company-title">
          <div className="rd-shell rd-company-grid">
            <div className="rd-company-heading"><p className="rd-kicker">Company</p><h2 id="company-title">A Kochi base for digital and aerial work.</h2><p>Rexin Dynamics Private Limited operates from the Kerala Startup Mission Integrated Startup Complex in Kochi, Kerala, and is led by founder and CEO Jerom Tom.</p><a className="rd-text-action" href="#contact">Start with the brief <RXIcon name="arrowUpRight" size={16} /></a></div>
            <div className="rd-company-details">
              <div><p className="rd-detail-label">Registration and recognition</p><div className="rd-credential-list"><article className="rd-credential"><p>Ministry of Corporate Affairs</p><strong>U26515KL2025PTC098575</strong><span>Certificate of Incorporation</span><a href="/documents/certificate-of-incorporation.pdf" target="_blank" rel="noreferrer">View incorporation certificate <RXIcon name="arrowUpRight" size={14} /></a></article><article className="rd-credential"><p>DPIIT · Startup India</p><strong>DIPP233529</strong><span>Certificate of Recognition</span><a href="/documents/dpiit-certificate-of-recognition.pdf" target="_blank" rel="noreferrer">View DPIIT certificate <RXIcon name="arrowUpRight" size={14} /></a></article><article className="rd-credential"><p>Kerala Startup Mission</p><strong>DIPP233529/2025/KSUM5047</strong><span>Unique ID</span><a href="/documents/ksum-startup-certificate.pdf" target="_blank" rel="noreferrer">View KSUM certificate <RXIcon name="arrowUpRight" size={14} /></a></article></div></div>
              
              <address><p className="rd-detail-label">Corporate office</p>First Floor, Integrated Startup Complex,<br />Kerala Startup Mission, Kerala Technology Innovation Zone,<br />Kinfra Hi-Tech Park, HMT Colony P.O., Kalamassery,<br />Kochi, Kerala 683503, India</address>
            </div>
          </div>
        </section>

        <section id="faq" className="rd-section rd-faq-section" aria-labelledby="faq-title">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <div className="rd-shell"><div className="rd-section-heading"><p className="rd-kicker">Working notes</p><h2 id="faq-title">Useful answers before a brief.</h2></div><dl className="rd-faq-list">{faqs.map((faq) => <div key={faq.q}><dt>{faq.q}</dt><dd>{faq.a}</dd></div>)}</dl></div>
        </section>

        <section id="contact" className="rd-section rd-contact" aria-labelledby="contact-title">
          <div className="rd-shell rd-contact-grid">
            <div className="rd-contact-copy"><p className="rd-kicker">Start a brief</p><h2 id="contact-title">Give us the operating context.</h2><p>A short note is enough to begin: what needs to change, who uses it, and the constraint that matters most.</p><div className="rd-contact-details"><a href="mailto:contact@rexindynamics.com"><RXIcon name="mail" size={18} /> contact@rexindynamics.com</a><a href="tel:+918921588769"><RXIcon name="phone" size={18} /> +91 89215 88769</a><p><RXIcon name="mapPin" size={18} /> First Floor, Integrated Startup Complex, Kerala Startup Mission, KTIZ, Kinfra Hi-Tech Park, Kalamassery, Kochi, Kerala 683503</p></div></div>
            <div className="rd-contact-form-wrap">
              {sent ? <div className="rd-form-result" role="status"><RXIcon name="check" size={24} /><h3>Your email draft is ready.</h3><p>Your mail app should have opened with the enquiry details. If it did not, email contact@rexindynamics.com directly.</p><button type="button" onClick={() => setSent(false)}>Send another brief</button></div> : (
                <form className="rd-form" onSubmit={handleSubmit}>
                  <label><span>Name</span><input name="name" autoComplete="name" required placeholder="Your name" /></label>
                  <label><span>Email</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
                  <label><span>Topic</span><select name="topic" value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>{topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label>
                  <label><span>Brief</span><textarea name="message" rows={5} placeholder="Context, desired outcome, timing, and constraints" /></label>
                  <button className="rd-submit" type="submit">Prepare email <RXIcon name="arrowUpRight" size={17} /></button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="rd-footer">
        <div className="rd-shell rd-footer-inner">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={isDark ? "/assets/logos/logo_horizontal_white.svg" : "/assets/logos/logo_horizontal_primary.svg"} alt="Rexin Dynamics" />
            <p>Digital systems. Aerial systems. Kochi, Kerala.</p>
          </div>
          <div className="rd-footer-links">
            <a href="/terms/">Terms</a><a href="/privacy/">Privacy</a><a href="/refund-cancellation/">Refunds</a>
            <a href="https://linkedin.com/company/rexin-dynamics" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://instagram.com/rexindynamics" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p className="rd-footer-meta" suppressHydrationWarning>© {new Date().getFullYear()} Rexin Dynamics Private Limited</p>
        </div>
      </footer>
    </div>
  );
}
