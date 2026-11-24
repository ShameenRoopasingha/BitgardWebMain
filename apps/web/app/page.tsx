"use client";

/**
 * =============================================================================
 * BITGARD HOMEPAGE - REDESIGNED COMMERCIAL SAAS EXPERIENCE
 * =============================================================================
 * 
 * Engineered in strict compliance with the Landing Page Design System:
 * - One clear offer: Commercial retail and fleet operations desktop software
 * - One primary action: "Explore products and subscribe"
 * - Authentic UI screenshots from running software (Vigil and POS)
 * - Geist typography, strict spacing tokens, flat dark surfaces (#000000, #181818)
 * - Mandatory scroll-driven tagline reveal section (B11)
 * - Full objection-handling FAQ and zero-risk commercial licensing terms
 */

import React from "react";
import { HomepageHero } from "@/components/sections/HomepageHero";
import { FlagshipProducts } from "@/components/sections/FlagshipProducts";
import { TaglineReveal } from "@/components/sections/TaglineReveal";
import { HomepageBenefits } from "@/components/sections/HomepageBenefits";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { HomepageFaq } from "@/components/sections/HomepageFaq";
import { HomepageCta } from "@/components/sections/HomepageCta";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Vigil Tour Management & Fleet OS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows 10, Windows 11, macOS, Linux",
        "description": "Commercial tour operations and fleet management desktop suite with live GPS telematics and precision invoicing.",
        "offers": {
          "@type": "Offer",
          "price": "5000",
          "priceCurrency": "LKR"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Bitgard POS & Inventory Management",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Windows 10, Windows 11, macOS, Linux, Web",
        "description": "High-throughput point of sale and batch inventory tracking suite with sub-second barcode checkout and multi-store cloud sync.",
        "offers": {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do you offer a free trial or demo version?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Bitgard provides commercial, enterprise grade software with dedicated local infrastructure, instant cryptographic license provisioning, and guaranteed uptime. You can subscribe month to month with no long term lock in and cancel at any time."
            }
          },
          {
            "@type": "Question",
            "name": "Can the software work completely offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Both Vigil and Bitgard POS are engineered as native desktop applications with local SQLite database storage. You can continue billing, scanning items, and registering driver duties even during complete internet blackouts."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-[#000000] text-foreground min-h-screen font-sans selection:bg-primary selection:text-white">
      {/* Structured Data for SEO / AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Above the fold: Hero Section & Product Showcase Mockup */}
      <HomepageHero />

      {/* 2. Mid page argument: Problem-to-Solution & Flagship Products */}
      <FlagshipProducts />

      {/* 3. Mandatory Tagline Reveal Section (B11) */}
      <TaglineReveal />

      {/* 4. Outcome-Driven Benefits */}
      <HomepageBenefits />

      {/* 5. How It Works (3 Steps) & Engineering Specifications */}
      <HowItWorks />

      {/* 6. Objection Handling: FAQ Section */}
      <HomepageFaq />

      {/* 7. Final Action & Risk Reversal Banner */}
      <HomepageCta />
    </div>
  );
}
