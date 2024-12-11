/** @type {import('next').NextConfig} */
const path = require('path');
const { URL } = require('url');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['some-package'] // Adjust as necessary
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['example.com'], // Replace with your image domains
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    // Custom webpack configurations if needed
    return config;
  }
};

module.exports = nextConfig;
