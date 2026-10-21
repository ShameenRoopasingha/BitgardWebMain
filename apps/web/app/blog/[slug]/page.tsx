"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Copy } from "lucide-react";

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // In a real app, we would fetch the article data based on params.slug
  const article = {
    title: "The Future of Retail: Cloud-Native POS Systems",
    author: "Elena Rodriguez",
    role: "Lead Architect",
    date: "Oct 12, 2026",
    category: "Engineering",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-0 left-[50%] -translate-x-1/2 w-[80vw] h-[40vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ARTICLE HERO */}
      <section className="relative pt-40 pb-16 z-10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors text-sm font-semibold group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to The Log
            </Link>
          </div>

          <div className="inline-block py-1 px-3 rounded-md bg-primary/10 border border-primary/20 text-xs font-bold tracking-wider text-primary uppercase mb-6">
            {article.category}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8 leading-tight drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
               {/* Placeholder Avatar */}
               <span className="font-bold text-primary text-xs">ER</span>
            </div>
            <div className="text-left">
              <div className="text-white font-bold">{article.author}</div>
              <div className="text-neutral-500">{article.role} • {article.date}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      <section className="relative z-10 mb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="w-full aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden relative border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
            <div className="absolute inset-0 z-20 opacity-30 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.img} alt={article.title} className="w-full h-full object-cover grayscale-[30%]" />
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto flex flex-col lg:flex-row gap-12">
            
            {/* Share Sidebar (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Share</span>
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Rich Text Area */}
            <div className="flex-1 prose prose-invert prose-orange max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-neutral-300 prose-p:font-subheading prose-p:leading-relaxed prose-p:text-lg prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white">
              <p className="lead text-xl text-neutral-400 mb-8 font-medium">
                The era of the bulky, on-premise back-office server is officially over. As retail footprints grow and consumer expectations for omnichannel experiences rise, legacy POS systems are crumbling under the weight of their own technical debt. 
              </p>

              <h2 className="text-3xl mt-12 mb-6">The Single Point of Failure</h2>
              <p>
                Historically, retail chains relied on local servers residing in a dusty back room of each store. These servers ran the POS software, stored local inventory data, and performed batch syncs to a master headquarters database overnight.
              </p>
              <p>
                This architecture presents a massive risk. If the local server goes down during the Black Friday rush, the store is essentially paralyzed. Furthermore, overnight batch syncing means that e-commerce platforms never have truly accurate stock levels, leading to canceled online orders and frustrated customers.
              </p>

              <div className="my-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 border-l-4 border-l-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <p className="text-white italic text-xl m-0 relative z-10 font-heading">
                  &ldquo;Transitioning to a cloud-native architecture isn&apos;t just about saving IT costs; it&apos;s about survival in an environment where real-time data is the only currency that matters.&rdquo;
                </p>
              </div>

              <h2 className="text-3xl mt-12 mb-6">Enter Cloud-Native Architecture</h2>
              <p>
                At Bitgard, we designed our POS ecosystem to be <strong>cloud-native from day one</strong>. This means the heavy lifting of data processing, inventory calculation, and report generation happens on our globally distributed, highly available cloud infrastructure—not on the iPads or registers in your store.
              </p>
              
              <h3 className="text-2xl mt-8 mb-4">How We Guarantee Resilience</h3>
              <ul>
                <li><strong>Edge Caching & Offline Mode:</strong> While the core brain lives in the cloud, our terminals intelligently cache the product catalog and essential customer data locally. If the internet drops, the terminal continues processing transactions offline, queuing them up securely.</li>
                <li><strong>Event-Driven Microservices:</strong> When a sale occurs, an event is fired that instantly updates inventory across all locations, updates the CRM, and triggers webhooks for your e-commerce site simultaneously.</li>
                <li><strong>Infinite Scalability:</strong> Opening 50 new stores next week? There are no servers to provision. You simply log in, add the locations, and start ringing up sales.</li>
              </ul>

              <h2 className="text-3xl mt-12 mb-6">The Bottom Line</h2>
              <p>
                By removing the need for on-premise hardware, retailers are drastically reducing their IT overhead. No more frantic calls to local IT contractors to fix a crashed server. The future of retail is lightweight, lightning-fast, and entirely cloud-based.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Share Bottom (Mobile) */}
      <section className="lg:hidden relative z-10 mt-12 px-6">
         <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 py-6 border-y border-white/10">
            <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider mr-2">Share</span>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-primary transition-colors">
              <Copy className="w-4 h-4" />
            </button>
         </div>
      </section>

    </div>
  );
}
