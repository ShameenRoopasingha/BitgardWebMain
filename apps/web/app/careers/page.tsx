"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Palette, Banknote, Globe2, BookOpen, Coins, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeJob, setActiveJob] = useState<number | null>(null);

  const jobs = [
    { id: 1, title: "Senior Backend Engineer", dept: "engineering", type: "Full-time", location: "Remote", desc: "We are looking for a Senior Backend Engineer to help scale our cloud-native POS infrastructure. You will be working heavily with Node.js, PostgreSQL, and Redis." },
    { id: 2, title: "Frontend Architect", dept: "engineering", type: "Full-time", location: "Remote", desc: "Lead the frontend architecture of our core web applications using Next.js, React, and Framer Motion to create stunning, performant UIs." },
    { id: 3, title: "UI/UX Designer", dept: "design", type: "Full-time", location: "Remote", desc: "Join our design team to craft beautiful, intuitive interfaces for complex enterprise workflows. Strong portfolio in SaaS products required." },
    { id: 4, title: "Account Executive", dept: "sales", type: "Full-time", location: "New York, USA", desc: "Drive growth by selling our enterprise solutions to mid-market and large businesses. B2B SaaS sales experience is a must." },
    { id: 5, title: "Technical Support Specialist", dept: "sales", type: "Full-time", location: "Remote (EU Timezone)", desc: "Provide world-class technical support to our enterprise clients. Requires deep understanding of API integrations." }
  ];

  const filteredJobs = activeFilter === "all" ? jobs : jobs.filter(j => j.dept === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 text-center z-10 border-b border-white/5 bg-[#050505] overflow-hidden">
        {/* Holographic Mesh */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) scale(2.5) translateY(-50px)',
             }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Careers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Join the <span className="text-primary">Builders.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-10 max-w-2xl mx-auto">
            We are always looking for exceptional talent to help us forge the future of enterprise software.
          </p>
          <a href="#open-roles" className="inline-flex bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] hover:shadow-[0_0_30px_rgba(232,115,42,0.6)] items-center gap-2">
            View Open Roles <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* CULTURE SECTION */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Culture</h2>
            <p className="text-neutral-400 font-subheading text-xl max-w-2xl mx-auto">We believe in giving our team the freedom, resources, and ownership to do the best work of their lives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Globe2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Remote-First</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Work from anywhere. We care about the code you ship and the impact you make, not where your desk is located.
              </p>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">Continuous Learning</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Generous stipends for courses, conferences, and books. We invest heavily in the growth of our engineers and designers.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">True Equity</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Every builder gets a piece of the pie. We offer highly competitive stock options so you share in the success you help create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN ROLES SECTION */}
      <section id="open-roles" className="py-24 bg-[#080808] border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">Open Positions</h2>
            
            {/* Filters */}
            <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1.5 overflow-x-auto scrollbar-hide max-w-full">
              {[
                { id: "all", label: "All Roles" },
                { id: "engineering", label: "Engineering", icon: Code },
                { id: "design", label: "Design", icon: Palette },
                { id: "sales", label: "Sales & Support", icon: Banknote }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeFilter === filter.id ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {activeFilter === filter.id && (
                    <motion.div 
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {filter.icon && <filter.icon className={`w-4 h-4 relative z-10 ${activeFilter === filter.id ? 'text-primary' : ''}`} />}
                  <span className="relative z-10">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div 
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30"
                >
                  <button 
                    onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                    className="w-full p-6 text-left flex flex-col md:flex-row md:items-center justify-between focus:outline-none gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <span className="capitalize">{job.dept}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span className="text-primary">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${activeJob === job.id ? 'rotate-180 text-primary' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {activeJob === job.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 border-t border-white/5 mt-2">
                          <p className="text-neutral-400 leading-relaxed mb-6">
                            {job.desc}
                          </p>
                          <button className="bg-primary/10 border border-primary/30 hover:bg-primary hover:text-white text-primary font-semibold px-6 py-2 rounded-lg transition-colors text-sm">
                            Apply for this position
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                No open roles in this department currently. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
