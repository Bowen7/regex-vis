import React, { useEffect, useState } from "react"
import parser from "@parser"
import { Node } from "@types"
type Props = {
  nodes: Node[]
}
const InfoItem: React.FC<Props> = props => {
  const { nodes } = props

  const [expression, setExpression] = useState<string>("")

  useEffect(() => {
    if (nodes.length > 0) {
      const start = nodes[0]
      const end = nodes[nodes.length - 1]
      setExpression(parser.gen(start, end))
    }
  }, [nodes])
  return (
    <>
      <p>Selected expression: </p>
      <p>{expression}</p>
    </>
  )
}

export default InfoItem
