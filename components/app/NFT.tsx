import { Token } from '@/__generated__/graphql'
import clsx from 'clsx'
import { TableCell, TableRow } from '../catalyst/table'
import { Text } from '../catalyst/text'

export default function NFT({
  token,
  onClick,
  selected,
}: {
  token: Token
  onClick: (token: Token) => void
  selected: boolean
}) {
  return (
    <TableRow
      onClick={() => onClick(token)}
      className={clsx(
        selected
          ? '!bg-zinc-950/25 dark:!bg-white/25'
          : 'hover:!bg-zinc-950/10 dark:hover:!bg-white/10',
        'cursor-pointer hover:shadow-sm'
      )}
    >
      <TableCell className="flex flex-row items-center space-x-4 !pl-4">
        <img
          src={token.media?.visualAssets?.lg?.staticUrl || ''}
          alt={token.name || ''}
          className="rounded-md w-10 h-10"
        />
        <Text className="text-base font-semibold !text-black dark:!text-white">
          #{token.tokenId}
        </Text>
      </TableCell>
      <TableCell className="text-black/50 dark:text-white/50">
        {token.collection.name}
      </TableCell>
    </TableRow>
  )
}
