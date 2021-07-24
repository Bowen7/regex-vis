import React, { useState, useEffect } from "react"
import { Input as GeistInput, useTheme } from "@geist-ui/react"
type Props = React.ComponentProps<typeof GeistInput> & {
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
  const [innerValue, setInnerValue] = useState(value)

  const { palette } = useTheme()

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const metaKey = e.ctrlKey || e.metaKey
    if (metaKey && e.key === "z") {
      e.preventDefault()
      return
    }
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
    onChange && onChange(e)
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
