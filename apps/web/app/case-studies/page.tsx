"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: "global-mart",
      company: "GlobalMart Supermarkets",
      industry: "Retail POS",
      title: "Scaling to 10,000 Locations with Zero Downtime",
      desc: "How a national supermarket chain migrated their legacy on-premise infrastructure to Bitgard's cloud-native POS, resulting in unparalleled uptime during peak holiday seasons.",
      metrics: [
        { label: "Uptime", value: "99.999%", icon: Clock },
        { label: "IT Costs", value: "-40%", icon: TrendingUp }
      ],
      img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "apex-rentals",
      company: "Apex Vehicle Hire",
      industry: "Fleet Management",
      title: "Increasing Fleet Utilization by 35%",
      desc: "Apex struggled with fragmented booking systems and lost inventory. By deploying our integrated vehicle hire system, they achieved total visibility and automated their maintenance schedules.",
      metrics: [
        { label: "Utilization", value: "+35%", icon: TrendingUp },
        { label: "Loss Prevention", value: "100%", icon: Shield }
      ],
      img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200",
      reverse: true
    },
    {
      id: "tech-corp",
      company: "TechCorp Industries",
      industry: "HRM System",
      title: "Streamlining Payroll for 5,000+ Employees across 12 Countries",
      desc: "Managing international payroll and compliance was a nightmare for TechCorp. Bitgard's HRM system automated their entire pipeline, ensuring 100% tax compliance globally.",
      metrics: [
        { label: "Processing Time", value: "-80%", icon: Clock },
        { label: "Compliance", value: "100%", icon: Shield }
      ],
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const clientLogos = [
    "ACME Corp", "Globex", "Soylent Corp", "Initech", "Umbrella Corp", "Stark Ind.", "Wayne Ent."
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 text-center z-10 border-b border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Customer Success</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Proven at <span className="text-primary">Scale.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-16 max-w-2xl mx-auto">
            Discover how industry leaders are leveraging the Bitgard ecosystem to eliminate friction and accelerate growth.
          </p>

          {/* Client Logos Carousel (Simplified) */}
          <div className="pt-10 border-t border-white/10 max-w-5xl mx-auto overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />
            
            <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
               {clientLogos.map((logo, i) => (
                 <span key={i} className="text-xl md:text-2xl font-heading font-bold text-neutral-500 hover:text-primary transition-colors cursor-default">
                   {logo}
                 </span>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY CARDS */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-32">
            
            {caseStudies.map((study, index) => (
              <div key={study.id} className={`flex flex-col ${study.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 group`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative perspective-1000">
                  <motion.div 
                    initial={{ opacity: 0, rotateY: study.reverse ? 15 : -15, x: study.reverse ? 30 : -30 }}
                    whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] aspect-[4/3] group-hover:border-primary/30 transition-colors duration-500"
                  >
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={study.img} alt={study.company} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    
                    {/* Floating Company Badge */}
                    <div className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl">
                      <span className="text-white font-bold font-heading">{study.company}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <div className="inline-block py-1 px-3 rounded-md bg-white/5 border border-white/10 text-xs font-bold tracking-wider text-neutral-400 uppercase mb-6">
                    {study.industry}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 group-hover:text-primary transition-colors">
                    {study.title}
                  </h2>
                  <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                    {study.desc}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex items-center gap-8 mb-10">
                    {study.metrics.map((metric, mi) => (
                      <div key={mi} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{metric.label}</span>
                        </div>
                        <span className="text-4xl font-bold font-heading text-white drop-shadow-[0_0_10px_rgba(232,115,42,0.3)]">{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/case-studies/${study.id}`} className="inline-flex items-center gap-3 bg-white/5 hover:bg-primary text-white font-bold px-6 py-3 rounded-xl transition-all border border-white/10 hover:border-primary shadow-none hover:shadow-[0_0_20px_rgba(232,115,42,0.4)]">
                    Read Full Study <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-black border-t border-primary/10 relative z-10 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Ready to be our next success story?</h2>
          <p className="text-xl text-neutral-400 font-subheading mb-10 max-w-2xl mx-auto">
            Speak with an architect today and discover how Bitgard can transform your operations.
          </p>
          <Link href="/contact" className="inline-block bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] hover:shadow-[0_0_30px_rgba(232,115,42,0.6)]">
            Schedule a Consultation
          </Link>
        </div>
      </section>

    </div>
  );
}
