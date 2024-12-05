/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'unsplash.com']
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
};

module.exports = nextConfig;
