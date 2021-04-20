import React from "react"
import { Input as GeistInput } from "@geist-ui/react"
type Props = React.ComponentProps<typeof GeistInput>
const Input: React.FC<Props> = (props) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const metaKey = e.ctrlKey || e.metaKey
    if (metaKey && e.key === "z") {
      e.preventDefault()
      return
    }
    e.stopPropagation()
  }
  return <GeistInput onKeyDown={handleKeyDown} {...props} />
}

export default Input
