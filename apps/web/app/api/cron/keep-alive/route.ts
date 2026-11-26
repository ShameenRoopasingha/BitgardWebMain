import { NextResponse } from "next/server";
import { prisma, timingSafeEqualStrings } from "@bitgard/database";

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET?.trim();
    if (!secret) {
        return NextResponse.json(
            { error: "CRON_SECRET is not configured" },
            { status: 500 }
        );
    }

    const authHeader = request.headers.get("authorization") || "";
    const provided = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!provided || !timingSafeEqualStrings(provided, secret)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
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
