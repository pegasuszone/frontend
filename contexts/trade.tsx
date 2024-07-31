import { mod, Mod } from '@/utils/format'
import { useAccount } from 'graz'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type SelectedTokens = Map<Mod, string>
type ToggleTokenFunction = (
  collectionAddress: string,
  tokenId: string,
  image: string
) => void

export interface TradeContext {
  selectedUserTokens: SelectedTokens
  toggleUserToken: ToggleTokenFunction
  selectedPeerTokens: SelectedTokens
  togglePeerToken: ToggleTokenFunction
}

export const Trade = createContext<TradeContext>({
  selectedUserTokens: new Map<Mod, string>(),
  toggleUserToken: () => {},
  selectedPeerTokens: new Map<Mod, string>(),
  togglePeerToken: () => {},
})

export function TradeProvider({ children }: { children: ReactNode }) {
  const { data: account } = useAccount()

  const selectedUserTokens = useMemo(() => new Map<Mod, string>(), [account])
  const [
    selectedUserTokensRefreshCounter,
    setSelectedUserTokensRefreshCounter,
  ] = useState<number>(0)
  const refreshSelectedUserTokens = useCallback(
    () =>
      setSelectedUserTokensRefreshCounter(selectedUserTokensRefreshCounter + 1),
    [selectedUserTokensRefreshCounter, setSelectedUserTokensRefreshCounter]
  )

  const toggleUserToken = (
    collectionAddress: string,
    tokenId: string,
    image: string
  ) => {
    const tokenMod = mod(collectionAddress, tokenId)
    switch (selectedUserTokens.has(tokenMod)) {
      case true:
        selectedUserTokens.delete(tokenMod)
        break
      case false:
        if (selectedUserTokens.size >= 5) return
        selectedUserTokens.set(tokenMod, image)
        break
    }
    refreshSelectedUserTokens()
  }

  const selectedPeerTokens = useMemo(() => new Map<Mod, string>(), [account])
  const [
    selectedPeerTokensRefreshCounter,
    setSelectedPeerTokensRefreshCounter,
  ] = useState<number>(0)
  const refreshSelectedPeerTokens = useCallback(
    () =>
      setSelectedPeerTokensRefreshCounter(selectedPeerTokensRefreshCounter + 1),
    [selectedPeerTokensRefreshCounter, setSelectedPeerTokensRefreshCounter]
  )

  const togglePeerToken = (
    collectionAddress: string,
    tokenId: string,
    image: string
  ) => {
    const tokenMod = mod(collectionAddress, tokenId)
    switch (selectedPeerTokens.has(tokenMod)) {
      case true:
        selectedPeerTokens.delete(tokenMod)
        break
      case false:
        if (selectedPeerTokens.size >= 5) return
        selectedPeerTokens.set(tokenMod, image)
        break
    }
    refreshSelectedPeerTokens()
  }

  return (
    <Trade.Provider
      value={{
        selectedUserTokens,
        toggleUserToken,
        selectedPeerTokens,
        togglePeerToken,
      }}
    >
      {children}
    </Trade.Provider>
  )
}

export const useTrade = (): TradeContext => useContext(Trade)
