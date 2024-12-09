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
    clientReferenceManifest: {
      resolveClientReferencePaths: (filePath) => {
        if (filePath.includes('(with-navbar)')) {
          return true;
        }
        return false;
      }
    }
  },
  webpack: (config, { isServer, nextRuntime }) => {
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];

    config.snapshot = {
      ...config.snapshot,
      managedPaths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/app/(with-navbar)')
      ]
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    config.optimization.moduleIds = 'named';

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/',
      },
    ];
  },
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
