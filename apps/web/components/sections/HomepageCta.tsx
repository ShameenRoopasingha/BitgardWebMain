"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function HomepageCta() {
  return (
    <section className="py-24 md:py-32 bg-[#000000] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#181818] border border-white/10 text-center relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#272727] border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Commercial Software Licensing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 text-balance max-w-2xl mx-auto">
            Ready to streamline your fleet or retail counter operations?
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto text-pretty mb-10 leading-relaxed">
            Join growing tour operators and multi branch retailers running on Bitgard software. Subscribe today for instant desktop installer access and license activation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(232,115,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Explore products and subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#272727] hover:bg-[#313131] active:scale-[0.98] border border-white/10 text-neutral-200 font-medium text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-300"
            >
              <span>Speak with technical team</span>
            </Link>
          </div>

          {/* Risk Reversal Guarantee */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-neutral-400 pt-8 border-t border-white/5">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Instant license key delivery</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Cancel subscription anytime</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Direct priority technical support</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
