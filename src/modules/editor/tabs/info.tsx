import React, { useEffect, useState, useCallback } from "react"
import parser from "@parser"
import { Node } from "@types"
import GroupSelector from "../features/group"
import Cell from "@/components/cell"
import Quantifier from "../features/quantifier"
type Props = {
  nodes: Node[]
  onGroup: (type: string, name: string) => void
}
const InfoItem: React.FC<Props> = props => {
  const { nodes, onGroup } = props

  const [expression, setExpression] = useState<string>("")

  const updateExpression = useCallback(() => {
    if (nodes.length > 0) {
      const start = nodes[0]
      const end = nodes[nodes.length - 1]
      setExpression(parser.gen(start, end))
    } else {
      setExpression("")
    }
  }, [nodes])
  useEffect(() => {
    updateExpression()
  }, [updateExpression])
  function onApply(type: string, name: string) {
    onGroup && onGroup(type, name)
    updateExpression()
  }
  return (
    <>
      <Cell label="Expression:">
        <span className="expression">{expression}</span>
      </Cell>
      <Cell label="Group:">
        <GroupSelector nodes={nodes} />
      </Cell>
      <Cell label="Quantifier:">
        <Quantifier />
      </Cell>
      <style jsx>{`
        .expression {
          color: #50e3c2;
        }
      `}</style>
    </>
  )
}

export default InfoItem
