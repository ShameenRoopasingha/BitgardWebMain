/**
 * =============================================================================
 * CMS SERVER ACTIONS
 * =============================================================================
 * 
 * Centralized server actions for CMS CRUD operations.
 * Uses local Prisma client to avoid ESM resolution issues on Windows.
 */

"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

// =============================================================================
// CROSS-APP REVALIDATION
// =============================================================================

/**
 * Trigger on-demand revalidation on the web app.
 * Since the CMS and web are separate Vercel projects,
 * revalidatePath("/") only clears the CMS cache.
 * This function calls the web app's revalidation API endpoint.
 */
async function revalidateWebsite(path: string = "/") {
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const secret = process.env.REVALIDATION_SECRET;

    if (!webUrl || !secret) {
        console.warn("[Revalidation] Missing NEXT_PUBLIC_WEB_URL or REVALIDATION_SECRET");
        return;
    }

    try {
        const res = await fetch(`${webUrl}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret, path }),
        });

        if (!res.ok) {
            console.error(`[Revalidation] Failed: ${res.status} ${res.statusText}`);
        }
    } catch (error) {
        console.error("[Revalidation] Error calling web app:", error);
    }
}

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

export async function getServices() {
    return prisma.service.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createService(data: ServiceInput) {
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
    revalidatePath("/dashboard/services");
    revalidateWebsite();
    return service;
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
    const service = await prisma.service.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/services");
    revalidateWebsite();
    return service;
}

export async function deleteService(id: string) {
    await prisma.service.delete({
        where: { id },
    });
    revalidatePath("/dashboard/services");
    revalidateWebsite();
}

export async function toggleServiceStatus(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new Error("Service not found");

    const updated = await prisma.service.update({
        where: { id },
        data: { isActive: !service.isActive },
    });
    revalidatePath("/dashboard/services");
    revalidateWebsite();
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

export async function getTeamMembers() {
    return prisma.teamMember.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createTeamMember(data: TeamMemberInput) {
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
    revalidatePath("/dashboard/team");
    revalidateWebsite();
    return member;
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>) {
    const member = await prisma.teamMember.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/team");
    revalidateWebsite();
    return member;
}

export async function deleteTeamMember(id: string) {
    await prisma.teamMember.delete({
        where: { id },
    });
    revalidatePath("/dashboard/team");
    revalidateWebsite();
}

export async function toggleTeamMemberStatus(id: string) {
    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new Error("Team member not found");

    const updated = await prisma.teamMember.update({
        where: { id },
        data: { isActive: !member.isActive },
    });
    revalidatePath("/dashboard/team");
    revalidateWebsite();
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

export async function getTestimonials() {
    return prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createTestimonial(data: TestimonialInput) {
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
    revalidatePath("/dashboard/testimonials");
    revalidateWebsite();
    return testimonial;
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
    const testimonial = await prisma.testimonial.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/testimonials");
    revalidateWebsite();
    return testimonial;
}

export async function deleteTestimonial(id: string) {
    await prisma.testimonial.delete({
        where: { id },
    });
    revalidatePath("/dashboard/testimonials");
    revalidateWebsite();
}

export async function toggleTestimonialStatus(id: string) {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new Error("Testimonial not found");

    const updated = await prisma.testimonial.update({
        where: { id },
        data: { isActive: !testimonial.isActive },
    });
    revalidatePath("/dashboard/testimonials");
    revalidateWebsite();
    return updated;
}

// =============================================================================
// PRODUCTS ACTIONS
// =============================================================================

import { Prisma } from "@prisma/client";

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

export async function getProducts() {
    return prisma.product.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createProduct(data: ProductInput) {
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
    revalidatePath("/dashboard/products");
    revalidateWebsite();
    return product;
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    const product = await prisma.product.update({
        where: { id },
        data,
    });
    revalidatePath("/dashboard/products");
    revalidateWebsite();
    return product;
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });
    revalidatePath("/dashboard/products");
    revalidateWebsite();
}

export async function toggleProductStatus(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    const updated = await prisma.product.update({
        where: { id },
        data: { isActive: !product.isActive },
    });
    revalidatePath("/dashboard/products");
    revalidateWebsite();
    return updated;
}

// =============================================================================
// CONTACT SUBMISSIONS ACTIONS
// =============================================================================

export async function getContactSubmissions() {
    return prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function markContactAsRead(id: string) {
    const submission = await prisma.contactSubmission.update({
        where: { id },
        data: { isRead: true },
    });
    revalidatePath("/dashboard/contacts");
    return submission;
}

export async function deleteContactSubmission(id: string) {
    await prisma.contactSubmission.delete({
        where: { id },
    });
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

export async function getBlogPosts() {
    return prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createBlogPost(data: BlogPostInput) {
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
    revalidatePath("/dashboard/blog");
    revalidateWebsite();
    return post;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            ...data,
            ...(data.isPublished !== undefined && {
                publishedAt: data.isPublished ? new Date() : null,
            }),
        },
    });
    revalidatePath("/dashboard/blog");
    revalidateWebsite();
    return post;
}

export async function deleteBlogPost(id: string) {
    await prisma.blogPost.delete({
        where: { id },
    });
    revalidatePath("/dashboard/blog");
    revalidateWebsite();
}

export async function toggleBlogPostPublish(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new Error("Blog post not found");

    const updated = await prisma.blogPost.update({
        where: { id },
        data: {
            isPublished: !post.isPublished,
            publishedAt: !post.isPublished ? new Date() : null,
        },
    });
    revalidatePath("/dashboard/blog");
    revalidateWebsite();
    return updated;
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export async function getDashboardStats() {
    const [
        productCount,
        serviceCount,
        teamCount,
        testimonialCount,
        contactCount,
        unreadContactCount,
        blogPostCount,
        publishedBlogCount,
    ] = await Promise.all([
        prisma.product.count(),
        prisma.service.count(),
        prisma.teamMember.count(),
        prisma.testimonial.count(),
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { isRead: false } }),
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { isPublished: true } }),
    ]);

    return {
        productCount,
        serviceCount,
        teamCount,
        testimonialCount,
        contactCount,
        unreadContactCount,
        blogPostCount,
        publishedBlogCount,
    };
}

export async function getRecentActivity() {
    const [recentContacts, recentProducts, recentTeam, recentBlog] = await Promise.all([
        prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { id: true, name: true, subject: true, createdAt: true } }),
        prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 2, select: { id: true, name: true, updatedAt: true } }),
        prisma.teamMember.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { id: true, name: true, position: true, createdAt: true } }),
        prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { id: true, title: true, isPublished: true, createdAt: true } }),
    ]);

    type Activity = { id: string; action: string; details: string; time: Date; type: string };

    const activities: Activity[] = [
        ...recentContacts.map(c => ({ id: c.id, action: "New contact submission", details: `${c.name} — ${c.subject}`, time: c.createdAt, type: "contact" })),
        ...recentProducts.map(p => ({ id: p.id, action: "Product updated", details: p.name, time: p.updatedAt, type: "product" })),
        ...recentTeam.map(t => ({ id: t.id, action: "Team member added", details: `${t.name} — ${t.position}`, time: t.createdAt, type: "team" })),
        ...recentBlog.map(b => ({ id: b.id, action: b.isPublished ? "Blog post published" : "Blog draft created", details: b.title, time: b.createdAt, type: "blog" })),
    ];

    activities.sort((a, b) => b.time.getTime() - a.time.getTime());
    return activities.slice(0, 6);
}
