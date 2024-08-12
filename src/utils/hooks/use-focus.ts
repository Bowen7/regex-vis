import { type FocusEvent, useState } from 'react'

type FocusOptions = {
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
}
export function useFocus(options: FocusOptions = {}) {
  const { onFocus, onBlur } = options
  const [focused, setFocused] = useState(false)

  return {
    focusProps: {
      onFocus: (e: FocusEvent) => {
        setFocused(true)
        onFocus?.(e)
      },
      onBlur: (e: FocusEvent) => {
        setFocused(false)
        onBlur?.(e)
      },
    },
    focused,
  }
}
