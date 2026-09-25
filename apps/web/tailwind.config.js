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
                // Major Third (1.250) Typographic Scale
                // Base: 16px (1rem). Tightly geometrically decreasing line-heights for larger text.
                "xs": ["0.640rem", { lineHeight: "1.6" }],
                "sm": ["0.800rem", { lineHeight: "1.6" }],
                "base": ["1.000rem", { lineHeight: "1.6" }],
                "lg": ["1.250rem", { lineHeight: "1.4" }],
                "xl": ["1.563rem", { lineHeight: "1.3" }],
                "2xl": ["1.953rem", { lineHeight: "1.2" }],
                "3xl": ["2.441rem", { lineHeight: "1.15" }],
                "4xl": ["3.052rem", { lineHeight: "1.1" }],
                "5xl": ["3.815rem", { lineHeight: "1.05" }],
                "6xl": ["4.768rem", { lineHeight: "1.0" }],
                "7xl": ["5.960rem", { lineHeight: "1.0" }],
                "8xl": ["7.451rem", { lineHeight: "1.0" }],
                "9xl": ["9.313rem", { lineHeight: "1.0" }],
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
                    // Matte Orange palette based on #E8732A
                    50: "#fdf2ec",
                    100: "#fbe4d8",
                    200: "#f6c4ac",
                    300: "#f1a47f",
                    400: "#ec8353",
                    500: "#e8732a",
                    600: "#c75c1d",
                    700: "#994716",
                    800: "#6e3310",
                    900: "#441f0a",
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
                subheading: ["var(--font-subheading)", "sans-serif"],
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
                spotlight: {
                    "0%": { opacity: 0, transform: "translate(-72%, -62%) scale(0.5)" },
                    "100%": { opacity: 1, transform: "translate(-50%,-40%) scale(1)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "fade-up": "fade-up 0.5s ease-out",
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                spotlight: "spotlight 2s ease .75s 1 forwards",
            },
        },
    },
    plugins: [],
};
