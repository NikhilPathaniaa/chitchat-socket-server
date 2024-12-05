import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ChitChat - Privacy, Security, and Real-time Communication',
  description: 'Explore our latest articles about privacy-focused chat applications, secure real-time communication, and modern web development. Learn about ephemeral messaging and data privacy.',
  keywords: [
    'chat applications',
    'real-time communication',
    'web development',
    'privacy',
    'security',
    'ephemeral messaging',
    'frontend development',
    'WebRTC',
    'secure chat',
    'tech blog'
  ],
  openGraph: {
    title: 'ChitChat Blog - Privacy and Security in Real-time Communication',
    description: 'Discover insights about privacy-focused chat applications, secure messaging, and modern web development.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://your-domain.com/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ChitChat Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChitChat Blog - Privacy and Security',
    description: 'Insights about privacy-focused messaging and secure communication',
    images: ['https://your-domain.com/blog-twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com/blogs',
  },
};
