import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'ChitChat - Private Real-time Messaging App',
    template: '%s | ChitChat'
  },
  description: 'ChitChat is a privacy-focused real-time messaging application with no data storage. Connect instantly with friends and family through secure, ephemeral conversations.',
  keywords: [
    'chat',
    'messaging',
    'real-time',
    'communication',
    'social',
    'private chat',
    'secure messaging',
    'no storage',
    'ephemeral chat',
    'instant messaging'
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'ChitChat',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'ChitChat',
    title: 'ChitChat - Private Real-time Messaging App',
    description: 'Connect and chat in real-time with ChitChat - The privacy-focused messaging platform with no data storage',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ChitChat Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChitChat - Private Real-time Messaging',
    description: 'Experience secure, ephemeral conversations with ChitChat - No data storage, just pure communication',
    images: ['https://your-domain.com/twitter-image.jpg'],
    creator: '@yourhandle',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
};

export default defaultMetadata;
