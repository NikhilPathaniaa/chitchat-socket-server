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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
