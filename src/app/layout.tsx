import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rexin Dynamics - Pioneering the Future of Aerial Robotics",
  description:
    "Rexin Dynamics Private Limited is a cutting-edge drone and aerial robotics startup specializing in entertainment and defense applications. We bring spectacular drone light shows to life while developing confidential defense solutions for the future.",
  keywords: [
    "drone light shows",
    "aerial robotics",
    "defense solutions",
    "drone technology",
    "entertainment",
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rexindynamics.com",
    siteName: "Rexin Dynamics",
    title: "Rexin Dynamics - Pioneering the Future of Aerial Robotics",
    description: "Cutting-edge drone and aerial robotics startup specializing in entertainment and defense applications.",
    images: [
      {
        url: "https://rexindynamics.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rexin Dynamics - Aerial Robotics Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rexin Dynamics - Pioneering the Future of Aerial Robotics",
    description: "Cutting-edge drone and aerial robotics startup specializing in entertainment and defense applications.",
    images: ["https://rexindynamics.com/og-image.jpg"],
    creator: "@rexindynamics",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
