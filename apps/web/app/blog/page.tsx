"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

export default function BlogIndexPage() {
  const posts = [
    {
      slug: "future-of-retail-pos",
      title: "The Future of Retail: Cloud-Native POS Systems",
      category: "Engineering",
      date: "Oct 12, 2026",
      desc: "How moving away from on-premise servers is saving retailers millions in IT costs and preventing downtime during peak hours.",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
    },
    {
      slug: "vehicle-hire-telematics",
      title: "Integrating Telematics into Your Rental Fleet",
      category: "Product Update",
      date: "Sep 28, 2026",
      desc: "Our latest release allows seamless integration with GPS trackers to monitor fleet health and utilization in real-time.",
      img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600"
    },
    {
      slug: "hrm-payroll-automation",
      title: "Why Automated Payroll is Non-Negotiable",
      category: "Business",
      date: "Sep 15, 2026",
      desc: "Manual payroll calculations are prone to human error. Here is how our new HRM module guarantees 100% accuracy.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"
    },
    {
      slug: "securing-customer-data",
      title: "Zero-Trust Architecture in Bitgard Core",
      category: "Security",
      date: "Aug 30, 2026",
      desc: "A deep dive into how we encrypt your data at rest and in transit, ensuring maximum compliance with global standards.",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
    },
    {
      slug: "scaling-to-10k-locations",
      title: "Case Study: Scaling to 10,000 Locations",
      category: "Case Study",
      date: "Aug 12, 2026",
      desc: "How a national supermarket chain migrated to Bitgard without dropping a single transaction.",
      img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=600"
    },
    {
      slug: "q3-engineering-update",
      title: "Q3 Engineering Update & Roadmap",
      category: "Engineering",
      date: "Jul 25, 2026",
      desc: "A look back at what we shipped in Q3 and a sneak peek into the major UI overhaul coming in Q4.",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 text-center z-10 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">The Log</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            The Bitgard <span className="text-primary">Transmission</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-12 max-w-2xl mx-auto">
            Insights, engineering deep-dives, and updates from the team building the future of business software.
          </p>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, i) => (
              <Link href={`/blog/${post.slug}`} key={i} className="group">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/50 transition-all duration-300 shadow-[0_0_0_rgba(232,115,42,0)] hover:shadow-[0_10px_40px_-10px_rgba(232,115,42,0.2)]"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video relative overflow-hidden bg-[#050505]">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">{post.category}</span>
                      <span className="text-xs text-neutral-500 font-medium">{post.date}</span>
                    </div>
                    
                    <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">{post.desc}</p>
                    
                    <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="py-24 bg-black border-t border-primary/10 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-[#050505] border border-white/10 p-10 md:p-12 rounded-3xl relative overflow-hidden">
             {/* Glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px]" />
             
             <h2 className="text-3xl font-heading font-bold text-white mb-4 relative z-10">Don&apos;t miss a transmission.</h2>
             <p className="text-neutral-400 mb-8 relative z-10">Join 10,000+ engineers and founders receiving our monthly updates.</p>
             
             <form className="flex flex-col sm:flex-row gap-4 relative z-10" onSubmit={e => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Enter your work email" 
                 required
                 className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors"
               />
               <button type="submit" className="bg-primary hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(232,115,42,0.3)] flex items-center justify-center gap-2">
                 Subscribe <Send className="w-4 h-4" />
               </button>
             </form>
          </div>
        </div>
      </section>

    </div>
  );
}
