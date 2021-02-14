import React, { useEffect, useState, useContext } from "react"
import { Divider, Button, ButtonGroup, Fieldset, Spacer } from "@geist-ui/react"
import Characters from "../features/characters"
import Group from "../features/group"
import Expression from "../features/expression"
import Quantifier from "../features/quantifier"
import { getInfoFromNodes, NodesInfo, genInitialNodesInfo } from "./helper"
import { GroupKind } from "@/types"
import { ActionTypes } from "@/reducers/vis"
import VisContext from "../../context"

export type InsertDirection = "prev" | "next" | "branch"

const InfoItem: React.FC<{}> = () => {
  const {
    state: { selectedNodes: nodes },
    dispatch,
  } = useContext(VisContext)

  const oneNode = nodes.length === 1
  const charactersShow = oneNode && nodes[0].type === "single"
  const quantifierShow = oneNode

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const { expression, groupType, groupName } = nodesInfo

  const handleInsert = (direction: InsertDirection) =>
    dispatch({ type: ActionTypes.INSERT, payload: { direction } })
  const handleGroup = (groupType: string, groupName: string) =>
    dispatch({
      type: ActionTypes.GROUP,
      payload: { groupType: groupType as GroupKind | "nonGroup", groupName },
    })

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
              <Button onClick={() => handleInsert("prev")}>
                Insert before
              </Button>
              <Button onClick={() => handleInsert("next")}>Insert after</Button>
              <Button onClick={() => handleInsert("branch")}>
                Insert as a branch
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
              onGroupChange={handleGroup}
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
