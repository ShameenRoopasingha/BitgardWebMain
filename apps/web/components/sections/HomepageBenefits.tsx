"use client";

import React from "react";
import { Zap, ShieldCheck, Database, RefreshCw, BarChart2, Laptop } from "lucide-react";

export function HomepageBenefits() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Eliminate revenue leakage",
      desc: "Precision multi currency invoicing calculates excess kilometers, waiting hours, and driver allowances automatically with zero manual rounding errors.",
      stat: "100% unbilled trip capture"
    },
    {
      icon: Zap,
      title: "Accelerate cashier checkout",
      desc: "Barcode scanning, instant catalog search, and split tender payments process transactions in under a second so checkout lines never stall.",
      stat: "0.4s barcode latency"
    },
    {
      icon: Database,
      title: "Maintain total offline autonomy",
      desc: "Native desktop applications write directly to local SQLite storage. Bill customers, print receipts, and log vehicle movements without network access.",
      stat: "Zero dependency on wifi"
    },
    {
      icon: RefreshCw,
      title: "Unify multi location stock",
      desc: "Live inventory deduction updates stock balances across shops, dispatch depots, and warehouses automatically with automated low stock warnings.",
      stat: "Instant cross branch sync"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#000000] border-b border-white/10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Measurable business outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-balance">
            Software built to protect profit margins
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 text-pretty max-w-2xl mx-auto">
            Every feature in our software is measured by tangible improvements in speed, data accuracy, and cost reduction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-white/10 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#272727] border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  {b.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] font-mono font-medium text-primary">
                {b.stat}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
