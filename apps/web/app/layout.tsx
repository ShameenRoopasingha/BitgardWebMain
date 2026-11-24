/**
 * =============================================================================
 * BITGARD WEBSITE - ROOT LAYOUT
 * =============================================================================
 * 
 * The root layout component that wraps all pages. It includes:
 * - Font configuration (Outfit, Inter, Fira Code)
 * - Global providers (Redux, Lenis smooth scroll)
 * - SEO metadata
 * - Navigation and Footer components
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GradualBlur from "@/components/ui/GradualBlur";
import DarkVeil from "@/components/backgrounds/DarkVeil";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Providers
import { ReduxProvider } from "@/lib/redux-provider";
import { LenisProvider } from "@/lib/lenis-provider";

// Layout Components
import { FloatingNavbar } from "@/components/magic/FloatingNavbar";
import { Footer } from "@/components/layout/Footer";

// -----------------------------------------------------------------------------
// Font Configuration (Geist & Geist Mono per Landing Page Design System)
// -----------------------------------------------------------------------------

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

// -----------------------------------------------------------------------------
// SEO Metadata Configuration
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "Bitgard | Dreams Forged in Code",
    template: "%s | Bitgard",
  },
  description:
    "Bitgard is a leading software development company specializing in SaaS products including POS & IMS systems, Tax Filing solutions, custom websites, and mobile applications. Transform your business with our innovative solutions.",
  keywords: [
    "software development",
    "SaaS products",
    "POS systems",
    "inventory management",
    "tax filing software",
    "web development",
    "mobile apps",
    "Bitgard",
  ],
  authors: [{ name: "Bitgard", url: "https://bitgard.com" }],
  creator: "Bitgard",
  publisher: "Bitgard",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bitgard.com",
    siteName: "Bitgard",
    title: "Bitgard | Dreams Forged in Code",
    description:
      "Transform your business with innovative SaaS solutions from Bitgard.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bitgard - Dreams Forged in Code",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitgard | Dreams Forged in Code",
    description:
      "Transform your business with innovative SaaS solutions from Bitgard.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#E8732A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// -----------------------------------------------------------------------------
// Root Layout Component
// -----------------------------------------------------------------------------

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout - Wraps all pages with providers and layout components
 * 
 * Structure:
 * - ReduxProvider: State management
 * - LenisProvider: Smooth scrolling
 * - Header: Navigation
 * - Main content
 * - Footer
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} font-sans`}
      suppressHydrationWarning
    >
      <body>
        <ReduxProvider>
          <LenisProvider>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg"
            >
              Skip to main content
            </a>

            {/* Main Content Wrapper - Relative z-10 for interactivity */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <FloatingNavbar />

              {/* Main Content */}
              <main id="main-content" className="flex-grow">{children}</main>

              {/* Footer */}
              <Footer />
            </div>

            {/* Premium Gradual Blur Effect */}
            <GradualBlur position="bottom" height="120px" blur="8px" />

            {/* React Bits - DarkVeil Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <DarkVeil
                scanlineFrequency={5}
                scanlineIntensity={1}
                hueShift={20}
              />
            </div>
          </LenisProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
