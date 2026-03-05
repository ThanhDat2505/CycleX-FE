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
    async headers() {
        return [
            {
                source: "/backend/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                ],
            },
        ];
    },
};

export default nextConfig;
