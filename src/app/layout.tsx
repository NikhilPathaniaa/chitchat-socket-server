import { Providers } from '@/components/Providers';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChitChat',
  description: 'A real-time chat application',
  icons: {
    icon: '/favicon.ico',
  },
};

export const headers = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
