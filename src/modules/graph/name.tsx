import React from "react"
import { Node } from "@/types"
type Center = {
  x: number
  y: number
}
type NameProps = {
  center: Center
  node: Node
  y: number
}

const NodeName: React.FC<NameProps> = React.memo(({ center, node, y }) => {
  const { val } = node
  if ("name" in node || val?.name) {
    const name = "name" in node ? node.name : val.name
    const { namePrefix = "" } = val
    return (
      <text
        x={center.x}
        y={y}
        fontSize={12}
        textAnchor="middle"
        dy={-0.5 * 12}
        className="text"
      >
        {namePrefix + name}
      </text>
    )
  } else {
    return null
  }
})

export default NodeName
