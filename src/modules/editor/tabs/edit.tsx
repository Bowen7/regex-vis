import React, { useEffect, useState, useCallback } from "react"
import { Node } from "@/types"
import { Divider, Button, ButtonGroup, Fieldset, Spacer } from "@geist-ui/react"
import Characters from "../features/characters"
import Group from "../features/group"
import Expression from "../features/expression"
import Quantifier from "../features/quantifier"
import { getInfoFromNodes, NodesInfo, genInitialNodesInfo } from "./helper"

export type InsertDirection = "prev" | "next" | "parallel"

type Props = {
  nodes: Node[]
  onGroup: (type: string, name: string) => void
  onInert: (direction: InsertDirection) => void
}
const InfoItem: React.FC<Props> = props => {
  const { nodes, onGroup, onInert } = props
  const oneNode = nodes.length === 1
  const charactersShow = oneNode && nodes[0].type === "single"
  const quantifierShow = oneNode

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const { expression, groupType, groupName } = nodesInfo

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    setNodesInfo(nodesInfo)
  }, [nodes])
  return (
    <>
      <div className="container">
        <Fieldset>
          <Fieldset.Title
            style={{
              paddingTop: "10pt",
              paddingBottom: "10pt",
              paddingLeft: "16pt",
            }}
          >
            Insert A Node
          </Fieldset.Title>
          <Divider y={0} />
          <Fieldset.Content>
            <ButtonGroup>
              <Button onClick={() => onInert("prev")}>Insert before</Button>
              <Button onClick={() => onInert("next")}>Insert after</Button>
              <Button onClick={() => onInert("parallel")}>
                Insert parallel
              </Button>
            </ButtonGroup>
          </Fieldset.Content>
        </Fieldset>
        <Spacer />
        <Fieldset>
          <Fieldset.Title
            style={{
              paddingTop: "10pt",
              paddingBottom: "10pt",
              paddingLeft: "16pt",
            }}
          >
            Edit Selected Nodes
          </Fieldset.Title>
          <Divider y={0} />
          <Fieldset.Content>
            <Expression expression={expression} />
            {charactersShow && <Characters />}
            <Group
              groupType={groupType}
              groupName={groupName}
              onGroupChange={onGroup}
            />
            {quantifierShow && <Quantifier />}
          </Fieldset.Content>
        </Fieldset>
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
