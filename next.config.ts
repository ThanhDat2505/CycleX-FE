import type { NextConfig } from "next";

const API_HOST =
    process.env.API_PROXY_TARGET ??
    (process.env.DOCKER === "true" ? "http://api:4491" : "http://localhost:4491");

const nextConfig: NextConfig = {
    async rewrites() {
        console.log(`API_HOST: ${API_HOST}`);
        return [
            {
                source: "/backend/:path*",
                destination: `${API_HOST}/:path*`,
            },
        ];
    },
};

export default nextConfig;
