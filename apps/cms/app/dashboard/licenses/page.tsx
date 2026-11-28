import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getCmsSession } from "@/lib/auth";
import LicensesClient from "./LicensesClient";

export const dynamic = "force-dynamic";

const toIsoStringOrNull = (val: Date | string | null | undefined): string | null => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const getCachedLicenses = unstable_cache(
  async () => {
    const subscriptions = await prisma.vigilSubscription.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        grantedByAdmin: { select: { name: true, email: true } },
        events: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    return subscriptions.map((s) => ({
      ...s,
      currentPeriodStart: toIsoStringOrNull(s.currentPeriodStart),
      currentPeriodEnd: toIsoStringOrNull(s.currentPeriodEnd),
      lastUsageReportedAt: toIsoStringOrNull(s.lastUsageReportedAt),
      lastSyncedAt: toIsoStringOrNull(s.lastSyncedAt),
      createdAt: toIsoStringOrNull(s.createdAt) || new Date().toISOString(),
      updatedAt: toIsoStringOrNull(s.updatedAt) || new Date().toISOString(),
      events: s.events.map((e) => ({
        ...e,
        createdAt: toIsoStringOrNull(e.createdAt) || new Date().toISOString(),
      })),
    }));
  },
  ["cms:licenses"],
  { revalidate: 30, tags: ["cms-licenses"] }
);

export default async function LicensesPage() {
  const admin = await getCmsSession();
  if (!admin) {
    redirect("/auth/login");
  }

  if (admin.role !== "SUPER_ADMIN") {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="dashboard-card p-6 border border-red-500/30 bg-red-500/5">
          <h1 className="text-xl font-bold text-white mb-2">Restricted Access</h1>
          <p className="text-sm text-gray-400">
            Only accounts with the <strong className="text-white">SUPER_ADMIN</strong> role can manage Vigil subscriptions and issue complimentary or lifetime licenses.
          </p>
        </div>
      </div>
    );
  }

  const serialized = await getCachedLicenses();
  return <LicensesClient initialSubscriptions={serialized} />;
}
