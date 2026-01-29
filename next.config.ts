import type { NextConfig } from "next";

const API_HOST =
    process.env.API_PROXY_TARGET ?? "http://localhost:4491";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/backend/:path*",
                destination: `${API_HOST}/:path*`,
            },
        ];
    },
};

export default nextConfig;
