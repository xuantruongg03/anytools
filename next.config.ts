import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Redirect www to non-www for SEO consistency
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [
                    {
                        type: "host",
                        value: "www.anytools.online",
                    },
                ],
                destination: "https://anytools.online/:path*",
                permanent: true,
            },
        ];
    },
    // Add trailing slash consistency
    trailingSlash: false,
};

export default nextConfig;
