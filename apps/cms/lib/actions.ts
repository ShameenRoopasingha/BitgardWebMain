/**
 * =============================================================================
 * CMS SERVER ACTIONS
 * =============================================================================
 *
 * Centralized server actions for CMS CRUD operations.
 * Uses consolidated SQL queries, React request deduplication (`getCmsSession`),
 * and tag-invalidated `unstable_cache` reads to minimize cross-region DB latency.
 */

"use server";

import { prisma } from "./db";
import { requireCmsAdmin } from "./auth";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

const CACHE_TTL_SECONDS = 60;

// =============================================================================
// SERVICES ACTIONS
// =============================================================================

interface ServiceInput {
    name: string;
    slug: string;
    description: string;
    icon: string;
    features: string[];
    order?: number;
    isActive?: boolean;
}

const getCachedServices = unstable_cache(
    async () =>
        prisma.service.findMany({
            orderBy: { order: "asc" },
        }),
    ["cms:services"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-services"] }
);

export async function getServices() {
    await requireCmsAdmin();
    return getCachedServices();
}

export async function createService(data: ServiceInput) {
    await requireCmsAdmin();
    const service = await prisma.service.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            features: data.features,
            order: data.order ?? 0,
            isActive: data.isActive ?? true,
        },
    });
    revalidateTag("cms-services");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/services");
    return service;
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
    await requireCmsAdmin();
    const service = await prisma.service.update({
        where: { id },
        data,
    });
    revalidateTag("cms-services");
    revalidatePath("/dashboard/services");
    return service;
}

export async function deleteService(id: string) {
    await requireCmsAdmin();
    await prisma.service.delete({
        where: { id },
    });
    revalidateTag("cms-services");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/services");
}

export async function toggleServiceStatus(id: string) {
    await requireCmsAdmin();
    const service = await prisma.service.findUnique({
        where: { id },
        select: { isActive: true },
    });
    if (!service) throw new Error("Service not found");

    const updated = await prisma.service.update({
        where: { id },
        data: { isActive: !service.isActive },
    });
    revalidateTag("cms-services");
    revalidatePath("/dashboard/services");
    return updated;
}

// =============================================================================
// TEAM MEMBERS ACTIONS
// =============================================================================

interface TeamMemberInput {
    name: string;
    position: string;
    bio?: string;
    image?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    order?: number;
    isActive?: boolean;
}

const getCachedTeamMembers = unstable_cache(
    async () =>
        prisma.teamMember.findMany({
            orderBy: { order: "asc" },
        }),
    ["cms:team"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-team"] }
);

export async function getTeamMembers() {
    await requireCmsAdmin();
    return getCachedTeamMembers();
}

export async function createTeamMember(data: TeamMemberInput) {
    await requireCmsAdmin();
    const member = await prisma.teamMember.create({
        data: {
            name: data.name,
            position: data.position,
            bio: data.bio || null,
            image: data.image || null,
            linkedin: data.linkedin || null,
            twitter: data.twitter || null,
            github: data.github || null,
            order: data.order ?? 0,
            isActive: data.isActive ?? true,
        },
    });
    revalidateTag("cms-team");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/team");
    return member;
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>) {
    await requireCmsAdmin();
    const member = await prisma.teamMember.update({
        where: { id },
        data,
    });
    revalidateTag("cms-team");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/team");
    return member;
}

export async function deleteTeamMember(id: string) {
    await requireCmsAdmin();
    await prisma.teamMember.delete({
        where: { id },
    });
    revalidateTag("cms-team");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/team");
}

export async function toggleTeamMemberStatus(id: string) {
    await requireCmsAdmin();
    const member = await prisma.teamMember.findUnique({
        where: { id },
        select: { isActive: true },
    });
    if (!member) throw new Error("Team member not found");

    const updated = await prisma.teamMember.update({
        where: { id },
        data: { isActive: !member.isActive },
    });
    revalidateTag("cms-team");
    revalidatePath("/dashboard/team");
    return updated;
}

// =============================================================================
// TESTIMONIALS ACTIONS
// =============================================================================

interface TestimonialInput {
    clientName: string;
    clientTitle: string;
    company: string;
    content: string;
    image?: string;
    rating?: number;
    isActive?: boolean;
}

const getCachedTestimonials = unstable_cache(
    async () =>
        prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        }),
    ["cms:testimonials"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-testimonials"] }
);

export async function getTestimonials() {
    await requireCmsAdmin();
    return getCachedTestimonials();
}

export async function createTestimonial(data: TestimonialInput) {
    await requireCmsAdmin();
    const testimonial = await prisma.testimonial.create({
        data: {
            clientName: data.clientName,
            clientTitle: data.clientTitle,
            company: data.company,
            content: data.content,
            image: data.image || null,
            rating: data.rating ?? 5,
            isActive: data.isActive ?? true,
        },
    });
    revalidateTag("cms-testimonials");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/testimonials");
    return testimonial;
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
    await requireCmsAdmin();
    const testimonial = await prisma.testimonial.update({
        where: { id },
        data,
    });
    revalidateTag("cms-testimonials");
    revalidatePath("/dashboard/testimonials");
    return testimonial;
}

