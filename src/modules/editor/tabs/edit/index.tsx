import React, { useEffect, useState, useMemo } from "react"
import { Divider, ButtonDropdown, useTheme } from "@geist-ui/react"
import Cell from "@/components/cell"
import ContentEditor from "../../features/content"
import Group from "../../features/group"
import Expression from "../../features/expression"
import Quantifier from "../../features/quantifier"
import { getInfoFromNodes, genInitialNodesInfo } from "../../utils"
import { AST } from "@/parser"
import { NodesInfo } from "../../types"
import { getNodesByIds } from "@/parser/visit"
import { useMainReducer, MainActionTypes } from "@/redux"

export type InsertDirection = "prev" | "next" | "branch"

const InfoItem: React.FC<{}> = () => {
  const { layout, palette } = useTheme()

  const [nodes, setNodes] = useState<AST.Node[]>([])
  const [{ selectedIds, ast }, dispatch] = useMainReducer()

  useEffect(() => setNodes(getNodesByIds(ast, selectedIds)), [ast, selectedIds])

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const { id, expression, group, content, hasQuantifier, quantifier } =
    nodesInfo

  const handleInsert = (direction: InsertDirection) =>
    dispatch({ type: MainActionTypes.INSERT, payload: { direction } })
  const handleGroup = (groupType: string, groupName: string) =>
    dispatch({
      type: MainActionTypes.UPDATE_GROUP,
      payload: {
        groupType: groupType as AST.GroupKind | "nonGroup",
        groupName,
      },
    })

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    setNodesInfo(nodesInfo)
  }, [nodes])

  const insertOptions = useMemo(() => {
    const options: { direction: InsertDirection; desc: string }[] = []
    const { body } = ast
    if (nodes.length === 0) {
      return []
    }
    if (body[body.length - 1].id !== nodes[nodes.length - 1].id) {
      options.push({
        direction: "next",
        desc: "Insert after",
      })
    }
    if (body[0].id !== nodes[0].id) {
      options.push({
        direction: "prev",
        desc: "Insert before",
      })
    }
    options.push({
      direction: "branch",
      desc: "Insert as a branch",
    })
    return options
  }, [ast, nodes])
  return (
    <>
      <div className="container">
        <Cell label="Insert a empty node">
          <ButtonDropdown size="small">
            {insertOptions.map(({ direction, desc }, index) => (
              <ButtonDropdown.Item
                main={index === 0}
                key={direction}
                onClick={() => handleInsert(direction)}
              >
                {desc}
              </ButtonDropdown.Item>
            ))}
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
        {content && <ContentEditor content={content} id={id} />}
        {group && <Group group={group} onGroupChange={handleGroup} />}
        {hasQuantifier && <Quantifier quantifier={quantifier} />}
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

        .container :global(input) {
          font-size: 0.75rem;
        }
        .container :global(button) {
          font-size: 0.75rem;
          color: ${palette.foreground};
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
