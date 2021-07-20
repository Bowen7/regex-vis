import React from "react"
import { AST } from "@/parser"
import { getName } from "./utils"
type Center = {
  x: number
  y: number
}
type NameProps = {
  center: Center
  node: AST.Node
  y: number
}

const NodeName: React.FC<NameProps> = React.memo(({ center, node, y }) => {
  const name = getName(node)
  if (name) {
    return (
      <text
        x={center.x}
        y={y}
        fontSize={12}
        textAnchor="middle"
        dy={-0.5 * 12}
        className="text"
      >
        {name}
      </text>
    )
  } else {
    return null
  }
})

export default NodeName
