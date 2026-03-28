/**
 * =============================================================================
 * REVALIDATION API ROUTE
 * =============================================================================
 *
 * On-demand revalidation endpoint for the web app.
 * Called by the CMS after content mutations to clear the cache.
 *
 * Requires REVALIDATION_SECRET env var to authenticate requests.
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Authenticate the request
        const body = await request.json();
        const secret = body.secret;

        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json(
                { message: "Invalid secret" },
                { status: 401 }
            );
        }

        // Revalidate the specified path, or "/" by default
        const path = body.path || "/";
        revalidatePath(path);

        return NextResponse.json({
            revalidated: true,
            path,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json(
            { message: "Error revalidating" },
            { status: 500 }
        );
    }
}
