import React from "react"
import { Node } from "@/types"
import {
  NODE_PADDING_HORIZONTAL,
  NODE_MARGIN_VERTICAL,
  TEXT_PADDING_VERTICAL,
} from "@/constants/graph"
const FONT = 16
type TextProps = {
  node: Node
  x: number
  y: number
}

const NodeText: React.FC<TextProps> = React.memo(({ x, y, node }) => {
  if (!("texts" in node)) {
    return null
  }
  const texts = node.texts
  return (
    <>
      {texts.map((text, index) => (
        <text
          x={x}
          y={y}
          fontSize={FONT}
          dy={
            FONT * (index + 1) +
            NODE_MARGIN_VERTICAL / 2 +
            index * TEXT_PADDING_VERTICAL
          }
          dx={NODE_PADDING_HORIZONTAL}
          className="text"
          key={index}
        >
          <tspan className="quote">`</tspan>
          <tspan>{text}</tspan>
          <tspan className="quote">`</tspan>
        </text>
      ))}
    </>
  )
})

export default NodeText
