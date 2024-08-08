import { Inter } from 'next/font/google'
import './globals.css'

import AppLayout from '@/components/app/AppLayout'
import PWAWrapper from '@/components/app/PWAWrapper'
import { Metadata } from 'next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pegasus',
  description: 'Peer-to-peer NFT trading on Stargaze',
  generator: 'Next.js',
  manifest: 'https://progressier.app/d1YRu9dGZ3sSjIKB6Xrk/progressier.json',
  authors: [
    {
      name: 'Josef Leventon',
      url: 'https://github.com/josefleventon',
    },
    {
      name: 'Maurits Bos',
      url: 'https://github.com/mbbrainz',
    },
  ],
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover, theme-color=#fff',
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', url: '/android-chrome-192x192.png' },
    { rel: 'icon', url: '/android-chrome-384x384.png' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script defer src="/progressier.js" />
      <body className={inter.className}>
        <PWAWrapper>
          <AppLayout>{children}</AppLayout>
        </PWAWrapper>
      </body>
    </html>
  )
}
