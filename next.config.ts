import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   useCache: true,
  // },
  plugins: [],
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(webm|mp4)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/videos/",
            outputPath: "static/videos/",
            name: "[name].[hash].[ext]",
          },
        },
      ],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uikurtujmcnikthuuxtd.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // or higher if needed (e.g., "10mb")
    },
  },
};

const getNextConfig = async () => {
  const typography = (await import("@tailwindcss/typography")).default;
  nextConfig.plugins.push(typography);
  return nextConfig;
};

export default getNextConfig;
