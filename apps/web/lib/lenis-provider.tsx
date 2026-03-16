/**
 * =============================================================================
 * BITGARD WEBSITE - SCROLL PROVIDER
 * =============================================================================
 * 
 * Simple scroll provider using native CSS smooth scroll.
 * More reliable than Lenis for anchor link navigation.
 * 
 * @author Bitgard Development Team
 * @version 2.0.0
 */

"use client";

import { useEffect, ReactNode, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LenisProviderProps {
    children: ReactNode;
}

// -----------------------------------------------------------------------------
// Scroll Provider Component (Lenis Implementation)
// -----------------------------------------------------------------------------

/**
 * LenisProvider - Provides premium smooth scrolling
 * 
 * Uses Lenis for momentum scrolling and integrates with GSAP ScrollTrigger.
 */
export function LenisProvider({ children }: LenisProviderProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Synchronize Lenis with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
                if (targetId && targetId !== "#") {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement && lenisRef.current) {
                        lenisRef.current.scrollTo(targetElement as HTMLElement, {
                            offset: -80, // Header offset
                        });
                    }
                }
            });
        });

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, []);

    return <>{children}</>;
}

// -----------------------------------------------------------------------------
// Scroll To Function
// -----------------------------------------------------------------------------

/**
 * Smooth scroll to an element with offset (Lenis compatible)
 */
export function scrollToElement(elementId: string, offset: number = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        // Fallback or custom event dispatch handling could go here
        // For now, we rely on the Lenis instance if accessible, 
        // or standard scrollIntoView as fallback if called outside provider context (rare)
        element.scrollIntoView({ behavior: "smooth" });
    }
}

export default LenisProvider;
