import React from "react"
import { Checkbox } from "@geist-ui/core"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import { dispatchUpdateContent } from "@/atom"

type Props = {
  negate: boolean
}
const SimpleString: React.FC<Props> = ({ negate }) => {
  const handleChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    dispatchUpdateContent({
      kind: "wordBoundaryAssertion",
      negate,
    })
  }

  return (
    <Cell.Item label="Negate">
      <Checkbox checked={negate} onChange={handleChange}>
        negate
      </Checkbox>
    </Cell.Item>
  )
}

export default SimpleString
