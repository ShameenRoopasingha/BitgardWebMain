import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  checkDistributedRateLimit,
  signCmsMfaChallengeToken,
} from "@bitgard/database";
import { prisma } from "@/lib/db";
import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_TTL_SECONDS,
  signCmsSessionToken,
  type CmsAdminRole,
} from "@/lib/session";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(254),
  password: z.string().min(1, "Password is required").max(200),
});

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-real-ip")?.trim() ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const ipRl = await checkDistributedRateLimit(`cms_login_ip:${ip}`, 30, 15 * 60 * 1000);
    if (ipRl.limited) {
      return NextResponse.json(
        { error: "Too many login attempts from this IP. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Email and password are required" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const { limited } = await checkDistributedRateLimit(`cms_login:${email}:${ip}`, 10, 15 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        mfaEnabled: true,
        tokenVersion: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (admin.mfaEnabled) {
      const challengeToken = signCmsMfaChallengeToken({
        id: admin.id,
        email: admin.email,
      });

      return NextResponse.json(
        {
          success: true,
          mfaRequired: true,
          challengeToken,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const token = await signCmsSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as CmsAdminRole,
      tokenVersion: admin.tokenVersion ?? 0,
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
    console.error("CMS login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
