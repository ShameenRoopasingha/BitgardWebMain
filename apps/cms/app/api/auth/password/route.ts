import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  checkDistributedRateLimit,
  verifyMfaChallengeAgainstRecord,
} from "@bitgard/database";
import { requireCmsAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_TTL_SECONDS,
  signCmsSessionToken,
  type CmsAdminRole,
} from "@/lib/session";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required").max(200),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters")
      .max(128)
      .regex(/[A-Z]/, "New password must include at least one uppercase letter")
      .regex(/[a-z]/, "New password must include at least one lowercase letter")
      .regex(/[0-9]/, "New password must include at least one number"),
    mfaCode: z.string().trim().max(32).optional(),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export async function PUT(request: Request) {
  let adminSession;
  try {
    adminSession = await requireCmsAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkDistributedRateLimit(
    `cms_pwd_change:${adminSession.id}`,
    10,
    15 * 60 * 1000
  );
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many password change attempts. Please wait 15 minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid password payload" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminSession.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
      mfaEnabled: true,
      mfaSecret: true,
      mfaBackupCodes: true,
      tokenVersion: true,
    },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
  }

  const currentValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!currentValid) {
    return NextResponse.json(
      { error: "Incorrect current password." },
      { status: 401 }
    );
  }

  let nextBackupHashes: string[] | undefined;
  if (admin.mfaEnabled) {
    if (!parsed.data.mfaCode) {
      return NextResponse.json(
        { error: "Enter your 6-digit authenticator code to change your password." },
        { status: 400 }
      );
    }
    const mfaRes = verifyMfaChallengeAgainstRecord({
      encryptedSecret: admin.mfaSecret,
      backupHashes: admin.mfaBackupCodes || [],
      code: parsed.data.mfaCode,
    });
    if (!mfaRes.valid) {
      return NextResponse.json(
        { error: "Invalid authenticator or backup code." },
        { status: 401 }
      );
    }
    if (mfaRes.usedBackupCode) {
      nextBackupHashes = mfaRes.remainingHashes;
    }
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash: newHash,
      tokenVersion: { increment: 1 },
      ...(nextBackupHashes !== undefined ? { mfaBackupCodes: nextBackupHashes } : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      tokenVersion: true,
    },
  });

  const freshToken = await signCmsSessionToken({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role as CmsAdminRole,
    tokenVersion: updated.tokenVersion,
  });

  const response = NextResponse.json(
    {
      success: true,
      message: "Password updated and previous sessions revoked.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set(CMS_SESSION_COOKIE, freshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CMS_SESSION_TTL_SECONDS,
  });

  return response;
}
