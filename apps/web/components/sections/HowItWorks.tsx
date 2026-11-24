"use client";

import React from "react";
import { Download, Key, MonitorPlay, Shield, Cpu, Lock, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Key,
      title: "Select your software subscription",
      desc: "Choose the exact tier matching your fleet size or checkout counter count. Simple month to month billing with no hidden onboarding fees or lock in contracts."
    },
    {
      step: "02",
      icon: Download,
      title: "Download and activate instantly",
      desc: "Receive your production desktop installer package along with your cryptographic license key immediately following checkout confirmation."
    },
    {
      step: "03",
      icon: MonitorPlay,
      title: "Connect hardware and run",
      desc: "Launch the desktop application, plug in thermal receipt printers, barcode scanners, or link the companion driver mobile APK to begin operations."
    }
  ];

  const specs = [
    { label: "Execution engine", value: "Tauri v2 Desktop Core" },
    { label: "Local storage", value: "Embedded SQLite Database" },
    { label: "Encryption", value: "AES-256 Tamper-Proof Audit" },
    { label: "Provisioning", value: "Instant License Key Dispatch" }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#000000] border-b border-white/10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HOW IT WORKS */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Rapid deployment
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-balance">
            Up and running in three simple steps
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 text-pretty max-w-2xl mx-auto">
            No weeks of complex consulting or cumbersome server setups. Deploy directly to your Windows desktop hardware today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-white/10 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#272727] border border-white/10 flex items-center justify-center text-primary">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-mono font-bold text-neutral-600">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PROOF & RELIABILITY SPECIFICATIONS */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#181818] border border-white/10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>Under the hood</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                Engineering specifications
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed text-pretty">
                We reject bloated web applications that stall during peak sales hours. Our platforms are built natively in Rust and modern TypeScript for maximum local execution speed.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((spec, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#000000] border border-white/10">
                  <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mb-1">
                    {spec.label}
                  </div>
                  <div className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
