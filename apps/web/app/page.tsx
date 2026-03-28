/**
 * =============================================================================
 * BITGARD WEBSITE - HOMEPAGE
 * =============================================================================
 * 
 * The main homepage that assembles all sections together.
 * 
 * Sections:
 * 1. Hero - 3D animated introduction
 * 2. Products - SaaS product showcase
 * 3. Services - Service offerings
 * 4. About - Company story
 * 5. Team - Team members
 * 6. Testimonials - Client feedback
 * 7. Contact - Contact form
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

export const dynamic = "force-dynamic";

import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

// -----------------------------------------------------------------------------
// Homepage Component
// -----------------------------------------------------------------------------

/**
 * Home - Main homepage with all sections
 * 
 * Each section is a self-contained component with its own
 * animations, data fetching, and styling.
 */
export default function Home() {
  return (
    <>
      {/* Hero Section - 3D animated introduction */}
      <Hero />

      {/* Products Section - SaaS products showcase */}
      <Products />

      {/* Services Section - Service offerings */}
      <Services />

      {/* About Section - Company story */}
      <About />

      {/* Team Section - Team members */}
      <Team />

      {/* Testimonials Section - Client feedback */}
      <Testimonials />

      {/* Contact Section - Contact form */}
      <Contact />
    </>
  );
}
