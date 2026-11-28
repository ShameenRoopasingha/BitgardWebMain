import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import {
  checkDistributedRateLimit,
  generateVigilLicenseKey,
  pushSubscriptionSyncToVigil,
  type VigilBillingCycle,
  type VigilSubscriptionStatus,
  type VigilTier,
} from "@bitgard/database";
import { prisma } from "@/lib/db";
import { requireCmsSuperAdmin } from "@/lib/auth";

const createLicenseSchema = z.object({
  email: z.string().trim().email("Valid client email is required").max(254),
  companyName: z.string().trim().min(2, "Company name is required").max(120),
  tier: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]).default("PROFESSIONAL"),
  grantMode: z.enum(["LIFETIME", "COMPLIMENTARY_TERM"]).default("LIFETIME"),
  durationDays: z.number().int().min(1).max(3650).optional().default(365),
  grantNote: z.string().trim().max(300).optional(),
  initialAdminPassword: z.string().min(6).max(128).optional(),
});

const patchLicenseSchema = z.object({
  id: z.string().trim().min(1),
  action: z.enum(["UPDATE", "REVOKE", "REACTIVATE", "RESYNC"]),
  tier: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]).optional(),
  status: z.enum(["ACTIVE", "LIFETIME", "PAST_DUE", "EXPIRED", "CANCELLED", "REVOKED"]).optional(),
  durationDays: z.number().int().min(1).max(3650).optional(),
  grantNote: z.string().trim().max(300).optional(),
});