export async function deleteTestimonial(id: string) {
    await requireCmsAdmin();
    await prisma.testimonial.delete({
        where: { id },
    });
    revalidateTag("cms-testimonials");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/testimonials");
}

export async function toggleTestimonialStatus(id: string) {
    await requireCmsAdmin();
    const testimonial = await prisma.testimonial.findUnique({
        where: { id },
        select: { isActive: true },
    });
    if (!testimonial) throw new Error("Testimonial not found");

    const updated = await prisma.testimonial.update({
        where: { id },
        data: { isActive: !testimonial.isActive },
    });
    revalidateTag("cms-testimonials");
    revalidatePath("/dashboard/testimonials");
    return updated;
}

// =============================================================================
// PRODUCTS ACTIONS
// =============================================================================

interface ProductInput {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    features: Prisma.InputJsonValue;
    icon: string;
    image?: string;
    demoUrl?: string;
    pricingTiers?: Prisma.InputJsonValue;
    order?: number;
    isActive?: boolean;
}

const getCachedProducts = unstable_cache(
    async () =>
        prisma.product.findMany({
            orderBy: { order: "asc" },
        }),
    ["cms:products"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-products"] }
);

export async function getProducts() {
    await requireCmsAdmin();
    return getCachedProducts();
}

export async function createProduct(data: ProductInput) {
    await requireCmsAdmin();
    const product = await prisma.product.create({
        data: {
            name: data.name,
            slug: data.slug,
            tagline: data.tagline,
            description: data.description,
            features: data.features,
            icon: data.icon,
            image: data.image || null,
            demoUrl: data.demoUrl || null,
            pricingTiers: data.pricingTiers ?? Prisma.JsonNull,
            order: data.order ?? 0,
            isActive: data.isActive ?? true,
        },
    });
    revalidateTag("cms-products");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/products");
    return product;
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    await requireCmsAdmin();
    const product = await prisma.product.update({
        where: { id },
        data,
    });
    revalidateTag("cms-products");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/products");
    return product;
}

export async function deleteProduct(id: string) {
    await requireCmsAdmin();
    await prisma.product.delete({
        where: { id },
    });
    revalidateTag("cms-products");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/products");
}

export async function toggleProductStatus(id: string) {
    await requireCmsAdmin();
    const product = await prisma.product.findUnique({
        where: { id },
        select: { isActive: true },
    });
    if (!product) throw new Error("Product not found");

    const updated = await prisma.product.update({
        where: { id },
        data: { isActive: !product.isActive },
    });
    revalidateTag("cms-products");
    revalidatePath("/dashboard/products");
    return updated;
}

// =============================================================================
// CONTACT SUBMISSIONS ACTIONS
// =============================================================================

const getCachedContactSubmissions = unstable_cache(
    async () =>
        prisma.contactSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: 250,
        }),
    ["cms:contacts"],
    { revalidate: 30, tags: ["cms-contacts"] }
);

export async function getContactSubmissions() {
    await requireCmsAdmin();
    return getCachedContactSubmissions();
}

export async function markContactAsRead(id: string) {
    await requireCmsAdmin();
    const submission = await prisma.contactSubmission.update({
        where: { id },
        data: { isRead: true },
    });
    revalidateTag("cms-contacts");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/contacts");
    return submission;
}

export async function deleteContactSubmission(id: string) {
    await requireCmsAdmin();
    await prisma.contactSubmission.delete({
        where: { id },
    });
    revalidateTag("cms-contacts");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/contacts");
}

// =============================================================================
// BLOG POST ACTIONS
// =============================================================================

interface BlogPostInput {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: string;
    tags: string[];
    isPublished?: boolean;
}

const getCachedBlogPosts = unstable_cache(
    async () =>
        prisma.blogPost.findMany({
            orderBy: { createdAt: "desc" },
        }),
    ["cms:blog"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-blog"] }
);

export async function getBlogPosts() {
    await requireCmsAdmin();
    return getCachedBlogPosts();
}

export async function createBlogPost(data: BlogPostInput) {
    await requireCmsAdmin();
    const post = await prisma.blogPost.create({
        data: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage || null,
            author: data.author,
            tags: data.tags,
            isPublished: data.isPublished ?? false,
            publishedAt: data.isPublished ? new Date() : null,
        },
    });
    revalidateTag("cms-blog");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/blog");
    return post;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
    await requireCmsAdmin();
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            ...data,
            ...(data.isPublished !== undefined && {
                publishedAt: data.isPublished ? new Date() : null,
            }),
        },
    });
    revalidateTag("cms-blog");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/blog");
    return post;
}

export async function deleteBlogPost(id: string) {
    await requireCmsAdmin();
    await prisma.blogPost.delete({
        where: { id },
    });
    revalidateTag("cms-blog");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/blog");
}

