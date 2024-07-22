import React from 'react'
import { useDebounceChange } from '@/utils/hooks/use-debounce-change'

import { cn } from '@/utils'

export type TextareaProps =
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
    debounced?: boolean
    onChange: (value: string) => void
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, debounced = true, onChange, ...props }, ref) => {
    const debouncedProps = useDebounceChange(debounced, value as string, onChange)
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...debouncedProps}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
