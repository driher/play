/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cms.pentas.tv",
      },
      {
        protocol: "https",
        hostname: "cms.pentas.tv",
      },
    ],
  },
};

module.exports = nextConfig;