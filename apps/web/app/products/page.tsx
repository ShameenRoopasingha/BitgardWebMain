"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MonitorSmartphone, Package, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";

export default function ProductsOverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative">
      
      {/* Subtle floating holographic orbs */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-[5%] w-[30vw] h-[30vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center min-h-[45vh] border-b border-primary/10">
        
        {/* Retro 80s wireframe grid floor effect */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)',
            transformOrigin: 'top center'
          }}
        />
        
        {/* Holographic noise texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="container relative z-10 mx-auto px-6 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-8 font-subheading">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Products</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(232,115,42,0.5)]"
          >
            Our Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-neutral-300 font-subheading max-w-2xl mx-auto"
          >
            Three powerful platforms. One seamless ecosystem.
          </motion.p>
        </div>
      </section>

      {/* PRODUCT CARDS SECTION */}
      <section className="container mx-auto px-6 py-20">
        <div className="space-y-32">
          
          {/* CARD 1 — POS + INVENTORY */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row gap-12 items-center bg-white/[0.02] border border-primary/20 rounded-3xl p-8 lg:p-12 backdrop-blur-xl relative group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(232,115,42,0.15)]"
          >
            {/* Prismatic Top Edge */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Left: Mockup Placeholder */}
            <div className="w-full lg:w-[55%] aspect-video bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(232,115,42,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="text-neutral-500 font-subheading flex flex-col items-center gap-4">
                  <MonitorSmartphone className="w-16 h-16 text-primary/40" />
                  <span>POS Dashboard UI Mockup</span>
                </div>
            </div>

            {/* Right: Content */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 mb-6">
                <MonitorSmartphone className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-3">POS + Inventory</h2>
              <h3 className="text-xl text-primary font-subheading mb-4">Sell smarter. Stock effortlessly.</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Complete point-of-sale solution with real-time inventory tracking, multi-location stock sync, supplier management, and powerful sales analytics.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {["Fast Checkout & Billing", "Real-time Stock Tracking", "Multi-location Sync", "Barcode Management", "Purchase Orders", "Sales Analytics"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-neutral-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products/pos" className="bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  View Product
                </Link>
                <button className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Try Free
                </button>
              </div>
            </div>
          </motion.div>


          {/* CARD 2 — VEHICLE HIRE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col-reverse lg:flex-row gap-12 items-center bg-white/[0.02] border border-primary/20 rounded-3xl p-8 lg:p-12 backdrop-blur-xl relative group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(232,115,42,0.15)]"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Left: Content */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 mb-6">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-3">Vehicle Hire</h2>
              <h3 className="text-xl text-primary font-subheading mb-4">Manage your fleet. Maximize every booking.</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                End-to-end platform for vehicle rental and tour operators. Manage bookings, track your fleet, coordinate drivers, and handle customer reservations.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {["Online Booking Engine", "Fleet & Vehicle Tracking", "Driver Assignment", "Tour Packages", "Customer CRM", "Revenue Reports"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-neutral-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products/vehicle-hire" className="bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  View Product
                </Link>
                <button className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Try Free
                </button>
              </div>
            </div>

            {/* Right: Mockup Placeholder */}
            <div className="w-full lg:w-[55%] aspect-video bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(232,115,42,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="text-neutral-500 font-subheading flex flex-col items-center gap-4">
                  <Package className="w-16 h-16 text-primary/40" />
                  <span>Fleet Dashboard UI Mockup</span>
                </div>
            </div>
          </motion.div>


          {/* CARD 3 — HRM SYSTEM */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row gap-12 items-center bg-white/[0.02] border border-primary/20 rounded-3xl p-8 lg:p-12 backdrop-blur-xl relative group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(232,115,42,0.15)]"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Left: Mockup Placeholder */}
            <div className="w-full lg:w-[55%] aspect-video bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(232,115,42,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="text-neutral-500 font-subheading flex flex-col items-center gap-4">
                  <Briefcase className="w-16 h-16 text-primary/40" />
                  <span>HRM Dashboard UI Mockup</span>
                </div>
            </div>

            {/* Right: Content */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 mb-6">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-3">HRM System</h2>
              <h3 className="text-xl text-primary font-subheading mb-4">Your people, perfectly managed.</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Comprehensive human resource management from recruitment to retirement. Handle payroll, attendance, leave, performance reviews, and engagement.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {["Payroll & Taxes", "Attendance Tracking", "Leave Management", "Recruitment", "Performance Reviews", "Employee Portal"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm text-neutral-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products/hrm" className="bg-primary hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  View Product
                </Link>
                <button className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Try Free
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ECOSYSTEM SECTION */}
      <section className="py-24 border-t border-primary/10 relative">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-16">Better Together</h2>
          
          <div className="max-w-4xl mx-auto bg-white/[0.02] border border-primary/20 backdrop-blur-xl rounded-3xl p-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-12 relative">
                
                {/* Connecting lines */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                
                <div className="flex flex-col items-center gap-4 relative z-10 bg-[#0A0A0A] p-4 rounded-xl border border-primary/30">
                  <MonitorSmartphone className="w-10 h-10 text-primary" />
                  <span className="text-white font-bold font-heading">POS</span>
                </div>
                <div className="flex flex-col items-center gap-4 relative z-10 bg-[#0A0A0A] p-4 rounded-xl border border-primary/30 scale-110">
                  <Package className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(232,115,42,0.8)]" />
                  <span className="text-white font-bold font-heading">Vehicle Hire</span>
                </div>
                <div className="flex flex-col items-center gap-4 relative z-10 bg-[#0A0A0A] p-4 rounded-xl border border-primary/30">
                  <Briefcase className="w-10 h-10 text-primary" />
                  <span className="text-white font-bold font-heading">HRM</span>
                </div>
            </div>
            
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto font-subheading">
              Use one product or all three. They work independently, but together they create a unified business operating system.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
