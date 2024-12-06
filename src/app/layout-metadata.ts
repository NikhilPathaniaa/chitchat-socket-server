import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'ChitChat - Real-time Chat Application',
  description: 'A modern real-time chat application built with Next.js and Socket.IO',
}
