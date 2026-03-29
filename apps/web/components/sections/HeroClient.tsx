/**
 * =============================================================================
 * BITGARD WEBSITE - HERO SECTION
 * =============================================================================
 * 
 * The hero section is the first thing visitors see. It features:
 * - 3D animated background scene
 * - Animated headline and tagline using GSAP
 * - Call-to-action buttons
 * - Scroll indicator
 * 
 * Performance optimized with:
 * - Dynamic import for 3D scene
 * - GSAP SplitText for text animations
 * - Intersection observer for visibility
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { FiArrowRight, FiPlay } from "react-icons/fi";



// -----------------------------------------------------------------------------
// Hero Section Component
// -----------------------------------------------------------------------------

/**
 * HeroClient - Client component for the hero section
 */
export function HeroClient({ content }: { content: any }) {
    // Refs for GSAP animations
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    // Initialize GSAP animations on mount
    useEffect(() => {
        // Create animation context for cleanup
        const ctx = gsap.context(() => {
            // Create a timeline for sequenced animations
            const tl = gsap.timeline({
                defaults: {
                    duration: 1,
                    ease: "power3.out",
                },
            });

            // Animate headline
            tl.fromTo(
                headlineRef.current,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }
            );

            // Animate tagline (starts slightly before headline finishes)
            tl.fromTo(
                taglineRef.current,
                {
                    opacity: 0,
                    y: 40,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                },
                "-=0.6" // Overlap with previous animation
            );

            // Animate CTA buttons
            tl.fromTo(
                ctaRef.current?.children || [],
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.6,
                },
                "-=0.4"
            );

            // Animate scroll indicator with infinite bounce
            tl.fromTo(
                scrollIndicatorRef.current,
                {
                    opacity: 0,
                    y: -20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                },
                "-=0.2"
            );

            // Add continuous bounce animation to scroll indicator
            gsap.to(scrollIndicatorRef.current, {
                y: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 2,
            });
        }, sectionRef);

        // Cleanup on unmount
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            aria-label="Hero section"
        >
            {/* ------------------------------------------------------------------- */}
            {/* Gradient Overlay for Text Readability - Minimal/No Background */}
            {/* ------------------------------------------------------------------- */}
            {/* We now use the global Light Pillar background in layout.tsx */}

            {/* ------------------------------------------------------------------- */}
            {/* Hero Content */}
            {/* ------------------------------------------------------------------- */}

            {/* ------------------------------------------------------------------- */}
            {/* Hero Content */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-20 container mx-auto px-6 text-center">
                {/* Main Headline */}
                <h1
                    ref={headlineRef}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
                    style={{ opacity: 0 }} // Start hidden for GSAP
                >
                    {content?.headline ? (
                        <span className="block text-white whitespace-pre-line">{content.headline}</span>
                    ) : (
                        <>
                            <span className="block text-white">Dreams Forged</span>
                            <span className="block gradient-text">in Code</span>
                        </>
                    )}
                </h1>

                {/* Tagline */}
                <p
                    ref={taglineRef}
                    className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 whitespace-pre-line"
                    style={{ opacity: 0 }} // Start hidden for GSAP
                >
                    {content?.subheadline || 
                        "Transforming businesses with innovative SaaS solutions. From POS systems\n" +
                        "to tax filing, we build the software that powers your success."}
                </p>

                {/* Call-to-Action Buttons */}
                <div
                    ref={ctaRef}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    {/* Primary CTA */}
                    <a
                        href={content?.ctaLink || "#products"}
                        className="btn btn-primary group"
                        aria-label={content?.ctaText || "Explore our products"}
                    >
                        {content?.ctaText || "Explore Products"}
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </a>

                    {/* Secondary CTA */}
                    <a
                        href="#contact"
                        className="btn btn-secondary group"
                        aria-label="Watch demo video"
                    >
                        <FiPlay className="transition-transform group-hover:scale-110" />
                        Watch Demo
                    </a>
                </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* Scroll Indicator */}
            {/* ------------------------------------------------------------------- */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
                style={{ opacity: 0 }} // Start hidden for GSAP
            >
                <a
                    href="#products"
                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label="Scroll to products section"
                >
                    <span className="text-sm font-medium tracking-wider uppercase">
                        Scroll
                    </span>
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-current rounded-full" />
                    </div>
                </a>
            </div>
        </section>
    );
}

export default HeroClient;
