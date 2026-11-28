"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardHeader } from "@/components/dashboard/Header";
import {
  FiKey,
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiShield,
  FiSlash,
  FiCheckCircle,
  FiStar,
  FiActivity,
  FiMonitor,
} from "react-icons/fi";

interface LiveUserSession {
  id: string;
  kind: "WORKSTATION" | "DRIVER_GPS";
  isLiveNow: boolean;
  isDesktopApp: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  companyId: string;
  companyName: string;
  tier: string;
  subscriptionStatus: string;
  billingCycle: string | null;
  deviceLabel: string;
  platform: string | null;
  lastSeenAt: string;
}

interface LiveUsersPayload {
  fetchedAt: string;
  summary: {
    liveNowCount: number;
    activeWorkstationCount: number;
    liveDriverCount: number;
    liveCompanyCount: number;
  };
  sessions: LiveUserSession[];
}

interface SubscriptionEventItem {
  id: string;
  eventType: string;
  actorEmail: string | null;
  createdAt: string;
}

export interface VigilSubscriptionItem {
  id: string;
  email: string;
  companyName: string;
  tier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  billingCycle: "MONTHLY" | "ANNUAL" | "LIFETIME";
  status: "TRIALING" | "ACTIVE" | "LIFETIME" | "PAST_DUE" | "EXPIRED" | "CANCELLED" | "REVOKED";
  source: "DODO_PAYMENTS" | "MANUAL_ADMIN";
  licenseKey: string;
  vehicleCount?: number;
  includedVehicles?: number;
  extraVehicles?: number;
  extraVehicleRateUsd?: number;
  monthlyOverageUsd?: number;
  lastUsageReportedAt?: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  grantNote: string | null;
  lastSyncedAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  grantedByAdmin: { name: string; email: string } | null;
  events: SubscriptionEventItem[];
}

interface Props {
  initialSubscriptions: VigilSubscriptionItem[];
}

const STATUS_BADGES: Record<string, string> = {
  LIFETIME: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  TRIALING: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  PAST_DUE: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  EXPIRED: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  CANCELLED: "bg-gray-500/20 text-gray-400 border-gray-600/40",
  REVOKED: "bg-red-500/20 text-red-300 border-red-500/40",
};

