"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Utensils, Car, Factory, Briefcase, Heart, UserCircle, Activity, Building, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const [activeRole, setActiveRole] = useState("ceo");

  const roles = {
    ceo: {
      title: "CEO / Founder",
      desc: "Get a bird's-eye view of your entire organization. Make data-driven decisions with real-time analytics across all locations and departments.",
      benefits: ["Unified real-time dashboards", "Cross-department KPI tracking", "Automated executive reports", "Scalable infrastructure"]
    },
    ops: {
      title: "Operations Manager",
      desc: "Streamline day-to-day activities. Connect your POS, inventory, and fleet management into a single, cohesive workflow.",
      benefits: ["Multi-location inventory sync", "Fleet tracking & utilization", "Automated stock alerts", "Shift & attendance monitoring"]
    },
    it: {
      title: "IT Director",
      desc: "Deploy secure, scalable software with zero headaches. Our cloud-native architecture means no local servers to maintain.",
      benefits: ["Zero-trust security model", "API-first integration", "99.99% guaranteed uptime", "Role-based access control (RBAC)"]
    },
    hr: {
      title: "HR Lead",
      desc: "Manage the entire employee lifecycle from a single dashboard. Automate payroll, track leave, and run performance reviews.",
      benefits: ["Automated payroll processing", "Self-service employee portal", "Digital onboarding workflows", "Compliance & tax reporting"]
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 text-center z-10 border-b border-white/5 bg-[#050505] overflow-hidden">
        {/* Glowing Orange Mesh */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
               backgroundSize: '60px 60px',
               maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
             }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[20vw] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Tailored for <span className="text-primary">Your Industry</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-12 max-w-2xl mx-auto">
            Bitgard isn&apos;t just generic software. We provide specialized solutions configured for the unique demands of your specific sector.
          </p>
        </div>
      </section>

      {/* INDUSTRY GRIDS */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { icon: Store, title: "Retail & Supermarkets", desc: "Multi-location POS, barcode scanning, and real-time inventory sync across all your physical stores.", link: "/products/pos" },
              { icon: Utensils, title: "Restaurants & Cafes", desc: "Table management, Kitchen Display Systems (KDS), and complex recipe inventory tracking.", link: "/products/pos" },
              { icon: Car, title: "Fleet & Rental", desc: "Vehicle tracking, maintenance scheduling, and online booking engines for rental operators.", link: "/products/vehicle-hire" },
              { icon: Briefcase, title: "Agencies & Services", desc: "Time tracking, project management, and automated invoicing for professional services.", link: "/products/hrm" },
              { icon: Factory, title: "Manufacturing", desc: "Raw material tracking, supply chain management, and production line efficiency tools.", link: "/products/pos" },
              { icon: Heart, title: "Non-Profits", desc: "Donor management, volunteer tracking, and transparent financial reporting.", link: "/products" }
            ].map((ind, i) => (
              <Link href={ind.link} key={i} className="group">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 h-full flex flex-col hover:border-primary/50 transition-all duration-300 shadow-[0_0_0_rgba(232,115,42,0)] hover:shadow-[0_10px_40px_-10px_rgba(232,115,42,0.2)]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <ind.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors">{ind.title}</h3>
                  <p className="text-neutral-400 mb-8 flex-1">{ind.desc}</p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BY ROLE (TABS) */}
      <section className="py-24 bg-[#080808] border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Built for Every Role</h2>
            <p className="text-neutral-400 font-subheading text-xl">Different departments, one unified truth.</p>
          </div>

          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
            {/* Tabs List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2">
              {[
                { id: "ceo", icon: Building, label: "CEO / Founder" },
                { id: "ops", icon: Activity, label: "Operations Manager" },
                { id: "it", icon: Store, label: "IT Director" }, // Placeholder icon for IT
                { id: "hr", icon: UserCircle, label: "HR Lead" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRole(tab.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                    activeRole === tab.id 
                    ? "bg-primary/10 border border-primary/50 shadow-[0_0_20px_rgba(232,115,42,0.15)]" 
                    : "bg-transparent border border-transparent hover:bg-white/5 text-neutral-400"
                  }`}
                >
                  <tab.icon className={`w-6 h-6 ${activeRole === tab.id ? "text-primary" : "text-neutral-500"}`} />
                  <span className={`font-bold font-heading ${activeRole === tab.id ? "text-white" : "text-neutral-400"}`}>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="w-full lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#050505] border border-white/10 rounded-3xl p-10 h-full flex flex-col"
                >
                  <h3 className="text-3xl font-heading font-bold text-primary mb-4">
                    {roles[activeRole as keyof typeof roles].title}
                  </h3>
                  <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                    {roles[activeRole as keyof typeof roles].desc}
                  </p>
                  
                  <div className="mt-auto">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Key Benefits:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {roles[activeRole as keyof typeof roles].benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(232,115,42,0.8)]" />
                          <span className="text-neutral-400 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
