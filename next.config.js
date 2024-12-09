/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  
  // Typescript configuration
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Output configuration
  output: 'standalone',
  
  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Images configuration
  images: {
    domains: ['images.unsplash.com', 'unsplash.com']
  },
  
  // Experimental features
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '.'),
    serverComponentsExternalPackages: ['mongoose', 'socket.io', 'express'],
    appDir: true,
    
    // Tracing configuration
    outputFileTracing: true,
    clientReferenceManifest: {
      resolveClientReferencePaths: (filePath) => {
        // Include specific paths for tracing
        const tracePaths = [
          '(with-navbar)',
          'components',
          'lib',
          'data'
        ];
        return tracePaths.some(path => filePath.includes(path));
      }
    }
  },
  
  // Webpack configuration
  webpack: (config, { isServer, nextRuntime }) => {
    // Custom file tracing
    config.plugins.push(
      new (require('webpack')).DefinePlugin({
        'process.env.NEXT_TRACE_CUSTOM': JSON.stringify(true)
      })
    );

    // Explicit module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ];

    // Snapshot configuration
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/app/(with-navbar)'),
        path.resolve(__dirname, 'src/components'),
        path.resolve(__dirname, 'src/lib'),
        path.resolve(__dirname, 'src/data')
      ]
    };

    // Fallback configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Module ID configuration
    config.optimization.moduleIds = 'named';

    // Ensure client reference manifest generation
    config.optimization.runtimeChunk = 'single';

    return config;
  },
  
  // Route handling
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/'
      }
    ];
  }
};

// Ensure the standalone output directory exists
const standaloneDir = path.join(__dirname, '.next', 'standalone');
if (!fs.existsSync(standaloneDir)) {
  fs.mkdirSync(standaloneDir, { recursive: true });
}

module.exports = nextConfig;
