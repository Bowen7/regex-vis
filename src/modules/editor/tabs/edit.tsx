import React, { useEffect, useState, useCallback } from "react"
import parser from "@/parser"
import { Node } from "@/types"
import { Divider, Button, ButtonGroup } from "@geist-ui/react"
import Characters from "../features/characters"
import Group from "../features/group"
import Expression from "../features/expression"
import Quantifier from "../features/quantifier"
import { getInfoFromNodes, NodesInfo } from "./helper"

export type InsertDirection = "prev" | "next" | "parallel"

type Props = {
  nodes: Node[]
  onGroup: (type: string, name: string) => void
  onInert: (direction: InsertDirection) => void
}
const InfoItem: React.FC<Props> = props => {
  const { nodes, onGroup, onInert } = props

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>({
    expression: "",
    groupName: "",
    groupType: "",
  })

  const { expression, groupType, groupName } = nodesInfo as NodesInfo

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    setNodesInfo(nodesInfo)
  }, [nodes])
  return (
    <>
      <div className="container">
        <Divider align="start">Insert</Divider>
        <ButtonGroup>
          <Button onClick={() => onInert("prev")}>Insert before</Button>
          <Button onClick={() => onInert("next")}>Insert after</Button>
          <Button onClick={() => onInert("parallel")}>Insert parallel</Button>
        </ButtonGroup>
        <Divider align="start">Edit</Divider>
        <Expression expression={expression} />
        <Characters />
        <Group
          groupType={groupType}
          groupName={groupName}
          onGroupChange={onGroup}
        />
        <Quantifier />
      </div>
      <style jsx>{`
        .container {
          margin-top: 12px;
        }

        .button {
          text-align: center;
        }
      `}</style>
    </>
  )
}

export default InfoItem
