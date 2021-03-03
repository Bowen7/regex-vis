import React from "react"
import { Input as GeistInput } from "@geist-ui/react"
type Props = React.ComponentProps<typeof GeistInput>
const Input: React.FC<Props> = props => {
  const handleKeyDown = (e: React.KeyboardEvent) => e.stopPropagation()
  return <GeistInput onKeyDown={handleKeyDown} {...props} />
}
export default Input
