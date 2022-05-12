import React, { useMemo, useState, useEffect, useCallback } from "react"
import { useImmer } from "use-immer"
import * as AST from "@/parser/ast"
import ChoiceNode from "./choice"
type Props = {
  index: number
  x: number
  y: number
  nodes: AST.Node[]
  onLayout: (index: number, width: number, height: number) => void
}

const Nodes: React.FC<Props> = ({ index, x, y, nodes, onLayout }) => {
  const [layoutMap, setLayoutMap] = useImmer(
    () => new Map<string, [number, number]>()
  )
  const [width, height] = useMemo(() => {
    const layouts = Array.from(layoutMap.values())
    return layouts.reduce(
      ([width, height], [nodeWidth, nodeHeight]) => [
        width + nodeWidth,
        Math.max(height, nodeHeight),
      ],
      [0, 0]
    )
  }, [layoutMap])

  useEffect(() => {
    onLayout(index, width, height)
  }, [index, width, height, onLayout])

  const handleNodeLayout = useCallback(
    (id: string, width: number, height: number) => {
      if (width === 0 && height === 0) {
        setLayoutMap((draft) => draft.delete(id))
      } else {
        setLayoutMap((draft) => draft.set(id, [width, height]))
      }
    },
    [setLayoutMap]
  )
  return (
    <>
      {nodes.map((node) => {
        switch (node.type) {
          case "choice":
            return (
              <ChoiceNode x={0} y={0} node={node} onLayout={handleNodeLayout} />
            )
          default:
            break
        }
      })}
    </>
  )
}
export default Nodes
