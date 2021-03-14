import React from "react"
import { Code } from "@geist-ui/react"
import { Range } from "@/types"
type Prop = {
  range: Range
}
const RangeOption: React.FC<Prop> = ({ range }) => {
  const { from, to } = range
  return (
    <span>
      {from === to ? (
        <Code>{from}</Code>
      ) : (
        <>
          <Code>{from}</Code> - <Code>{to}</Code>
        </>
      )}
    </span>
  )
}
export default RangeOption
