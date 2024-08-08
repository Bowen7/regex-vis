import React, { useCallback, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useFocus } from '@/utils/hooks'
import { cn } from '@/utils'
import { useLatest } from '@/utils/hooks/use-latest'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (value: string) => void
}

const DEBOUNCE_DELAY = 500

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...rest }, ref) => {
    const [text, setText] = useState(value)
    const latestOnChange = useLatest(onChange)

    const onTextChange = useCallback((text: string) => {
      latestOnChange.current(text)
    }, [latestOnChange])

    const debouncedOnTextChange = useDebounceCallback(onTextChange, DEBOUNCE_DELAY)

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value
      setText(text)
      debouncedOnTextChange(text)
    }, [debouncedOnTextChange])

    const { focused, focusProps } = useFocus({
      onFocus: () => setText(value),
      // flush debouncedChange on blur
      onBlur: debouncedOnTextChange.flush,
    })

    // flush debouncedChange on unmount
    useEffect(() => {
      return () => {
        debouncedOnTextChange.flush()
      }
    }, [debouncedOnTextChange])

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={focused ? text : value}
        ref={ref}
        onChange={onInputChange}
        {...focusProps}
        {...rest}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
