import React from "react"
import { Note, Spacer, useToasts } from "@geist-ui/react"
import Input from "@/components/input"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import { dispatchUpdateContent } from "@/atom"

type Props = {
  value: string
  quantifier: AST.Quantifier | null
}
const SimpleString: React.FC<Props> = ({ value, quantifier }) => {
  const [, setToast] = useToasts()

  const handleChange = (value: string) => {
    if (value.length > 1 && quantifier) {
      setToast({ text: "Group selection automatically" })
    }
    dispatchUpdateContent({
      kind: "string",
      value,
    })
  }

  return (
    <Cell.Item label="Value">
      <Note type="secondary" small style={{ lineHeight: 1.5 }}>
        The input will be escaped automatically.
      </Note>
      <Spacer y={0.5} />
      <Input size="small" value={value} onChange={handleChange} />
    </Cell.Item>
  )
}

export default SimpleString
