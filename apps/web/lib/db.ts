/**
 * =============================================================================
 * DATABASE UTILITY - WEB APP DATA FETCHING
 * =============================================================================
 * 
 * Server-side data fetching functions for the web app.
 * Uses Prisma client from @bitgard/database package.
 * 
 * All functions include error handling and return demo data as fallback.
 */

import {
    prisma,
    type Service,
    type TeamMember,
    type Testimonial,
    type Product,
    type HeroContent,
    type SiteSettings
} from "@bitgard/database";

// =============================================================================
// SERVICES
// =============================================================================

export async function getActiveServices(): Promise<Service[]> {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
        return services;
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
}

// =============================================================================
// TEAM MEMBERS
// =============================================================================

export async function getActiveTeamMembers(): Promise<TeamMember[]> {
    try {
        const members = await prisma.teamMember.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
        return members;
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return [];
    }
}

// =============================================================================
// TESTIMONIALS
// =============================================================================

export async function getActiveTestimonials(): Promise<Testimonial[]> {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return testimonials;
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return [];
    }
}

// =============================================================================
// PRODUCTS
// =============================================================================

export async function getActiveProducts(): Promise<Product[]> {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

// =============================================================================
// HERO CONTENT
// =============================================================================

export async function getActiveHeroContent(): Promise<HeroContent | null> {
    try {
        const hero = await prisma.heroContent.findFirst({
            where: { isActive: true },
        });
        return hero;
    } catch (error) {
        console.error("Failed to fetch hero content:", error);
        return null;
    }
}

// =============================================================================
// SITE SETTINGS
// =============================================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const settings = await prisma.siteSettings.findFirst({
            where: { id: "main" },
        });
        return settings;
    } catch (error) {
        console.error("Failed to fetch site settings:", error);
        return null;
    }
}
