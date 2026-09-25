"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Play, Users, CalendarDays, Wallet, UserCheck, BarChart3, Clock, Briefcase, FileText, LayoutDashboard } from "lucide-react";

export default function HRMProductPage() {
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
        
        {/* Holographic network node pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen"
             style={{
                 backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
                 backgroundSize: '40px 40px'
             }}
        />

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">Human Resource Management</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
                HRM System
              </h1>
              
              <h2 className="text-2xl font-subheading text-primary mb-6">Your people, perfectly managed.</h2>
              
              <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-xl">
                End-to-end human resource management — from recruitment to retirement. Automate payroll, track attendance, manage leave, run performance reviews, and empower employees with self-service tools.
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
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Setup in minutes</span>
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
                  {/* Top Stats */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-center">
                       <div className="text-[10px] text-neutral-500 mb-1">Total Employees</div>
                       <div className="text-xl text-white font-bold">245</div>
                    </div>
                    <div className="flex-1 h-20 bg-primary/10 rounded-xl border border-primary/30 p-3 flex flex-col justify-center">
                       <div className="text-[10px] text-primary mb-1">On Leave Today</div>
                       <div className="text-xl text-primary font-bold">12</div>
                    </div>
                    <div className="flex-1 h-20 bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col justify-center">
                       <div className="text-[10px] text-neutral-500 mb-1">Open Roles</div>
                       <div className="text-xl text-white font-bold">8</div>
                    </div>
                  </div>
                  
                  {/* Main Grid */}
                  <div className="flex gap-4 flex-1">
                    {/* Employee Directory */}
                    <div className="w-2/3 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/10" />
                         <div className="flex-1">
                           <div className="h-2 w-1/2 bg-white/20 rounded-full mb-1" />
                           <div className="h-2 w-1/3 bg-white/5 rounded-full" />
                         </div>
                         <div className="w-12 h-4 rounded-full bg-green-500/20 border border-green-500/30" />
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/10" />
                         <div className="flex-1">
                           <div className="h-2 w-1/2 bg-white/20 rounded-full mb-1" />
                           <div className="h-2 w-1/3 bg-white/5 rounded-full" />
                         </div>
                         <div className="w-12 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary/20" />
                         <div className="flex-1">
                           <div className="h-2 w-1/2 bg-primary/40 rounded-full mb-1" />
                           <div className="h-2 w-1/3 bg-primary/20 rounded-full" />
                         </div>
                         <div className="w-12 h-4 rounded-full bg-primary/20 border border-primary/30" />
                       </div>
                    </div>
                    {/* Chart Mockup */}
                    <div className="w-1/3 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-end justify-center p-4 gap-2">
                       <div className="w-full bg-primary/20 h-[30%] rounded-t-sm" />
                       <div className="w-full bg-primary/40 h-[60%] rounded-t-sm" />
                       <div className="w-full bg-primary/80 h-[80%] rounded-t-sm" />
                       <div className="w-full bg-primary h-[50%] rounded-t-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-20 z-20 bg-black/80 backdrop-blur-xl border border-green-500/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(34,197,94,0.2)] flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-white text-sm font-bold">Leave Request</div>
                  <div className="text-neutral-400 text-xs">John Smith — Approved ✓</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-5 bottom-24 z-20 bg-black/80 backdrop-blur-xl border border-primary/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(232,115,42,0.2)] flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-neutral-400 text-xs">New Applicant</div>
                  <div className="text-white text-sm font-bold font-heading text-primary">Senior Developer</div>
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Why HR Teams Choose Us</h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-subheading">
            Stop drowning in spreadsheets and endless emails. Our <span className="text-primary font-bold">unified platform</span> automates the administrative burden, so your HR team can finally focus on <span className="text-primary font-bold">people, not paperwork</span>.
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
                title: "Payroll & Tax Management",
                desc: "Automate complex salary calculations, deductions, and tax compliance across multiple regions. Generate bulk bank files and digital payslips instantly.",
                features: ["Automated salary calculations", "Multi-country tax compliance", "Digital payslip distribution", "Overtime & bonuses"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Wallet className="w-20 h-20 text-primary/30" /></div>
              },
              {
                id: "02",
                title: "Attendance & Time Tracking",
                desc: "Monitor staff availability in real-time. Track clock-ins via web, mobile, or biometric devices with GPS verification for field teams.",
                features: ["GPS-based attendance", "Shift scheduling", "Overtime tracking", "Timesheet approvals"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><Clock className="w-20 h-20 text-primary/30" /></div>,
                reversed: true
              },
              {
                id: "03",
                title: "Leave Management",
                desc: "Streamline time-off requests with automated accruals, multi-level approval workflows, and a shared team calendar.",
                features: ["Custom leave types", "Balance tracking & rules", "Multi-level approvals", "Team holiday calendar"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><CalendarDays className="w-20 h-20 text-primary/30" /></div>
              },
              {
                id: "04",
                title: "Recruitment & Onboarding",
                desc: "Build a seamless candidate pipeline from the first interview to their first day. Track applicants, collect feedback, and manage offer letters.",
                features: ["Applicant tracking (ATS)", "Candidate scoring", "Interview scheduling", "Digital onboarding checklists"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><UserCheck className="w-20 h-20 text-primary/30" /></div>,
                reversed: true
              },
              {
                id: "05",
                title: "Employee Self-Service",
                desc: "Empower your workforce with a dedicated portal to manage their profile, download payslips, request leave, and submit helpdesk tickets.",
                features: ["Personal profile management", "Payslip & tax document hub", "Company directory", "Helpdesk ticketing"],
                img: <div className="w-full aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center"><LayoutDashboard className="w-20 h-20 text-primary/30" /></div>
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

      {/* COMPANY SIZE FIT */}
      <section className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Built For Every Organization</h2>
        <p className="text-neutral-400 mb-16 font-subheading">Scalable from your first hire to global enterprise.</p>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {[
            { label: "Startups (10-50)", desc: "Simple setup, grow as you hire" },
            { label: "SMBs (50-200)", desc: "Streamline HR ops, automate manual work" },
            { label: "Mid-Market (200-1000)", desc: "Advanced workflows, multi-department control" },
            { label: "Enterprise (1000+)", desc: "Custom roles, compliance, global workforce" }
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 w-[240px] flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-default text-center">
              <Users className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-white">{item.label}</h3>
              <span className="text-sm font-medium text-neutral-400">{item.desc}</span>
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
              <p className="text-neutral-400 text-sm mb-6">Up to 25 employees</p>
              <div className="text-4xl font-bold text-white mb-8">$2<span className="text-lg text-neutral-500 font-normal">/emp/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Attendance Tracking</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Basic Leave Mgmt</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors">Start Trial</button>
            </div>

            {/* Business */}
            <div className="bg-primary/5 border border-primary rounded-3xl p-8 text-left relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(232,115,42,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">Professional</h3>
              <p className="text-neutral-400 text-sm mb-6">Up to 200 employees</p>
              <div className="text-4xl font-bold text-white mb-8">$5<span className="text-lg text-neutral-500 font-normal">/emp/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Payroll Processing</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Recruitment Pipeline</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Performance Reviews</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(232,115,42,0.3)]">Get Professional</button>
            </div>

            {/* Enterprise */}
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 text-left">
              <h3 className="text-2xl font-heading font-bold text-white mb-2">Enterprise</h3>
              <p className="text-neutral-400 text-sm mb-6">Unlimited employees</p>
              <div className="text-4xl font-bold text-white mb-8">$8<span className="text-lg text-neutral-500 font-normal">/emp/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Custom Workflows</li>
                <li className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-primary mr-3"/>Global Compliance</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
