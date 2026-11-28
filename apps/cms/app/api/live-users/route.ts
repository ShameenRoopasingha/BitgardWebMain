import { NextResponse } from "next/server";
import { signBitgardSyncPayload } from "@bitgard/database";
import { requireCmsSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function resolveVigilOrigin(): string {
  const raw =
    process.env.VIGIL_SYNC_URL?.trim() ||
    "https://vigil-pos.vercel.app/api/bitgard/subscription-sync";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://vigil-pos.vercel.app";
  }
}

export async function GET() {
  try {
    await requireCmsSuperAdmin();

    const syncSecret = process.env.BITGARD_SYNC_SECRET?.trim();
    if (!syncSecret) {
      return NextResponse.json(
        { success: false, error: "BITGARD_SYNC_SECRET is not configured in CMS" },
        { status: 500 }
      );
    }

    const vigilOrigin = resolveVigilOrigin();
    const deliveryId = `cms_live_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const rawBody = JSON.stringify({ requestedAt: new Date().toISOString() });
    const headers = signBitgardSyncPayload(rawBody, syncSecret, deliveryId);

    const res = await fetch(`${vigilOrigin}/api/bitgard/live-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: rawBody,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      return NextResponse.json(
        { success: false, error: data?.error || `Vigil telemetry error (HTTP ${res.status})` },
        { status: res.status || 502 }
      );
    }

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.startsWith("Forbidden") ? 403 : 401;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
