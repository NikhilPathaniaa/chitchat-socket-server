import { Providers } from '@/components/Providers';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChitChat - Ephemeral Messaging',
  description: 'Privacy-focused, ephemeral messaging platform',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://chitchat.vercel.app'),
  openGraph: {
    title: 'ChitChat',
    description: 'Secure, Private Messaging',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://chitchat.vercel.app',
    siteName: 'ChitChat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChitChat - Ephemeral Messaging',
    description: 'Privacy-focused, ephemeral messaging platform',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
            <CssBaseline />
            <Providers>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </Providers>
      </body>
    </html>
  );
}
