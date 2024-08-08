'use server'

import { SWIFT_API, SWIFT_APP_ID } from '@/utils/constants'
import { truncateAddress } from '@/utils/format'
import { signMessage } from '@swiftprotocol/api/helpers'

export default async function issueOfferSentNotification(
  user: string,
  peer: string
) {
  'use server'

  const privateKey = process.env.SWIFT_PRIVATE_KEY
  const publicKey = process.env.SWIFT_PUBLIC_KEY
  const appId = SWIFT_APP_ID

  console.log('issueOfferSentNotification', user, peer)
  console.log('keys', privateKey, publicKey)

  if (!privateKey) throw new Error('Missing Swift private key')
  if (!publicKey) throw new Error('Missing Swift public key')

  const signature = await signMessage(privateKey, appId.toString())
  console.log('signature', signature)
  const notification = {
    title: 'Sent new offer',
    body: 'You have sent a new offer to ' + truncateAddress(peer),
  }
  console.log('notification', notification)

  await fetch(`${SWIFT_API}/notify/push`, {
    method: 'POST',
    body: JSON.stringify({
      address: user,
      pubkey: publicKey,
      signature,
      notification,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
