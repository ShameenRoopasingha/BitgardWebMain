/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontSize: {
                // Golden Ratio (φ = 1.618) Fluid Typography Scale
                "xs": ["clamp(0.618rem, 1vw + 0.5rem, 0.786rem)", { lineHeight: "1.5" }],
                "sm": ["clamp(0.786rem, 1.2vw + 0.6rem, 1rem)", { lineHeight: "1.5" }],
                "base": ["1rem", { lineHeight: "1.5" }],
                "lg": ["clamp(1rem, 2vw + 0.8rem, 1.272rem)", { lineHeight: "1.4" }],
                "xl": ["clamp(1.272rem, 2.5vw + 1rem, 1.618rem)", { lineHeight: "1.3" }],
                "2xl": ["clamp(1.618rem, 3.5vw + 1.2rem, 2.058rem)", { lineHeight: "1.2" }],
                "3xl": ["clamp(2.058rem, 4.5vw + 1.4rem, 2.618rem)", { lineHeight: "1.15" }],
                "4xl": ["clamp(2.618rem, 6vw + 1.6rem, 3.330rem)", { lineHeight: "1.1" }],
                "5xl": ["clamp(3.330rem, 8vw + 2rem, 4.236rem)", { lineHeight: "1.05" }],
                "6xl": ["clamp(4.236rem, 11vw + 2.5rem, 5.388rem)", { lineHeight: "1.0" }],
                "7xl": ["clamp(5.388rem, 15vw + 3rem, 6.854rem)", { lineHeight: "1.0" }],
                "8xl": ["clamp(6.854rem, 20vw + 4rem, 8.719rem)", { lineHeight: "1.0" }],
                "9xl": ["clamp(8.719rem, 26vw + 5rem, 11.089rem)", { lineHeight: "1.0" }],
            },
            colors: {
                // shadcn-style semantic colors using CSS variables
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    // Slate Gray palette based on #6A6E79
                    50: "#f0f1f2",
                    100: "#d9dbde",
                    200: "#c2c5ca",
                    300: "#a9adb4",
                    400: "#8f949d",
                    500: "#6a6e79",
                    600: "#5a5e67",
                    700: "#4a4d55",
                    800: "#3a3d43",
                    900: "#2a2c31",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Near Black palette based on #040504
                dark: {
                    50: "#1a1b1c",
                    100: "#141515",
                    200: "#0f1010",
                    300: "#0a0b0b",
                    400: "#060707",
                    500: "#040504",
                    600: "#030403",
                    700: "#020302",
                    800: "#010201",
                    900: "#000100",
                },
                // Slate accent variations
                slate: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
                mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "glow-pulse": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(106, 110, 121, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(106, 110, 121, 0.5)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "fade-up": "fade-up 0.5s ease-out",
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
