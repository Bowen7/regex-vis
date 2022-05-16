import React, { useState, useEffect, useMemo, useCallback } from "react"
import { AST } from "@/parser"
import Nodes from "./nodes"
type Props = {
  x: number
  y: number
  node: AST.GroupNode | AST.LookAroundAssertionNode
  onLayout: (id: string, width: number, height: number) => void
}
const GroupLikeNode: React.FC<Props> = React.memo(
  ({ x, y, node, onLayout }) => {
    const [layout, setLayout] = useState<[number, number]>([0, 0])

    useEffect(() => {
      onLayout(node.id, ...layout)
      return () => onLayout(node.id, 0, 0)
    }, [node.id, layout, onLayout])

    const { children } = node

    const handleNodesLayout = useCallback(
      (index: number, width: number, height: number) => {
        setLayout([width, height])
      },
      [setLayout]
    )
    return (
      <>
        <Nodes
          index={0}
          x={x}
          y={y}
          nodes={children}
          onLayout={handleNodesLayout}
        ></Nodes>
      </>
    )
  }
)
export default GroupLikeNode
