import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone: un servidor mínimo para la imagen de producción de Docker.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
