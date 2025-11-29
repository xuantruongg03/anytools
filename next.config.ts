import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Redirect non-www to www for SEO consistency
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [
                    {
                        type: "host",
                        value: "anytools.online",
                    },
                ],
                destination: "https://www.anytools.online/:path*",
                permanent: true,
            },
        ];
    },
    // Add trailing slash consistency
    trailingSlash: false,
};

export default nextConfig;
