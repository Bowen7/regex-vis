import React, { useEffect, useState } from "react"
import { Divider, ButtonDropdown, useTheme } from "@geist-ui/react"
import Cell from "@/components/cell"
import Characters from "../../features/content"
import Group from "../../features/group"
import Expression from "../../features/expression"
import Quantifier from "../../features/quantifier"
import { getInfoFromNodes, genInitialNodesInfo } from "./helper"
import { GroupKind, NodesInfo, Node } from "@/types"
import { getNodesByIds } from "@/parser/visit"
import { useMainReducer, MainActionTypes } from "@/redux"

export type InsertDirection = "prev" | "next" | "branch"

const InfoItem: React.FC<{}> = () => {
  const { layout } = useTheme()

  const [nodes, setNodes] = useState<Node[]>([])
  const [{ selectedIds, nodes: rootNodes }, dispatch] = useMainReducer()

  useEffect(
    () => setNodes(getNodesByIds(rootNodes, selectedIds)),
    [rootNodes, selectedIds]
  )

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const { id, expression, group, character, quantifier } = nodesInfo

  const handleInsert = (direction: InsertDirection) =>
    dispatch({ type: MainActionTypes.INSERT, payload: { direction } })
  const handleGroup = (groupType: string, groupName: string) =>
    dispatch({
      type: MainActionTypes.UPDATE_GROUP,
      payload: { groupType: groupType as GroupKind | "nonGroup", groupName },
    })

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    setNodesInfo(nodesInfo)
  }, [nodes])
  return (
    <>
      <div className="container">
        <Cell label="Insert a empty node">
          <ButtonDropdown size="small">
            <ButtonDropdown.Item main onClick={() => handleInsert("next")}>
              Insert after
            </ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={() => handleInsert("prev")}>
              Insert before
            </ButtonDropdown.Item>
            <ButtonDropdown.Item onClick={() => handleInsert("branch")}>
              Insert as a branch
            </ButtonDropdown.Item>
          </ButtonDropdown>
        </Cell>
        {/* <Cell label="Wrap with a group">
          <ButtonDropdown size="small">
            <ButtonDropdown.Item
              main
              onClick={() => handleGroup("capturing", "")}
            >
              Capturing group
            </ButtonDropdown.Item>
            <ButtonDropdown.Item
              onClick={() => handleGroup("nonCapturing", "")}
            >
              Non-capturing group
            </ButtonDropdown.Item>
            <ButtonDropdown.Item
              onClick={() => handleGroup("namedCapturing", "")}
            >
              Named-capturing group
            </ButtonDropdown.Item>
          </ButtonDropdown>
        </Cell> */}
        <Divider />
        <Expression expression={expression} />
        {character && <Characters character={character} id={id} />}
        {group && <Group group={group} onGroupChange={handleGroup} />}
        {quantifier !== undefined && <Quantifier quantifier={quantifier} />}
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

        .container :global(.btn-dropdown button) {
          height: calc(1.687 * 16pt);
        }

        .container :global(details) {
          border-radius: 0 ${layout.radius} ${layout.radius} 0;
        }

        .container :global(summary) {
          height: calc(1.687 * 16pt);
        }
      `}</style>
    </>
  )
}

export default InfoItem
