/** @type {import('next').NextConfig} */
const nextConfig = {
    // Transpile packages if needed
    transpilePackages: ["@bitgard/database"],

    // Experimental features
    experimental: {
        // Optimize package imports
        optimizePackageImports: ["gsap", "react-icons", "@react-three/drei"],
    },

    // Image configuration
    images: {
        domains: [],
        formats: ["image/avif", "image/webp"],
    },
};

module.exports = nextConfig;
