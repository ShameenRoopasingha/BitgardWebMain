"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Play, MapPin, Calendar, TrendingUp, Package, Car, Bus, Bike } from "lucide-react";


export default function VehicleHireProductPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 min-h-[60vh] flex items-center border-b border-primary/10">
        {/* Holographic noise texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">Fleet & Booking Management</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
                Tour & Vehicle Hire Management
              </h1>
              
              <h2 className="text-2xl font-subheading text-primary mb-6">Manage your fleet. Maximize every booking.</h2>
              
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-xl">
                The all-in-one platform for vehicle rental companies, tour operators, and transportation businesses. Handle reservations, track your fleet, manage drivers, and grow revenue â€” from a single dashboard.
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
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Free for 14 days</span>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="w-full lg:w-1/2 relative perspective-1000">
              <motion.div 
                initial={{ rotateY: -20, rotateX: 10, opacity: 0, x: 50 }}
                animate={{ rotateY: -15, rotateX: 5, opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative z-10 bg-[#0a0a0a] border border-primary/30 rounded-2xl shadow-[0_30px_100px_-20px_rgba(232,115,42,0.3)] aspect-[4/3] overflow-hidden flex flex-col"
              >
                {/* Simulated UI Window Bar */}
                <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                
                {/* Dashboard Content Mockup */}
                <div className="p-6 flex-1 flex flex-col gap-6">
                  {/* Calendar / Timeline */}
                  <div className="h-24 bg-white/5 rounded-xl border border-white/10 p-4 flex gap-4 overflow-hidden">
                    <div className="w-16 h-full border-r border-white/10 shrink-0" />
                    <div className="flex-1 relative">
                       <div className="absolute top-2 left-10 w-32 h-6 bg-primary/40 rounded border border-primary/60" />
                       <div className="absolute top-10 left-32 w-48 h-6 bg-yellow-500/40 rounded border border-yellow-500/60" />
                    </div>
                  </div>
                  
                  <div className="flex gap-6 flex-1">
                    {/* Vehicle List */}
                    <div className="w-1/2 flex flex-col gap-3">
                      <div className="h-16 bg-white/5 rounded-xl border border-white/10 p-3 flex gap-3 items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg" />
                        <div className="flex-1 h-2 bg-white/10 rounded-full" />
                      </div>
                      <div className="h-16 bg-white/5 rounded-xl border border-white/10 p-3 flex gap-3 items-center">
                        <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        <div className="flex-1 h-2 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    {/* Map Mockup */}
                    <div className="w-1/2 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                       <MapPin className="w-8 h-8 text-primary absolute top-1/3 left-1/3" />
                       <MapPin className="w-8 h-8 text-primary/50 absolute top-1/2 right-1/3" />
                       <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                         <path d="M 33 33 L 66 50" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                       </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-20 z-20 bg-black/80 backdrop-blur-xl border border-primary/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(232,115,42,0.2)] flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-white text-sm font-bold">New Booking Request</div>
                  <div className="text-neutral-400 text-xs">Toyota SUV - 3 Days</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-5 bottom-10 z-20 bg-black/80 backdrop-blur-xl border border-green-500/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.2)] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-500 flex items-center justify-center rotate-45">
                   <span className="text-white font-bold text-xs -rotate-45">87%</span>
                </div>
                <div>
                  <div className="text-neutral-400 text-xs">Fleet Utilization</div>
                  <div className="text-white text-lg font-bold font-heading text-green-500">Optimal</div>
                </div>
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Why Tour & Hire Operators Choose Us</h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-subheading">
            Stop losing track of your vehicles. Our <span className="text-primary font-bold">unified booking engine</span> prevents double-bookings, while our <span className="text-primary font-bold">live tracking</span> gives you complete oversight of your entire fleet.
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
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Calendar, title: "Zero Double-Bookings", desc: "Real-time availability prevents conflicts. Every vehicle, every slot, always accurate." },
            { icon: MapPin, title: "Live Fleet Tracking", desc: "Know where every vehicle is. GPS integration with real-time status updates." },
            { icon: TrendingUp, title: "30% More Revenue", desc: "Dynamic pricing, upsells, and utilization analytics maximize your earnings." }
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
                title: "Online Booking Engine",
                desc: "Turn your website into a 24/7 sales channel. Customers can check availability, select add-ons, and pay securely online.",
                features: ["Embeddable booking widget", "Real-time calendar sync", "Instant confirmations (SMS)", "Multi-currency support"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Calendar className="w-20 h-20 text-primary/30" /></div>
              },
              {
                id: "02",
                title: "Fleet & Vehicle Management",
                desc: "A complete database for your vehicles. Track maintenance schedules, insurance renewals, and view utilization heatmaps.",
                features: ["Detailed vehicle profiles", "Maintenance scheduling", "Damage photo uploads", "Utilization tracking"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Car className="w-20 h-20 text-primary/30" /></div>,
                reversed: true
              },
              {
                id: "03",
                title: "Tour Package Management",
                desc: "Create and sell complex tour packages with set itineraries, dynamic seasonal pricing, and automated guide assignments.",
                features: ["Custom itineraries", "Seasonal pricing rules", "Group booking management", "Package upsells"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Package className="w-20 h-20 text-primary/30" /></div>
              }
            ].map((block, i) => (
              <div key={i} className={`flex flex-col ${block.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 relative`}>
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

      {/* VEHICLE COMPATIBILITY */}
      <section className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Manage Any Fleet</h2>
        <p className="text-neutral-400 mb-16 font-subheading">From a single car to a fleet of hundreds.</p>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {[
            { icon: Car, label: "Cars & SUVs" },
            { icon: Bus, label: "Buses & Vans" },
            { icon: Bike, label: "Bicycles / ATV" }
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
              <p className="text-neutral-400 text-sm mb-6">For small operators</p>
              <div className="text-4xl font-bold text-white mb-8">Rs 5,000<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Up to 10 Vehicles</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Basic Booking</li>
              </ul>
              <Link href="/checkout/tourbiller?tier=starter"><button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors w-full block text-center">Get Starter</button></Link>
            </div>

            {/* Business */}
            <div className="bg-primary/5 border border-primary rounded-3xl p-8 text-left relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(232,115,42,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">Professional</h3>
              <p className="text-neutral-400 text-sm mb-6">For growing fleets</p>
              <div className="text-4xl font-bold text-white mb-8">Rs 10,000<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Up to 50 Vehicles</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Online Widget</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Driver Management</li>
              </ul>
              
              <Link href="/checkout/tourbiller?tier=professional"><button className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(232,115,42,0.3)] mt-4 block text-center">Get Professional</button></Link>
            </div>

            {/* Enterprise */}
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 text-left">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Enterprise</h3>
              <p className="text-neutral-400 text-sm mb-6">Unlimited scale</p>
              <div className="text-4xl font-bold text-white mb-8">Rs 25,000<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Unlimited Fleet</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>API Access</li>
              </ul>
              <Link href="/checkout/tourbiller?tier=enterprise"><button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors w-full block text-center">Get Enterprise</button></Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
