import { memo, useCallback, useState } from 'react'
import type { ZodAny } from 'zod'

interface Props<T> {
  children: (value: T, onChange: (value: T) => void) => React.ReactNode
  value: T
  onChange: (value: T) => void
  validator: ZodAny
}

export const Validation = memo(<T>(props: Props<T>) => {
  const {
    children,
    value,
    onChange,
    validator,
  } = props
  const [innerValue, setInnerValue] = useState(value)

  const onValueChange = useCallback((value: T) => {
    setInnerValue(value)
    const result = validator.safeParse(value)
    if (result.success) {
      onChange(value)
    } else {
      console.error(result.error)
    }
  }, [setInnerValue, onChange, validator])

  return children(innerValue, onValueChange)
})
