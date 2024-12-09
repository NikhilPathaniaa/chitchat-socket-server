/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'unsplash.com']
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  output: 'standalone', 
  experimental: {
    outputFileTracingRoot: '.',
    serverComponentsExternalPackages: ['mongoose'],
    appDir: true
  },
  webpack: (config, { isServer, nextRuntime }) => {
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
