import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkDistributedRateLimit } from "@bitgard/database";
import { requireCmsAdmin } from "@/lib/auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_EXTENSIONS: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
};

function matchesImageMagicBytes(buf: Buffer, ext: string): boolean {
    if (buf.length < 12) return false;
    if (ext === "png") {
        return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    }
    if (ext === "jpg") {
        return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    }
    if (ext === "gif") {
        return buf.subarray(0, 4).toString("ascii") === "GIF8";
    }
    if (ext === "webp") {
        return (
            buf.subarray(0, 4).toString("ascii") === "RIFF" &&
            buf.subarray(8, 12).toString("ascii") === "WEBP"
        );
    }
    return false;
}

export async function POST(request: Request) {
    let adminSession;
    try {
        adminSession = await requireCmsAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { limited } = await checkDistributedRateLimit(
        `cms_upload:${adminSession.id}`,
        30,
        15 * 60 * 1000
    );
    if (limited) {
        return NextResponse.json(
            { error: "Too many uploads. Please wait before uploading again." },
            { status: 429 }
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes("your-service-role-key")) {
        return NextResponse.json(
            {
                error:
                    "Server-side image upload is not configured (set SUPABASE_SERVICE_ROLE_KEY in apps/cms/.env).",
            },
            { status: 503 }
        );
    }

    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");

    if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "A valid image file is required" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 413 });
    }

    const ext = ALLOWED_MIME_EXTENSIONS[file.type.toLowerCase()];
    if (!ext) {
        return NextResponse.json(
            { error: "Unsupported file type. Allowed: PNG, JPEG, WEBP, GIF." },
            { status: 400 }
        );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!matchesImageMagicBytes(bytes, ext)) {
        return NextResponse.json(
            { error: "File contents do not match declared image format." },
            { status: 400 }
        );
    }

    const filePath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: uploadError } = await supabase.storage
        .from("bitgard-images")
        .upload(filePath, bytes, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        console.error("CMS Upload Error:", uploadError);
        return NextResponse.json({ error: uploadError.message || "Upload failed" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
        .from("bitgard-images")
        .getPublicUrl(filePath);

    return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        path: filePath,
    });
}
