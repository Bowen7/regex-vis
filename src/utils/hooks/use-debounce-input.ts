import React, { useState, useCallback } from "react"
import debounce from "lodash/debounce"
function useDebounceInput(
  handler: (value: string) => void,
  deps: React.DependencyList
): [
  React.Dispatch<React.SetStateAction<string>>,
  { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void },
  () => void
] {
  const [value, setValue] = useState("")
  const debouncedHandler = useCallback(
    debounce((value: string) => {
      handler(value)
    }, 500),
    deps
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    debouncedHandler(value)
  }
  return [
    setValue,
    {
      value,
      onChange,
    },
    debouncedHandler.cancel,
  ]
}
export default useDebounceInput
