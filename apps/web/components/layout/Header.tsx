/**
 * =============================================================================
 * BITGARD WEBSITE - NAVIGATION HEADER
 * =============================================================================
 * 
 * The main navigation header component with:
 * - Logo and brand name
 * - Desktop navigation links with scroll spy
 * - Mobile hamburger menu
 * - Transparent to solid background transition on scroll
 * - GSAP animations for smooth entrance
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleMobileMenu, closeMobileMenu, setHasScrolled } from "@/store/slices/ui-slice";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Navigation Links Configuration
// -----------------------------------------------------------------------------

/**
 * Navigation items with their section IDs and labels
 */
const NAV_LINKS = [
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "team", label: "Team" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
] as const;

// -----------------------------------------------------------------------------
// Header Component
// -----------------------------------------------------------------------------

/**
 * Header - Main navigation header with desktop and mobile menus
 * 
 * Features:
 * - Transparent on hero, solid on scroll
 * - Smooth scroll to sections
 * - Mobile responsive hamburger menu
 * - Active section highlighting
 */
export function Header() {
    // Redux state
    const dispatch = useAppDispatch();
    const { isMobileMenuOpen, hasScrolled, activeSection } = useAppSelector(
        (state) => state.ui
    );

    // Refs for animations
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);

    // Track scroll position for header styling
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            dispatch(setHasScrolled(scrolled));
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch]);

    // GSAP entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate header elements on load
            const tl = gsap.timeline({ delay: 0.5 });

            tl.fromTo(
                logoRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            );

            tl.fromTo(
                navRef.current?.querySelectorAll("a") || [],
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" },
                "-=0.3"
            );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    /**
     * Handle smooth scroll to section using native scroll
     */
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string
    ) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            // Get header height for offset
            const headerHeight = headerRef.current?.offsetHeight || 80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: "smooth",
            });
        }
        // Close mobile menu if open
        dispatch(closeMobileMenu());
    };

    return (
        <header
            ref={headerRef}
            className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${hasScrolled
                    ? "bg-background/90 backdrop-blur-lg border-b border-border py-4"
                    : "bg-transparent py-6"
                }
      `}
            role="banner"
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* ------------------------------------------------------------- */}
                    {/* Logo */}
                    {/* ------------------------------------------------------------- */}
                    <div ref={logoRef} className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                            aria-label="Bitgard Home"
                        >
                            {/* Logo Image */}
                            <div className="relative w-10 h-10 md:w-12 md:h-12">
                                <Image
                                    src="/logo.png"
                                    alt="Bitgard Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Brand Name */}
                            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                                Bitgard
                            </span>
                        </Link>
                    </div>

                    {/* ------------------------------------------------------------- */}
                    {/* Desktop Navigation */}
                    {/* ------------------------------------------------------------- */}
                    <nav
                        ref={navRef}
                        className="hidden lg:flex items-center gap-1"
                        role="navigation"
                        aria-label="Main navigation"
                    >
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => handleNavClick(e, link.id)}
                                className={`
                  relative px-4 py-2 text-sm font-medium tracking-wide
                  transition-colors duration-200
                  ${activeSection === link.id
                                        ? "text-primary-400"
                                        : "text-muted-foreground hover:text-foreground"
                                    }
                `}
                                aria-current={activeSection === link.id ? "page" : undefined}
                            >
                                {link.label}

                                {/* Active indicator */}
                                {activeSection === link.id && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />
                                )}
                            </a>
                        ))}

                        {/* CTA Button */}
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, "contact")}
                            className="ml-4 btn btn-primary text-sm py-2 px-5"
                        >
                            Get Started
                        </a>
                    </nav>

                    {/* ------------------------------------------------------------- */}
                    {/* Mobile Menu Toggle */}
                    {/* ------------------------------------------------------------- */}
                    <button
                        type="button"
                        className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                        onClick={() => dispatch(toggleMobileMenu())}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Mobile Menu */}
            {/* ----------------------------------------------------------------- */}
            <div
                id="mobile-menu"
                className={`
          lg:hidden absolute top-full left-0 right-0
          bg-background/95 backdrop-blur-lg border-b border-border
          transition-all duration-300 overflow-hidden
          ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
                role="navigation"
                aria-label="Mobile navigation"
            >
                <nav className="container mx-auto px-6 py-6">
                    <ul className="flex flex-col gap-2">
                        {NAV_LINKS.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    onClick={(e) => handleNavClick(e, link.id)}
                                    className={`
                    block py-3 px-4 rounded-lg text-lg font-medium
                    transition-colors duration-200
                    ${activeSection === link.id
                                            ? "text-primary-400 bg-primary-500/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }
                  `}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}

                        {/* Mobile CTA */}
                        <li className="mt-4">
                            <a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, "contact")}
                                className="btn btn-primary w-full justify-center"
                            >
                                Get Started
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
