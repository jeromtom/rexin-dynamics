import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RawEmbed } from "@/components/raw-embed";

const plexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rexindynamics.com";
const isPreview = process.env.NEXT_PUBLIC_DEPLOY_ENV === "preview";
const title = isPreview
  ? "Rexin Dynamics — Industrial redesign preview"
  : "Rexin Dynamics — Digital and aerial systems";
const description =
  "Rexin Dynamics designs automation, web products, and aerial systems from Kochi, Kerala. Services include AI workflow automation, voice and WhatsApp agents, focused web delivery, custom aerial platforms, drone light shows, workshops, and autonomous-flight R&D.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  keywords: [
    "AI workflow automation",
    "voice agents",
    "WhatsApp agents",
    "websites",
    "web apps",
    "Rapid MVP Sprint",
    "aerial systems",
    "custom aerial platforms",
    "drone light shows",
    "autonomous flight R&D",
    "Kochi",
    "Kerala",
    "Rexin Dynamics",
  ],
  authors: [{ name: "Rexin Dynamics Private Limited" }],
  creator: "Rexin Dynamics Private Limited",
  publisher: "Rexin Dynamics Private Limited",
  robots: {
    index: !isPreview,
    follow: !isPreview,
    googleBot: {
      index: !isPreview,
      follow: !isPreview,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Rexin Dynamics",
    title,
    description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Rexin Dynamics — Digital and aerial systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rexin Dynamics Private Limited",
  alternateName: "Rexin Dynamics",
  url: siteUrl,
  logo: new URL("/og-image.jpg", siteUrl).toString(),
  description,
  slogan: "Digital systems. Aerial systems.",
  identifier: [
    { "@type": "PropertyValue", name: "Corporate Identity Number (CIN)", value: "U26515KL2025PTC098575" },
    { "@type": "PropertyValue", name: "DPIIT Certificate of Recognition", value: "DIPP233529" },
    { "@type": "PropertyValue", name: "Kerala Startup Mission Unique ID", value: "DIPP233529/2025/KSUM5047" },
  ],
  foundingLocation: "Kochi, Kerala, India",
  currenciesAccepted: "USD, CAD, AED, GBP, EUR, INR, AUD, SGD, NZD, CHF",
  knowsAbout: [
    "AI workflow automation",
    "Voice agents",
    "WhatsApp agents",
    "Website and web app development",
    "Rapid MVP delivery",
    "Custom aerial platforms",
    "Drone light shows",
    "Autonomous-flight research and development",
    "Aerial systems workshops",
  ],
  email: "contact@rexindynamics.com",
  telephone: "+91-89215-88769",
  address: {
    "@type": "PostalAddress",
    streetAddress: "First Floor, Integrated Startup Complex, Kerala Startup Mission, Kerala Technology Innovation Zone, Kinfra Hi-Tech Park, HMT Colony P.O.",
    addressLocality: "Kalamassery, Kochi",
    addressRegion: "Kerala",
    postalCode: "683503",
    addressCountry: "IN",
  },
  founder: [
    { "@type": "Person", name: "Jerom Tom", jobTitle: "CEO", sameAs: ["https://linkedin.com/in/jeromtom"] },
  ],
  sameAs: ["https://linkedin.com/company/rexin-dynamics", "https://instagram.com/rexindynamics"],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Automations & Agents",
        serviceType: "AI workflow automation and conversational agents",
        description: "AI workflow automation plus voice and WhatsApp agents, designed around a defined operating workflow.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Websites & Products",
        serviceType: "Website and web product development",
        description: "Websites, web applications, and a Rapid MVP Sprint for one scoped and deployable workflow in seven days once requirements are agreed.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Aerial Systems",
        serviceType: "Aerial systems engineering",
        description: "Available engagements include custom aerial platforms, drone light shows, workshops, and labs. Autonomous-flight work is separately scoped R&D.",
      },
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rexin Dynamics",
  url: siteUrl,
  publisher: { "@type": "Organization", name: "Rexin Dynamics Private Limited" },
  inLanguage: "en",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plexSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {/* NeetoChat widget: no-op until NEXT_PUBLIC_NEETOCHAT_EMBED_SNIPPET is set. */}
        <RawEmbed html={process.env.NEXT_PUBLIC_NEETOCHAT_EMBED_SNIPPET} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
