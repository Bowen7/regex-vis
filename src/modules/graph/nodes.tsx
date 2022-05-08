import React, { useMemo, useState } from "react"
import { useImmer } from "use-immer"
import * as AST from "@/parser/ast"
import Node from "./node-new"
type Props = {
  x: number
  y: number
  nodes: AST.Node[]
}

const Nodes: React.FC<Props> = ({ x, y, nodes }) => {
  const [width, setWidth] = useState(0)
  const [heightMap, setHeightMap] = useImmer(() => new Map<string, number>())
  const height = useMemo(
    () => Math.max(...Array.from(heightMap.values()), 0),
    [heightMap]
  )

  const handleNodeLayout = (
    id: string,
    widthDelta: number,
    heightDelta: number
  ) => {
    setWidth(width + widthDelta)
    const nextHeight = (heightMap.get(id) || 0) + heightDelta
    if (nextHeight === 0) {
      setHeightMap((draft) => draft.delete(id))
    } else {
      setHeightMap((draft) => draft.set(id, nextHeight))
    }
  }
  return (
    <>
      {nodes.map((node) => (
        <Node x={x} y={y} node={node} key={node.id} />
      ))}
    </>
  )
}
export default Nodes
