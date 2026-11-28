import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { checkDistributedRateLimit, timingSafeEqualStrings } from "@bitgard/database";

export async function POST(request: NextRequest) {
    try {
        const ip =
            request.headers.get("x-real-ip")?.trim() ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";
        const { limited } = await checkDistributedRateLimit(
            `web_revalidate:${ip}`,
            30,
            60 * 1000
        );
        if (limited) {
            return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
        }

        const expectedSecret = process.env.REVALIDATION_SECRET?.trim();
        if (!expectedSecret) {
            return NextResponse.json(
                { message: "REVALIDATION_SECRET is not configured" },
                { status: 500 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const providedSecret = String(
            body.secret || request.nextUrl.searchParams.get("secret") || ""
        ).trim();

        if (!providedSecret || !timingSafeEqualStrings(providedSecret, expectedSecret)) {
            return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
        }

        const rawPath = typeof body.path === "string"
            ? body.path
            : request.nextUrl.searchParams.get("path") || "/";
        const path = rawPath.startsWith("/") ? rawPath : "/";
        revalidatePath(path);

        return NextResponse.json({ revalidated: true, now: Date.now(), path });
    } catch {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
