/**
 * =============================================================================
 * BITGARD WEBSITE - SERVICES SECTION (CLIENT COMPONENT)
 * =============================================================================
 * 
 * Animated client component for displaying services.
 * Receives data as props from the server wrapper.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    FiCode,
    FiLayout,
    FiDatabase,
    FiCloud,
    FiShield,
    FiHeadphones,
    FiArrowRight,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import BorderGlow from "@/components/BorderGlow";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ServiceData {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
}

interface ServicesClientProps {
    services: ServiceData[];
}

// -----------------------------------------------------------------------------
// Icon Mapping
// -----------------------------------------------------------------------------

const ICON_MAP: Record<string, IconType> = {
    FiCode: FiCode,
    FiLayout: FiLayout,
    FiDatabase: FiDatabase,
    FiCloud: FiCloud,
    FiShield: FiShield,
    FiHeadphones: FiHeadphones,
};


// -----------------------------------------------------------------------------
// Service Card Component
// -----------------------------------------------------------------------------

interface ServiceCardProps {
    service: ServiceData;
}

function ServiceCard({ service }: ServiceCardProps) {
    const IconComponent = ICON_MAP[service.icon] || FiCode;

    return (
        <BorderGlow 
            className="service-card group cursor-pointer h-full"
            glowColor="30 100 55" // Bitgard Neon Orange
            backgroundColor="#050308" // Deep dark background to contrast the glow
            glowIntensity={1.2}
            borderRadius={20}
        >
            <div className="p-6 relative flex flex-col h-full transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors duration-300">
                    <IconComponent className="w-7 h-7" />
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>

                {/* Description */}
                <p className="text-muted-foreground mb-5 leading-relaxed flex-grow">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* CTA Link */}
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-primary-400 font-medium group/link hover:text-primary-300 transition-colors mt-auto"
                >
                    Get Started
                    <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
                </a>

                {/* Remove the old static hover glow as BorderGlow handles it actively */}
            </div>
        </BorderGlow>
    );
}

// -----------------------------------------------------------------------------
// Services Client Component
// -----------------------------------------------------------------------------

export function ServicesClient({ services }: ServicesClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const displayServices = services;

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

            // Animate service cards with stagger
            const cards = cardsRef.current?.querySelectorAll(".service-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [displayServices]);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="section bg-background"
            aria-labelledby="services-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        Our Services
                    </span>
                    <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Expert Solutions for{" "}
                        <span className="gradient-text">Every Challenge</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        From concept to deployment and beyond, we offer comprehensive services
                        to bring your digital vision to life.
                    </p>
                </div>

                {/* Services Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesClient;
