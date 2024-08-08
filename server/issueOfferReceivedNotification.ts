'use server'

import { SWIFT_API, SWIFT_APP_ID } from '@/utils/constants'
import { truncateAddress } from '@/utils/format'
import { signMessage } from '@swiftprotocol/api/helpers'

export default async function issueOfferReceivedNotification(
  user: string,
  peer: string
) {
  'use server'

  const privateKey = process.env.SWIFT_PRIVATE_KEY
  const publicKey = process.env.SWIFT_PUBLIC_KEY
  const appId = SWIFT_APP_ID

  if (!privateKey) throw new Error('Missing Swift private key')
  if (!publicKey) throw new Error('Missing Swift public key')

  const signature = await signMessage(privateKey, appId.toString())
  const notification = {
    title: 'New offer received',
    body: 'You have received a new offer from ' + truncateAddress(user),
  }

  await fetch(`${SWIFT_API}/notify/push`, {
    method: 'POST',
    body: JSON.stringify({
      address: peer,
      pubkey: publicKey,
      signature,
      notification,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
