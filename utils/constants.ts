import { WalletType } from 'graz'
import { stargaze, stargazetestnet } from 'graz/chains'

export const microAmountMultiplier = 1_000_000

export const GRAPHQL = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? process.env.NEXT_PUBLIC_TESTNET_GRAPHQL!
  : process.env.NEXT_PUBLIC_MAINNET_GRAPHQL!

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS!
  : process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS!

export const CHAIN_ID = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? 'elgafar-1'
  : 'stargaze-1'
export const CHAIN_NAME = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? 'stargazetestnet'
  : 'stargaze'
export const CHAIN_DATA = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? stargazetestnet
  : stargaze

export const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? process.env.NEXT_PUBLIC_TESTNET_BLOCK_EXPLORER
  : process.env.NEXT_PUBLIC_MAINNET_BLOCK_EXPLORER

export const SUPPORTED_WALLETS: {
  type: WalletType
  name: string
  icon: string
  isMobile: boolean
}[] = [
  {
    type: WalletType.KEPLR,
    name: 'Keplr',
    icon: '/wallets/keplr.png',
    isMobile: false,
  },
  {
    type: WalletType.LEAP,
    name: 'Leap',
    icon: '/wallets/leap.svg',
    isMobile: false,
  },
  {
    type: WalletType.XDEFI,
    name: 'XDEFI',
    icon: '/wallets/xdefi.svg',
    isMobile: false,
  },
  {
    type: WalletType.COSMOSTATION,
    name: 'Cosmostation',
    icon: '/wallets/cosmostation.png',
    isMobile: false,
  },
  {
    type: WalletType.WC_KEPLR_MOBILE,
    name: 'Keplr Mobile',
    icon: '/wallets/keplr.png',
    isMobile: true,
  },
  {
    type: WalletType.WC_LEAP_MOBILE,
    name: 'Leap Mobile',
    icon: '/wallets/leap.svg',
    isMobile: true,
  },
  {
    type: WalletType.WC_COSMOSTATION_MOBILE,
    name: 'Cosmostation Mobile',
    icon: '/wallets/cosmostation.png',
    isMobile: true,
  },
  {
    type: WalletType.WALLETCONNECT,
    name: 'WalletConnect',
    icon: '/wallets/walletconnect.png',
    isMobile: false,
  },
]
