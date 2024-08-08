'use client'

import { SwProvider } from '@/contexts/sw'

declare global {
  interface Window {
    workbox: ServiceWorkerContainer
  }
}

export default function PWAWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SwProvider>{children}</SwProvider>
}
