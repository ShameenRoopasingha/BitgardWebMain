"use client";

import { cn } from "@/lib/utils";

interface GradualBlurProps {
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    blur?: string; // e.g. "20px", "40px"
    height?: string; // e.g. "100px", "20vh"
    zIndex?: number;
}

/**
 * GradualBlur
 * 
 * Creates a premium "fade out" blur effect using backdrop-filter and mask-image.
 * This effectively blurs the content underneath in a gradient fashion.
 */
export default function GradualBlur({
    className,
    position = "bottom",
    blur = "10px",
    height = "150px",
    zIndex = 40,
}: GradualBlurProps) {

    // Determine mask gradient based on position
    const getMaskImage = () => {
        switch (position) {
            case "top":
                return `linear-gradient(to bottom, black 0%, transparent 100%)`;
            case "bottom":
                return `linear-gradient(to top, black 0%, transparent 100%)`;
            case "left":
                return `linear-gradient(to right, black 0%, transparent 100%)`;
            case "right":
                return `linear-gradient(to left, black 0%, transparent 100%)`;
            default:
                return `linear-gradient(to top, black 0%, transparent 100%)`;
        }
    };

    // Determine positioning classes
    const getPositionClasses = () => {
        switch (position) {
            case "top":
                return "top-0 left-0 right-0";
            case "bottom":
                return "bottom-0 left-0 right-0";
            case "left":
                return "top-0 bottom-0 left-0";
            case "right":
                return "top-0 bottom-0 right-0";
            default:
                return "bottom-0 left-0 right-0";
        }
    };

    return (
        <div
            aria-hidden="true"
            className={cn(
                "fixed pointer-events-none transition-all duration-700 ease-in-out",
                getPositionClasses(),
                className
            )}
            style={{
                zIndex,
                height: position === "top" || position === "bottom" ? height : "100%",
                width: position === "left" || position === "right" ? height : "100%",
                backdropFilter: `blur(${blur})`,
                WebkitBackdropFilter: `blur(${blur})`,
                maskImage: getMaskImage(),
                WebkitMaskImage: getMaskImage(),
            }}
        />
    );
}
