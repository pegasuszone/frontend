import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalyst/dialog'
import { SUPPORTED_WALLETS } from '@/utils/constants'
import { WalletType } from 'graz'
import isMobile from 'is-mobile'
import { SidebarDivider } from '../catalyst/sidebar'

export default function WalletModal({
  isOpen,
  setIsOpen,
  callback,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  callback: (walletType: WalletType) => void
}) {
  const mobile = isMobile()
  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle className="!text-lg">Connect a wallet</DialogTitle>
        <DialogDescription>
          Select a wallet to connect to Pegasus
        </DialogDescription>
        <DialogBody className="flex flex-col">
          {SUPPORTED_WALLETS.filter(
            (wallet) => wallet.isMobile === isMobile()
          ).map((wallet, k, a) => (
            <div key={wallet.name}>
              <button
                onClick={() => {
                  callback(wallet.type)
                }}
                className="flex flex-row items-center w-full justify-between"
              >
                <div className="flex flex-row items-center space-x-4">
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-10 h-10"
                  />
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <span className="text-sm text-white/50">
                  {wallet.isMobile || wallet.type === WalletType.WALLETCONNECT
                    ? 'Mobile'
                    : 'Desktop'}
                </span>
              </button>
              {k !== a.length - 1 && <SidebarDivider />}
            </div>
          ))}
        </DialogBody>
      </Dialog>
    </>
  )
}
