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
