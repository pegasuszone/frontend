import { microAmountMultiplier } from './constants'

export function truncateAddress(
  address: string,
  visibleFirst: number = 8,
  visibleLast: number = 4
) {
  return `${address.substring(0, visibleFirst)}...${address.substring(
    address.length - visibleLast,
    address.length
  )}`
}

export function formatCurrency(amount: string | any, currency: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger',
  })

  return `${formatter.format(parseInt(amount || '0') / microAmountMultiplier).replace('$', '')} STARS`
}

export type Mod = `${string}-${string}`

export function mod(collectionAddress: string, tokenId: string): Mod {
  return `${collectionAddress}-${tokenId}`
}

export function demod(mod: string) {
  if (!mod.includes('-') || !mod.includes('stars1'))
    throw new Error('Provided string is not a valid mod')
  const splitMod = mod.split('-')
  return {
    collectionAddress: splitMod[0],
    tokenId: splitMod[1],
  }
}

export function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
