/**
 * =============================================================================
 * BITGARD WEBSITE - ABOUT SECTION
 * =============================================================================
 * 
 * Company story section with:
 * - Mission statement
 * - Company stats/metrics
 * - Story highlights
 * - GSAP scroll-triggered animations
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiTarget, FiHeart, FiZap, FiUsers, FiAward, FiGlobe } from "react-icons/fi";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------

const STATS = [
    { label: "Years Experience", value: "8+", icon: FiAward },
    { label: "Projects Delivered", value: "150+", icon: FiTarget },
    { label: "Happy Clients", value: "80+", icon: FiUsers },
    { label: "Countries Served", value: "12", icon: FiGlobe },
];

const VALUES = [
    {
        icon: FiTarget,
        title: "Mission-Driven",
        description: "We're on a mission to democratize software, making powerful tools accessible to businesses of all sizes.",
    },
    {
        icon: FiHeart,
        title: "Customer First",
        description: "Every decision we make starts with a simple question: how does this benefit our customers?",
    },
    {
        icon: FiZap,
        title: "Innovation",
        description: "We constantly push boundaries, embracing new technologies to deliver cutting-edge solutions.",
    },
];

// -----------------------------------------------------------------------------
// Stats Counter Component
// -----------------------------------------------------------------------------

interface StatCardProps {
    stat: (typeof STATS)[number];
}

function StatCard({ stat }: StatCardProps) {
    const IconComponent = stat.icon;

    return (
        <div className="stat-card text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// Value Card Component
// -----------------------------------------------------------------------------

interface ValueCardProps {
    value: (typeof VALUES)[number];
}

function ValueCard({ value }: ValueCardProps) {
    const IconComponent = value.icon;

    return (
        <div className="value-card flex gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary-500/30 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// About Section Component
// -----------------------------------------------------------------------------

/**
 * About - Company story and values section
 */
export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);

    // GSAP scroll-triggered animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate section heading
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animate story content
            gsap.fromTo(
                storyRef.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: storyRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            // Animate stats
            const statCards = statsRef.current?.querySelectorAll(".stat-card");
            if (statCards) {
                gsap.fromTo(
                    statCards,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }

            // Animate values
            const valueCards = valuesRef.current?.querySelectorAll(".value-card");
            if (valueCards) {
                gsap.fromTo(
                    valueCards,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.15,
                        scrollTrigger: {
                            trigger: valuesRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="section bg-background"
            aria-labelledby="about-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        About Us
                    </span>
                    <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Building the Future,{" "}
                        <span className="gradient-text">One Line at a Time</span>
                    </h2>
                </div>

                {/* Story Section */}
                <div ref={storyRef} className="max-w-4xl mx-auto mb-20">
                    <div className="prose prose-lg prose-invert mx-auto text-center">
                        <p className="text-xl text-foreground leading-relaxed mb-6">
                            Founded in 2017, Bitgard was born from a simple belief: that every business
                            deserves access to powerful, well-crafted software, regardless of size or budget.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            What started as a small team of passionate developers has grown into a
                            full-service software company. We've helped startups scale, enterprises
                            modernize, and countless businesses transform their operations through
                            innovative technology solutions. Our tagline, "Dreams Forged in Code,"
                            reflects our commitment to turning ambitious visions into digital reality.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div
                    ref={statsRef}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border"
                >
                    {STATS.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Values Section */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white text-center mb-10">
                        Our Core Values
                    </h3>
                    <div ref={valuesRef} className="space-y-4">
                        {VALUES.map((value, index) => (
                            <ValueCard key={index} value={value} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
