/** @type {import('next').NextConfig} */
const path = require('path');
const { URL } = require('url');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['example.com'], // Replace with your actual image domains
  },
  webpack: (config, { isServer }) => {
    console.log('Webpack configuration:', config); // Logging the webpack config
    if (!isServer) {
      config.resolve.fallback = {
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
