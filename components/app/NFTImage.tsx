import GET_TOKEN from '@/graphql/token'
import { useQuery } from '@apollo/client'
import Spinner from './Spinner'

export default function NFTImage({
  collectionAddress,
  tokenId,
}: {
  collectionAddress: string
  tokenId: string
}) {
  const { data: token } = useQuery(GET_TOKEN, {
    variables: { collectionAddr: collectionAddress, tokenId },
  })

  return token ? (
    <img
      src={token?.token?.media?.visualAssets?.lg?.url!}
      className="w-24 h-24 aspect-square object-cover rounded-lg"
      data-tip={`${token?.token?.name}`}
    />
  ) : (
    <div className="w-24 h-24 aspect-square rounded-lg bg-zinc-950/25 dark:bg-white/25 flex justify-center items-center">
      <Spinner className="w-8 h-8" />
    </div>
  )
}