export async function toggleBlogPostPublish(id: string) {
    await requireCmsAdmin();
    const post = await prisma.blogPost.findUnique({
        where: { id },
        select: { isPublished: true },
    });
    if (!post) throw new Error("Blog post not found");

    const updated = await prisma.blogPost.update({
        where: { id },
        data: {
            isPublished: !post.isPublished,
            publishedAt: !post.isPublished ? new Date() : null,
        },
    });
    revalidateTag("cms-blog");
    revalidateTag("cms-dashboard");
    revalidatePath("/dashboard/blog");
    return updated;
}

// =============================================================================
// DASHBOARD STATS & ACTIVITY (SINGLE-QUERY SQL + CACHE)
// =============================================================================

interface DashboardStatsRow {
    productCount: number;
    serviceCount: number;
    teamCount: number;
    testimonialCount: number;
    contactCount: number;
    unreadContactCount: number;
    blogPostCount: number;
    publishedBlogCount: number;
}

const getCachedDashboardStats = unstable_cache(
    async (): Promise<DashboardStatsRow> => {
        const rows = await prisma.$queryRaw<DashboardStatsRow[]>`
            SELECT
                (SELECT COUNT(*)::int FROM "Product") AS "productCount",
                (SELECT COUNT(*)::int FROM "Service") AS "serviceCount",
                (SELECT COUNT(*)::int FROM "TeamMember") AS "teamCount",
                (SELECT COUNT(*)::int FROM "Testimonial") AS "testimonialCount",
                (SELECT COUNT(*)::int FROM "ContactSubmission") AS "contactCount",
                (SELECT COUNT(*)::int FROM "ContactSubmission" WHERE "isRead" = false) AS "unreadContactCount",
                (SELECT COUNT(*)::int FROM "BlogPost") AS "blogPostCount",
                (SELECT COUNT(*)::int FROM "BlogPost" WHERE "isPublished" = true) AS "publishedBlogCount"
        `;
        return (
            rows[0] ?? {
                productCount: 0,
                serviceCount: 0,
                teamCount: 0,
                testimonialCount: 0,
                contactCount: 0,
                unreadContactCount: 0,
                blogPostCount: 0,
                publishedBlogCount: 0,
            }
        );
    },
    ["cms:dashboard:stats"],
    { revalidate: 30, tags: ["cms-dashboard"] }
);

export async function getDashboardStats() {
    await requireCmsAdmin();
    return getCachedDashboardStats();
}

const getCachedRecentActivity = unstable_cache(
    async () => {
        const rows = await prisma.$queryRaw<
            Array<{
                id: string;
                action: string;
                details: string;
                time: Date;
                type: string;
            }>
        >`
            SELECT * FROM (
                (SELECT "id", 'New contact submission'::text AS "action", ("name" || ' — ' || "subject")::text AS "details", "createdAt" AS "time", 'contact'::text AS "type"
                 FROM "ContactSubmission" ORDER BY "createdAt" DESC LIMIT 2)
                UNION ALL
                (SELECT "id", 'Product updated'::text AS "action", "name"::text AS "details", "updatedAt" AS "time", 'product'::text AS "type"
                 FROM "Product" ORDER BY "updatedAt" DESC LIMIT 2)
                UNION ALL
                (SELECT "id", 'Team member added'::text AS "action", ("name" || ' — ' || "position")::text AS "details", "createdAt" AS "time", 'team'::text AS "type"
                 FROM "TeamMember" ORDER BY "createdAt" DESC LIMIT 2)
                UNION ALL
                (SELECT "id",
                        CASE WHEN "isPublished" THEN 'Blog post published' ELSE 'Blog draft created' END::text AS "action",
                        "title"::text AS "details",
                        "createdAt" AS "time",
                        'blog'::text AS "type"
                 FROM "BlogPost" ORDER BY "createdAt" DESC LIMIT 2)
            ) AS recent_events
            ORDER BY "time" DESC
            LIMIT 6
        `;
        return rows;
    },
    ["cms:dashboard:activity"],
    { revalidate: 30, tags: ["cms-dashboard"] }
);

export async function getRecentActivity() {
    await requireCmsAdmin();
    return getCachedRecentActivity();
}

// =============================================================================
// SITE SETTINGS ACTIONS
// =============================================================================

const getCachedSiteSettings = unstable_cache(
    async () => {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: "main" },
        });
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: { id: "main" },
            });
        }
        return settings;
    },
    ["cms:settings"],
    { revalidate: CACHE_TTL_SECONDS, tags: ["cms-settings"] }
);

export async function getSiteSettings() {
    await requireCmsAdmin();
    return getCachedSiteSettings();
}

export async function upsertSiteSettings(data: {
    siteName?: string;
    tagline?: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    socialFacebook?: string | null;
    socialTwitter?: string | null;
    socialLinkedin?: string | null;
    socialGithub?: string | null;
    socialInstagram?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    favicon?: string | null;
    logo?: string | null;
    logoDark?: string | null;
}) {
    await requireCmsAdmin();
    const settings = await prisma.siteSettings.upsert({
        where: { id: "main" },
        update: data,
        create: { id: "main", ...data },
    });
    revalidateTag("cms-settings");
    revalidatePath("/dashboard/settings");
    return settings;
}