export default function LicensesClient({ initialSubscriptions }: Props) {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<VigilSubscriptionItem[]>(initialSubscriptions);
  const [activeTab, setActiveTab] = useState<"licenses" | "live">("licenses");
  const [search, setSearch] = useState("");
  const [liveSearch, setLiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liveData, setLiveData] = useState<LiveUsersPayload | null>(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLiveUsers = useCallback(async (quiet = false) => {
    if (!quiet) setLiveLoading(true);
    try {
      const res = await fetch("/api/live-users", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setLiveError(json.error || "Unable to fetch live user telemetry");
        return;
      }
      setLiveData({
        fetchedAt: json.fetchedAt,
        summary: json.summary,
        sessions: json.sessions || [],
      });
      setLiveError(null);
    } catch {
      setLiveError("Network error while reaching Vigil telemetry");
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLiveUsers(false);
  }, [fetchLiveUsers]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      void fetchLiveUsers(true);
    }, 15000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchLiveUsers]);

  // Grant Modal state
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tier, setTier] = useState<"STARTER" | "PROFESSIONAL" | "ENTERPRISE">("ENTERPRISE");
  const [grantMode, setGrantMode] = useState<"LIFETIME" | "COMPLIMENTARY_TERM">("LIFETIME");
  const [durationDays, setDurationDays] = useState(365);
  const [grantNote, setGrantNote] = useState("");
  const [initialAdminPassword, setInitialAdminPassword] = useState("");

  const filtered = subscriptions.filter((sub) => {
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      sub.email.toLowerCase().includes(q) ||
      sub.companyName.toLowerCase().includes(q) ||
      sub.licenseKey.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const upsertLocalRow = (updated: VigilSubscriptionItem) => {
    setSubscriptions((prev) => {
      const idx = prev.findIndex((item) => item.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          tier,
          grantMode,
          durationDays: Number(durationDays),
          grantNote: grantNote || undefined,
          initialAdminPassword: initialAdminPassword || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to grant license");
        return;
      }
      upsertLocalRow(json.data);
      toast.success(
        json.data.lastSyncStatus === "SYNCED"
          ? "License granted & synced to Vigil!"
          : `License saved (Vigil sync: ${json.data.lastSyncStatus})`
      );
      setIsModalOpen(false);
      setEmail("");
      setCompanyName("");
      setGrantNote("");
      setInitialAdminPassword("");
      router.refresh();
    } catch {
      toast.error("Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatch = async (
    id: string,
    payload: {
      action: "UPDATE" | "REVOKE" | "REACTIVATE" | "RESYNC";
      tier?: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
      status?: "ACTIVE" | "LIFETIME" | "REVOKED";
    }
  ) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Action failed");
        return;
      }
      upsertLocalRow(json.data);
      toast.success(
        json.data.lastSyncStatus === "SYNCED"
          ? "Updated & synced to Vigil"
          : `Updated (Vigil sync: ${json.data.lastSyncStatus})`
      );
      router.refresh();
    } catch {
      toast.error("Failed to update license");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Vigil Subscriptions & Lifetime Licenses"
        subtitle="Manage paid Dodo subscriptions and issue Super-Admin complimentary / LIFETIME licenses"
        action={{ label: "Grant Free / Lifetime License", onClick: () => setIsModalOpen(true) }}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="dashboard-card p-4">
            <p className="text-xs text-gray-400">Total Licenses</p>
            <p className="text-2xl font-bold text-white mt-1">{subscriptions.length}</p>
          </div>
          <div className="dashboard-card p-4">
            <p className="text-xs text-gray-400">Active Paid</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {subscriptions.filter((s) => s.status === "ACTIVE").length}
            </p>
          </div>
          <div className="dashboard-card p-4">
            <p className="text-xs text-gray-400">Lifetime / VIP</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {subscriptions.filter((s) => s.status === "LIFETIME").length}
            </p>
          </div>
          <div className="dashboard-card p-4">
            <p className="text-xs text-gray-400">Sync Pending / Failed</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">
              {subscriptions.filter((s) => s.lastSyncStatus !== "SYNCED").length}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className="dashboard-card p-4 text-left border border-emerald-500/30 hover:border-emerald-400/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Live Users Now</p>
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {liveLoading && !liveData ? "..." : liveData?.summary.liveNowCount ?? 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {liveData ? `${liveData.summary.activeWorkstationCount} sessions • ${liveData.summary.liveCompanyCount} companies` : "Click to inspect"}
            </p>
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("licenses")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
                activeTab === "licenses"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              <FiKey className="w-4 h-4" />
              <span>Licenses ({subscriptions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors ${
                activeTab === "live"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              <FiActivity className="w-4 h-4" />
              <span>Live Users Monitor</span>
              <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-black/30">
                {liveData?.summary.liveNowCount ?? 0}
              </span>
            </button>
          </div>

          {activeTab === "live" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoRefresh((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs border ${
                  autoRefresh
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : "bg-gray-900 text-gray-400 border-gray-800"
                }`}
              >
                Auto-refresh (15s): {autoRefresh ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => void fetchLiveUsers(false)}
                disabled={liveLoading}
                className="px-3 py-1.5 rounded-lg text-xs bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${liveLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          )}
        </div>

        {activeTab === "live" ? (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={liveSearch}
                onChange={(e) => setLiveSearch(e.target.value)}
                placeholder="Search user name, email, company, or device..."
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
              />
            </div>

            {liveError ? (
              <div className="dashboard-card p-6 text-sm text-red-300 border border-red-500/30">
                {liveError}
              </div>
            ) : (
              <div className="space-y-2.5">
                {(liveData?.sessions || [])
                  .filter((s) => {
                    const q = liveSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      s.userName.toLowerCase().includes(q) ||
                      s.userEmail.toLowerCase().includes(q) ||
                      s.companyName.toLowerCase().includes(q) ||
                      s.deviceLabel.toLowerCase().includes(q)
                    );
                  })
                  .map((s) => (
                    <div
                      key={s.id}
                      className="dashboard-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full border ${
                              s.isLiveNow
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-gray-800 text-gray-300 border-gray-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                s.isLiveNow ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
                              }`}
                            />
                            {s.isLiveNow ? "LIVE NOW" : "ACTIVE SESSION"}
                          </span>
                          <span className="text-sm font-semibold text-white">{s.userName}</span>
                          <span className="text-xs text-gray-400">({s.userEmail})</span>
                          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-gray-800 text-gray-300">
                            {s.userRole}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Company: <strong className="text-gray-200">{s.companyName}</strong></span>
                          <span>Tier: <strong className="text-primary-300">{s.tier}</strong> ({s.subscriptionStatus})</span>
                          <span className="inline-flex items-center gap-1">
                            <FiMonitor className="w-3.5 h-3.5 text-gray-500" />
                            {s.deviceLabel}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 shrink-0 sm:text-right">
                        <div>Last seen</div>
                        <div className="text-gray-200 font-mono">
                          {new Date(s.lastSeenAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                {!liveLoading && (liveData?.sessions.length || 0) === 0 && (
                  <div className="dashboard-card p-8 text-center text-sm text-gray-400">
                    No active workstations or live driver sessions reported right now.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email, company, or VGL-... key"
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", "LIFETIME", "ACTIVE", "PAST_DUE", "REVOKED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  statusFilter === st
                    ? "bg-primary-500/20 text-primary-300 border-primary-500/50"
                    : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="dashboard-card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold text-white">{sub.companyName}</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-full border ${
                      STATUS_BADGES[sub.status] || "bg-gray-800 text-gray-300 border-gray-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-primary-500/15 text-primary-300 border border-primary-500/30">
                    {sub.tier} • {sub.billingCycle}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-gray-800 text-gray-300">
                    {sub.source === "MANUAL_ADMIN" ? "SUPER_ADMIN GRANT" : "DODO PAYMENTS"}
                  </span>
                </div>

                <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Email: <strong className="text-gray-200">{sub.email}</strong></span>
                  <span>Key: <code className="text-amber-300 font-mono">{sub.licenseKey}</code></span>
                  <span>
                    Fleet:{" "}
                    <strong className="text-gray-200">
                      {sub.vehicleCount ?? 0}/
                      {sub.includedVehicles ??
                        (sub.tier === "ENTERPRISE" ? 75 : sub.tier === "PROFESSIONAL" ? 25 : 10)}
                    </strong>
                    {sub.status !== "LIFETIME" && (sub.extraVehicles ?? 0) > 0 && (
                      <span className="ml-1 text-amber-300 font-semibold">
                        (+{sub.extraVehicles} extra &bull; +${(sub.monthlyOverageUsd ?? 0).toFixed(2)}/mo @ $
                        {(sub.extraVehicleRateUsd ?? (sub.tier === "ENTERPRISE" ? 1.56 : sub.tier === "PROFESSIONAL" ? 1.8 : 2.1)).toFixed(2)}/veh)
                      </span>
                    )}
                  </span>
                  <span>
                    Expiry:{" "}
                    <strong className="text-gray-200">
                      {sub.status === "LIFETIME"
                        ? "Never (Lifetime)"
                        : sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </span>
                </div>

                {sub.grantNote && (
                  <p className="text-xs text-gray-400">Note: {sub.grantNote}</p>
                )}

                <div className="text-xs flex flex-wrap items-center gap-2 pt-1">
                  <span
                    className={`font-mono ${
                      sub.lastSyncStatus === "SYNCED" ? "text-emerald-400" : "text-orange-400"
                    }`}
                  >
                    Vigil Sync: {sub.lastSyncStatus || "PENDING"}
                  </span>
                  {sub.lastSyncError && (
                    <span className="text-red-400">({sub.lastSyncError})</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Tier"
                  value={sub.tier}
                  disabled={busyId === sub.id}
                  onChange={(e) =>
                    handlePatch(sub.id, {
                      action: "UPDATE",
                      tier: e.target.value as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
                    })
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-gray-900 border border-gray-700 text-white"
                >
                  <option value="STARTER">Starter</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>

                {sub.status !== "LIFETIME" && (
                  <button
                    onClick={() =>
                      handlePatch(sub.id, { action: "UPDATE", status: "LIFETIME" })
                    }
                    disabled={busyId === sub.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1"
                  >
                    <FiStar className="w-3.5 h-3.5" />
                    Make Lifetime
                  </button>
                )}

                {sub.status !== "REVOKED" ? (
                  <button
                    onClick={() => handlePatch(sub.id, { action: "REVOKE" })}
                    disabled={busyId === sub.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 flex items-center gap-1"
                  >
                    <FiSlash className="w-3.5 h-3.5" />
                    Revoke
                  </button>
                ) : (
                  <button
                    onClick={() => handlePatch(sub.id, { action: "REACTIVATE" })}
                    disabled={busyId === sub.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center gap-1"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Reactivate
                  </button>
                )}

                <button
                  onClick={() => handlePatch(sub.id, { action: "RESYNC" })}
                  disabled={busyId === sub.id}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 flex items-center gap-1"
                >
                  <FiRefreshCw className={`w-3.5 h-3.5 ${busyId === sub.id ? "animate-spin" : ""}`} />
                  Sync Vigil
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="dashboard-card p-10 text-center text-gray-400 text-sm">
              <FiKey className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              No Vigil subscriptions or complimentary licenses found yet.
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleGrantSubmit}
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Grant Complimentary / Lifetime License</h2>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Company / Fleet Name *</label>
              <input
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Ceylon VIP Tours"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Vigil Admin Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@company.com"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tier Privileges</label>
                <select
                  value={tier}
                  onChange={(e) =>
                    setTier(e.target.value as "STARTER" | "PROFESSIONAL" | "ENTERPRISE")
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                >
                  <option value="STARTER">Starter (10 Vehicles)</option>
                  <option value="PROFESSIONAL">Professional (25 Vehicles)</option>
                  <option value="ENTERPRISE">Enterprise (75 Vehicles)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Grant Type</label>
                <select
                  value={grantMode}
                  onChange={(e) =>
                    setGrantMode(e.target.value as "LIFETIME" | "COMPLIMENTARY_TERM")
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                >
                  <option value="LIFETIME">LIFETIME (No Expiry)</option>
                  <option value="COMPLIMENTARY_TERM">Fixed-Term Free</option>
                </select>
              </div>
            </div>

            {grantMode === "COMPLIMENTARY_TERM" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={3650}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Grant Reason / Tag</label>
              <input
                type="text"
                value={grantNote}
                onChange={(e) => setGrantNote(e.target.value)}
                placeholder="e.g. Friend / Partner VIP Lifetime Account"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Optional Initial Vigil Password (for new accounts; leave blank to email reset link)
              </label>
              <input
                type="password"
                minLength={6}
                value={initialAdminPassword}
                onChange={(e) => setInitialAdminPassword(e.target.value)}
                placeholder="Min 6 characters (optional)"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                <FiPlus className="w-4 h-4" />
                {submitting ? "Granting & Syncing..." : "Grant License"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
