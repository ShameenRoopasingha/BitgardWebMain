/**
 * =============================================================================
 * CMS DATABASE CLIENT
 * =============================================================================
 * 
 * Local Prisma client wrapper for CMS app.
 * Avoids ESM module resolution issues with cross-package imports on Windows.
 */

import { PrismaClient } from "@prisma/client";

function buildPooledDatasourceUrl(): string | undefined {
    const raw = process.env.DATABASE_URL?.trim();
    if (!raw) return undefined;
    try {
        const url = new URL(raw);
        if (!url.searchParams.has("connection_limit")) {
            url.searchParams.set("connection_limit", process.env.DB_CONNECTION_LIMIT || "15");
        }
        if (!url.searchParams.has("pool_timeout")) {
            url.searchParams.set("pool_timeout", "20");
        }
        if (!url.searchParams.has("connect_timeout")) {
            url.searchParams.set("connect_timeout", "15");
        }
        return url.toString();
    } catch {
        const sep = raw.includes("?") ? "&" : "?";
        return `${raw}${sep}connection_limit=15&pool_timeout=20&connect_timeout=15`;
    }
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const pooledUrl = buildPooledDatasourceUrl();

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        ...(pooledUrl ? { datasourceUrl: pooledUrl } : {}),
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
