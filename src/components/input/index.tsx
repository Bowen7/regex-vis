import React from "react"
import { Input as _Input } from "@geist-ui/react"
type Props = React.ComponentProps<typeof _Input>
const Input: React.FC<Props> = (props) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const metaKey = e.ctrlKey || e.metaKey
    if (metaKey && e.key === "z") {
      e.preventDefault()
      return
    }
    e.stopPropagation()
  }
  return <Input onKeyDown={handleKeyDown} {...props} />
}

export default Input
