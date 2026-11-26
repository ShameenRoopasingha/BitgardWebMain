import { NextRequest, NextResponse } from "next/server";
import { checkDistributedRateLimit, prisma } from "@bitgard/database";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().trim().email("Invalid email address").max(254),
    phone: z.string().trim().max(40).optional(),
    company: z.string().trim().max(120).optional(),
    subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(200),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
});

export async function POST(request: NextRequest) {
    try {
        const ip =
            request.headers.get("x-real-ip")?.trim() ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";

        const { limited } = await checkDistributedRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
        if (limited) {
            return NextResponse.json(
                { success: false, error: "Too many submissions. Please try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const validatedData = contactSchema.parse(body);

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
