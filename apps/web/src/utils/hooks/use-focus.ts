import { useState } from "react"

export const useFocus = () => {
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)
  return { focused, bindings: { onFocus, onBlur } }
}
