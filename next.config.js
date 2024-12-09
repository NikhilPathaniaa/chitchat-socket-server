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
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Explicitly include all necessary paths
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];

    // Ensure all necessary files are traced
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [
        path.resolve(__dirname, 'node_modules')
      ]
    };

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
  },
  // Explicitly define route groups
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true
      },
      {
        source: '/blogs',
        destination: '/',
        permanent: true
      },
      {
        source: '/chat',
        destination: '/',
        permanent: true
      },
      {
        source: '/docs',
        destination: '/',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
