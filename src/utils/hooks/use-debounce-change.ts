import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

export function useDebounceChange(debounced: boolean, value: string, onChange: (value: string) => void) {
  const [innerValue, setInnerValue] = useState(value)

  const debouncedOnChange = useDebounceCallback(onChange, 300)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value
    if (debounced) {
      setInnerValue(value)
      debouncedOnChange(value)
    } else {
      onChange(value)
    }
  }
  return {
    value: debounced ? innerValue : value,
    onChange: handleChange,
  }
}
