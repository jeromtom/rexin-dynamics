'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import DynamicWaveCanvasBackground from "@/components/ui/dynamic-wave-canvas-background";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);

      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 120) {
          element.classList.add("revealed");
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  const handleDiscussClick = (serviceTitle: string) => {
    const message = `Hi, I'm interested in learning more about ${serviceTitle} at Rexin Dynamics.`;
    
    if (isMobile()) {
      // Open WhatsApp on mobile
      const whatsappNumber = "918921588769";
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    } else {
      // Open email on desktop
      const email = "contact@rexindynamics.com";
      const subject = encodeURIComponent(`Inquiry about ${serviceTitle}`);
      const body = encodeURIComponent(message);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav – minimal, techy */}
      <nav
        className={`fixed top-0 z-50 w-full border-b border-border/70 backdrop-blur-sm transition-all duration-300 ${
          isScrolled ? "bg-background/95" : "bg-background/75"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              <span className="font-bold">REXIN</span> <span className="font-normal">Dynamics</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink
                        href={item.href}
                        className="px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-md transition-colors"
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <DynamicWaveCanvasBackground />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 text-center sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative h-48 w-full max-w-md overflow-hidden sm:h-56 sm:max-w-lg md:h-64 md:max-w-xl">
              <Image
                src={resolvedTheme === 'dark' 
                  ? "/Rexin Dynamics Transparent White Logo.png" 
                  : "/Rexin Dynamics Transparent Black Logo.png"}
                alt="Rexin Dynamics"
                width={400}
                height={400}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>
          </div>

          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
            Aerial Robotics · R&amp;D · Education
          </p>

          <p className="mb-8 max-w-xl text-sm text-muted-foreground sm:text-base">
            In stealth mode, quietly building the next generation of custom drones,
            workshops, and learning experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-6 text-[0.7rem] uppercase tracking-[0.2em]"
            >
              Get in touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-6 text-[0.7rem] uppercase tracking-[0.2em]"
            >
              View services
            </Button>
          </div>
        </div>

        {/* Subtle scroll hint */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform text-center text-[0.65rem] text-muted-foreground">
          <div className="mb-2 tracking-[0.3em] uppercase">Scroll</div>
          <div className="mx-auto h-8 w-px bg-muted-foreground/40" />
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-reveal border-t border-border bg-background py-16"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              About
            </p>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Early‑stage aerial robotics in stealth
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Rexin Dynamics is an early‑stage aerial robotics startup currently
              operating in stealth mode. While we shape upcoming projects, we already
              collaborate on customised drone builds, hands‑on workshops, and learning
              experiences for teams, students, and professionals.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { number: "100+", label: "Custom builds & pilots" },
              { number: "50+", label: "Collaborators & clients" },
              { number: "24/7", label: "Technical support window" },
              { number: "99%", label: "Uptime across flights" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center space-y-1 rounded-lg border border-dashed border-border/80 bg-muted/40 px-4 py-4 text-center"
              >
                <div className="text-xl font-semibold">{item.number}</div>
                <div className="text-[0.7rem] text-muted-foreground uppercase tracking-[0.15em]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="scroll-reveal border-t border-border bg-muted/40 py-16"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              What we do
            </p>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Focused on a few high‑signal tracks
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              We stay intentionally small and focused, working closely with teams on
              drones, flight systems, and learning programs that actually ship.
            </p>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base mt-4">
              Pricing starts from ₹5,000 and goes up to ₹50,000.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Stealth‑mode R&D",
                tag: "R&D",
                body: "Long‑horizon projects in autonomous flight, swarms, and control systems, developed quietly with select partners.",
              },
              {
                title: "Custom drone builds",
                tag: "Build",
                body: "Mission‑specific multirotors and fixed‑wing platforms: from concept and airframe to payload integration and field testing.",
              },
              {
                title: "Workshops & labs",
                tag: "Learn",
                body: "Hands‑on sessions and short programs covering fundamentals, building, tuning, and flying for schools, colleges, and teams.",
              },
            ].map((card) => (
              <Card
                key={card.title}
                className="flex h-full flex-col justify-between border border-border bg-card/80"
              >
                <div className="space-y-3 px-5 pt-5">
                  <span className="inline-flex rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {card.tag}
                  </span>
                  <h3 className="text-base font-medium tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.body}</p>
                </div>
                <div className="px-5 pb-5 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-[0.7rem] uppercase tracking-[0.2em]"
                    onClick={() => handleDiscussClick(card.title)}
                  >
                    Discuss this
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        className="scroll-reveal border-t border-border bg-background py-16"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Team
            </p>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              People behind the systems
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Siona Shaji",
                role: "MD",
                description: "Operations and delivery.",
                image: "/team-siona.png",
                linkedin: "https://linkedin.com/in/siona-shaji-zacharias",
                email: "siona@rexindynamics.com",
              },
              {
                name: "Junaid CK",
                role: "CTO-Software",
                description: "Developing software systems.",
                image: "/team-junaid.png",
                linkedin: "https://linkedin.com/in/junaid-c-k",
                email: "junaid@rexindynamics.com",
              },
              {
                name: "Arjun Raju",
                role: "CTO-Hardware",
                description: "Developing hardware systems.",
                image: "/team-arjun.png",
                linkedin: "https://linkedin.com/in/arjun-raju-498b7532a",
                email: "arjun@rexindynamics.com",
              },
              {
                name: "Jerom Tom",
                role: "CEO",
                description: "Leading the vision and strategy.",
                image: "/team-jerom.png",
                linkedin: "https://linkedin.com/in/jeromtom",
                email: "jerom@rexindynamics.com",
              },
            ].map((member) => (
              <Card
                key={member.name}
                className="border border-border bg-card/80 text-center"
              >
                <div className="flex flex-col items-center space-y-4 px-5 py-6">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border/80 bg-muted">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">{member.name}</h3>
                    <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <p className="max-w-[14rem] text-xs text-muted-foreground">
                    {member.description}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border/70 bg-muted/60 p-1.5 hover:bg-muted transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="rounded-md border border-border/70 bg-muted/60 p-1.5 hover:bg-muted transition-colors"
                      aria-label={`${member.name} Email`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-reveal border-t border-border bg-muted/40 py-16"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Contact
            </p>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Ready when you are
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              A short message with context is enough to start a conversation. We tend
              to reply quickly, even if we&apos;re in the lab.
            </p>
          </div>

          <Card className="border border-border bg-card/80 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </p>
                <p className="text-sm">contact@rexindynamics.com</p>
              </div>
              <div>
                <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </p>
                <p className="text-sm">+91 89215 88769</p>
              </div>
              <div>
                <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Registered address
                </p>
                <p className="text-xs text-muted-foreground">
                  KODINJIYIL, Palakuzha, Muvattupuzha, Ernakulam, Kerala 686662
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-border/70 pt-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://linkedin.com/company/rexin-dynamics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://rexindynamics.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Website
                </Link>
                <Link
                  href="https://instagram.com/rexindynamics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Instagram
                </Link>
              </div>
              <div>
                <Link
                  href="/bank-details"
                  className="text-[0.7rem] uppercase tracking-[0.15em] underline-offset-4 hover:underline"
                >
                  Bank Transfer Details
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-4xl space-y-3 px-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.25em]">
              Rexin Dynamics Private Limited
            </p>
            <p className="mt-1">
              Pioneering the future of aerial robotics · Kerala, India
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/terms"
              className="underline-offset-4 hover:underline"
            >
              Terms &amp; Conditions
            </Link>
            <span>·</span>
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/refund-cancellation"
              className="underline-offset-4 hover:underline"
            >
              Refund &amp; Cancellation
            </Link>
            <span>·</span>
            <Link
              href="/return"
              className="underline-offset-4 hover:underline"
            >
              Return Policy
            </Link>
            <span>·</span>
            <Link
              href="/shipping"
              className="underline-offset-4 hover:underline"
            >
              Shipping Policy
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Rexin Dynamics Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
