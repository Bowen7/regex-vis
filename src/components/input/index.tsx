import React, { useState } from "react"
import { Input as GeistInput, useTheme } from "@geist-ui/core"
import { useDebounceInput } from "@/utils/hooks"
import { REGEX_FONT_FAMILY } from "@/constants"

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

  const { palette } = useTheme()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleChange = (value: string) => {
    if (validation && !validation.test(value)) {
      setInvalid(true)
      return
    }
    if (invalid) {
      setInvalid(false)
    }
    onChange(value)
  }

  const debouncedBindings = useDebounceInput(value as string, handleChange)

  return (
    <>
      {invalid && <p className="error-msg">{errMsg}</p>}
      <GeistInput
        onKeyDown={handleKeyDown}
        {...restProps}
        {...debouncedBindings}
        style={{ fontFamily: REGEX_FONT_FAMILY }}
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
