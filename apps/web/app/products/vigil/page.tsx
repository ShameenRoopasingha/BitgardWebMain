"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Play,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  Car,
  Bus,
  Download,
  ShieldCheck,
  Key,
  ArrowRight,
  Laptop,
  Check,
  AlertCircle,
  Sparkles,
  Smartphone,
  Gauge,
  FileText,
  DollarSign,
  Wrench,
  Navigation,
  Search,
  RefreshCw,
  Compass,
  ExternalLink,
  Loader2,
} from "lucide-react";

const VIGIL_EXE_URL =
  process.env.NEXT_PUBLIC_VIGIL_WINDOWS_EXE_URL ||
  "https://zrlsaiygvlgaizedpbdr.supabase.co/storage/v1/object/public/bitgard-releases/vigil/Vigil-Setup-v0.1.0-x64.exe";
const VIGIL_MSI_URL =
  process.env.NEXT_PUBLIC_VIGIL_WINDOWS_MSI_URL ||
  "https://zrlsaiygvlgaizedpbdr.supabase.co/storage/v1/object/public/bitgard-releases/vigil/Vigil-Setup-v0.1.0-x64.msi";
const VIGIL_PORTAL_BASE = "https://vigil-pos.vercel.app";

interface SessionVerifyState {
  loading: boolean;
  verified?: boolean;
  pending?: boolean;
  email?: string;
  companyName?: string;
  tier?: string;
  billingCycle?: string;
  licenseKey?: string;
  setupUrl?: string | null;
  portalLoginUrl?: string;
  windowsExeUrl?: string;
  windowsMsiUrl?: string;
  error?: string;
}

