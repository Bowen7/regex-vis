import React, { useEffect, useState } from "react"
import { Divider, Button } from "@geist-ui/react"
import Characters from "../features/content"
import Group from "../features/group"
import Expression from "../features/expression"
import Quantifier from "../features/quantifier"
import { getInfoFromNodes, genInitialNodesInfo } from "./helper"
import { GroupKind, NodesInfo, Node } from "@/types"
import { getNodesByIds } from "@/parser/visit"
import { useMainReducer, MainActionTypes } from "@/redux"

export type InsertDirection = "prev" | "next" | "branch"

const InfoItem: React.FC<{}> = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [{ selectedIds, nodes: rootNodes }, dispatch] = useMainReducer()

  useEffect(() => setNodes(getNodesByIds(rootNodes, selectedIds)), [
    rootNodes,
    selectedIds,
  ])

  const oneNode = nodes.length === 1
  const quantifierShow = oneNode

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const { id, expression, group, character } = nodesInfo

  const handleInsert = (direction: InsertDirection) =>
    dispatch({ type: MainActionTypes.INSERT, payload: { direction } })
  const handleGroup = (groupType: string, groupName: string) =>
    dispatch({
      type: MainActionTypes.GROUP,
      payload: { groupType: groupType as GroupKind | "nonGroup", groupName },
    })

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    console.log(nodesInfo)
    setNodesInfo(nodesInfo)
  }, [nodes])
  return (
    <>
      <div className="container">
        <Button onClick={() => handleInsert("prev")}>Insert before</Button>
        <Button onClick={() => handleInsert("next")}>Insert after</Button>
        <Button onClick={() => handleInsert("branch")}>
          Insert as a branch
        </Button>
        <Divider />
        <Expression expression={expression} />
        {character && <Characters character={character} id={id} />}
        {group && <Group group={group} onGroupChange={handleGroup} />}
        {quantifierShow && <Quantifier />}
      </div>
      <style jsx>{`
        .container {
          padding: 12px;
        }
        .button {
          text-align: center;
        }

        .container :global(h3) {
          font-size: 1.15rem;
        }
      `}</style>
    </>
  )
}

export default InfoItem
