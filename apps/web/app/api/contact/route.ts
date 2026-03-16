/**
 * =============================================================================
 * CONTACT FORM API ROUTE
 * =============================================================================
 * 
 * Handles contact form submissions.
 * Validates form data and saves to database.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@bitgard/database";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = contactSchema.parse(body);

        // Save to database
        const submission = await prisma.contactSubmission.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone || null,
                company: validatedData.company || null,
                subject: validatedData.subject,
                message: validatedData.message,
            },
        });

        return NextResponse.json(
            { success: true, id: submission.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, errors: error.errors },
                { status: 400 }
            );
        }

        console.error("Contact form error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit form" },
            { status: 500 }
        );
    }
}
