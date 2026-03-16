/**
 * =============================================================================
 * BITGARD WEBSITE - FOOTER
 * =============================================================================
 * 
 * The site footer with:
 * - Company branding and description
 * - Quick links to all sections
 * - Product links
 * - Contact information
 * - Social media links
 * - Newsletter signup
 * - Copyright notice
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import {
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiGithub,
    FiInstagram,
    FiMail,
    FiPhone,
    FiMapPin,
    FiArrowRight
} from "react-icons/fi";

// -----------------------------------------------------------------------------
// Footer Links Configuration
// -----------------------------------------------------------------------------

const QUICK_LINKS = [
    { label: "Home", href: "#hero" },
    { label: "Products", href: "#products" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
];

const PRODUCT_LINKS = [
    { label: "Smart POS", href: "/products/pos" },
    { label: "Inventory Pro", href: "/products/ims" },
    { label: "TaxEase", href: "/products/tax" },
    { label: "WebCraft", href: "/products/web" },
    { label: "AppForge", href: "/products/mobile" },
];

const SOCIAL_LINKS = [
    { icon: FiFacebook, href: "https://facebook.com/bitgard", label: "Facebook" },
    { icon: FiTwitter, href: "https://twitter.com/bitgard", label: "Twitter" },
    { icon: FiLinkedin, href: "https://linkedin.com/company/bitgard", label: "LinkedIn" },
    { icon: FiGithub, href: "https://github.com/bitgard", label: "GitHub" },
    { icon: FiInstagram, href: "https://instagram.com/bitgard", label: "Instagram" },
];

// -----------------------------------------------------------------------------
// Footer Component
// -----------------------------------------------------------------------------

/**
 * Footer - Main site footer with links, contact info, and newsletter
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 border-t border-gray-800" role="contentinfo">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* ------------------------------------------------------------- */}
                    {/* Company Info */}
                    {/* ------------------------------------------------------------- */}
                    <div className="lg:col-span-1">
                        {/* Logo */}
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.png"
                                    alt="Bitgard Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">Bitgard</span>
                        </Link>

                        {/* Tagline */}
                        <p className="text-muted-foreground mb-6">
                            Dreams Forged in Code. Building innovative software solutions
                            that power businesses worldwide.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary-500/20 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ------------------------------------------------------------- */}
                    {/* Quick Links */}
                    {/* ------------------------------------------------------------- */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ------------------------------------------------------------- */}
                    {/* Products */}
                    {/* ------------------------------------------------------------- */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Products</h3>
                        <ul className="space-y-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ------------------------------------------------------------- */}
                    {/* Contact & Newsletter */}
                    {/* ------------------------------------------------------------- */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>

                        {/* Contact Info */}
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <FiMail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:info@bitgard.com"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    info@bitgard.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FiPhone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="tel:+1234567890"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">
                                    123 Tech Street<br />
                                    Innovation City, TC 12345
                                </span>
                            </li>
                        </ul>

                        {/* Newsletter Signup */}
                        <div>
                            <h4 className="text-white font-medium mb-3">Subscribe to Newsletter</h4>
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-grow px-4 py-2.5 bg-muted/50 border border-input rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary-500 transition-colors"
                                    aria-label="Email address for newsletter"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                                    aria-label="Subscribe to newsletter"
                                >
                                    <FiArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-border">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>© {currentYear} Bitgard. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
