import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-f089194c-5b89-455e-95df-0323d2c6ea8e.space-z.ai",
    ".space-z.ai",
    "localhost",
  ],
};

export default nextConfig;
