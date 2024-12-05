import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://chitchat.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blogs/',
          '/about/',
        ],
        disallow: [
          '/private/',
          '/api/',
          '/*.json$',
          '/settings/',
          '/profile/',
          '/chat/',
          '/*?*', // Prevent crawling of URL parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/*.json$',
          '/api/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/blogs/',
          '/about/',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.webp$',
          '/*.gif$',
          '/*.svg$',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
