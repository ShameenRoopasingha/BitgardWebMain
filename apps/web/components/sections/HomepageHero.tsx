"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Car, ShoppingCart, MapPin, Package, Calendar, Activity, ChevronRight } from "lucide-react";

type ShowcaseTab = "fleet" | "itinerary" | "pos" | "inventory";

interface TabMeta {
  id: ShowcaseTab;
  title: string;
  badge: string;
  product: string;
  link: string;
  img: string;
  icon: React.ComponentType<{ className?: string }>;
  calloutTitle: string;
  calloutDesc: string;
}

const TABS: TabMeta[] = [
  {
    id: "fleet",
    title: "Live Fleet Radar",
    badge: "Vigil Fleet OS",
    product: "Tour & Fleet Management",
    link: "/products/vehicle-hire",
    img: "/vigil-fleet.png",
    icon: Car,
    calloutTitle: "Live GPS Fleet Telematics",
    calloutDesc: "Continuous vehicle tracking, driver duty dispatch, and automated excess kilometer billing."
  },
  {
    id: "itinerary",
    title: "Tour & Itinerary Billing",
    badge: "Vigil Tour Engine",
    product: "Tour & Fleet Management",
    link: "/products/vehicle-hire",
    img: "/vigil-itinerary.png",
    icon: MapPin,
    calloutTitle: "Day-by-Day Tour Routing",
    calloutDesc: "Landmark itinerary planning, hotel stops, and multi-currency (LKR/USD) precision invoices."
  },
  {
    id: "pos",
    title: "Cashier Register",
    badge: "Bitgard POS",
    product: "Point of Sale & Retail",
    link: "/products/pos",
    img: "/pos-checkout.png",
    icon: ShoppingCart,
    calloutTitle: "Sub-Second Barcode Register",
    calloutDesc: "High-speed product search, custom discounts, and split cash/card payments with digital receipts."
  },
  {
    id: "inventory",
    title: "Inventory & Batch Expiry",
    badge: "Bitgard IMS",
    product: "Point of Sale & Retail",
    link: "/products/pos",
    img: "/pos-inventory.png",
    icon: Package,
    calloutTitle: "Automated Batch Tracking",
    calloutDesc: "Real-time stock balance alerts, expiry countdowns, and multi-branch warehouse transfers."
  }
];

export function HomepageHero() {
  const [activeTabId, setActiveTabId] = useState<ShowcaseTab>("fleet");
  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#000000] border-b border-white/10 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-wider mb-6">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Commercial software suite &bull; Tour fleet OS and retail POS</span>
        </div>

        {/* Heading: Left-to-right gradient text (#FFFFFF -> #9B9B9B), max-w-[740px], text-wrap: balance */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-[740px] mx-auto text-balance bg-gradient-to-r from-white via-neutral-100 to-[#9B9B9B] bg-clip-text text-transparent leading-[1.15] mb-6">
          Enterprise software built to run tour fleets and retail operations
        </h1>

        {/* Subheading: max-w-[680px], text-pretty */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-[680px] mx-auto text-pretty leading-relaxed mb-8">
          Commercial desktop software built for modern business operators. Plan day by day itineraries, track live vehicle GPS radar, run sub second cashier checkouts, and eliminate revenue leakage with offline resilient systems.
        </p>

        {/* Primary CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            href="/products/vehicle-hire"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(232,115,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Explore Vigil Fleet OS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products/pos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#272727] active:scale-[0.98] border border-white/10 text-neutral-200 font-medium text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span>Explore Bitgard POS</span>
          </Link>
        </div>

        {/* Commercial Terms / Proof Signal */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400 mb-14">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Subscription based licensing</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Instant license activation</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>100% offline ready desktop suite (Tauri + SQLite)</span>
          </span>
        </div>

        {/* HERO VISUAL STAGE: Interactive Real Software Showcase */}
        <div className="max-w-5xl mx-auto text-left">
          
          {/* Interactive Screen Tab Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#181818] border-primary/50 text-white shadow-[0_0_15px_rgba(232,115,42,0.15)]"
                      : "bg-[#101010] border-white/5 text-neutral-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-neutral-400"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <div className="text-[10px] uppercase font-mono text-neutral-500 leading-tight">{tab.badge}</div>
                    <div className="truncate">{tab.title}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real Software Showcase Window */}
          <div className="relative rounded-2xl bg-[#181818] border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Window title bar */}
            <div className="h-11 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <span className="text-xs text-neutral-300 font-mono ml-2">
                  {activeTab.product} &bull; {activeTab.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Offline Engine Active</span>
                </span>
                <span className="text-white/20">|</span>
                <Link
                  href={activeTab.link}
                  className="text-primary hover:text-primary-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Open product page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Genuine Software Screenshot Stage */}
            <div className="relative bg-[#070709] overflow-hidden aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeTab.img}
                    alt={`${activeTab.title} - ${activeTab.product}`}
                    className="w-full h-full object-cover object-top block"
                  />
                  {/* Glass reflective sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Real-Time Callout Badge */}
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-20 bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 sm:p-4 text-left shadow-2xl max-w-[320px] sm:max-w-[380px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Activity className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {activeTab.calloutTitle}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  {activeTab.calloutDesc}
                </p>
                <Link
                  href={activeTab.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-400 transition-colors"
                >
                  <span>View feature documentation &amp; pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Engine Badge */}
              <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-20 hidden sm:block bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-xl px-3.5 py-2 text-right shadow-2xl">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Local Storage Architecture</div>
                <div className="text-xs font-semibold text-white font-mono">SQLite + Automatic Cloud Sync</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
