import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCmsSession } from "@/lib/auth";
import LicensesClient from "./LicensesClient";

export const dynamic = "force-dynamic";

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

  const subscriptions = await prisma.vigilSubscription.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      grantedByAdmin: { select: { name: true, email: true } },
      events: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const serialized = subscriptions.map((s) => ({
    ...s,
    currentPeriodStart: s.currentPeriodStart?.toISOString() ?? null,
    currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
    lastSyncedAt: s.lastSyncedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    events: s.events.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    })),
  }));

  return <LicensesClient initialSubscriptions={serialized} />;
}
