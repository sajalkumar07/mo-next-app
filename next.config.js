/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true }, // TEMP: don’t block builds on lint
};
module.exports = nextConfig;
