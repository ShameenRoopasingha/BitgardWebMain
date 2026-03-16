/**
 * =============================================================================
 * BITGARD CMS - ROOT LAYOUT
 * =============================================================================
 * 
 * The root layout for the CMS admin dashboard.
 * Includes font configuration and global providers.
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// -----------------------------------------------------------------------------
// Font Configuration
// -----------------------------------------------------------------------------

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "Bitgard CMS",
    template: "%s | Bitgard CMS",
  },
  description: "Content management system for Bitgard website",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2196f3",
  width: "device-width",
  initialScale: 1,
};

// -----------------------------------------------------------------------------
// Root Layout Component
// -----------------------------------------------------------------------------

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${manrope.variable}`}>
      <body>
        {children}

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #334155",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#1e293b",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#1e293b",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
