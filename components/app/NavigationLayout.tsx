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
import { useAccount, useConnect, useDisconnect } from 'graz'
import { usePathname } from 'next/navigation'
import { Button } from '../catalyst/button'
import WalletModal from './WalletModal'

const navItems = [
  { label: 'Trade', url: '/' },
  { label: 'Inbox', url: '/inbox' },
  { label: 'Outbox', url: '/outbox' },
]

export default function NavigationLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
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
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url} current={pathname === url}>
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
              <DropdownButton as={NavbarItem} aria-label="Notifications">
                <BellIcon />
              </DropdownButton>
            </Dropdown>
            {isConnected ? (
              <Button
                outline
                className="!cursor-pointer"
                onClick={() => disconnect()}
              >
                Disconnect wallet
              </Button>
            ) : (
              <>
                <Button
                  color="white"
                  className="!cursor-pointer"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  Connect wallet
                </Button>
                <WalletModal
                  isOpen={isWalletModalOpen}
                  setIsOpen={setIsWalletModalOpen}
                  callback={(walletType) => {
                    connect({ chainId: CHAIN_ID, walletType })
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
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
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
