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

    async redirects() {
        return [
            {
                source: "/products/vehicle-hire",
                destination: "/products/vigil",
                permanent: true,
            },
            {
                source: "/products/vehicle-hire/:path*",
                destination: "/products/vigil/:path*",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
