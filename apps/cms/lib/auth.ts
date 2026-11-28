import { cookies } from "next/headers";
import { prisma } from "./db";
import { CMS_SESSION_COOKIE, verifyCmsSessionToken, type CmsAdminRole } from "./session";

export interface AuthenticatedCmsAdmin {
  id: string;
  email: string;
  name: string;
  role: CmsAdminRole;
}

/**
 * Resolves the currently authenticated CMS Admin from the signed HttpOnly cookie
 * and verifies that the account still exists in PostgreSQL.
 */
export async function getCmsSession(): Promise<AuthenticatedCmsAdmin | null> {
  const token = cookies().get(CMS_SESSION_COOKIE)?.value;
  const parsed = await verifyCmsSessionToken(token);
  if (!parsed) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: parsed.id },
    select: { id: true, email: true, name: true, role: true, tokenVersion: true },
  });

  if (!admin) return null;

  if (typeof parsed.tokenVersion === "number" && admin.tokenVersion !== parsed.tokenVersion) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as CmsAdminRole,
  };
}

export async function requireCmsAdmin(): Promise<AuthenticatedCmsAdmin> {
  const admin = await getCmsSession();
  if (!admin) {
    throw new Error("Unauthorized: CMS authentication required");
  }
  return admin;
}

export async function requireCmsSuperAdmin(): Promise<AuthenticatedCmsAdmin> {
  const admin = await requireCmsAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: SUPER_ADMIN role required");
  }
  return admin;
}
