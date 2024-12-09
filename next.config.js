/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com', 'unsplash.com']
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '.'),
    serverComponentsExternalPackages: ['mongoose'],
    appDir: true,
    // Force client-side tracing
    clientTraceRoot: path.join(__dirname, '.'),
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Ensure all necessary files are traced
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [
        path.resolve(__dirname, 'node_modules')
      ]
    };

    // Explicit module resolution
    config.resolve.extensions = [
      ...config.resolve.extensions,
      '.js', '.jsx', '.ts', '.tsx'
    ];

    // Handle fallback for non-server environments
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Ensure client reference manifests are handled
    config.optimization.moduleIds = 'named';

    return config;
  },
  // Ensure all routes are handled
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/',
      },
    ];
  }
};

module.exports = nextConfig;
