"use client";

import React from "react";
import dynamic from "next/dynamic";

const Hero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center bg-[#141414] border border-white/5 rounded-2xl animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
          <span className="text-xs text-neutral-500 font-mono">Initializing 3D Telemetry Engine...</span>
        </div>
      </div>
    ),
  }
);

interface Hero3DWrapperProps {
  mode: "vigil" | "pos";
}

export function Hero3DWrapper({ mode }: Hero3DWrapperProps) {
  return <Hero3DCanvas mode={mode} />;
}
