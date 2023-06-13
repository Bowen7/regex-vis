import React, { useEffect, useState } from "react"
import { useDebounce } from "react-use"

export const useDebounceInput = (
  value: string,
  onChange: (value: string) => void,
  ms = 300
) => {
  const [innerValue, setInnerValue] = useState(value)

  useDebounce(
    () => {
      onChange(innerValue)
    },
    ms,
    [innerValue]
  )

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setInnerValue(e.target.value)

  return { value: innerValue, onChange: handleChange }
}
