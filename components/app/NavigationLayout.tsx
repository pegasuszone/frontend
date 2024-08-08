'use client'

import { useState, type ReactNode } from 'react'

import { Avatar } from '@/components/catalyst/avatar'
import { Badge } from '@/components/catalyst/badge'
import { Dropdown, DropdownButton } from '@/components/catalyst/dropdown'
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/catalyst/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/catalyst/sidebar'
import { StackedLayout } from '@/components/catalyst/stacked-layout'
import { CHAIN_ID } from '@/utils/constants'
import { BellIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSuggestChainAndConnect,
} from 'graz'
import { stargaze, stargazetestnet } from 'graz/chains'
import isMobile from 'is-mobile'
import { usePathname } from 'next/navigation'
import { Button } from '../catalyst/button'
import NotificationDropdown from './NotificationDropdown'
import WalletModal from './WalletModal'

const navItems = [
  { label: 'Trade', url: '/' },
  { label: 'Inbox', url: '/inbox', walletRequired: true },
  { label: 'Outbox', url: '/outbox', walletRequired: true },
]

export default function NavigationLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { suggestAndConnect } = useSuggestChainAndConnect()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Dropdown>
            <NavbarItem href="/">
              <Avatar src="/logo.png" />
              <NavbarLabel>Pegasus</NavbarLabel>
            </NavbarItem>
          </Dropdown>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url, walletRequired }) => (
              <NavbarItem
                key={label}
                href={url}
                current={pathname === url}
                onClick={() => {
                  if (walletRequired && !isConnected) setIsWalletModalOpen(true)
                }}
              >
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            {process.env.NEXT_PUBLIC_SHOW_NOTIFICATIONS_PROMO_BADGE && (
              <Badge color="red" className="hidden lg:flex">
                Now with notifications <ChevronRightIcon className="w-4 h-4" />
              </Badge>
            )}
            <Dropdown>
              <DropdownButton
                disabled={!isConnected}
                as={NavbarItem}
                className="!cursor-pointer"
                aria-label="Notifications"
              >
                <BellIcon className="!cursor-pointer" />
              </DropdownButton>
              <NotificationDropdown />
            </Dropdown>
            {isConnected ? (
              <Button
                outline
                className="!cursor-pointer"
                onClick={() => disconnect()}
              >
                {isMobile() ? 'Disconnect' : 'Disconnect wallet'}
              </Button>
            ) : (
              <>
                <Button
                  color="white"
                  className="!cursor-pointer"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  {isMobile() ? 'Connect' : 'Connect wallet'}
                </Button>
                <WalletModal
                  isOpen={isWalletModalOpen}
                  setIsOpen={setIsWalletModalOpen}
                  callback={(walletType) => {
                    if (isMobile()) {
                      connect({ chainId: CHAIN_ID, walletType })
                    } else {
                      suggestAndConnect({
                        chainInfo:
                          CHAIN_ID === 'stargaze-1'
                            ? stargaze
                            : stargazetestnet,
                        walletType,
                      })
                    }
                    setIsWalletModalOpen(false)
                  }}
                />
              </>
            )}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <SidebarItem className="lg:mb-2.5 cursor-pointer">
                <Avatar src="/logo.png" />
                <SidebarLabel>Pegasus</SidebarLabel>
              </SidebarItem>
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url, walletRequired }) => (
                <SidebarItem
                  key={label}
                  href={url}
                  onClick={() => {
                    if (walletRequired && !isConnected)
                      setIsWalletModalOpen(true)
                  }}
                >
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  )
}
