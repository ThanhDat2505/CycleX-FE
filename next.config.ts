import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: "/backend/:path*",
                destination: "http://api:4491/:path*",
            },
        ];
    },
};

export default nextConfig;
