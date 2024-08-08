'use client'

import { useSw } from '@/contexts/sw'
import { CHAIN_ID, SWIFT_API, SWIFT_APP_ID } from '@/utils/constants'
import { urlB64ToUint8Array } from '@/utils/format'
import { StdTx } from '@cosmjs/amino'
import { BellIcon } from '@heroicons/react/24/outline'
import {
  GetResponseType as AuthorizationsGetResponse,
  SetResponseType as AuthorizationsSetResponse,
} from '@swiftprotocol/api/routes/notify/auth/types'
import { VerifyResponseType } from '@swiftprotocol/api/routes/notify/verify/types'
import { getWallet, useAccount } from 'graz'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../catalyst/button'
import { DropdownMenu } from '../catalyst/dropdown'
import { Heading } from '../catalyst/heading'
import { Text } from '../catalyst/text'
import Spinner from './Spinner'

export default function NotificationDropdown() {
  const { data: account } = useAccount()
  const { registration } = useSw()

  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<PushSubscriptionJSON>()
  const [refreshCounter, setRefreshCounter] = useState(0)
  const refresh = () => setRefreshCounter(refreshCounter + 1)

  const handleRetrieveSignature: () => Promise<StdTx> =
    useCallback(async () => {
      if (!account)
        throw new Error('Cannot retrieve signature without a connected account')
      const signatureItem = localStorage.getItem(
        `swift:signature/${account.bech32Address}`
      )

      if (signatureItem) {
        const sig = JSON.parse(signatureItem) as StdTx
        if (
          sig.msg[0].type !== 'sign/MsgSignData' &&
          sig.msg[0].value.signer !== account?.bech32Address
        ) {
          localStorage.removeItem('swift:signature')
        } else {
          return sig
        }
      }

      const sig = await handleSign()
      if (!sig) throw new Error('Failed to sign message')
      localStorage.setItem(
        `swift:signature/${account.bech32Address}`,
        JSON.stringify(sig)
      )
      return sig
    }, [localStorage, account])

  const handleSign = useCallback(async () => {
    console.log(account)
    if (!account) return

    const wallet = getWallet()
    console.log(wallet)
    if (!wallet.signArbitrary) return

    const authMsg =
      'I am signing this message to authorize Pegasus to display push notifications on this device.'

    const sig = await wallet.signArbitrary(
      CHAIN_ID,
      account.bech32Address,
      authMsg
    )

    console.log(sig)

    const walletSignature: StdTx = {
      msg: [
        {
          type: 'sign/MsgSignData',
          value: {
            signer: account.bech32Address,
            data: btoa(authMsg),
          },
        },
      ],
      fee: { gas: '0', amount: [] },
      memo: '',
      signatures: [sig],
    }

    return walletSignature
  }, [account])

  const handleRegister = useCallback(async () => {
    if (!account) throw new Error('Cannot register without an account')
    if (!registration) throw new Error('Failed to retrieve registration')

    const signature = await handleRetrieveSignature()
    if (!signature) throw new Error('Failed to retrieve signature')

    const applicationServerKey = urlB64ToUint8Array(
      'BN5HxHnstRvRlvUs6iH9KwgS65fPqmtY1IVpiCeNC3mRTIA4tBitR-GXnMq6ij_CJfmdP3gzJzh0KnFYh8YPgmA'
    )

    console.log(Buffer.from(applicationServerKey).toString('base64'))

    const authorizationsResponse = await fetch(`${SWIFT_API}/notify/auth/get`, {
      method: 'POST',
      body: JSON.stringify({
        address: account?.bech32Address,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let authorizations: AuthorizationsGetResponse['authorizations']

    if (authorizationsResponse.status !== 200) {
      authorizations = []
    } else {
      const auth: AuthorizationsGetResponse =
        await authorizationsResponse.json()
      authorizations = auth.authorizations
    }

    const pegasusAuthIndex = authorizations.findIndex(
      (auth) => auth.app === SWIFT_APP_ID
    )
    if (pegasusAuthIndex >= 0) {
      authorizations[pegasusAuthIndex].methods = ['push']
    } else {
      authorizations.push({
        app: SWIFT_APP_ID,
        methods: ['push'],
      })
    }

    const setAuthorizationsResponse = await fetch(
      `${SWIFT_API}/notify/auth/set`,
      {
        method: 'POST',
        body: JSON.stringify({
          signature,
          authorizations: authorizations,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (setAuthorizationsResponse.status !== 200) {
      throw new Error('Failed to set authorizations')
    }

    const setAuth: AuthorizationsSetResponse =
      await setAuthorizationsResponse.json()
    console.log(setAuth)

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })

    const subscribeResponse = await fetch(`${SWIFT_API}/notify/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        signature,
        subscription,
        app: SWIFT_APP_ID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (subscribeResponse.status !== 200) {
      throw new Error('Failed to subscribe')
    }

    refresh()
  }, [registration, account])

  const handleRetrieveSubscription: () => Promise<
    PushSubscriptionJSON | undefined
  > = useCallback(async () => {
    if (!account) return

    const signature = await handleRetrieveSignature()
    if (!signature) throw new Error('Failed to retrieve signature')

    const subscriptionResponse = await fetch(`${SWIFT_API}/notify/verify`, {
      method: 'POST',
      body: JSON.stringify({
        signature,
        app: SWIFT_APP_ID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (subscriptionResponse.status !== 200) {
      return undefined
    }

    const sub: VerifyResponseType = await subscriptionResponse.json()
    return sub.subscription
  }, [account])

  useEffect(() => {
    async function effect() {
      const subscription = await handleRetrieveSubscription()
      setSubscription(subscription)
      setIsLoading(false)
    }
    effect()
  }, [account, refreshCounter])

  return (
    <DropdownMenu>
      <div className="md:max-w-xs">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="w-8 h-8" />
          </div>
        ) : subscription ? (
          <div className="flex flex-col w-full">
            <Heading level={2}>Notifications</Heading>
          </div>
        ) : (
          <div className="flex flex-col pt-4 w-full justify-center items-center">
            <BellIcon className="h-12 w-12 text-black dark:text-white" />
            <Heading level={2} className="mt-1">
              Push Notifications
            </Heading>
            <Text className="text-center mt-1.5 lg:mt-0">
              Sign this device up for push notifications whenever you receive or
              send a new offer.
            </Text>
            <Button
              onClick={handleRegister}
              color="dark/white"
              className="w-full mt-4 !cursor-pointer"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </DropdownMenu>
  )
}
