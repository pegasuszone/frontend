import clsx from 'clsx'

export default function Spinner({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      className={clsx('w-12 h-12 animate-spin', className)}
    />
  )
}
