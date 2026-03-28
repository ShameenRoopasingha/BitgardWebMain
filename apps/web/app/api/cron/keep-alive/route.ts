/**
 * =============================================================================
 * DATABASE KEEP-ALIVE CRON JOB
 * =============================================================================
 *
 * This endpoint is automatically pinged by Vercel Cron once a day.
 * It executes a lightweight database query to keep the database connection
 * active, preventing the Supabase free tier project from pausing.
 */

import { NextResponse } from "next/server";
import { prisma } from "@bitgard/database";

export async function GET(request: Request) {
    // Basic security check: verify the CRON_SECRET matches
    // Note: Vercel sends the CRON_SECRET as a Bearer token in the Authorization header.
    const authHeader = request.headers.get("authorization");
    const secret = process.env.CRON_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Execute a fast, simple query to wake up the database
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            success: true,
            message: "Database pinged successfully.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Keep-Alive Ping Failed:", error);
        return NextResponse.json(
            { error: "Failed to ping database" },
            { status: 500 }
        );
    }
}
