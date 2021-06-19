import React from "react"
import { Node } from "@/types"
const FONT = 16
type Center = {
  x: number
  y: number
}
type TextProps = {
  center: Center
  selected: boolean
  node: Node
}

const NodeText: React.FC<TextProps> = React.memo(
  ({ center, node, selected }) => {
    const { val } = node
    if (!("text" in node || val?.text)) {
      return null
    }
    const className = selected ? "selected-text" : "text"
    const text = "text" in node ? node.text : val.text
    return (
      <text
        x={center.x}
        y={center.y}
        fontSize={FONT}
        dy={FONT * 0.35}
        className={className}
        textAnchor="middle"
      >
        {text}
      </text>
    )
  }
)

export default NodeText
