"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const CyberButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden bg-primary/20 px-8 font-medium text-primary duration-300 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] hover:bg-primary/40 hover:text-white",
        className
      )}
    >
      {/* Glitch Effect on Hover */}
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="relative h-full w-8 bg-white/20" />
      </div>
      <div className="absolute inset-0 border border-primary/50 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]" />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
};
