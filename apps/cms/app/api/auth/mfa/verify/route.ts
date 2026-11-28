import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkDistributedRateLimit,
  consumeBitgardReplayNonce,
  verifyCmsMfaChallengeToken,
  verifyMfaChallengeAgainstRecord,
} from "@bitgard/database";
import { prisma } from "@/lib/db";
import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_TTL_SECONDS,
  signCmsSessionToken,
  type CmsAdminRole,
} from "@/lib/session";

const verifySchema = z.object({
  challengeToken: z.string().trim().min(10).max(2048),
  code: z.string().trim().min(6).max(32),
});

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const ipRl = await checkDistributedRateLimit(`cms_mfa_ip:${ip}`, 25, 15 * 60 * 1000);
    if (ipRl.limited) {
      return NextResponse.json(
        { error: "Too many authenticator attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Verification code is required" },
        { status: 400 }
      );
    }

    const challenge = verifyCmsMfaChallengeToken(parsed.data.challengeToken);
    if (!challenge) {
      return NextResponse.json(
        { error: "MFA session expired or invalid. Please sign in again." },
        { status: 401 }
      );
    }

    const userRl = await checkDistributedRateLimit(
      `cms_mfa_user:${challenge.id}:${ip}`,
      8,
      15 * 60 * 1000
    );
    if (userRl.limited) {
      return NextResponse.json(
        { error: "Too many failed authenticator codes. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: challenge.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mfaEnabled: true,
        mfaSecret: true,
        mfaBackupCodes: true,
      },
    });

    if (!admin || !admin.mfaEnabled) {
      return NextResponse.json(
        { error: "Invalid verification request." },
        { status: 401 }
      );
    }

    const check = verifyMfaChallengeAgainstRecord({
      encryptedSecret: admin.mfaSecret,
      backupHashes: admin.mfaBackupCodes || [],
      code: parsed.data.code,
    });

    if (!check.valid) {
      return NextResponse.json(
        { error: "Invalid 6-digit authenticator or backup code." },
        { status: 401 }
      );
    }

    // Consume challenge nonce only on successful MFA verification so the same token cannot be replayed
    const freshNonce = await consumeBitgardReplayNonce(`cms_mfa_nonce:${challenge.nonce}`, 6 * 60 * 1000);
    if (!freshNonce) {
      return NextResponse.json(
        { error: "MFA challenge has already been used. Please sign in again." },
        { status: 401 }
      );
    }

    if (check.usedBackupCode) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { mfaBackupCodes: check.remainingHashes },
      });
    }

    const token = await signCmsSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as CmsAdminRole,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set(CMS_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CMS_SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("CMS MFA verification error:", error);
    return NextResponse.json({ error: "MFA verification failed" }, { status: 500 });
  }
}
