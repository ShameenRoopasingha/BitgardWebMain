"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Rocket, Headphones, Globe2, Target, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const timeline = [
    { year: "2018", title: "The Foundation", desc: "Bitgard was founded with a mission to simplify complex business operations through elegant software." },
    { year: "2020", title: "Launch of POS v1", desc: "Our flagship Point of Sale system launched, quickly becoming the backbone for hundreds of retail stores." },
    { year: "2023", title: "Ecosystem Expansion", desc: "Introduced Vehicle Hire Management and HRM Systems, completing our unified business suite." },
    { year: "Today", title: "Global Scale", desc: "Powering over 5,000 businesses worldwide with our secure, scalable infrastructure." }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture / Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 text-center z-10 border-b border-white/5">
        
        {/* Holographic node-network background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
             style={{
                 backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
                 backgroundSize: '40px 40px',
                 maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
             }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Dreams Forged <br/>
            <span className="text-primary text-6xl md:text-8xl drop-shadow-[0_0_30px_rgba(232,115,42,0.5)]">in Code.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-12 max-w-2xl mx-auto">
            We build the operating systems for modern businesses. Code is our craft, scale is our standard, and your success is our mission.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-24 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-xl hover:border-primary/50 transition-colors group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Our Mission</h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              To empower businesses of all sizes with enterprise-grade software that is beautiful, intuitive, and relentlessly reliable. We believe great technology should eliminate friction, not create it.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border border-primary/30 rounded-3xl p-10 backdrop-blur-xl hover:border-primary transition-colors group shadow-[0_10px_40px_-10px_rgba(232,115,42,0.15)]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(232,115,42,0.3)]">
              <Globe2 className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Our Vision</h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              To become the foundational software layer for global retail and operations. We envision a world where managing a business across continents is as simple as managing a single store.
            </p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY (TIMELINE) */}
      <section className="py-24 bg-[#080808] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Journey</h2>
            <p className="text-neutral-400 font-subheading text-xl">How we got here.</p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent -translate-x-1/2" />

            <div className="space-y-16">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Node */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(232,115,42,0.8)] -translate-x-1/2" />
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="text-primary font-heading font-bold text-xl mb-2">{item.year}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Core Values</h2>
            <p className="text-neutral-400 text-xl font-subheading">The principles that drive our code.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: "Speed", desc: "Fast code, fast decisions. We optimize for performance in everything we do." },
              { icon: ShieldCheck, title: "Security", desc: "Data protection is non-negotiable. We build fortresses, not just software." },
              { icon: Rocket, title: "Scalability", desc: "Architectures designed to grow. Your software should never be your bottleneck." },
              { icon: Headphones, title: "Support", desc: "We stand behind our code. Our partners' success is our ultimate metric." }
            ].map((value, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/30 transition-colors group">
                <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">{value.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="py-24 bg-black border-t border-primary/10 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_30px_rgba(232,115,42,0.2)]">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Meet the Architects</h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Discover the engineers, designers, and visionaries forging the future of business software.
          </p>
          <Link href="/team" className="inline-block bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 rounded-xl transition-all">
            View Our Team
          </Link>
        </div>
      </section>

    </div>
  );
}
