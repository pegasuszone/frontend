import { WalletType } from 'graz'

export const microAmountMultiplier = 1_000_000

// export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRADE_CONTRACT_ADDRESS!
// export const CONTRACT_CODEID = parseInt(
//   process.env.NEXT_PUBLIC_TRADE_CONTRACT_CODEID!
// )

// export const SG721_CODEID = parseInt(process.env.NEXT_PUBLIC_SG721_CODEID!)

export const GRAPHQL = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? process.env.NEXT_PUBLIC_TESTNET_GRAPHQL!
  : process.env.NEXT_PUBLIC_MAINNET_GRAPHQL!

export const CHAIN_ID = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? 'elgafar-1'
  : 'stargaze-1'
export const CHAIN_NAME = process.env.NEXT_PUBLIC_TESTNET_ENABLED
  ? 'stargazetestnet'
  : 'stargaze'

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
