import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages read content/ and content-samples/ at run time (src/lib/content.ts), so the deployed server needs them.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*", "./content-samples/**/*"],
  },
};

export default nextConfig;
