"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare, Send, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture / Orbs */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Grid overlay */}
      <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            transform: 'perspective(1000px) rotateX(70deg) scale(2.5) translateY(-200px)',
            transformOrigin: 'top center'
          }}
      />

      <div className="container relative z-10 mx-auto px-6 pt-40">
        
        {/* HERO SECTION */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Let&apos;s Build <span className="text-primary">Together.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-subheading max-w-2xl mx-auto">
            Ready to upgrade your business operating system? Contact our team of architects today.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <h2 className="text-2xl font-heading font-bold text-white mb-8 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              Send a Transmission
            </h2>

            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Floating Label Input: Name */}
                <div className="relative group">
                  <input type="text" id="name" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors peer placeholder-transparent" placeholder="Name" />
                  <label htmlFor="name" className="absolute left-4 top-4 text-neutral-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#0a0a0a] peer-valid:px-1">Full Name</label>
                </div>

                {/* Floating Label Input: Company */}
                <div className="relative group">
                  <input type="text" id="company" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors peer placeholder-transparent" placeholder="Company" />
                  <label htmlFor="company" className="absolute left-4 top-4 text-neutral-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#0a0a0a] peer-valid:px-1">Company</label>
                </div>
              </div>

              {/* Floating Label Input: Email */}
              <div className="relative group">
                <input type="email" id="email" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors peer placeholder-transparent" placeholder="Email" />
                <label htmlFor="email" className="absolute left-4 top-4 text-neutral-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#0a0a0a] peer-valid:px-1">Work Email</label>
              </div>

              {/* Dropdown: Inquiry Type */}
              <div className="relative group">
                <select id="inquiry" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors appearance-none cursor-pointer">
                  <option value="" disabled selected className="text-neutral-500">Select Inquiry Type...</option>
                  <option value="pos" className="bg-neutral-900">POS + Inventory</option>
                  <option value="hire" className="bg-neutral-900">Vigil (Tour &amp; Vehicle Hire)</option>
                  <option value="hrm" className="bg-neutral-900">HRM System</option>
                  <option value="general" className="bg-neutral-900">General Inquiry</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative group">
                <textarea id="message" required rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary/80 transition-colors peer placeholder-transparent resize-none" placeholder="Message"></textarea>
                <label htmlFor="message" className="absolute left-4 top-4 text-neutral-500 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0a0a0a] peer-focus:px-1 peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#0a0a0a] peer-valid:px-1">How can we help?</label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full py-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(232,115,42,0.4)] hover:shadow-[0_0_30px_rgba(232,115,42,0.6)] flex items-center justify-center gap-2 group">
                Send Transmission
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </motion.div>


          {/* Right Column: Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 flex flex-col gap-8"
          >
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">Sales</h3>
                <a href="mailto:sales@bitgard.com" className="text-neutral-400 hover:text-primary transition-colors text-sm">sales@bitgard.com</a>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">Support</h3>
                <a href="mailto:support@bitgard.com" className="text-neutral-400 hover:text-primary transition-colors text-sm">support@bitgard.com</a>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">Phone</h3>
                <a href="tel:+18005550199" className="text-neutral-400 hover:text-primary transition-colors text-sm">+1 (800) 555-0199</a>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">Global HQ</h3>
                <p className="text-neutral-400 text-sm">Level 42, Tech Spire<br/>Cyber City, TC 90210</p>
              </div>
            </div>

            {/* Map Mockup */}
            <div className="flex-1 bg-black border border-white/10 rounded-3xl overflow-hidden relative min-h-[300px] shadow-inner group">
              {/* Fake Map Background */}
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                   <MapPin className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(232,115,42,0.8)] relative z-10 group-hover:-translate-y-2 transition-transform" />
                   <div className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-2 bg-primary/30 rounded-[100%] blur-sm group-hover:scale-75 transition-transform" />
                 </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
