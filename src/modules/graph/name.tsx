import React from "react"
import { Node } from "@/types"
const FONT = 16
type Center = {
  x: number
  y: number
}
type NameProps = {
  center: Center
  selected: boolean
  node: Node
  y: number
}

const NodeName: React.FC<NameProps> = React.memo(
  ({ center, node, selected, y }) => {
    const { val } = node
    if ("name" in node || val?.name) {
      const className = selected ? "selected-text" : "text"
      const name = "name" in node ? node.name : val.name
      const { namePrefix = "" } = val
      return (
        <text
          x={center.x}
          y={y}
          fontSize={12}
          textAnchor="middle"
          dy={-0.5 * 12}
          className={className}
        >
          {namePrefix + name}
        </text>
      )
    } else {
      return null
    }
  }
)

export default NodeName
