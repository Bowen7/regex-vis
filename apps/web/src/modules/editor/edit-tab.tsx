import React, { useEffect, useState } from "react"
import { Divider, useTheme } from "@geist-ui/core"
import { useAtomValue } from "jotai"
import ContentEditor from "./features/content"
import Group from "./features/group"
import Expression from "./features/expression"
import Quantifier from "./features/quantifier"
import LookAround from "./features/look-around"
import Insert from "./features/insert"
import { getInfoFromNodes, genInitialNodesInfo } from "./utils"
import { AST } from "@/parser"
import { NodesInfo } from "./utils"
import { getNodesByIds } from "@/parser/visit"
import { astAtom, selectedIdsAtom } from "@/atom"

const InfoItem = () => {
  const { layout } = useTheme()

  const [nodes, setNodes] = useState<AST.Node[]>([])
  const selectedIds = useAtomValue(selectedIdsAtom)
  const ast = useAtomValue(astAtom)

  useEffect(() => {
    if (selectedIds.length === 0) {
      return setNodes([])
    }
    setNodes(getNodesByIds(ast, selectedIds).nodes)
  }, [ast, selectedIds])

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const {
    id,
    regex,
    startIndex,
    endIndex,
    group,
    content,
    hasQuantifier,
    quantifier,
    lookAround,
  } = nodesInfo

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(ast, nodes)
    setNodesInfo(nodesInfo)
  }, [ast, nodes])

  return (
    <>
      <div className="container" data-testid="edit-tab">
        <Insert nodes={nodes} />
        <Divider mt="24px" />
        <Expression regex={regex} startIndex={startIndex} endIndex={endIndex} />
        {content && (
          <ContentEditor content={content} id={id} quantifier={quantifier} />
        )}
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
          line-height: 0;
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
