// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // This disables SSR
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
