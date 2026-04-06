import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const secret = body.secret || request.nextUrl.searchParams.get("secret");

        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
        }

        const path = body.path || request.nextUrl.searchParams.get("path") || "/";
        revalidatePath(path);

        return NextResponse.json({ revalidated: true, now: Date.now(), path });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
    }
}
