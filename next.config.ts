import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["mongoose", "bcryptjs", "src/lib/db.proxy"],
};

export default nextConfig;
