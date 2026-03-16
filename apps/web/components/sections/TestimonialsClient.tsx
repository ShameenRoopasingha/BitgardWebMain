/**
 * =============================================================================
 * BITGARD WEBSITE - TESTIMONIALS SECTION (CLIENT COMPONENT)
 * =============================================================================
 * 
 * Animated client component for displaying testimonials.
 * Receives data as props from the server wrapper.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiStar } from "react-icons/fi";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TestimonialData {
    id: string;
    clientName: string;
    clientTitle: string;
    company: string;
    content: string;
    rating: number;
}

interface TestimonialsClientProps {
    testimonials: TestimonialData[];
}


// -----------------------------------------------------------------------------
// Rating Stars Component
// -----------------------------------------------------------------------------

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                        }`}
                />
            ))}
        </div>
    );
}

// -----------------------------------------------------------------------------
// Testimonial Card Component
// -----------------------------------------------------------------------------

interface TestimonialCardProps {
    testimonial: TestimonialData;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className="testimonial-card group relative p-6 rounded-2xl bg-card border border-border hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
            {/* Quote mark */}
            <div className="absolute top-4 right-4 text-6xl font-serif text-primary-500/10 leading-none">
                &quot;
            </div>

            {/* Rating */}
            <div className="mb-4">
                <RatingStars rating={testimonial.rating} />
            </div>

            {/* Quote content */}
            <blockquote className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                &quot;{testimonial.content}&quot;
            </blockquote>

            {/* Client info */}
            <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                        {testimonial.clientName.split(" ").map(n => n[0]).join("")}
                    </span>
                </div>

                {/* Name and title */}
                <div>
                    <p className="font-semibold text-white">{testimonial.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                        {testimonial.clientTitle}, {testimonial.company}
                    </p>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-500/5 to-cyan-500/5" />
        </div>
    );
}

// -----------------------------------------------------------------------------
// Testimonials Client Component
// -----------------------------------------------------------------------------

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const displayTestimonials = testimonials;

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

            // Animate testimonial cards with stagger
            const cards = cardsRef.current?.querySelectorAll(".testimonial-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50 },
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
    }, [displayTestimonials]);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="section bg-background"
            aria-labelledby="testimonials-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        Testimonials
                    </span>
                    <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        What Our <span className="gradient-text">Clients Say</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what businesses have achieved
                        with Bitgard solutions.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayTestimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsClient;
