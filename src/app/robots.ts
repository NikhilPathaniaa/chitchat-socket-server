import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

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
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
