import React, { useCallback } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useLatest } from '@/utils/hooks/use-latest'

import { cn } from '@/utils'

const DEBOUNCE_DELAY = 500

export type TextareaProps =
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> & {
    onChange: (value: string) => void
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const latestOnChange = useLatest(onChange)

    const onTextChange = useCallback((text: string) => {
      latestOnChange.current(text)
    }, [latestOnChange])

    const debouncedOnTextChange = useDebounceCallback(onTextChange, DEBOUNCE_DELAY)

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      debouncedOnTextChange(e.target.value)
    }, [debouncedOnTextChange])

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        onChange={onInputChange}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
