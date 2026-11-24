"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Monitor, Car, Shield, Activity, Sparkles } from "lucide-react";

export function HomepageHero() {
  const [activeTab, setActiveTab] = useState<"vigil" | "pos">("vigil");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#000000] border-b border-white/10 overflow-hidden">
      {/* Subtle radial ambient background strictly adhering to dark surface rules */}
      <div className="absolute inset-0 bg-[#000000] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-wider mb-6">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Commercial software suite &bull; Retail and fleet operations</span>
        </div>

        {/* Heading: Left-to-right gradient text (#FFFFFF -> #9B9B9B), max-w-[680px], text-wrap: balance, no hyphens */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-[680px] mx-auto text-balance bg-gradient-to-r from-white via-neutral-100 to-[#9B9B9B] bg-clip-text text-transparent leading-[1.1] mb-6">
          Run your entire fleet and retail operations on one unified software suite
        </h1>

        {/* Subheading: max-w-[680px], text-pretty */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-[680px] mx-auto text-pretty leading-relaxed mb-8">
          Commercial desktop and cloud software built for tour operators and multi branch retailers. Process cashier transactions at sub second speed, dispatch vehicles with live GPS radar, and eliminate revenue leakage.
        </p>

        {/* Primary CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="#products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(232,115,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>Explore products and subscribe</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#272727] active:scale-[0.98] border border-white/10 text-neutral-200 font-medium text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <span>View software catalog</span>
          </Link>
        </div>

        {/* Commercial Terms / Proof Signal */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400 mb-16">
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
            <span>100% offline resilient</span>
          </span>
        </div>

        {/* Interactive Product Showcase Mockup */}
        <div className="max-w-5xl mx-auto">
          {/* Tab selector */}
          <div className="inline-flex items-center p-1 bg-[#181818] border border-white/10 rounded-xl mb-4">
            <button
              onClick={() => setActiveTab("vigil")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeTab === "vigil"
                  ? "bg-[#272727] text-white shadow-sm border border-white/10"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Car className="w-4 h-4 text-primary" />
              <span>Vigil Tour &amp; Fleet OS</span>
            </button>
            <button
              onClick={() => setActiveTab("pos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeTab === "pos"
                  ? "bg-[#272727] text-white shadow-sm border border-white/10"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4 text-primary" />
              <span>Bitgard POS &amp; Inventory</span>
            </button>
          </div>

          {/* Window Mockup Frame */}
          <div className="relative rounded-2xl bg-[#181818] border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Window header */}
            <div className="h-10 bg-[#141414] border-b border-white/10 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <div className="w-3 h-3 rounded-full bg-[#313131] border border-white/10" />
                <span className="text-xs text-neutral-500 font-mono ml-2">
                  {activeTab === "vigil" ? "vigil-fleet-os.desktop" : "bitgard-pos-terminal.desktop"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Offline Engine Ready</span>
              </div>
            </div>

            {/* Mockup screen with smooth transition */}
            <div className="relative aspect-[16/10] bg-[#000000] overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "vigil" ? (
                  <motion.div
                    key="vigil"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/vigil-dashboard.png"
                      alt="Vigil Tour Operating System & Live Telematics Fleet Dashboard"
                      className="w-full h-full object-cover object-top block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="pos"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/pos-dashboard.png"
                      alt="Bitgard Point of Sale and Inventory Management Dashboard"
                      className="w-full h-full object-cover object-top block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Stat Overlay 1 */}
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-20 bg-[#181818]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 text-left shadow-lg max-w-[260px] sm:max-w-[300px]">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-white">
                    {activeTab === "vigil" ? "Live Telematics Stream" : "Sub Second Checkout"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400">
                  {activeTab === "vigil"
                    ? "Continuous GPS beaconing with automatic excess mileage billing."
                    : "Barcode scanner register processing 120 items per minute."}
                </p>
              </div>

              {/* Floating Stat Overlay 2 */}
              <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 bg-[#181818]/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-right shadow-lg">
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Local Database</div>
                <div className="text-xs sm:text-sm font-semibold text-white font-mono">SQLite + Cloud Sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