function StatusNotification() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const sessionId = searchParams.get("session_id");

  const [verifyState, setVerifyState] = useState<SessionVerifyState>({
    loading: Boolean(status === "success" && sessionId),
  });

  useEffect(() => {
    if (status !== "success" || !sessionId || sessionId === "{CHECKOUT_SESSION_ID}") {
      setVerifyState({ loading: false });
      return;
    }

    let cancelled = false;
    setVerifyState({ loading: true });

    fetch(
      `/api/dodo/session-status?session_id=${encodeURIComponent(sessionId)}&plan=${encodeURIComponent(
        plan || ""
      )}&billing=${encodeURIComponent(billing || "")}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setVerifyState({
          loading: false,
          verified: Boolean(data.verified),
          pending: Boolean(data.pending),
          email: data.email,
          companyName: data.companyName,
          tier: data.tier,
          billingCycle: data.billingCycle,
          licenseKey: data.licenseKey,
          setupUrl: data.setupUrl || null,
          portalLoginUrl: data.portalLoginUrl || `${VIGIL_PORTAL_BASE}/login`,
          windowsExeUrl: data.downloadUrls?.windowsExe || VIGIL_EXE_URL,
          windowsMsiUrl: data.downloadUrls?.windowsMsi || VIGIL_MSI_URL,
          error: data.error,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setVerifyState({
            loading: false,
            portalLoginUrl: `${VIGIL_PORTAL_BASE}/login`,
            windowsExeUrl: VIGIL_EXE_URL,
            windowsMsiUrl: VIGIL_MSI_URL,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, sessionId, plan, billing]);

  if (!status) return null;

  if (status === "success") {
    const exeHref = verifyState.windowsExeUrl || VIGIL_EXE_URL;
    const msiHref = verifyState.windowsMsiUrl || VIGIL_MSI_URL;
    const loginHref = verifyState.portalLoginUrl || `${VIGIL_PORTAL_BASE}/login`;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 pt-28 pb-4"
      >
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-black/80 border border-emerald-500/50 rounded-2xl p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(16,185,129,0.25)] space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                {verifyState.loading ? (
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                ) : (
                  <Check className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-white font-heading font-bold text-lg">
                    Subscription Active! Welcome to Vigil.
                  </h3>
                  {(verifyState.tier || plan) && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {verifyState.tier || plan} Tier
                      {verifyState.billingCycle ? ` • ${verifyState.billingCycle}` : ""}
                    </span>
                  )}
                </div>
                <p className="text-emerald-200/80 text-sm mt-1">
                  {verifyState.loading
                    ? "Confirming your payment & provisioning your Vigil workspace..."
                    : verifyState.verified
                    ? "Your workspace is provisioned. First set your login password, then download the Vigil desktop installer."
                    : "Your checkout completed. Use the buttons below to set up your Vigil login password and download the installer."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {verifyState.setupUrl ? (
                <a
                  href={verifyState.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-600 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] whitespace-nowrap flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Set Password &amp; Login
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href={loginHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-600 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] whitespace-nowrap flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Vigil Portal
                </a>
              )}

              <a
                href={exeHref}
                download="Vigil-Setup-v0.1.0-x64.exe"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Vigil (.exe)
              </a>
            </div>
          </div>

          {verifyState.verified && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-500/20 text-xs">
              <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                <div className="text-neutral-400">Workspace Username (Email)</div>
                <div className="text-white font-semibold mt-0.5 break-all">{verifyState.email}</div>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                <div className="text-neutral-400">License Key</div>
                <div className="text-emerald-300 font-mono font-semibold mt-0.5">{verifyState.licenseKey}</div>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-neutral-400">Alternative Installer</div>
                  <a
                    href={msiHref}
                    download="Vigil-Setup-v0.1.0-x64.msi"
                    className="text-primary hover:underline font-semibold mt-0.5 inline-block"
                  >
                    Windows .MSI (2.7 MB) &rarr;
                  </a>
                </div>
                <a
                  href={`${VIGIL_PORTAL_BASE}/forgot-password`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline text-[11px]"
                >
                  Reset Password
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (status === "cancel") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 pt-28 pb-4"
      >
        <div className="bg-amber-950/50 border border-amber-500/40 rounded-2xl p-5 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-amber-200 text-sm">
              Checkout was not completed. You can review our plans below and subscribe whenever you are ready.
            </p>
          </div>
          <a
            href="#pricing"
            className="text-amber-300 hover:text-white text-xs font-semibold underline underline-offset-4"
          >
            View Plans
          </a>
        </div>
      </motion.div>
    );
  }

  return null;
}

interface PricingTier {
  id: "starter" | "professional" | "enterprise";
  name: string;
  subtitle: string;
  isPopular?: boolean;
  monthly: {
    priceFormatted: string;
    period: string;
    subtext?: string;
  };
  annual: {
    priceFormatted: string;
    period: string;
    subtext: string;
  };
  setupFee: {
    monthly: string;
    annual: string;
  };
  features: string[];
  ctaText: string;
  ctaHref: (billing: "monthly" | "annual") => string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "For small operators & independent rental fleets",
    monthly: {
      priceFormatted: "$21",
      period: "/mo",
      subtext: "Billed monthly",
    },
    annual: {
      priceFormatted: "$210",
      period: "/yr",
      subtext: "$17.50/mo billed annually",
    },
    setupFee: {
      monthly: "$0 self-serve setup (Optional assisted setup: $29)",
      annual: "Setup waived ($0) on Annual billing",
    },
    features: [
      "Up to 10 Vehicles (+$2.10/extra vehicle)",
      "1 Office Desktop App (.exe) + Cloud Web Portal",
      "Precision Invoicing & Quotations Engine",
      "Customer Directory & Travel History",
      "Instant Smart Search Across All Records",
      "Basic Service Due Reminders",
      "Automated Daily Cloud Backups",
      "Standard Support (Mon–Fri, 9 AM–5 PM)",
    ],
    ctaText: "Subscribe to Starter",
    ctaHref: (billing) => `/checkout/vigil?tier=starter&billing=${billing}`,
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "For growing tour agencies & commercial fleets",
    isPopular: true,
    monthly: {
      priceFormatted: "$45",
      period: "/mo",
      subtext: "Billed monthly",
    },
    annual: {
      priceFormatted: "$450",
      period: "/yr",
      subtext: "$37.50/mo billed annually",
    },
    setupFee: {
      monthly: "One-time onboarding & driver training: $44",
      annual: "Onboarding & driver training: $0 (Waived on Annual)",
    },
    features: [
      "Up to 25 Vehicles (+$1.80/extra vehicle)",
      "Up to 3 Office Desktop Apps (.exe) + Cloud Web Portal",
      "Everything in Starter, plus:",
      "Day-by-Day Tour Itinerary & Landmark Routing",
      "Live GPS Fleet Radar (30-Day Route History)",
      "Companion Mobile Driver App Sync",
      "Preventive Maintenance Milestone Alerts",
      "Trip Cost & Fuel Margin Tracking",
      "Priority Ticket Support (Mon–Sat, 8 AM–8 PM)",
    ],
    ctaText: "Subscribe to Professional",
    ctaHref: (billing) => `/checkout/vigil?tier=professional&billing=${billing}`,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For multi-branch operators & large fleet companies",
    monthly: {
      priceFormatted: "$117",
      period: "/mo",
      subtext: "Billed monthly",
    },
    annual: {
      priceFormatted: "$1,170",
      period: "/yr",
      subtext: "$97.50/mo billed annually",
    },
    setupFee: {
      monthly: "One-time multi-PC deployment & setup: $104",
      annual: "Multi-PC deployment & setup: $0 (Waived on Annual)",
    },
    features: [
      "Up to 75 Vehicles (+$1.56/extra vehicle)",
      "Up to 10 Multi-Branch Workstations + Cloud Web Portal",
      "Everything in Professional, plus:",
      "Multi-Currency Billing (USD, EUR, GBP, AUD, NZD & Custom)",
      "In-Field Vehicle Swap Audit Logging",
      "Role-Based Access (Managers, Dispatch & Accounts)",
      "90-Day Telemetry Archive & Custom Reports",
      "Dedicated Account Manager & Priority Ticket SLA",
    ],
    ctaText: "Subscribe to Enterprise",
    ctaHref: (billing) => `/checkout/vigil?tier=enterprise&billing=${billing}`,
  },
];

export default function VigilProductPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownloadVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadEmail) return;
    setDownloadMsg(
      `Ready for ${downloadEmail}: Click "Download Vigil (.exe)" above, then sign in at ${VIGIL_PORTAL_BASE}/login (or set/reset your workspace password at ${VIGIL_PORTAL_BASE}/forgot-password).`
    );
  };

  const navTabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Key Features" },
    { id: "itinerary-billing", label: "Tour & Billing Engine" },
    { id: "telematics-maintenance", label: "Telematics & Maintenance" },
    { id: "fleet-types", label: "Fleet Categories" },
    { id: "pricing", label: "Subscription Plans" },
    { id: "download", label: "Software Download" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Payment Status Notification */}
      <Suspense fallback={null}>
        <StatusNotification />
      </Suspense>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 min-h-[65vh] flex items-center border-b border-primary/10">
        {/* Holographic noise texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Vigil &bull; Tour Operating &amp; Fleet Management Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-3 leading-tight drop-shadow-[0_0_20px_rgba(232,115,42,0.35)]">
                Vigil
              </h1>

              <h2 className="text-2xl md:text-3xl font-subheading text-primary font-semibold mb-6">
                Tour Operating &bull; Precision Billing &bull; Live Telematics
              </h2>

              <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-xl">
                The all-in-one software ecosystem for modern tour operators and vehicle rental companies. Plan day-by-day itineraries, track live fleet GPS on radar, dispatch mobile driver duties, manage preventive maintenance countdowns, and generate multi-currency (LKR/USD) invoices with zero revenue leakage.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#pricing"
                  className="bg-primary hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(232,115,42,0.45)] transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2.5"
                >
                  <span>Subscribe to Vigil</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#download"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all inline-flex items-center gap-2.5 backdrop-blur-md"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Download Desktop App</span>
                </a>
              </div>

              {/* Commercial Terms Badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Subscription-based licensing
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Offline-ready desktop suite (Tauri)
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Companion mobile driver app
                </span>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="w-full lg:w-1/2 relative perspective-1000">
              {/* Outer ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-cyan-500/20 to-primary/30 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

              <motion.div
                initial={{ rotateY: -10, rotateX: 6, opacity: 0, scale: 0.95 }}
                animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_30px_100px_-20px_rgba(232,115,42,0.35)] overflow-hidden transition-all duration-500 group"
              >
                {/* Genuine App Screenshot */}
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/vigil-dashboard.png"
                    alt="Vigil Tour Management Platform & Precision Billing Dashboard"
                    className="w-full h-auto object-cover rounded-2xl block border border-white/5"
                  />
                  {/* Subtle glass reflective sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                </div>
              </motion.div>

              {/* Floating Badge 1: Live Fleet Telematics */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 -bottom-6 z-20 bg-black/90 backdrop-blur-xl border border-emerald-500/50 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <div className="text-white text-xs font-bold flex items-center gap-1.5">
                    Live Fleet Radar <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
                  </div>
                  <div className="text-neutral-400 text-[11px]">Real-Time GPS &amp; Driver Speed</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Multi-Currency Billing */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-6 top-6 z-20 bg-black/90 backdrop-blur-xl border border-primary/50 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(232,115,42,0.3)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Precision Billing Engine</div>
                  <div className="text-white text-xs font-bold text-primary font-mono">
                    LKR 185,400 <span className="text-[10px] text-neutral-400 font-normal">($618.00 USD)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY NAVIGATION TABS */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {navTabs.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <section id="overview" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium mb-3">
            Engineered For Serious Tour &amp; Vehicle Operators
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            The Complete Operating System For Your Fleet
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-subheading">
            Tired of lost mileage, unrecorded extra hours, forgotten maintenance dates, and messy paper invoices? Vigil centralizes every tour booking, driver assignment, fuel expense, and billing calculation into one high-performance command center.
          </p>
        </div>

        {/* Video / Workspace Preview Banner */}
        <div className="max-w-4xl mx-auto mb-20 relative rounded-2xl overflow-hidden border border-primary/30 aspect-video group bg-[#050505] shadow-[0_10px_50px_rgba(232,115,42,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vigil-dashboard.png"
            alt="Vigil Tour Management Workspace Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-black/40 to-black/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(232,115,42,0.3)]">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <div className="text-white font-heading font-bold text-xl">Vigil Tour Management Workspace</div>
            <p className="text-neutral-300 text-sm max-w-md">
              Real-time dispatch radar, day-by-day tour itineraries, instant quotation builder, maintenance intervals, and driver mobile sync.
            </p>
          </div>
        </div>

        {/* 3 Core Impact Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: DollarSign,
              title: "Zero Revenue Leakage",
              desc: "Automatically calculate package distance, extra KM charges, excess hours, waiting fees, driver night out allowance, tolls, and gate passes with dual LKR/USD currency billing.",
            },
            {
              icon: Navigation,
              title: "Live GPS Fleet Radar",
              desc: "Track every vehicle on a real-time live map. Monitor live coordinates, vehicle speed, driver status, and receive instant emergency SOS notifications from the road.",
            },
            {
              icon: Wrench,
              title: "Preventive Fleet Intelligence",
              desc: "Automated countdowns for engine oil (5,000 km), air filters, tyre lifespan, and wash intervals, plus proactive warnings before revenue licenses and insurance policies expire.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 hover:border-primary/40 p-8 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group"
            >
              <benefit.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES (ZIGZAG 1) */}
      <section id="features" className="py-24 bg-[#080808] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Showcase Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Key Features Showcased on Vigil
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
              Engineered specifically around the operational realities of tour operators, chauffeur services, and commercial vehicle rental companies.
            </p>
          </div>

          {/* 5-PILLAR SHOWCASE MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {/* Feature 1 */}
            <div className="bg-white/[0.02] border border-primary/20 hover:border-primary/50 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">
                  Precision Billing &amp; Multi-Currency Quotation Engine
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Automated calculations for base packages, included kilometers, excess KM rates, and extra hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Granular charges: driver accommodation, meals, expressway tolls/gate passes, and advance deductions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Dual-currency billing (LKR and USD) with live exchange rate lock and one-click PDF invoices.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-primary font-semibold">
                <span>Dual-Currency LKR / USD</span>
                <span>Zero Revenue Leakage</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.02] border border-primary/20 hover:border-primary/50 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">
                  Day-by-Day Tour Scheduling &amp; Landmark Engine
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Multi-day tour planner with curated Sri Lankan landmarks (Sigiriya, Ella, Kandy, Yala) powered by typo-tolerant smart search autocomplete.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>OSRM road routing with automatic distance and driving duration estimation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Permanent itinerary snapshots embedded with finalized invoices.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-primary font-semibold">
                <span>Fuzzy Landmark Search</span>
                <span>OSRM Routing Engine</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.02] border border-primary/20 hover:border-primary/50 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">
                  Live Fleet Telematics &amp; Mobile Driver App Sync
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Real-time GPS fleet radar with vehicle speed, live coordinates, and status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Companion mobile driver app (vigil-driver-app) for duty assignment, milestone updates, and in-field expense logging (fuel, tolls).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>One-tap Emergency SOS alerts with dispatcher acknowledgment.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400 font-semibold font-mono">
                <span>LIVE RADAR ONLINE</span>
                <span>SOS Signal Dispatch</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/[0.02] border border-primary/20 hover:border-primary/50 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">
                  Preventive Maintenance Intelligence &amp; Vehicle Swaps
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Mileage countdowns for engine oil (5,000 KM), air filters (10,000 KM), tyre wear (40,000 KM), and routine washing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Revenue license &amp; insurance policy expiry countdown monitors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>In-field Vehicle Swap Audit Logging for breakdown replacements without disrupting active tour bookings.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-primary font-semibold">
                <span>Audited Interval Timers</span>
                <span>Zero Tour Disruption</span>
              </div>
            </div>

            {/* Feature 5 (Spans 2 columns on lg) */}
            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 via-black to-neutral-950 border border-primary/30 hover:border-primary/60 rounded-2xl p-7 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.2)] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">
                  Real-World Fleet Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <div className="text-primary font-bold">Cars (CAR)</div>
                    <div className="text-white font-medium mt-0.5">Toyota Prius, Axio, Premio, Alto</div>
                    <div className="text-neutral-400 text-[11px]">Transfers &amp; city hires</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <div className="text-primary font-bold">Vans (VAN)</div>
                    <div className="text-white font-medium mt-0.5">Toyota KDH 200 Super GL, Caravan</div>
                    <div className="text-neutral-400 text-[11px]">Family tours &amp; corporate travel</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <div className="text-primary font-bold">SUVs (SUV)</div>
                    <div className="text-white font-medium mt-0.5">BYD Sealion 6, Land Cruiser Prado</div>
                    <div className="text-neutral-400 text-[11px]">Upcountry &amp; VIP luxury</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                    <div className="text-primary font-bold">Coaches (BUS)</div>
                    <div className="text-white font-medium mt-0.5">Toyota Coaster 29-seater with Dual A/C</div>
                    <div className="text-neutral-400 text-[11px]">Tour delegations</div>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-primary font-bold">Three-Wheelers (TUKTUK):</span>{" "}
                      <span className="text-white font-medium">Local excursions &amp; sightseeing</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Custom Tariff Compatible</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Granular Per-Category Extra KM &amp; Overtime Tariff Support</span>
                <a href="#fleet-types" className="text-primary hover:underline font-semibold flex items-center gap-1">
                  <span>Explore All Vehicle Classes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-32">
            {/* BLOCK 1: Precision Billing & Multi-Currency */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="absolute -left-10 -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none">
                01
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                {/* Outer ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-500/20 to-primary/30 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(232,115,42,0.25)] overflow-hidden transition-all duration-500 group">
                  {/* Genuine Invoice Screenshot */}
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vigil-invoice.png"
                      alt="Vigil Precision Billing & Invoice Generator with Multi-Channel Sharing"
                      className="w-full h-auto object-cover rounded-2xl block border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    {/* Subtle glass reflective sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4">
                  Precision Billing &amp; Multi-Currency Quotation Engine
                </h3>
                <p className="text-neutral-400 text-base mb-6 leading-relaxed">
                  Eliminate manual spreadsheet math and bill customers with 100% auditable accuracy. Capture package inclusions, excess mileage, hourly overtime, night charges, expressway tolls, and driver meal allowances in seconds.
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Automated calculations for base packages, included kilometers, excess KM rates, and extra hours.",
                    "Granular charges: driver accommodation, meals, expressway tolls/gate passes, and advance deductions.",
                    "Dual-currency billing (LKR and USD) with live exchange rate lock and one-click PDF invoices.",
                    "Granular extra kilometer and overtime hour rate cards configured per vehicle category.",
                    "Instant quotation builder convertible to finalized bills in a single click with zero revenue leakage.",
                  ].map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BLOCK 2: Tour Itinerary & Sri Lanka Landmarks */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 relative">
              <div className="absolute -right-10 -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none">
                02
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                {/* Outer ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-primary/30 to-cyan-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(232,115,42,0.25)] overflow-hidden transition-all duration-500 group">
                  {/* Genuine Itinerary Screenshot */}
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vigil-itinerary.png"
                      alt="Vigil Day-by-Day Tour Itinerary Planning and Pricing Breakdown"
                      className="w-full h-auto object-cover rounded-2xl block border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    {/* Subtle glass reflective sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4">
                  Day-by-Day Tour Scheduling &amp; Landmark Engine
                </h3>
                <p className="text-neutral-400 text-base mb-6 leading-relaxed">
                  Plan multi-day tour itineraries with automated routing. Pre-indexed with iconic Sri Lankan destinations and landmarks with typo-tolerant fuzzy autocomplete, so your dispatch team can craft accurate tour schedules effortlessly.
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Multi-day tour planner with curated Sri Lankan landmarks (Sigiriya, Ella, Kandy, Yala) powered by typo-tolerant smart search autocomplete.",
                    "OSRM road routing with automatic distance and driving duration estimation.",
                    "Permanent itinerary snapshots embedded with finalized invoices.",
                    "Day-by-day itinerary schedule linked directly to billing quotations and driver assignments.",
                    "Printable guest itineraries and tour vouchers with complete day item breakdowns.",
                  ].map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BLOCK 3: Live Telematics & Mobile Driver App */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="absolute -left-10 -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none">
                03
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                {/* Outer ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary/30 to-emerald-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25)] overflow-hidden transition-all duration-500 group">
                  {/* Genuine Telematics & Radar Screenshot */}
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vigil-telematics.png"
                      alt="Vigil Live Fleet Radar, Real-Time GPS Tracking & Telematics Dispatch Center"
                      className="w-full h-auto object-cover rounded-2xl block border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    {/* Subtle glass reflective sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4">
                  Live Fleet Telematics &amp; Mobile Driver App Sync
                </h3>
                <p className="text-neutral-400 text-base mb-6 leading-relaxed">
                  Bridge the gap between your dispatch office and chauffeurs on the road. The companion <code className="text-primary font-mono font-bold">vigil-driver-app</code> feeds real-time GPS telemetry back to your desktop radar while allowing drivers to confirm duties and log fuel expenses.
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Real-time GPS fleet radar with vehicle speed, live coordinates, and status.",
                    "Companion mobile driver app (vigil-driver-app) for duty assignment, milestone updates, and in-field expense logging (fuel, tolls).",
                    "One-tap Emergency SOS alerts with dispatcher acknowledgment.",
                    "In-field expense logging: drivers submit fuel, toll, and repair receipts during active tours.",
                    "Dispatcher emergency acknowledgment workflow with automated audit logging.",
                  ].map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BLOCK 4: Maintenance Intelligence & Vehicle Swaps */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 relative">
              <div className="absolute -right-10 -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none">
                04
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                {/* Outer ambient glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-primary/30 to-amber-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(245,158,11,0.25)] overflow-hidden transition-all duration-500 group">
                  {/* Genuine Maintenance Screenshot */}
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vigil-maintenance.png"
                      alt="Vigil Preventive Fleet Maintenance Radar & Service Interval Intelligence"
                      className="w-full h-auto object-cover rounded-2xl block border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    {/* Subtle glass reflective sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4">
                  Preventive Maintenance Intelligence &amp; Vehicle Swaps
                </h3>
                <p className="text-neutral-400 text-base mb-6 leading-relaxed">
                  Stop surprise breakdowns and traffic fines. Vigil automatically tracks vehicle mileage against routine service intervals and alerts your fleet manager when oil changes, tyre rotations, or insurance policy renewals are due.
                </p>
                <ul className="space-y-3.5">
                  {[
                    "Mileage countdowns for engine oil (5,000 KM), air filters (10,000 KM), tyre wear (40,000 KM), and routine washing.",
                    "Revenue license & insurance policy expiry countdown monitors.",
                    "In-field Vehicle Swap Audit Logging for breakdown replacements without disrupting active tour bookings.",
                    "Fuel efficiency monitoring: track actual KM per Litre per vehicle and identify high-cost units.",
                    "Annual insurance and routine servicing cost analytics per vehicle identification number.",
                  ].map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPO-TOLERANT SEARCH & CRM SECTION */}
      <section id="itinerary-billing" className="py-24 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Search className="w-4 h-4" />
              <span>Intelligent Smart Search Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              Instant Typo-Tolerant Search &amp; Customer CRM
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
              Search through thousands of quotations, customers, tour schedules, and vehicle numbers instantly—even when customer names or car models are misspelled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Smart Search Across Every Table</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Typing &ldquo;sealon&rdquo; instantly surfaces &ldquo;BYD Sealion 6&rdquo;. Searching &ldquo;sigriya&rdquo; matches &ldquo;Sigiriya Lion Rock&rdquo;. Your team never loses time to exact-string queries or search failures.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300">
                    <span className="text-neutral-500">Query:</span> &ldquo;kdh&rdquo; &rarr; <span className="text-emerald-400 font-bold">Toyota KDH 200 Super GL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300">
                    <span className="text-neutral-500">Query:</span> &ldquo;ella bridge&rdquo; &rarr; <span className="text-emerald-400 font-bold">Nine Arches Bridge, Ella</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-neutral-300">
                    <span className="text-neutral-500">Query:</span> &ldquo;coaster&rdquo; &rarr; <span className="text-emerald-400 font-bold">Toyota Coaster Bus (29 Seats)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Complete Customer CRM &amp; Tour History</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Maintain an exhaustive guest and agency profile directory. Track passport/NIC credentials, nationality, past tour itineraries, total spend, and contact records with automatic billing prefill.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Passport &amp; National Identity Card (NIC) verification records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Repeat guest history: see past tour packages, bills, and assigned drivers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>One-click guest selection during quotation and tour schedule generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Agency B2B vs individual traveler tagging with customized credit terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VEHICLE CATEGORIES COMPATIBILITY */}
      <section id="fleet-types" className="py-24 container mx-auto px-6 text-center border-t border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Car className="w-4 h-4" />
          <span>Vehicle Class Support</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
          Real-World Fleet Categories
        </h2>
        <p className="text-neutral-400 mb-16 font-subheading max-w-2xl mx-auto">
          From luxury chauffeur SUVs to 29-seater tour coaches, Vigil manages custom rate cards, seating capacities, and A/C configurations for every commercial vehicle category.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Car,
              label: "Cars (CAR)",
              models: "Toyota Prius, Axio, Premio, Alto",
              role: "Transfers & city hires",
            },
            {
              icon: Bus,
              label: "Vans (VAN)",
              models: "Toyota KDH 200 Super GL, Caravan",
              role: "Family tours & corporate travel",
            },
            {
              icon: Package,
              label: "SUVs (SUV)",
              models: "BYD Sealion 6, Land Cruiser Prado",
              role: "Upcountry & VIP luxury",
            },
            {
              icon: Bus,
              label: "Coaches (BUS)",
              models: "Toyota Coaster 29-seater with Dual A/C",
              role: "Tour delegations",
            },
            {
              icon: Compass,
              label: "Three-Wheelers (TUKTUK)",
              models: "Local excursions & sightseeing",
              role: "Custom tariff & tour itineraries",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/10 hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,115,42,0.15)] group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <div className="font-bold text-white text-base mb-1">{item.label}</div>
              <div className="text-primary text-xs font-semibold mb-2">{item.models}</div>
              <div className="text-neutral-400 text-xs mt-auto">{item.role}</div>
            </div>
          ))}
        </div>

        {/* Genuine Fleet Directory Showcase */}
        <div className="mt-16 max-w-5xl mx-auto relative z-10 text-left">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-500/20 to-primary/30 rounded-2xl blur-xl opacity-40 pointer-events-none" />
          <div className="relative z-10 bg-[#070709] border border-primary/40 hover:border-primary/70 rounded-2xl shadow-[0_20px_60px_-15px_rgba(232,115,42,0.25)] overflow-hidden transition-all duration-500 group">
            {/* Genuine Vehicles Screenshot */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vigil-vehicles.png"
                alt="Vigil Comprehensive Commercial Fleet Management, Rate Cards & Capacities Table"
                className="w-full h-auto object-cover rounded-2xl block border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 px-2 text-xs text-neutral-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Live fleet registry with package tariffs, daily rate baselines, and excess KM pricing.
            </span>
            <span className="font-mono text-primary font-semibold">12 Fleet Categories Supported</span>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 bg-black border-t border-primary/10 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Commercial Software Licensing</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Simple, Transparent Subscription Plans
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
            Choose your plan and complete your subscription via Dodo Payments. Once subscribed, you immediately receive access to download the Vigil Windows desktop suite, download the mobile driver APK, and activate your license key.
          </p>

          {/* Billing Toggle Pill */}
          <div className="flex items-center justify-center mb-14">
            <div className="inline-flex items-center p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(232,115,42,0.4)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  billingCycle === "annual"
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(232,115,42,0.4)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full transition-colors ${
                    billingCycle === "annual"
                      ? "bg-black/30 text-white border border-white/20"
                      : "bg-primary/20 text-primary border border-primary/30"
                  }`}
                >
                  2 Months Free
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {PRICING_TIERS.map((tier) => {
              const currentPricing = billingCycle === "annual" ? tier.annual : tier.monthly;
              const isPopular = tier.isPopular;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-8 text-left flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? "bg-primary/5 border-2 border-primary relative transform md:-translate-y-4 shadow-[0_20px_60px_rgba(232,115,42,0.2)]"
                      : "bg-[#050505] border border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Top Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(232,115,42,0.6)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <h3
                      className={`text-2xl font-heading font-bold mb-1 ${
                        isPopular ? "text-primary" : "text-white"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p className="text-neutral-400 text-xs mb-6 min-h-[32px]">
                      {tier.subtitle}
                    </p>

                    {/* Price with smooth animation */}
                    <div className="mb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={billingCycle}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className={`text-4xl font-bold font-heading ${
                              isPopular ? "text-primary" : "text-white"
                            }`}
                          >
                            {currentPricing.priceFormatted}
                            <span className="text-base text-neutral-500 font-normal font-sans ml-1">
                              {currentPricing.period}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-1 min-h-[18px]">
                            {currentPricing.subtext || "Billed monthly"}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Setup Fee Display */}
                    <div className="mb-6 pb-5 border-b border-white/10">
                      <div className="text-[11px] text-neutral-400 leading-snug flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1" />
                        <span>{billingCycle === "annual" ? tier.setupFee.annual : tier.setupFee.monthly}</span>
                      </div>
                    </div>

                    {/* Feature List */}
                    <ul className="space-y-3.5 mb-8">
                      {tier.features.map((feat, fi) => {
                        const isSectionHeader = feat.startsWith("Everything in");
                        return (
                          <li key={fi} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0 mt-0.5" />
                            <span
                              className={
                                isSectionHeader
                                  ? "text-primary font-semibold"
                                  : isPopular
                                  ? "text-white font-medium"
                                  : "text-neutral-300"
                              }
                            >
                              {feat}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* CTA Button Aligned to Bottom */}
                  <div className="pt-2">
                    <Link href={tier.ctaHref(billingCycle)} className="block w-full">
                      <button
                        className={`w-full text-sm text-center font-bold transition-all ${
                          isPopular
                            ? "py-4 rounded-xl bg-primary hover:bg-primary-600 text-white shadow-[0_0_20px_rgba(232,115,42,0.4)]"
                            : "py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold"
                        }`}
                      >
                        {tier.ctaText}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-On Strip Below Cards */}
          <div className="max-w-6xl mx-auto mt-8 p-5 rounded-2xl bg-[#080808] border border-white/10 text-neutral-300 text-xs sm:text-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="leading-relaxed">
                <span className="text-white font-semibold">Custom Fleets &amp; Priority SLA:</span>{" "}
                Async <span className="text-primary font-semibold">Priority Ticket SLA</span> included on Enterprise. Managing more than 75 vehicles? Contact us for a custom fleet quote.
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-400 font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors"
            >
              <span>Contact for Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Commercial Policy Clarification Notice */}
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-neutral-400 text-xs text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold">Bitgard Commercial Licensing Policy:</span>{" "}
              Bitgard provides Vigil exclusively as a subscription-based commercial platform. We do not offer free tiers, ad-supported versions, or trial licenses. Subscribed operators receive complete desktop installer download rights, driver APK access, regular platform upgrades, and license key activation via Dodo Payments.
            </div>
          </div>
        </div>
      </section>

      {/* SOFTWARE DOWNLOAD & ACTIVATION SECTION */}
      <section id="download" className="py-24 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Download className="w-4 h-4" />
              <span>Subscriber Download Portal</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              Download Vigil Software Suite
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
              Deploy Vigil on your office workstations and dispatch mobile tools to your drivers. An active subscription is required to activate your master license key.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-white font-bold mb-2">1. Subscribe on Bitgard</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Choose a plan (Starter, Professional, or Enterprise) and complete checkout via Dodo Payments.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-white font-bold mb-2">2. Install Desktop Suite</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Download the official Vigil Windows setup installer (.exe) and run the setup wizard on your computers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-white font-bold mb-2">3. Sign In &amp; Activate</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Launch Vigil, log in using your subscriber credentials provided during Bitgard registration, and start managing your fleet.
              </p>
            </div>
          </div>

          {/* Download Box */}
          <div className="bg-gradient-to-b from-white/[0.04] to-black border border-primary/30 rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(232,115,42,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <Laptop className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-heading font-bold text-white">
                    Vigil Desktop Suite
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold border border-primary/30">
                    v0.1.0 LTS
                  </span>
                </div>
                <p className="text-neutral-400 text-sm mb-3">
                  Windows 10 / 11 / Windows Server (64-bit) &bull; Setup Size: 1.8 MB (.exe) / 2.7 MB (.msi)
                </p>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>Signed Desktop Launcher</span>
                  <span>&bull;</span>
                  <span>Cloud-Synced Workspace</span>
                  <span>&bull;</span>
                  <span>Windows Setup Wizard</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              <a
                href={VIGIL_EXE_URL}
                download="Vigil-Setup-v0.1.0-x64.exe"
                className="bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(232,115,42,0.4)] transition-all flex items-center justify-center gap-2 text-center"
              >
                <Download className="w-5 h-5" />
                <span>Download Vigil (.exe)</span>
              </a>
              <div className="flex items-center justify-center gap-3 text-xs text-neutral-400 py-1">
                <a
                  href={VIGIL_MSI_URL}
                  download="Vigil-Setup-v0.1.0-x64.msi"
                  className="hover:text-white underline transition-colors"
                >
                  Download .MSI
                </a>
                <span>&bull;</span>
                <a
                  href={`${VIGIL_PORTAL_BASE}/login`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline transition-colors"
                >
                  Launch Web App &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Verification / License Recovery for Existing Subscribers */}
          <div className="mt-12 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Existing Subscriber? Retrieve Your Installer &amp; License Credentials
            </h4>
            <p className="text-neutral-400 text-xs mb-6">
              Enter your registered subscriber email below to receive your direct download URL and active license activation token:
            </p>

            <form onSubmit={handleDownloadVerification} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={downloadEmail}
                onChange={(e) => setDownloadEmail(e.target.value)}
                placeholder="your-company-email@domain.com"
                className="flex-1 bg-black/60 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-white text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
              >
                Retrieve Access
              </button>
            </form>

            {downloadMsg && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {downloadMsg}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
