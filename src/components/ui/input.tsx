import React from 'react'
import { useDebounceChange } from '@/utils/hooks/use-debounce-change'

import { cn } from '@/utils'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  debounced?: boolean
  onChange: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, debounced = true, ...props }, ref) => {
    const debouncedProps = useDebounceChange(debounced, value as string, onChange)

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...debouncedProps}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
