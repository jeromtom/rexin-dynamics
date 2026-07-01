import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  variable: "--rx-font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--rx-font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--rx-font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const description =
  "Rexin Dynamics is an AI and robotics company in Kochi, Kerala, India working with businesses worldwide. We deliver AI automation, website and web app development, AI voice agents and WhatsApp automation, and we are building indigenous autonomous drones and the agentic AI behind them, getting closer to Physical AI.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rexindynamics.com"),
  title: "Rexin Dynamics: Getting closer to Physical AI",
  description,
  alternates: { canonical: "/" },
  keywords: [
    "AI automation",
    "agentic AI",
    "website development",
    "web app development",
    "AI voice agents",
    "WhatsApp automation",
    "autonomous drones",
    "aerial robotics",
    "Physical AI",
    "Kochi",
    "Kerala",
    "India",
    "Rexin Dynamics",
    "Rexin Dynamics Private Limited",
  ],
  authors: [{ name: "Rexin Dynamics Private Limited" }],
  creator: "Rexin Dynamics Private Limited",
  publisher: "Rexin Dynamics Private Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rexindynamics.com",
    siteName: "Rexin Dynamics",
    title: "Rexin Dynamics: Getting closer to Physical AI",
    description,
    images: [
      {
        url: "https://rexindynamics.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rexin Dynamics: AI, automation and aerial robotics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rexin Dynamics: Getting closer to Physical AI",
    description,
    images: ["https://rexindynamics.com/og-image.jpg"],
    creator: "@rexindynamics",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rexin Dynamics Private Limited",
  alternateName: "Rexin Dynamics",
  url: "https://rexindynamics.com",
  logo: "https://rexindynamics.com/og-image.jpg",
  description,
  slogan: "Getting closer to Physical AI.",
  foundingLocation: "Kochi, Kerala, India",
  areaServed: [
    "Worldwide",
    "United States",
    "Canada",
    "United Arab Emirates",
    "United Kingdom",
    "European Union",
    "India",
  ],
  currenciesAccepted: "USD, CAD, AED, GBP, EUR, INR",
  knowsAbout: [
    "AI automation",
    "Agentic AI",
    "Multi-modal AI",
    "Workflow automation",
    "Website development",
    "Web app development",
    "AI voice agents",
    "WhatsApp automation",
    "Conversational AI",
    "Aerial robotics",
    "Autonomous drones",
    "Swarm control systems",
    "Custom drone manufacturing",
    "Physical AI",
  ],
  email: "contact@rexindynamics.com",
  telephone: "+91-89215-88769",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kodinjiyil, Palakuzha, Muvattupuzha",
    addressLocality: "Ernakulam",
    addressRegion: "Kerala",
    postalCode: "686662",
    addressCountry: "IN",
  },
  founder: [
    { "@type": "Person", name: "Jerom Tom", jobTitle: "CEO", sameAs: ["https://linkedin.com/in/jeromtom"] },
    { "@type": "Person", name: "Junaid CK", jobTitle: "CTO", sameAs: ["https://www.linkedin.com/in/junaid-c-k/"] },
  ],
  sameAs: [
    "https://linkedin.com/company/rexin-dynamics",
    "https://instagram.com/rexindynamics",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        serviceType: "AI automation",
        name: "AI automation",
        description:
          "Agentic workflows that connect your tools and run the busywork: data entry, follow-ups, routing and reporting, with a human in the loop. Delivered for businesses worldwide.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        serviceType: "Web development",
        name: "Website and web app development",
        description:
          "Fast, modern websites and web apps designed and built to ship, from marketing sites to full product front-ends.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        serviceType: "AI voice agent",
        name: "AI voice agents",
        description:
          "AI voice agents that answer calls, qualify leads and book appointments around the clock in a natural voice.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        serviceType: "WhatsApp automation",
        name: "WhatsApp agents",
        description:
          "WhatsApp automation that replies instantly, routes conversations and follows up where your customers already are.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        serviceType: "Aerial robotics",
        name: "Autonomous drones and flight systems",
        description:
          "Custom drone builds, autonomous flight R&D and hands-on workshops, the engineering behind our path to Physical AI.",
      },
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rexin Dynamics",
  url: "https://rexindynamics.com",
  publisher: { "@type": "Organization", name: "Rexin Dynamics Private Limited" },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
