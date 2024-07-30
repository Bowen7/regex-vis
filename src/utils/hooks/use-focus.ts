import { useState } from 'react'

export function useFocus() {
  const [focused, setFocused] = useState(false)
  return {
    focusProps: {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
    focused,
  }
}
