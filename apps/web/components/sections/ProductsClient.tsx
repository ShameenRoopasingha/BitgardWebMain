/**
 * =============================================================================
 * BITGARD WEBSITE - PRODUCTS SECTION (CLIENT COMPONENT)
 * =============================================================================
 * 
 * Animated client component for displaying products.
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
    FiMonitor,
    FiPackage,
    FiFileText,
    FiGlobe,
    FiSmartphone,
    FiArrowRight,
    FiBox
} from "react-icons/fi";
import type { IconType } from "react-icons";
import SpotlightCard from "@/components/SpotlightCard";
// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ProductData {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    description: string;
    icon: string;
    features: string[];
}

interface ProductsClientProps {
    products: ProductData[];
}

// -----------------------------------------------------------------------------
// Icon Mapping
// -----------------------------------------------------------------------------

const ICON_MAP: Record<string, IconType> = {
    FiMonitor: FiMonitor,
    FiPackage: FiPackage,
    FiFileText: FiFileText,
    FiGlobe: FiGlobe,
    FiSmartphone: FiSmartphone,
    FiBox: FiBox,
};

const COLOR_MAP: Record<string, string> = {
    FiMonitor: "from-blue-500 to-cyan-500",
    FiPackage: "from-purple-500 to-pink-500",
    FiFileText: "from-green-500 to-emerald-500",
    FiGlobe: "from-orange-500 to-amber-500",
    FiSmartphone: "from-pink-500 to-rose-500",
    default: "from-primary-500 to-cyan-500",
};

const SPOTLIGHT_MAP: Record<string, `rgba(${number}, ${number}, ${number}, ${number})`> = {
    FiMonitor: "rgba(59, 130, 246, 0.15)",
    FiPackage: "rgba(168, 85, 247, 0.15)",
    FiFileText: "rgba(34, 197, 94, 0.15)",
    FiGlobe: "rgba(249, 115, 22, 0.15)",
    FiSmartphone: "rgba(236, 72, 153, 0.15)",
    default: "rgba(249, 115, 22, 0.15)",
};


// -----------------------------------------------------------------------------
// Product Card Component
// -----------------------------------------------------------------------------

interface ProductCardProps {
    product: ProductData;
}

function ProductCard({ product }: ProductCardProps) {
    const IconComponent = ICON_MAP[product.icon] || FiBox;
    const colorClass = COLOR_MAP[product.icon] || COLOR_MAP.default;
    const spotlightColor = SPOTLIGHT_MAP[product.icon] || SPOTLIGHT_MAP.default;

    return (
        <SpotlightCard className="product-card group h-full flex flex-col" spotlightColor={spotlightColor}>
            {/* Icon with gradient background */}
            <div
                className={`
                    w-16 h-16 rounded-xl mb-6 flex items-center justify-center
                    bg-gradient-to-br ${colorClass}
                    shadow-md group-hover:scale-110 transition-transform duration-300
                `}
            >
                <IconComponent className="w-8 h-8 text-white" />
            </div>

            {/* Product Name & Tagline */}
            <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
            <p className="text-primary-400 font-medium mb-4">{product.tagline}</p>

            {/* Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Features */}
            <ul className={`grid gap-x-3 gap-y-2 mb-6 text-sm ${product.features.length > 5 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground/80 leading-snug">
                        <span className={`w-1.5 h-1.5 mt-1.5 shrink-0 rounded-full bg-gradient-to-r ${colorClass}`} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Link */}
            <a
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 text-primary-400 font-medium group/link hover:text-primary-300 transition-colors mt-auto"
            >
                Learn More
                <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
            </a>
        </SpotlightCard>
    );
}

// -----------------------------------------------------------------------------
// Products Client Component
// -----------------------------------------------------------------------------

export function ProductsClient({ products }: ProductsClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const displayProducts = products;

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

            // Animate product cards with stagger
            const cards = cardsRef.current?.querySelectorAll(".product-card");
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
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
    }, [displayProducts]);

    return (
        <section
            ref={sectionRef}
            id="products"
            className="section bg-background"
            aria-labelledby="products-heading"
        >
            <div className="container mx-auto px-6">
                {/* Section Heading */}
                <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                        Our Products
                    </span>
                    <h2 id="products-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Software Solutions That{" "}
                        <span className="gradient-text">Power Your Business</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        From point-of-sale systems to custom applications, we build the tools
                        that help businesses thrive in the digital age.
                    </p>
                </div>

                {/* Products Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductsClient;
