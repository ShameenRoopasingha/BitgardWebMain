/**
 * =============================================================================
 * BITGARD WEBSITE - HERO SECTION
 * =============================================================================
 * 
 * Left-aligned hero with TextType typing animation showcasing
 * what Bitgard Pvt Ltd does.
 * 
 * @author Bitgard Development Team
 * @version 2.0.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import TextType from "@/components/TextType";
import CircularText from "@/components/CircularText";

// -----------------------------------------------------------------------------
// Typing sentences that describe what Bitgard does
// -----------------------------------------------------------------------------

const TYPING_SENTENCES = [
    "Engineering high-performance SaaS solutions that drive growth.",
    "Streamlining retail with intelligent POS and inventory systems.",
    "Architecting scalable software that evolves with your business.",
    "Turning complex challenges into seamless digital experiences.",
    "Where visionary ideas are forged into powerful software reality.",
];

// -----------------------------------------------------------------------------
// Hero Section Component
// -----------------------------------------------------------------------------

export function HeroClient({ content }: { content: any }) {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const typingRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    duration: 1,
                    ease: "power3.out",
                },
            });

            // Animate headline
            tl.fromTo(
                headlineRef.current,
                { opacity: 0, y: 60, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1 }
            );

            // Animate typing section
            tl.fromTo(
                typingRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8 },
                "-=0.6"
            );

            // Animate CTA buttons
            tl.fromTo(
                ctaRef.current?.children || [],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 },
                "-=0.4"
            );

            // Animate scroll indicator
            tl.fromTo(
                scrollIndicatorRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5 },
                "-=0.2"
            );

            // Continuous bounce on scroll indicator
            gsap.to(scrollIndicatorRef.current, {
                y: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 2,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex items-center overflow-hidden"
            aria-label="Hero section"
        >
            {/* ------------------------------------------------------------------- */}
            {/* Background Watermark */}
            {/* ------------------------------------------------------------------- */}
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] md:opacity-[0.05] pointer-events-none z-0"
                style={{ transform: 'translate(25%, -50%) scale(3)' }}
            >
                <CircularText
                    text=" -BITGARD- Dreams Forged In Code "
                    spinDuration={40}
                    className="text-orange-500 w-50 h-50 text-[10px] text-spacing-1"
                    onHover="goBonkers"
                />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* Hero Content - Left Aligned */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-20 container mx-auto px-6 md:px-12 lg:px-20">
                {/* Small label */}
                <div
                    className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
                    style={{ opacity: 0 }}
                    ref={(el) => {
                        if (el) {
                            gsap.to(el, { opacity: 1, delay: 0.3, duration: 0.8 });
                        }
                    }}
                >
                    Bitgard (Pvt) Ltd — Software Company
                </div>

                {/* Main Headline - Left aligned, golden ratio typography (φ = 1.618) */}
                <h1
                    ref={headlineRef}
                    className="mb-8 max-w-4xl"
                    style={{ opacity: 0 }}
                >
                    {content?.headline ? (
                        <span className="block text-white whitespace-pre-line text-6xl font-bold tracking-tight">
                            {content.headline}
                        </span>
                    ) : (
                        <>
                            {/* Tier 1: Base size — elegant setup */}
                            <span className="block text-white text-4xl font-normal tracking-wide">
                                Dreams Forged
                            </span>
                            {/* Tier 2: φ × base — the punchline */}
                            <span
                                className="block text-6xl font-extrabold tracking-tight"
                                style={{
                                    color: '#ff6b00',
                                    textShadow: '0 0 10px rgba(255,107,0,0.6), 0 0 30px rgba(255,107,0,0.3), 0 0 60px rgba(255,107,0,0.15)',
                                }}
                            >
                                in Code
                            </span>
                        </>
                    )}
                </h1>

                {/* TextType Typing Animation - What we do */}
                <div
                    ref={typingRef}
                    className="mb-10 max-w-2xl"
                    style={{ opacity: 0, minHeight: '3.5rem' }}
                >
                    <TextType
                        text={TYPING_SENTENCES}
                        as="p"
                        className="text-gray-300 font-light text-2xl"
                        typingSpeed={40}
                        deletingSpeed={25}
                        pauseDuration={2500}
                        loop={true}
                        showCursor={true}
                        cursorCharacter="|"
                        cursorClassName="text-primary-400"
                        cursorBlinkDuration={0.6}
                    />
                </div>

                {/* Call-to-Action Buttons - Left aligned */}
                <div
                    ref={ctaRef}
                    className="flex flex-col sm:flex-row gap-4 items-start"
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
                style={{ opacity: 0 }}
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
