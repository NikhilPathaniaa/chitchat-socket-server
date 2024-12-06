import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChitChat - Private, Frontend-Only Chat Application | No Data Storage',
  description: 'ChitChat is a revolutionary frontend-only chat application focused on complete privacy. No servers, no storage, no tracking - just secure, ephemeral conversations that disappear on refresh.',
  keywords: [
    'private chat',
    'frontend chat',
    'no storage chat',
    'ephemeral messaging',
    'temporary chat',
    'secure messaging',
    'browser-only chat',
    'no backend chat',
    'private messaging',
    'anonymous chat',
    'real-time chat',
    'peer-to-peer chat',
    'WebRTC chat',
    'no history chat',
    'privacy-focused chat'
  ],
  authors: [{ name: 'ChitChat Team' }],
  category: 'Privacy Software',
  openGraph: {
    title: 'ChitChat - Private, Frontend-Only Chat Application',
    description: 'Experience truly private conversations with ChitChat. No servers, no storage, just secure peer-to-peer messaging that leaves no trace.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ChitChat',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'ChitChat - Private Messaging Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChitChat - Private, Frontend-Only Chat',
    description: 'Truly private messaging with no data storage. Your conversations, your privacy, guaranteed.',
    images: ['/twitter-image.png'],
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://chitchat.com/about',
  },
}
