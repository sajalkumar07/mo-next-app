/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // This will skip static generation and use client-side rendering
  exportPathMap: function () {
    return {
      "/": { page: "/" },
    };
  },
};

module.exports = nextConfig;
