import { Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import RootLayoutClient from '@/components/RootLayoutClient'
import { metadata } from './layout-metadata'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Providers>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </Providers>
      </body>
    </html>
  )
}
