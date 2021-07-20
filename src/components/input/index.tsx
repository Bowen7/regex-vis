import React, { useState } from "react"
import { Input as GeistInput } from "@geist-ui/react"
type Props = React.ComponentProps<typeof GeistInput> & {
  validation?: RegExp
  errMsg?: string
}

const Input: React.FC<Props> = (props) => {
  const { onChange, validation, errMsg = "Invalid input", ...restProps } = props
  const [invalid, setInvalid] = useState(false)
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
      {invalid && <p>{errMsg}</p>}
      <GeistInput
        onKeyDown={handleKeyDown}
        {...restProps}
        onChange={handleChange}
      />
    </>
  )
}

export default Input
