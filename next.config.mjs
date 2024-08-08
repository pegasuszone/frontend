import pwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
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
