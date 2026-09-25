"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Play, Clock, TrendingUp, Store, MonitorSmartphone, Printer, CreditCard, Laptop, FileText, BarChart3, Package, Settings, Users } from "lucide-react";
import { GlareCard } from "@/components/magic/GlareCard";

export default function POSProductPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex items-center border-b border-primary/10">
        {/* Holographic noise texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">Point of Sale</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
                POS + Inventory Management
              </h1>
              
              <h2 className="text-2xl font-subheading text-primary mb-6">Sell smarter. Stock effortlessly.</h2>
              
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-xl">
                The complete point-of-sale and inventory platform built for retail stores, restaurants, and multi-location businesses. Lightning-fast checkout, real-time stock tracking, and analytics that drive decisions.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button className="bg-primary hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(232,115,42,0.4)] transition-all transform hover:-translate-y-1">
                  Start Free Trial
                </button>
                <button className="bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                  Book a Demo
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-neutral-400">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 14-day free trial</span>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="w-full lg:w-1/2 relative perspective-1000">
              <motion.div 
                initial={{ rotateY: -20, rotateX: 10, opacity: 0, x: 50 }}
                animate={{ rotateY: -15, rotateX: 5, opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative z-10 bg-[#0a0a0a] border border-primary/30 rounded-2xl shadow-[0_30px_100px_-20px_rgba(232,115,42,0.3)] aspect-[4/3] overflow-hidden"
              >
                {/* Dashboard Image */}
                <div className="absolute top-0 inset-x-0 h-10 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center px-4 gap-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="absolute inset-0 mt-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pos-dashboard.png" alt="POS System Dashboard" className="w-full h-full object-cover grayscale-[20%] border-t border-white/5" />
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-20 z-20 bg-black/80 backdrop-blur-xl border border-red-500/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(239,68,68,0.2)] flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-500 font-bold">!</span>
                </div>
                <div>
                  <div className="text-white text-sm font-bold">Low Stock Alert</div>
                  <div className="text-neutral-400 text-xs">Coffee Beans (2 bags left)</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-5 bottom-10 z-20 bg-black/80 backdrop-blur-xl border border-primary/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(232,115,42,0.2)]"
              >
                <div className="text-neutral-400 text-xs mb-1">Today's Sales</div>
                <div className="text-white text-2xl font-bold font-heading text-primary">$12,450.00</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY TABS */}
      <div className="sticky top-20 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 flex items-center gap-8 overflow-x-auto scrollbar-hide">
          {["overview", "features", "hardware", "use-cases", "pricing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Why Businesses Choose Our POS</h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-subheading">
            Stop losing sales to slow systems. Our <span className="text-primary font-bold">lightning-fast architecture</span> ensures you never keep a customer waiting, while our <span className="text-primary font-bold">real-time sync engine</span> guarantees your inventory is always accurate.
          </p>
        </div>

        {/* Video Player Mockup */}
        <div className="max-w-4xl mx-auto mb-20 relative rounded-2xl overflow-hidden border border-primary/20 aspect-video group cursor-pointer bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
            <div className="h-full w-1/3 bg-primary" />
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Clock, title: "2x Faster Checkout", desc: "Process transactions in seconds with barcode scanning and smart search." },
            { icon: TrendingUp, title: "Zero Stockouts", desc: "Real-time alerts before you run out. Auto-reorder suggestions." },
            { icon: Store, title: "Multi-Location Sync", desc: "Manage 1 store or 100. Inventory syncs instantly across all locations." }
          ].map((benefit, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 hover:border-primary/30 p-8 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(232,115,42,0.1)] group">
              <benefit.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES ZIGZAG */}
      <section className="py-24 bg-[#080808] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">Powerful Features</h2>
          </div>

          <div className="space-y-32">
            {[
              {
                id: "01",
                title: "Fast Checkout & Billing",
                desc: "Never keep a line waiting. Our interface is optimized for speed, supporting complex split payments, discounts, and custom items on the fly.",
                features: ["Barcode & QR scanning", "Custom item search", "Split & partial payments", "Digital receipts (SMS/Email)"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><CreditCard className="w-20 h-20 text-primary/30" /></div>
              },
              {
                id: "02",
                title: "Real-Time Inventory",
                desc: "Know exactly what you have, where it is, and what it's worth. Every sale instantly updates stock levels across your entire network.",
                features: ["Live stock tracking", "Low-stock alerts", "Stock transfers", "Batch & expiry tracking"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Package className="w-20 h-20 text-primary/30" /></div>,
                reversed: true
              },
              {
                id: "03",
                title: "Sales Reports & Analytics",
                desc: "Turn data into profit. Identify your best-selling items, most profitable hours, and top-performing staff with visual dashboards.",
                features: ["Trend line charts", "Revenue heatmaps", "Staff performance", "Export to PDF/Excel"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><BarChart3 className="w-20 h-20 text-primary/30" /></div>
              }
            ].map((block, i) => (
              <div key={i} className={`flex flex-col ${block.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 relative`}>
                {/* Huge Background Number */}
                <div className={`absolute ${block.reversed ? '-right-10' : '-left-10'} -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none`}>
                  {block.id}
                </div>
                
                <div className="w-full lg:w-1/2 relative z-10">
                  {block.img}
                </div>
                <div className="w-full lg:w-1/2 relative z-10">
                  <h3 className="text-3xl font-heading font-bold text-white mb-4">{block.title}</h3>
                  <p className="text-neutral-400 text-lg mb-8">{block.desc}</p>
                  <ul className="space-y-4">
                    {block.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-neutral-200">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HARDWARE COMPATIBILITY */}
      <section className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Works With Your Hardware</h2>
        <p className="text-neutral-400 mb-16 font-subheading">Works on any device with a modern browser.</p>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {[
            { icon: MonitorSmartphone, label: "Tablet / iPad" },
            { icon: Laptop, label: "Touchscreen PC" },
            { icon: Printer, label: "Receipt Printer" },
            { icon: CreditCard, label: "Card Reader" }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 w-[160px] flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-default">
              <item.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-medium text-neutral-300">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 bg-black border-t border-primary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-16">Simple Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 text-left">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Starter</h3>
              <p className="text-neutral-400 text-sm mb-6">Perfect for single stores</p>
              <div className="text-4xl font-bold text-white mb-8">$29<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>1 Location</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Basic POS</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors">Start Trial</button>
            </div>

            {/* Business */}
            <div className="bg-primary/5 border border-primary rounded-3xl p-8 text-left relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(232,115,42,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">Business</h3>
              <p className="text-neutral-400 text-sm mb-6">For growing retailers</p>
              <div className="text-4xl font-bold text-white mb-8">$79<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Up to 5 Locations</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Advanced Inventory</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Sales Reports</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(232,115,42,0.3)]">Get Business</button>
            </div>

            {/* Enterprise */}
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 text-left">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Enterprise</h3>
              <p className="text-neutral-400 text-sm mb-6">Unlimited scale</p>
              <div className="text-4xl font-bold text-white mb-8">$199<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Unlimited Locations</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>API Access</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
