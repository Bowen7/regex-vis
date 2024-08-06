import React, { useCallback, useEffect } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useFocus } from '@/utils/hooks'
import { cn } from '@/utils'
import { useLatest } from '@/utils/hooks/use-latest'

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (value: string) => void
}

const DEBOUNCE_DELAY = 300

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...rest }, ref) => {
    const latestOnChange = useLatest(onChange)

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      latestOnChange.current(e.target.value)
    }, [latestOnChange])

    const debouncedChange = useDebounceCallback(onInputChange, DEBOUNCE_DELAY)

    const { focused, focusProps } = useFocus({
      // flush debouncedChange on blur
      onBlur: debouncedChange.flush,
    })

    // flush debouncedChange on unmount
    useEffect(() => {
      return () => {
        debouncedChange.flush()
      }
    }, [debouncedChange])

    const props: React.ComponentProps<'input'> = {
      onChange: debouncedChange,
      ...focusProps,
      ...rest,
    }

    if (!focused) {
      props.value = value
    } else {
      props.defaultValue = value
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
