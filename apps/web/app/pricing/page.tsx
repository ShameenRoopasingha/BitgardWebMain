"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, HelpCircle, ChevronDown } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [activeProduct, setActiveProduct] = useState<"pos" | "vehicle" | "hrm">("pos");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const pricingData = {
    pos: [
      { name: "Starter", price: billingCycle === "monthly" ? "29" : "24", desc: "Perfect for single retail stores.", features: ["1 Location", "Basic POS", "Real-time Sync", "Standard Support"] },
      { name: "Professional", price: billingCycle === "monthly" ? "79" : "64", desc: "For growing multi-location retailers.", popular: true, features: ["Up to 5 Locations", "Advanced Inventory", "Sales Reports", "Priority Support"] },
      { name: "Enterprise", price: billingCycle === "monthly" ? "199" : "159", desc: "Unlimited scale and custom needs.", features: ["Unlimited Locations", "API Access", "Custom Integration", "24/7 Phone Support"] }
    ],
    vehicle: [
      { name: "Starter", price: billingCycle === "monthly" ? "39" : "31", desc: "For small independent operators.", features: ["Up to 10 Vehicles", "Basic Booking Engine", "Calendar View", "Standard Support"] },
      { name: "Professional", price: billingCycle === "monthly" ? "99" : "79", desc: "For growing fleets.", popular: true, features: ["Up to 50 Vehicles", "Online Booking Widget", "Driver Management", "Priority Support"] },
      { name: "Enterprise", price: billingCycle === "monthly" ? "249" : "199", desc: "Unlimited scale and custom needs.", features: ["Unlimited Fleet", "API Access", "Custom Reports", "24/7 Phone Support"] }
    ],
    hrm: [
      { name: "Starter", price: billingCycle === "monthly" ? "2" : "1.60", unit: "/emp/mo", desc: "For small teams.", features: ["Attendance Tracking", "Basic Leave Mgmt", "Employee Directory", "Standard Support"] },
      { name: "Professional", price: billingCycle === "monthly" ? "5" : "4", unit: "/emp/mo", desc: "For growing companies.", popular: true, features: ["Payroll Processing", "Recruitment Pipeline", "Performance Reviews", "Priority Support"] },
      { name: "Enterprise", price: billingCycle === "monthly" ? "8" : "6.40", unit: "/emp/mo", desc: "For large organizations.", features: ["Custom Workflows", "Global Compliance", "API Access", "24/7 Phone Support"] }
    ]
  };

  const currentTiers = pricingData[activeProduct];

  const faqs = [
    { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges will be applied automatically." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and wire transfers for annual Enterprise plans." },
    { q: "Is there a setup fee?", a: "No, there are no hidden setup fees for our Starter and Professional plans. Enterprise plans may include a one-time onboarding fee depending on complexity." },
    { q: "Do you offer discounts for non-profits?", a: "Yes, we offer a 30% discount for registered non-profit organizations. Please contact our sales team with your documentation." }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-hidden relative font-body">
      
      {/* Background Holographic Texture / Orbs */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80vw] h-[40vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-16 text-center z-10">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(232,115,42,0.3)]">
            Transparent Pricing <br/> for Every Stage
          </h1>
          <p className="text-xl text-neutral-400 font-subheading mb-12 max-w-2xl mx-auto">
            Start for free, then choose a plan that scales with your business. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 transition-colors focus:outline-none"
            >
              <motion.div 
                className="absolute top-1 bottom-1 w-6 rounded-full bg-primary"
                animate={{ left: billingCycle === 'monthly' ? '4px' : 'calc(100% - 28px)' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-neutral-500'}`}>Annual</span>
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/30">Save 20%</span>
            </div>
          </div>

          {/* Product Selector Tabs */}
          <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1.5 mb-16 max-w-full overflow-x-auto scrollbar-hide">
            {[
              { id: "pos", label: "POS + Inventory" },
              { id: "vehicle", label: "Vehicle Hire" },
              { id: "hrm", label: "HRM System" }
            ].map(prod => (
              <button
                key={prod.id}
                onClick={() => setActiveProduct(prod.id as any)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeProduct === prod.id ? "text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {activeProduct === prod.id && (
                  <motion.div 
                    layoutId="activeProduct"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{prod.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative z-10 pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* Starter */}
            <motion.div 
              key={`${activeProduct}-starter`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#050505] border border-white/10 rounded-3xl p-8 flex flex-col h-[500px]"
            >
              <h3 className="text-2xl font-heading font-bold text-white mb-2">{currentTiers[0].name}</h3>
              <p className="text-neutral-400 text-sm mb-6 flex-1">{currentTiers[0].desc}</p>
              <div className="text-5xl font-bold text-white mb-8">${currentTiers[0].price}<span className="text-lg text-neutral-500 font-normal">{((currentTiers[0] as any).unit) || '/mo'}</span></div>
              <ul className="space-y-4 mb-8">
                {currentTiers[0].features.map((feat, i) => (
                  <li key={i} className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-neutral-500 mr-3"/>{feat}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/5 text-white font-semibold transition-colors mt-auto">Start Free Trial</button>
            </motion.div>

            {/* Professional (Highlighted) */}
            <motion.div 
              key={`${activeProduct}-pro`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-primary/5 border border-primary rounded-3xl p-8 relative flex flex-col h-[540px] shadow-[0_20px_60px_-15px_rgba(232,115,42,0.3)] md:-translate-y-4"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(232,115,42,0.5)]">Most Popular</div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">{currentTiers[1].name}</h3>
              <p className="text-neutral-400 text-sm mb-6 flex-1">{currentTiers[1].desc}</p>
              <div className="text-5xl font-bold text-white mb-8">${currentTiers[1].price}<span className="text-lg text-primary/70 font-normal">{((currentTiers[1] as any).unit) || '/mo'}</span></div>
              <ul className="space-y-4 mb-8">
                {currentTiers[1].features.map((feat, i) => (
                  <li key={i} className="flex items-center text-sm text-white font-medium"><CheckCircle2 className="w-5 h-5 text-primary mr-3"/>{feat}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(232,115,42,0.4)] mt-auto">Get Professional</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div 
              key={`${activeProduct}-ent`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#050505] border border-white/10 rounded-3xl p-8 flex flex-col h-[500px] relative overflow-hidden"
            >
              {/* Carbon Fiber Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
              
              <h3 className="text-2xl font-heading font-bold text-white mb-2 relative z-10">{currentTiers[2].name}</h3>
              <p className="text-neutral-400 text-sm mb-6 flex-1 relative z-10">{currentTiers[2].desc}</p>
              <div className="text-5xl font-bold text-white mb-8 relative z-10">${currentTiers[2].price}<span className="text-lg text-neutral-500 font-normal">{((currentTiers[2] as any).unit) || '/mo'}</span></div>
              <ul className="space-y-4 mb-8 relative z-10">
                {currentTiers[2].features.map((feat, i) => (
                  <li key={i} className="flex items-center text-sm text-neutral-300"><CheckCircle2 className="w-4 h-4 text-white mr-3"/>{feat}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold transition-colors mt-auto relative z-10">Contact Sales</button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* DETAILED COMPARISON TABLE */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Compare Features</h2>
            <p className="text-neutral-400 font-subheading">See exactly what you&apos;re paying for.</p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto rounded-2xl border border-white/10 bg-[#050505]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#050505] z-20 shadow-xl">
                <tr>
                  <th className="p-6 border-b border-white/10 text-white font-heading font-bold w-1/3">Feature</th>
                  <th className="p-6 border-b border-white/10 text-neutral-300 font-semibold text-center w-2/9">Starter</th>
                  <th className="p-6 border-b border-primary/30 bg-primary/5 text-primary font-bold text-center w-2/9">Professional</th>
                  <th className="p-6 border-b border-white/10 text-white font-semibold text-center w-2/9">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { category: "Core Functionality" },
                  { name: "Users", s: "1", p: "Up to 10", e: "Unlimited" },
                  { name: "Locations/Entities", s: "1", p: "Up to 5", e: "Unlimited" },
                  { name: "Cloud Syncing", s: true, p: true, e: true },
                  { name: "Offline Mode", s: false, p: true, e: true },
                  
                  { category: "Analytics & Reporting" },
                  { name: "Basic Dashboard", s: true, p: true, e: true },
                  { name: "Advanced Analytics", s: false, p: true, e: true },
                  { name: "Custom Reports", s: false, p: false, e: true },
                  
                  { category: "Support & Integrations" },
                  { name: "Email Support", s: true, p: true, e: true },
                  { name: "Priority 24/7 Phone", s: false, p: true, e: true },
                  { name: "API Access", s: false, p: false, e: true },
                  { name: "SSO (SAML/OAuth)", s: false, p: false, e: true },
                ].map((row, i) => (
                  row.category ? (
                    <tr key={`cat-${i}`}>
                      <td colSpan={4} className="p-4 bg-white/5 font-bold text-white border-b border-white/10 uppercase tracking-wider text-xs pt-8 pb-3">{row.category}</td>
                    </tr>
                  ) : (
                    <tr key={`row-${i}`} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 border-b border-white/5 text-neutral-300 font-medium group-hover:text-white transition-colors">{row.name}</td>
                      <td className="p-4 border-b border-white/5 text-center text-neutral-400">
                        {typeof row.s === 'boolean' ? (row.s ? <CheckCircle2 className="w-5 h-5 mx-auto text-neutral-500" /> : <X className="w-5 h-5 mx-auto text-neutral-700" />) : row.s}
                      </td>
                      <td className="p-4 border-b border-white/5 text-center bg-primary/[0.02] text-white font-medium">
                        {typeof row.p === 'boolean' ? (row.p ? <CheckCircle2 className="w-5 h-5 mx-auto text-primary" /> : <X className="w-5 h-5 mx-auto text-neutral-700" />) : row.p}
                      </td>
                      <td className="p-4 border-b border-white/5 text-center text-white">
                        {typeof row.e === 'boolean' ? (row.e ? <CheckCircle2 className="w-5 h-5 mx-auto text-white" /> : <X className="w-5 h-5 mx-auto text-neutral-700" />) : row.e}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none hover:bg-white/[0.02]"
              >
                <span className="font-semibold text-white flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-primary' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-neutral-400 border-t border-white/5 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
