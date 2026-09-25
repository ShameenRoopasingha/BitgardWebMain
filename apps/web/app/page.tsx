"use client";

/**
 * =============================================================================
 * BITGARD WEBSITE - HOMEPAGE (PHASE 3 OVERHAUL)
 * =============================================================================
 */

import { Hero } from "@/components/sections/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { MonitorSmartphone, Package, Briefcase, Zap, ShieldCheck, Rocket, Headphones } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background text-foreground overflow-hidden font-body relative">
      {/* Background Holographic Texture / Orbs */}
      <div className="absolute top-[30%] left-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[70%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 1. Hero Section (Kept from original per user request) */}
      <Hero />

      {/* 2. PRODUCT ECOSYSTEM PREVIEW */}
      <section className="py-24 relative z-10 border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Core Products</h2>
            <p className="text-xl text-neutral-400 font-subheading">One interconnected ecosystem to run your entire enterprise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* POS */}
            <Link href="/products/pos" className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white/[0.02] border border-white/10 hover:border-primary/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 h-full flex flex-col relative overflow-hidden shadow-[0_0_0_rgba(232,115,42,0)] hover:shadow-[0_20px_50px_-15px_rgba(232,115,42,0.3)]"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MonitorSmartphone className="w-32 h-32 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                  <MonitorSmartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10 group-hover:text-primary transition-colors">POS + Inventory</h3>
                <p className="text-neutral-400 mb-8 relative z-10 flex-1">
                  Complete point-of-sale solution with real-time inventory tracking, multi-location stock sync, and analytics.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Explore Product →
                </span>
              </motion.div>
            </Link>

            {/* Vehicle Hire */}
            <Link href="/products/vehicle-hire" className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white/[0.02] border border-white/10 hover:border-primary/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 h-full flex flex-col relative overflow-hidden shadow-[0_0_0_rgba(232,115,42,0)] hover:shadow-[0_20px_50px_-15px_rgba(232,115,42,0.3)]"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Package className="w-32 h-32 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10 group-hover:text-primary transition-colors">Vehicle Hire</h3>
                <p className="text-neutral-400 mb-8 relative z-10 flex-1">
                  End-to-end platform for vehicle rental operators. Manage bookings, track your fleet, and handle customers.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Explore Product →
                </span>
              </motion.div>
            </Link>

            {/* HRM */}
            <Link href="/products/hrm" className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white/[0.02] border border-white/10 hover:border-primary/50 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 h-full flex flex-col relative overflow-hidden shadow-[0_0_0_rgba(232,115,42,0)] hover:shadow-[0_20px_50px_-15px_rgba(232,115,42,0.3)]"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Briefcase className="w-32 h-32 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10 group-hover:text-primary transition-colors">HRM System</h3>
                <p className="text-neutral-400 mb-8 relative z-10 flex-1">
                  Comprehensive human resource management. Handle payroll, attendance, leave, and performance reviews.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Explore Product →
                </span>
              </motion.div>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <Link href="/products" className="inline-block bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(232,115,42,0.4)]">
              View Entire Ecosystem
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE BITGARD */}
      <section className="py-24 relative z-10 bg-[#050505] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Why Choose Bitgard</h2>
            <p className="text-neutral-400 text-xl font-subheading">Built for scale, secured by design.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Optimized architectures ensure sub-second response times even under heavy load." },
              { icon: Rocket, title: "Infinite Scale", desc: "Cloud-native infrastructure that grows seamlessly alongside your business." },
              { icon: ShieldCheck, title: "Bank-Grade Security", desc: "End-to-end encryption, automated backups, and strict compliance." },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated technical teams available around the clock to assist you." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(232,115,42,0.2)]">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
