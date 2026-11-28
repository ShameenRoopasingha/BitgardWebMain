import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { z } from "zod";
import {
  buildOtpAuthUri,
  checkDistributedRateLimit,
  decryptMfaSecret,
  encryptMfaSecret,
  generateBackupCodes,
  generateTotpSecret,
  verifyMfaChallengeAgainstRecord,
  verifyTotpCode,
} from "@bitgard/database";
import { requireCmsAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const setupActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("begin") }),
  z.object({
    action: z.literal("enable"),
    code: z.string().trim().min(6).max(16),
  }),
  z.object({
    action: z.literal("regenerate"),
    currentPassword: z.string().min(1).max(200),
    code: z.string().trim().min(6).max(32),
  }),
]);

const disableSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  code: z.string().trim().min(6).max(32),
});

export async function GET() {
  try {
    const adminSession = await requireCmsAdmin();
    const admin = await prisma.admin.findUnique({
      where: { id: adminSession.id },
      select: { mfaEnabled: true, mfaBackupCodes: true },
    });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: true,
        mfaEnabled: admin.mfaEnabled,
        backupCodesRemaining: admin.mfaBackupCodes?.length ?? 0,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  let adminSession;
  try {
    adminSession = await requireCmsAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkDistributedRateLimit(`cms_mfa_setup:${adminSession.id}`, 15, 15 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many MFA setup attempts. Please wait 15 minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = setupActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request payload" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminSession.id },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      mfaEnabled: true,
      mfaSecret: true,
      mfaPendingSecret: true,
    },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin account not found" }, { status: 404 });
  }

  if (parsed.data.action === "begin") {
    const plainSecret = generateTotpSecret();
    const encryptedPending = encryptMfaSecret(plainSecret);
    const otpauthUri = buildOtpAuthUri({
      issuer: "Bitgard CMS",
      accountEmail: admin.email,
      secret: plainSecret,
    });
    const qrDataUrl = await QRCode.toDataURL(otpauthUri, {
      width: 220,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    });

    await prisma.admin.update({
      where: { id: admin.id },
      data: { mfaPendingSecret: encryptedPending },
    });

    return NextResponse.json(
      {
        success: true,
        manualSecret: plainSecret,
        otpauthUri,
        qrDataUrl,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (parsed.data.action === "enable") {
    if (!admin.mfaPendingSecret) {
      return NextResponse.json(
        { error: "No pending authenticator setup found. Click Set Up 2FA first." },
        { status: 400 }
      );
    }

    let plainSecret: string;
    try {
      plainSecret = decryptMfaSecret(admin.mfaPendingSecret);
    } catch {
      return NextResponse.json(
        { error: "Pending setup secret invalid. Please restart 2FA setup." },
        { status: 400 }
      );
    }

    if (!verifyTotpCode(plainSecret, parsed.data.code)) {
      return NextResponse.json(
        { error: "Invalid 6-digit authenticator code." },
        { status: 400 }
      );
    }

    const { plainCodes, hashedCodes } = generateBackupCodes(8);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        mfaEnabled: true,
        mfaSecret: admin.mfaPendingSecret,
        mfaPendingSecret: null,
        mfaBackupCodes: hashedCodes,
      },
    });

    return NextResponse.json(
      {
        success: true,
        mfaEnabled: true,
        backupCodes: plainCodes,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!admin.mfaEnabled || !admin.mfaSecret) {
    return NextResponse.json({ error: "2FA is not currently enabled." }, { status: 400 });
  }

  const passwordValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!passwordValid) {
    return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
  }

  const mfaCheck = verifyMfaChallengeAgainstRecord({
    encryptedSecret: admin.mfaSecret,
    backupHashes: [],
    code: parsed.data.code,
  });
  if (!mfaCheck.valid) {
    return NextResponse.json({ error: "Invalid 6-digit authenticator code." }, { status: 401 });
  }

  const { plainCodes, hashedCodes } = generateBackupCodes(8);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { mfaBackupCodes: hashedCodes },
  });

  return NextResponse.json(
    { success: true, backupCodes: plainCodes },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(request: Request) {
  let adminSession;
  try {
    adminSession = await requireCmsAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkDistributedRateLimit(`cms_mfa_disable:${adminSession.id}`, 10, 15 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = disableSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Password and authenticator code are required" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminSession.id },
    select: {
      id: true,
      passwordHash: true,
      mfaEnabled: true,
      mfaSecret: true,
      mfaBackupCodes: true,
    },
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const passwordValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!passwordValid) {
    return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
  }

  if (admin.mfaEnabled) {
    const check = verifyMfaChallengeAgainstRecord({
      encryptedSecret: admin.mfaSecret,
      backupHashes: admin.mfaBackupCodes || [],
      code: parsed.data.code,
    });
    if (!check.valid) {
      return NextResponse.json(
        { error: "Invalid authenticator or backup code." },
        { status: 401 }
      );
    }
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      mfaEnabled: false,
      mfaSecret: null,
      mfaPendingSecret: null,
      mfaBackupCodes: [],
    },
  });

  return NextResponse.json({ success: true, mfaEnabled: false });
}
