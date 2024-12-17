/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'chitchat-blog.vercel.app'],
    },
  },
}

module.exports = nextConfig
