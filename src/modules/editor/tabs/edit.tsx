import React, { useEffect, useState, useCallback } from "react"
import parser from "@/parser"
import { Node } from "@/types"
import { Divider, Button, ButtonGroup } from "@geist-ui/react"
import Group from "../features/group"
import Expression from "../features/expression"
import Quantifier from "../features/quantifier"

export type InsertDirection = "prev" | "next" | "parallel"

type Props = {
  nodes: Node[]
  onGroup: (type: string, name: string) => void
  onInert: (direction: InsertDirection) => void
}
const InfoItem: React.FC<Props> = props => {
  const { nodes, onGroup, onInert } = props

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
      <div className="container">
        <Divider align="start">Insert</Divider>
        <ButtonGroup size="small">
          <Button onClick={() => onInert("prev")}>Insert before</Button>
          <Button onClick={() => onInert("next")}>Insert after</Button>
          <Button onClick={() => onInert("parallel")}>Insert parallel</Button>
        </ButtonGroup>
        <Divider align="start">Edit</Divider>
        <Expression expression={expression} />
        <Group nodes={nodes} />
        <Quantifier />
      </div>
      <style jsx>{`
        .container {
          margin-top: 12px;
        }
      `}</style>
    </>
  )
}

export default InfoItem
