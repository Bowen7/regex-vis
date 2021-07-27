import React, { useEffect, useState } from "react"
import { Divider, useTheme } from "@geist-ui/react"
import ContentEditor from "../../features/content"
import Group from "../../features/group"
import Expression from "../../features/expression"
import Quantifier from "../../features/quantifier"
import LookAround from "../../features/look-around"
import Insert from "../../features/insert"
import { getInfoFromNodes, genInitialNodesInfo } from "../../utils"
import { AST } from "@/parser"
import { NodesInfo } from "../../types"
import { getNodesByIds } from "@/parser/visit"
import { useMainReducer } from "@/redux"

const InfoItem: React.FC<{}> = () => {
  const { layout } = useTheme()

  const [nodes, setNodes] = useState<AST.Node[]>([])
  const [{ selectedIds, ast }] = useMainReducer()

  useEffect(() => setNodes(getNodesByIds(ast, selectedIds)), [ast, selectedIds])

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const {
    id,
    expression,
    group,
    content,
    hasQuantifier,
    quantifier,
    lookAround,
  } = nodesInfo

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(nodes)
    setNodesInfo(nodesInfo)
  }, [nodes])

  return (
    <>
      <div className="container">
        <Insert ast={ast} nodes={nodes} />
        <Divider />
        <Expression expression={expression} />
        {content && <ContentEditor content={content} id={id} />}
        {group && <Group group={group} />}
        {hasQuantifier && <Quantifier quantifier={quantifier} />}
        {lookAround && (
          <LookAround kind={lookAround.kind} negate={lookAround.negate} />
        )}
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

        .container :global(.btn-group) {
          margin: 0;
        }
        .container :global(.btn-group .btn) {
          width: 80px;
          padding: 0;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        .container :global(.btn-group .tooltip) {
          display: inline-flex;
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
