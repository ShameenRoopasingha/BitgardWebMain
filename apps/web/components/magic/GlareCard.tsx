"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export const GlareCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate: { x: 0, y: 0 },
  });
  const [styles, setStyles] = useState<Record<string, string>>({});

  const containerStyle = {
    "--m-x": "50%",
    "--m-y": "50%",
    "--r-x": "0deg",
    "--r-y": "0deg",
    "--bg-x": "50%",
    "--bg-y": "50%",
    "--duration": "300ms",
    "--foil-size": "100%",
    "--opacity": "0",
    "--radius": "12px",
    "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
    ...styles,
  } as any;

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current;
      setStyles({
        "--m-x": `${glare.x}%`,
        "--m-y": `${glare.y}%`,
        "--r-x": `${rotate.x}deg`,
        "--r-y": `${rotate.y}deg`,
        "--bg-x": `${background.x}%`,
        "--bg-y": `${background.y}%`,
        "--opacity": isPointerInside.current ? "1" : "0",
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!refElement.current) return;
    isPointerInside.current = true;
    const rect = refElement.current.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    };
    const delta = {
      x: percentage.x - 50,
      y: percentage.y - 50,
    };

    state.current.background.x = 50 + percentage.x / 4 - 12.5;
    state.current.background.y = 50 + percentage.y / 3 - 16.67;
    state.current.rotate.x = -(delta.y / 3.5);
    state.current.rotate.y = delta.x / 2;
    state.current.glare.x = percentage.x;
    state.current.glare.y = percentage.y;

    updateStyles();
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;
    state.current.rotate.x = 0;
    state.current.rotate.y = 0;
    setStyles({
      "--opacity": "0",
      "--duration": "500ms",
      "--easing": "ease-out",
      "--r-x": "0deg",
      "--r-y": "0deg",
    });
  };

  return (
    <div
      style={containerStyle}
      className={cn(
        "relative isolate [contain:layout_style] [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] w-full h-full",
        className
      )}
      ref={refElement}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="h-full grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-[var(--easing)] hover:[transition:none] [transform:rotateY(var(--r-y))_rotateX(var(--r-x))] rounded-[var(--radius)] overflow-hidden border border-border">
        <div className="w-full h-full grid [grid-area:1/1] mix-blend-normal">
          {children}
        </div>
        <div className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light opacity-[var(--opacity)] transition-opacity duration-[var(--duration)] ease-[var(--easing)]">
          <div className="absolute inset-0 bg-[radial-gradient(farthest-corner_at_var(--m-x)_var(--m-y),rgba(255,255,255,0.8)_10%,rgba(255,255,255,0.65)_20%,rgba(255,255,255,0)_90%)] mix-blend-color-burn" />
        </div>
        <div className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-[var(--opacity)] transition-opacity duration-[var(--duration)] ease-[var(--easing)] hover:[transition:none]">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,hsl(var(--primary))_25%,transparent_50%,hsl(var(--accent))_75%,transparent_100%)] [background-size:200%_auto] [background-position:var(--bg-x)_var(--bg-y)] opacity-50 mix-blend-color-dodge" />
        </div>
      </div>
    </div>
  );
};
