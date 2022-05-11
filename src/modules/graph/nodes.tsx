import React, { useMemo, useState, useEffect } from "react"
import { useImmer } from "use-immer"
import * as AST from "@/parser/ast"
import ChoiceNode from "./choice"
type Props = {
  x: number
  y: number
  nodes: AST.Node[]
  onLayout: (width: number, height: number) => void
}

const Nodes: React.FC<Props> = ({ x, y, nodes }) => {
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

  const handleNodeLayout = (id: string, width: number, height: number) => {
    if (width === 0 && height === 0) {
      setLayoutMap((draft) => draft.delete(id))
    } else {
      setLayoutMap((draft) => draft.set(id, [width, height]))
    }
  }
  return (
    <>
      {nodes.map((node) => {
        switch (node.type) {
          case "choice":
            break
          default:
            break
        }
      })}
    </>
  )
}
export default Nodes
