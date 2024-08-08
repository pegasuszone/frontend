import { createContext, ReactNode, useContext, useState } from 'react'

export interface SwContext {
  registration: ServiceWorkerRegistration | undefined
  setRegistration: (registration: ServiceWorkerRegistration) => void
}

export const Sw = createContext<SwContext>({
  registration: undefined,
  setRegistration: () => {},
})

export function SwProvider({ children }: { children: ReactNode }) {
  const [registration, setRegistration] = useState<
    ServiceWorkerRegistration | undefined
  >()

  return (
    <Sw.Provider
      value={{
        registration,
        setRegistration,
      }}
    >
      {children}
    </Sw.Provider>
  )
}

export const useSw = (): SwContext => useContext(Sw)
