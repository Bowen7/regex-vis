import React from "react"
import { Node } from "@/types"
const FONT = 16
type Center = {
  x: number
  y: number
}
type TextProps = {
  center: Center
  node: Node
}

const NodeText: React.FC<TextProps> = React.memo(({ center, node }) => {
  const { val } = node
  if (!("text" in node || val?.text)) {
    return null
  }
  const text = "text" in node ? node.text : val.text
  return (
    <text
      x={center.x}
      y={center.y}
      fontSize={FONT}
      dy={FONT * 0.35}
      className="text"
      textAnchor="middle"
    >
      {text}
    </text>
  )
})

export default NodeText
