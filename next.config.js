/** @type {import('next').NextConfig} */
const path = require('path');
const { URL } = require('url');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  images: {
    domains: ['example.com'], // Replace with your actual image domains
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;
