'use client'

import { SwProvider } from '@/contexts/sw'
import { Workbox } from 'workbox-window'

declare global {
  interface Window {
    workbox: Workbox
  }
}

export default function PWAWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SwProvider>{children}</SwProvider>
}
