'use client'

import NavigationLayout from '@/components/app/NavigationLayout'
import { Inter } from 'next/font/google'
import './globals.css'

import { TradeProvider } from '@/contexts/trade'
import { TxProvider } from '@/contexts/tx'
import graphqlClient from '@/graphql'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GrazProvider } from 'graz'
import { stargaze, stargazetestnet } from 'graz/chains'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const queryClient = new QueryClient()

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-center" />
        <ApolloProvider client={graphqlClient}>
          <QueryClientProvider client={queryClient}>
            <GrazProvider
              grazOptions={{
                chains: [stargaze, stargazetestnet],
                autoReconnect: false,
                walletConnect: {
                  options: {
                    projectId: '076225cb5475a70d9e6eef6e6dcd2c6b',
                    metadata: walletConnectMetadata,
                  },
                },
              }}
            >
              <TxProvider>
                <TradeProvider>
                  <div className="dark grow">
                    <NavigationLayout>{children}</NavigationLayout>
                  </div>
                </TradeProvider>
              </TxProvider>
            </GrazProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
