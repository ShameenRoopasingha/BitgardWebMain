/**
 * =============================================================================
 * BITGARD WEBSITE - TEAM SECTION (CLIENT COMPONENT)
 * =============================================================================
 * 
 * Animated client component for displaying team members.
 * Receives data as props from the server wrapper.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiLinkedin, FiTwitter, FiGithub } from "react-icons/fi";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TeamMemberData {
    id: string;
    name: string;
    position: string;
    bio: string | null;
    image: string | null;
    linkedin: string | null;
    twitter: string | null;
    github: string | null;
}

interface TeamClientProps {
    members: TeamMemberData[];
}


// -----------------------------------------------------------------------------
// Team Member Card Component
// -----------------------------------------------------------------------------

interface TeamMemberCardProps {
    member: TeamMemberData;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
    return (
        <div className="team-card group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary-500/50 transition-all duration-300">
            {/* Image Container */}
            <div className="relative h-72 overflow-hidden bg-gradient-to-br from-muted to-card">
                {/* Placeholder gradient - would be replaced with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-cyan-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                            {member.name.split(" ").map(n => n[0]).join("")}
                        </span>
                    </div>
                </div>

                {/* Hover overlay with social links */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex gap-4">
                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label={`${member.name}'s LinkedIn`}
                            >
                                <FiLinkedin className="w-5 h-5 text-white" />
                            </a>
                        )}
                        {member.twitter && (
                            <a
                                href={member.twitter}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label={`${member.name}'s Twitter`}
                            >
                                <FiTwitter className="w-5 h-5 text-white" />
                            </a>
                        )}
                        {member.github && (
                            <a
                                href={member.github}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors"
                                aria-label={`${member.name}'s GitHub`}
                            >
                                <FiGithub className="w-5 h-5 text-white" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.position}</p>
                {member.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                )}
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// Team Client Component
// -----------------------------------------------------------------------------

export function TeamClient({ members }: TeamClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const displayMembers = members;

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

            // Animate team cards with stagger
            const cards = cardsRef.current?.querySelectorAll(".team-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 60, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
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
    }, [displayMembers]);

    return (
        <section
            ref={sectionRef}
            id="team"
            className="section bg-background"
            aria-labelledby="team-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        Our Team
                    </span>
                    <h2 id="team-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Meet the <span className="gradient-text">Dreamweavers</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        A passionate team of innovators, creators, and problem solvers dedicated
                        to turning your vision into reality.
                    </p>
                </div>

                {/* Team Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {displayMembers.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TeamClient;