async function syncAndRecord(
  subscriptionId: string,
  eventType: string,
  actorEmail: string,
  initialAdminPassword?: string
) {
  const sub = await prisma.vigilSubscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });

  const deliveryId = `cms_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await prisma.vigilSubscriptionEvent.create({
    data: {
      subscriptionId: sub.id,
      eventType,
      externalEventId: deliveryId,
      actorEmail,
      payload: {
        tier: sub.tier,
        billingCycle: sub.billingCycle,
        status: sub.status,
        source: sub.source,
        grantNote: sub.grantNote,
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
      },
    },
  });

  const syncResult = await pushSubscriptionSyncToVigil({
    deliveryId,
    eventType,
    email: sub.email,
    companyName: sub.companyName,
    tier: sub.tier as VigilTier,
    billingCycle: sub.billingCycle as VigilBillingCycle,
    status: sub.status as VigilSubscriptionStatus,
    source: sub.source,
    isLifetime: sub.status === "LIFETIME",
    licenseKey: sub.licenseKey,
    bitgardSubscriptionId: sub.id,
    currentPeriodStart: sub.currentPeriodStart?.toISOString() ?? null,
    currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
    note: sub.grantNote,
    ...(initialAdminPassword ? { initialAdminPassword } : {}),
  });

  return prisma.vigilSubscription.update({
    where: { id: sub.id },
    data: {
      lastSyncedAt: syncResult.synced ? new Date() : sub.lastSyncedAt,
      lastSyncStatus: syncResult.status,
      lastSyncError: syncResult.error || null,
    },
    include: {
      grantedByAdmin: { select: { name: true, email: true } },
      events: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

export async function GET() {
  try {
    const admin = await requireCmsSuperAdmin();
    const { limited } = await checkDistributedRateLimit(
      `cms_licenses_read:${admin.id}`,
      60,
      15 * 60 * 1000
    );
    if (limited) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    const subscriptions = await prisma.vigilSubscription.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        grantedByAdmin: { select: { name: true, email: true } },
        events: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.startsWith("Forbidden") ? 403 : 401;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const superAdmin = await requireCmsSuperAdmin();
    const { limited } = await checkDistributedRateLimit(
      `cms_licenses_write:${superAdmin.id}`,
      30,
      15 * 60 * 1000
    );
    if (limited) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
    }
    const rawBody = await request.json().catch(() => null);
    const parsed = createLicenseSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid license payload" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const now = new Date();
    const isLifetime = parsed.data.grantMode === "LIFETIME";
    const billingCycle: VigilBillingCycle = isLifetime
      ? "LIFETIME"
      : parsed.data.durationDays >= 365
      ? "ANNUAL"
      : "MONTHLY";
    const status: VigilSubscriptionStatus = isLifetime ? "LIFETIME" : "ACTIVE";
    const periodEnd = isLifetime
      ? null
      : new Date(now.getTime() + parsed.data.durationDays * 86_400_000);

    const existing = await prisma.vigilSubscription.findUnique({ where: { email } });

    const upserted = await prisma.vigilSubscription.upsert({
      where: { email },
      update: {
        companyName: parsed.data.companyName,
        tier: parsed.data.tier,
        billingCycle,
        status,
        source: "MANUAL_ADMIN",
        grantedByAdminId: superAdmin.id,
        grantNote: parsed.data.grantNote || existing?.grantNote || "Complimentary Super-Admin license",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      create: {
        email,
        companyName: parsed.data.companyName,
        tier: parsed.data.tier,
        billingCycle,
        status,
        source: "MANUAL_ADMIN",
        licenseKey: generateVigilLicenseKey(),
        grantedByAdminId: superAdmin.id,
        grantNote: parsed.data.grantNote || "Complimentary Super-Admin license",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    const synced = await syncAndRecord(
      upserted.id,
      isLifetime ? "admin.lifetime_granted" : "admin.complimentary_granted",
      superAdmin.email,
      parsed.data.initialAdminPassword
    );

    revalidateTag("cms-licenses");
    revalidatePath("/dashboard/licenses");
    return NextResponse.json({ success: true, data: synced }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to grant license";
    const status = message.startsWith("Forbidden") ? 403 : message.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const superAdmin = await requireCmsSuperAdmin();
    const rawBody = await request.json().catch(() => null);
    const parsed = patchLicenseSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid update payload" },
        { status: 400 }
      );
    }

    const existing = await prisma.vigilSubscription.findUnique({
      where: { id: parsed.data.id },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Subscription not found" }, { status: 404 });
    }

    if (parsed.data.action === "RESYNC") {
      const resynced = await syncAndRecord(existing.id, "admin.manual_resync", superAdmin.email);
      return NextResponse.json({ success: true, data: resynced });
    }

    const now = new Date();
    let nextStatus = parsed.data.status || existing.status;
    let nextTier = parsed.data.tier || existing.tier;
    let nextCycle = existing.billingCycle;
    let nextPeriodEnd = existing.currentPeriodEnd;
    let eventType = "admin.license_updated";

    if (parsed.data.action === "REVOKE") {
      nextStatus = "REVOKED";
      eventType = "admin.license_revoked";
    } else if (parsed.data.action === "REACTIVATE") {
      nextStatus = existing.billingCycle === "LIFETIME" ? "LIFETIME" : "ACTIVE";
      if (nextStatus === "ACTIVE" && (!nextPeriodEnd || nextPeriodEnd < now)) {
        const days = parsed.data.durationDays || 30;
        nextPeriodEnd = new Date(now.getTime() + days * 86_400_000);
      }
      eventType = "admin.license_reactivated";
    } else if (nextStatus === "LIFETIME") {
      nextCycle = "LIFETIME";
      nextPeriodEnd = null;
      eventType = "admin.lifetime_granted";
    } else if (parsed.data.durationDays) {
      nextPeriodEnd = new Date(now.getTime() + parsed.data.durationDays * 86_400_000);
      nextCycle = parsed.data.durationDays >= 365 ? "ANNUAL" : "MONTHLY";
    }

    await prisma.vigilSubscription.update({
      where: { id: existing.id },
      data: {
        tier: nextTier,
        status: nextStatus,
        billingCycle: nextCycle,
        currentPeriodEnd: nextPeriodEnd,
        grantedByAdminId: superAdmin.id,
        ...(parsed.data.grantNote !== undefined ? { grantNote: parsed.data.grantNote } : {}),
      },
    });

    const synced = await syncAndRecord(existing.id, eventType, superAdmin.email);
    revalidateTag("cms-licenses");
    revalidatePath("/dashboard/licenses");
    return NextResponse.json({ success: true, data: synced });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update license";
    const status = message.startsWith("Forbidden") ? 403 : message.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
