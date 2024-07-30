import type { ComponentProps } from 'react'
import clsx from 'clsx'

type Props = ComponentProps<'div'> & {
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}
export function ButtonGroup(props: Props) {
  const { className, variant, ...rest } = props
  return (
    <div
      {...rest}
      className={clsx('flex items-center [&>button]:rounded-none [&>button]:font-normal [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md', {
        '[&>*:not(:last-child)]:border-r-0': variant === 'outline',
      }, className)}
    />
  )
}
