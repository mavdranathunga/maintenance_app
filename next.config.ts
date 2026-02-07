import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  // (optional for older Next setups)
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
  },
  reactCompiler: true,
};

export default nextConfig;
