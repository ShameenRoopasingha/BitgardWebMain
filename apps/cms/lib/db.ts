/**
 * =============================================================================
 * CMS DATABASE CLIENT
 * =============================================================================
 * 
 * Local Prisma client wrapper for CMS app.
 * Avoids ESM module resolution issues with cross-package imports on Windows.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
