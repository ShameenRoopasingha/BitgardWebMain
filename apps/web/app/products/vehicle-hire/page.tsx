"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Play,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  Car,
  Bus,
  Bike,
  Download,
  ShieldCheck,
  Key,
  ArrowRight,
  Laptop,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";

function StatusNotification() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  if (!status) return null;

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 pt-28 pb-4"
      >
        <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-black/80 border border-emerald-500/50 rounded-2xl p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(16,185,129,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-heading font-bold text-lg">
                  Subscription Active! Welcome to Vigil.
                </h3>
                {plan && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {plan} Tier
                  </span>
                )}
              </div>
              <p className="text-emerald-200/80 text-sm mt-0.5">
                Your transaction via Dodo Payments was successful. Download your software installer below and activate with your subscriber credentials.
              </p>
            </div>
          </div>
          <a
            href="#download"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Installer Now
          </a>
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

export default function VehicleHireProductPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownloadVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadEmail) return;
    setDownloadMsg(
      `Direct installer link and activation instructions have been sent to ${downloadEmail}. Active subscribers can also proceed with the direct download link.`
    );
  };

  const navTabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "fleet-types", label: "Fleet Types" },
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
                  Vigil &bull; Precision Billing &amp; Fleet Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-3 leading-tight drop-shadow-[0_0_20px_rgba(232,115,42,0.35)]">
                Vigil
              </h1>

              <h2 className="text-2xl md:text-3xl font-subheading text-primary font-semibold mb-6">
                Tour &amp; Vehicle Hire Management &bull; Precision Billing
              </h2>

              <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-xl">
                Smart travel management and intelligent invoicing infrastructure for modern fleets. Handle reservations, live fleet radar, driver rosters, and automated billing from an enterprise desktop suite.
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
                  <span>Download Software</span>
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
                  Instant software download
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Continuous updates & support
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

              {/* Floating Badge 1: Live Fleet Radar */}
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
                  <div className="text-neutral-400 text-[11px]">Real-time GPS &amp; Dispatch</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Precision Invoicing */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-6 top-6 z-20 bg-black/90 backdrop-blur-xl border border-primary/50 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(232,115,42,0.3)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-neutral-400 text-[11px]">Precision Billing</div>
                  <div className="text-white text-xs font-bold text-primary font-mono">
                    Rs. 51,800.00 <span className="text-[10px] text-neutral-400 font-normal">Active</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY NAVIGATION TABS */}
      <div className="sticky top-20 z-40 bg-black/75 backdrop-blur-xl border-b border-white/10">
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
            Built For Serious Operators
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Why Tour & Hire Operators Rely on Vigil
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-subheading">
            Eliminate double bookings, lost maintenance records, and disjointed phone reservations. Vigil gives your office total visibility and command over every vehicle, slot, and payment.
          </p>
        </div>

        {/* Video / Showcase Banner */}
        <div className="max-w-4xl mx-auto mb-20 relative rounded-2xl overflow-hidden border border-primary/30 aspect-video group bg-[#050505] shadow-[0_10px_50px_rgba(232,115,42,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <div className="text-white font-heading font-bold text-xl">Vigil Workspace in Action</div>
            <p className="text-neutral-400 text-sm max-w-md">
              Real-time fleet dispatch, reservation matrix, billing calculation, and driver mobile sync.
            </p>
          </div>
        </div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Calendar,
              title: "Zero Double-Bookings",
              desc: "Unified calendar synchronizes web bookings, walk-ins, and agency reservations in real time with automated collision guards.",
            },
            {
              icon: MapPin,
              title: "Live Fleet Telematics",
              desc: "Keep real-time tabs on vehicle locations, trip milestones, return times, and fuel/maintenance alerts.",
            },
            {
              icon: TrendingUp,
              title: "Maximum Revenue Per Unit",
              desc: "Dynamic seasonal pricing, security deposit tracking, addon upsells, and utilization metrics optimize your bottom line.",
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

      {/* FEATURES ZIGZAG */}
      <section id="features" className="py-24 bg-[#080808] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Core Capabilities</div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Engineered For Modern Rental & Tour Companies
            </h2>
          </div>

          <div className="space-y-32">
            {[
              {
                id: "01",
                title: "24/7 Online Booking Engine",
                desc: "Turn your business into an automated booking machine. Customers select vehicle classes, dates, pickup/drop-off points, and extra services with instant calculation.",
                features: [
                  "Embeddable website booking widget",
                  "Real-time calendar & slot availability",
                  "Automated confirmation & booking receipts",
                  "Security deposit & insurance fee handling",
                ],
                img: (
                  <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-8">
                    <Calendar className="w-20 h-20 text-primary/40 mb-4" />
                    <span className="text-neutral-400 text-sm font-subheading">Integrated Booking Engine</span>
                  </div>
                ),
              },
              {
                id: "02",
                title: "Complete Fleet Health & Records",
                desc: "Every vehicle profile stores registration, fitness certificates, insurance renewals, odometer readings, and routine service alerts.",
                features: [
                  "Comprehensive maintenance history",
                  "Pre-rental and post-rental damage logs",
                  "Automated service milestone reminders",
                  "Vehicle revenue & expense balance sheets",
                ],
                img: (
                  <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-8">
                    <Car className="w-20 h-20 text-primary/40 mb-4" />
                    <span className="text-neutral-400 text-sm font-subheading">Fleet Health & Telematics</span>
                  </div>
                ),
                reversed: true,
              },
              {
                id: "03",
                title: "Tour Package Itineraries & Guide Dispatch",
                desc: "Create and bill custom or packaged tours. Assign chauffeurs, tour guides, and track multiday milestones with automated guide allowances.",
                features: [
                  "Custom multi-day tour itineraries",
                  "Automated hotel & waypoint schedules",
                  "Driver & guide wage/batta calculations",
                  "Instant client quote and voucher generation",
                ],
                img: (
                  <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-8">
                    <Package className="w-20 h-20 text-primary/40 mb-4" />
                    <span className="text-neutral-400 text-sm font-subheading">Tour Package Architect</span>
                  </div>
                ),
              },
            ].map((block, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  block.reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-16 relative`}
              >
                <div
                  className={`absolute ${
                    block.reversed ? "-right-10" : "-left-10"
                  } -top-20 text-[200px] font-heading font-bold text-primary/5 select-none pointer-events-none`}
                >
                  {block.id}
                </div>

                <div className="w-full lg:w-1/2 relative z-10">{block.img}</div>
                <div className="w-full lg:w-1/2 relative z-10">
                  <h3 className="text-3xl font-heading font-bold text-white mb-4">{block.title}</h3>
                  <p className="text-neutral-400 text-lg mb-8 leading-relaxed">{block.desc}</p>
                  <ul className="space-y-4">
                    {block.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-neutral-200 text-sm">{feat}</span>
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
      <section id="fleet-types" className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Manage Any Vehicle Category
        </h2>
        <p className="text-neutral-400 mb-16 font-subheading max-w-xl mx-auto">
          Vigil handles individual vehicle properties, seating capacity, rate cards, and maintenance specifications for every fleet type.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Car, label: "Sedans & Hatchbacks", count: "Self-drive & Chauffeur" },
            { icon: Bus, label: "Vans & Coaches", count: "Tours & Corporate" },
            { icon: Bike, label: "Bikes & Scooters", count: "Daily Rentals" },
            { icon: Package, label: "Safari & 4x4s", count: "Specialized Tours" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
            >
              <item.icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <div className="font-bold text-white text-sm">{item.label}</div>
              <div className="text-neutral-500 text-xs">{item.count}</div>
            </div>
          ))}
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
          <p className="text-neutral-400 max-w-2xl mx-auto mb-16 text-sm sm:text-base">
            Choose your plan to subscribe via Dodo Payments. Once subscribed, you immediately receive access to download the Vigil software suite and your activation license key.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Starter */}
            <div className="bg-[#050505] border border-white/10 hover:border-white/20 rounded-3xl p-8 text-left flex flex-col transition-all">
              <h3 className="text-2xl font-heading font-bold text-white mb-1">Starter</h3>
              <p className="text-neutral-400 text-xs mb-6">For small operators & independent rental fleets</p>
              <div className="text-4xl font-bold text-white mb-6">
                Rs 5,000<span className="text-base text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Up to 10 Vehicles
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Core Reservation Engine
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Customer Directory & Records
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Full Software Installer Access
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Standard Support & Bug Fixes
                </li>
              </ul>
              <Link href="/checkout/tourbiller?tier=starter" className="block w-full">
                <button className="w-full py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold transition-all text-sm text-center">
                  Subscribe to Starter
                </button>
              </Link>
            </div>

            {/* Professional (Highlighted) */}
            <div className="bg-primary/5 border-2 border-primary rounded-3xl p-8 text-left flex flex-col relative transform md:-translate-y-4 shadow-[0_20px_60px_rgba(232,115,42,0.2)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(232,115,42,0.6)]">
                Most Popular
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-1">Professional</h3>
              <p className="text-neutral-400 text-xs mb-6">For growing rental companies & tour agencies</p>
              <div className="text-4xl font-bold text-white mb-6">
                Rs 10,000<span className="text-base text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Up to 50 Vehicles
                </li>
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Online Booking Widget Integration
                </li>
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Driver & Chauffeur Rostering
                </li>
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  GPS Telematics & Trip Tracking
                </li>
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Tour Package Itinerary Builder
                </li>
                <li className="flex items-center text-sm text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Priority Technical Support
                </li>
              </ul>
              <Link href="/checkout/tourbiller?tier=professional" className="block w-full">
                <button className="w-full py-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] text-sm text-center">
                  Subscribe to Professional
                </button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-[#050505] border border-white/10 hover:border-white/20 rounded-3xl p-8 text-left flex flex-col transition-all">
              <h3 className="text-2xl font-heading font-bold text-white mb-1">Enterprise</h3>
              <p className="text-neutral-400 text-xs mb-6">For multi-branch operators & large fleets</p>
              <div className="text-4xl font-bold text-white mb-6">
                Rs 25,000<span className="text-base text-neutral-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Unlimited Vehicles
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Multi-Branch & Multi-Currency
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Custom Telematics API Access
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Multi-Workstation Desktop Deployment
                </li>
                <li className="flex items-center text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-primary mr-3 shrink-0" />
                  Dedicated Account SLA & 24/7 Support
                </li>
              </ul>
              <Link href="/checkout/tourbiller?tier=enterprise" className="block w-full">
                <button className="w-full py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold transition-all text-sm text-center">
                  Subscribe to Enterprise
                </button>
              </Link>
            </div>
          </div>

          {/* Commercial Policy Clarification Notice */}
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-neutral-400 text-xs text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold">Commercial Licensing Policy:</span>{" "}
              Bitgard provides Vigil exclusively as a subscription-based commercial product. We do not offer free tiers, trial versions, or demo licenses. Subscribing customers receive full software download rights, regular updates, and license key activation via Dodo Payments.
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
              Download Vigil Software
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
              Install the Vigil software suite on your office computers or workstations. An active subscription is required to generate your activation key and license your fleet.
            </p>
          </div>

          {/* 3 Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-white font-bold mb-2">Subscribe</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Choose a plan (Starter, Professional, or Enterprise) and complete checkout via Dodo Payments.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-white font-bold mb-2">Download Installer</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Download the official Vigil Windows setup package (.exe) and run the quick installer on your machine.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-white font-bold mb-2">Activate License</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Enter your subscribed customer email upon startup to license your fleet and start operating immediately.
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
                    v2.4.0 LTS
                  </span>
                </div>
                <p className="text-neutral-400 text-sm mb-3">
                  Windows 10 / 11 / Windows Server (64-bit) &bull; Installer Size: ~84.5 MB
                </p>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>SHA-256 Verified</span>
                  <span>&bull;</span>
                  <span>Direct Offline-First Client</span>
                  <span>&bull;</span>
                  <span>Auto-Updater Included</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              <a
                href="#download"
                onClick={() => {
                  alert(
                    "Vigil Installer Download:\n\nActive subscribers can download the latest build (Vigil-Setup-v2.4.0-x64.exe). Please ensure you have your subscription email handy for activation."
                  );
                }}
                className="bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(232,115,42,0.4)] transition-all flex items-center justify-center gap-2 text-center"
              >
                <Download className="w-5 h-5" />
                <span>Download Vigil (.exe)</span>
              </a>
              <a
                href="#pricing"
                className="text-xs text-center text-neutral-400 hover:text-white transition-colors py-1"
              >
                Not subscribed yet? View plans &rarr;
              </a>
            </div>
          </div>

          {/* Verification / License Recovery for Existing Subscribers */}
          <div className="mt-12 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Existing Subscriber? Retrieve Your Installer & License Key
            </h4>
            <p className="text-neutral-400 text-xs mb-6">
              Enter your registered subscriber email below to receive your direct download URL and active license token:
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
