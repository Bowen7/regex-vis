import React, { useState, useEffect, useCallback } from "react"
import { Input as GeistInput, useTheme } from "@geist-ui/react"
import debounce from "lodash/debounce"
type Props = Omit<React.ComponentProps<typeof GeistInput>, "onChange"> & {
  validation?: RegExp
  errMsg?: string
  onChange: (value: string) => void
}

const Input: React.FC<Props> = (props) => {
  const {
    onChange,
    validation,
    errMsg = "Invalid input",
    value,
    ...restProps
  } = props
  const [invalid, setInvalid] = useState(false)
  const [innerValue, setInnerValue] = useState(value)

  const { palette } = useTheme()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHelper = useCallback(
    debounce(
      (caller: (value: string) => void, value: string) =>
        caller.call(null, value),
      500
    ),
    []
  )

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInnerValue(value)

    if (validation) {
      if (!validation.test(value)) {
        setInvalid(true)
        return
      }
    }
    if (invalid) {
      setInvalid(false)
    }
    onChange && debouncedHelper(onChange, value)
  }

  return (
    <>
      {invalid && <p className="error-msg">{errMsg}</p>}
      <GeistInput
        onKeyDown={handleKeyDown}
        {...restProps}
        value={innerValue}
        onChange={handleChange}
      />
      <style jsx>{`
        .error-msg {
          margin: 0;
          color: ${palette.error};
        }
      `}</style>
    </>
  )
}

export default Input
