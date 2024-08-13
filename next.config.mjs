import pwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.swiftprotocol.zone"],
      allowedForwardedHosts: ["localhost:3000", "*.swiftprotocol.zone"],
    }
  },
};

const withPWA = pwa({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: false,
  skipWaiting: true,
  importScripts: ["/service-worker.js"]
});

export default withPWA(nextConfig);
