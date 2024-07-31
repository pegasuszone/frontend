'use client'

import NavigationLayout from '@/components/app/NavigationLayout'
import { Inter } from 'next/font/google'
import './globals.css'

import { TradeProvider } from '@/contexts/trade'
import graphqlClient from '@/graphql'
import { ApolloProvider } from '@apollo/client'
import { GrazProvider } from 'graz'
import { stargaze, stargazetestnet } from 'graz/chains'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Pegasus',
  description: 'Peer-to-peer NFT trading on Stargaze',
}

const walletConnectMetadata = {
  name: metadata.title,
  description: metadata.description,
  url: 'https://pegasus.stargaze.zone',
  icons: ['https://pegasus.stargaze.zone/logo.png'],
}

// projectId: '076225cb5475a70d9e6eef6e6dcd2c6b',

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={graphqlClient}>
          <GrazProvider
            grazOptions={{
              chains: [stargaze, stargazetestnet],
              walletConnect: {
                options: {
                  projectId: '076225cb5475a70d9e6eef6e6dcd2c6b',
                  metadata: walletConnectMetadata,
                },
              },
            }}
          >
            <TradeProvider>
              <div className="dark">
                <NavigationLayout>{children}</NavigationLayout>
              </div>
            </TradeProvider>
          </GrazProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
