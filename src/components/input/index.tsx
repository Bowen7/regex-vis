import React, { useState } from "react"
import { Input as GeistInput, useTheme } from "@geist-ui/core"
import { withDebounce } from "@/utils/hocs"
const DebouncedInput = withDebounce<
  HTMLInputElement,
  React.ComponentProps<typeof GeistInput>
>(GeistInput, 500)

type Props = Omit<
  React.ComponentProps<typeof DebouncedInput>,
  "enterKeyHint"
> & {
  validation?: RegExp
  errMsg?: string
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

  return (
    <>
      {invalid && <p className="error-msg">{errMsg}</p>}
      <DebouncedInput
        onKeyDown={handleKeyDown}
        {...restProps}
        value={value}
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
