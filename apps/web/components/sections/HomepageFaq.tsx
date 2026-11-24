"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function HomepageFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do you offer a free trial or demo version?",
      a: "No. Bitgard provides commercial, enterprise grade software with dedicated local infrastructure, instant cryptographic license provisioning, and guaranteed uptime. You can subscribe month to month with no long term lock in and cancel at any time."
    },
    {
      q: "Can the software work completely offline?",
      a: "Yes. Both Vigil and Bitgard POS are engineered as native desktop applications with local SQLite database storage. You can continue billing, scanning items, and registering driver duties even during complete internet blackouts. All data synchronizes seamlessly when connectivity resumes."
    },
    {
      q: "What hardware does Bitgard POS support?",
      a: "Bitgard POS works with standard USB and network thermal receipt printers (ESC/POS), barcode scanners, cash drawers, customer displays, and touchscreen Windows terminals."
    },
    {
      q: "How is licensing activated after purchase?",
      a: "Upon completing subscription checkout via our secure payment gateway, your unique software license key is generated immediately and sent via email alongside direct desktop installer download links."
    },
    {
      q: "Can I manage multiple stores or fleet hubs?",
      a: "Yes. Our Business and Enterprise tiers support multi location inventory transfers, centralized financial analytics, and distributed fleet dispatch across multiple branch depots."
    },
    {
      q: "What are the computer system requirements?",
      a: "Our desktop applications are lightweight and run smoothly on modern 64 bit Windows (Windows 10 or 11), macOS, or Linux computers with a minimum of 4 GB RAM."
    },
    {
      q: "How do I manage or cancel my subscription?",
      a: "You have access to a self service customer billing portal where you can upgrade, downgrade, or cancel your active subscription at any time with zero termination fees or penalties."
    },
    {
      q: "Do you provide technical support and software updates?",
      a: "Yes. All active subscriptions include regular software updates, security patches, new feature additions, and direct priority technical support."
    }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#000000] border-b border-white/10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-neutral-300 text-xs font-medium uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Questions and answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 text-balance">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 text-pretty">
            Everything you need to know about our commercial licensing, hardware compatibility, and offline architecture.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#181818] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-white pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
