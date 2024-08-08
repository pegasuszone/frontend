import { ProfileWalletQuery } from '@/__generated__/graphql'
import { truncateAddress } from '@/utils/format'
import { UserIcon } from '@heroicons/react/20/solid'
import { Heading } from '../catalyst/heading'

export default function Profile({ profile }: { profile: ProfileWalletQuery }) {
  return (
    <div className="flex flex-row space-x-6 items-center">
      {profile.wallet?.name ? (
        <img
          src={profile.wallet?.name?.media?.visualAssets?.lg?.url as string}
          alt={profile?.wallet?.name?.name}
          className="w-16 h-16 rounded-md"
        />
      ) : (
        <div className="bg-zinc-950/10 dark:bg-white/10 flex items-center justify-center w-16 h-16 rounded-md">
          <UserIcon className="text-zinc-950/50 dark:text-white/50 w-6 h-6" />
        </div>
      )}
      <div className="flex flex-row space-x-3 items-center">
        <Heading>
          {profile.wallet?.name
            ? profile.wallet.name.name
            : truncateAddress(profile.wallet?.address || '')}
        </Heading>
        {profile.wallet?.name && (
          <img
            src="https://www.stargaze.zone/favicon.ico"
            className="w-5 h-5"
          />
        )}
      </div>
    </div>
  )
}
