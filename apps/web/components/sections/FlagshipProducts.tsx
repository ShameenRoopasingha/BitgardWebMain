"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Calculator, Layers, AlertCircle, ShoppingCart, BarChart3, Users } from "lucide-react";

export function FlagshipProducts() {
  return (
    <section id="products" className="py-24 md:py-32 bg-[#000000] border-b border-white/10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PROBLEM TO SOLUTION COMPARISON */}
        <div className="max-w-4xl mx-auto mb-24 md:mb-32">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
              The operational bottleneck
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-4 text-balance">
              Fragmented software costs your business time and uncollected revenue
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 text-pretty max-w-2xl mx-auto">
              Most businesses still run critical operations on disconnected spreadsheets, manual paper log sheets, and fragile web apps that crash whenever the internet connection drops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Fragile Way */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-red-500/20 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium mb-4">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>The legacy dilemma</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">Disconnected and fragile systems</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold leading-none mt-1">&times;</span>
                    <span>Paper log sheets lead to unbilled kilometers and lost trip fees</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold leading-none mt-1">&times;</span>
                    <span>Web cashier terminals freeze completely when internet drops</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold leading-none mt-1">&times;</span>
                    <span>Stock levels desynchronize across branches, creating unexpected stockouts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* The Bitgard Architecture */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-primary/30 shadow-[0_10px_30px_rgba(232,115,42,0.1)] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>The Bitgard architecture</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">Native desktop performance with cloud sync</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Local SQLite engines run transactions continuously with zero downtime</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Automated telematics track every kilometer and calculate excess billing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Real time cloud synchronization keeps all branches and fleet hubs aligned</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION HEADER: CORE PRODUCTS */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Proprietary software suites
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-balance">
            Two specialized platforms engineered for revenue growth
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 text-pretty max-w-2xl mx-auto">
            Choose the dedicated platform built for your industry. Download the installer, activate your license key, and start operating without delay.
          </p>
        </div>

        {/* PRODUCT 01: VIGIL FLEET & TOUR OS */}
        <div className="mb-24 p-6 sm:p-10 rounded-3xl bg-[#181818] border border-white/10 hover:border-primary/40 transition-colors duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-4 w-fit">
                <span>Flagship 01 &bull; Fleet &amp; Tour Ops</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">
                Vigil Tour Management &amp; Live Telematics Suite
              </h3>
              <p className="text-sm sm:text-base text-neutral-400 mb-6 leading-relaxed text-pretty">
                The complete operating system for modern tour operators and vehicle rental companies. Plan complex multi day itineraries, monitor vehicles on live GPS radar, and generate multi currency invoices with zero revenue leakage.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Day by day itinerary planning</h4>
                    <p className="text-xs text-neutral-400">Map landmarks, accommodations, and driver night halts with automated quote generation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Live telematics and excess billing</h4>
                    <p className="text-xs text-neutral-400">Track odometer discrepancies, waiting hours, and excess mileage automatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Mobile driver app dispatch</h4>
                    <p className="text-xs text-neutral-400">Send trip itineraries directly to drivers with digital start and end odometer captures.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products/vigil"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.3)]"
                >
                  <span>Explore Vigil and subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-neutral-400">From $21 per month</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-2xl bg-[#000000] border border-white/10 overflow-hidden shadow-2xl group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/vigil-fleet.png"
                  alt="Vigil Live Fleet Management and Dispatch Dashboard"
                  className="w-full h-auto object-cover block group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT 02: BITGARD POS + INVENTORY */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#181818] border border-white/10 hover:border-primary/40 transition-colors duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-2xl bg-[#000000] border border-white/10 overflow-hidden shadow-2xl group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pos-checkout.png"
                  alt="Bitgard POS Cashier Register and Barcode Checkout Screen"
                  className="w-full h-auto object-cover block group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-4 w-fit">
                <span>Flagship 02 &bull; Retail &amp; Inventory</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">
                Bitgard Point of Sale &amp; Inventory Management
              </h3>
              <p className="text-sm sm:text-base text-neutral-400 mb-6 leading-relaxed text-pretty">
                Lightning fast checkout and stock management built for retail stores, supermarkets, and multi location businesses. Process lines quickly, automate reorders, and audit every item batch.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Sub second barcode checkout</h4>
                    <p className="text-xs text-neutral-400">Supports split cash and card payments, instant item discounts, and custom receipts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Automated batch and expiry tracking</h4>
                    <p className="text-xs text-neutral-400">Receive alerts before goods spoil or stock levels dip below reorder thresholds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">Multi branch stock transfers</h4>
                    <p className="text-xs text-neutral-400">Transfer items between store rooms and warehouses with full audit logs.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products/pos"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.3)]"
                >
                  <span>Explore POS and subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-neutral-400">From $29 per month</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
