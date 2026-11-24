"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
  isReducedMotion: boolean | null;
}

function Word({ children, progress, range, isReducedMotion }: WordProps) {
  const opacity = useTransform(progress, range, [0.25, 1], {
    ease: (t: number) => {
      // Cubic-bezier(0.22, 1, 0.36, 1) approximation
      const p1 = 0.22, p2 = 1, p3 = 0.36, p4 = 1;
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  });

  if (isReducedMotion) {
    return <span className="text-white inline-block mr-[0.3em]">{children}</span>;
  }

  return (
    <span className="relative inline-block mr-[0.3em]">
      {/* Background ghost text at 25% opacity */}
      <span className="opacity-25 text-white select-none">{children}</span>
      {/* Active text transitioning smoothly on base curve */}
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-white select-none transition-colors duration-300"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function TaglineReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const quote = "Every transaction, fleet dispatch, and inventory movement accounted for with sub second precision and zero internet dependency.";
  const words = quote.split(" ");

  return (
    <section
      ref={containerRef}
      className="py-28 md:py-36 bg-[#000000] border-b border-white/10 flex items-center justify-center relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-[760px]">
        <div className="inline-block px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-neutral-400 text-xs font-mono uppercase tracking-wider mb-8">
          The Bitgard Standard
        </div>

        <p className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.25] text-balance">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                isReducedMotion={isReducedMotion}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
