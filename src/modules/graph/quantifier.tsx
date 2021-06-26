import React from "react"
import { Node } from "@/types"
import { getQuantifierText } from "@/parser/utils/quantifier"
type QuantifierProps = {
  node: Node
  selected: boolean
  x: number
  y: number
  width: number
  height: number
}

const NodeQuantifier: React.FC<QuantifierProps> = React.memo(
  ({ node, x, y, width, height, selected }) => {
    if (!node.quantifier) {
      return null
    }
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    const text = getQuantifierText(node.quantifier)

    const strokeDasharray = node.quantifier.greedy ? "" : "3,3"
    const transform = `translate(${x} ${y + height + 4})`

    return (
      <>
        <g fill="none" className="stroke" transform={transform}>
          <path d="M17 1l4 4-4 4"></path>
          <path
            d="M3 11V9a4 4 0 014-4h14"
            strokeDasharray={strokeDasharray}
          ></path>
          <path d="M7 19l-4-4 4-4"></path>
          <path
            d="M21 9v2a4 4 0 01-4 4H3"
            strokeDasharray={strokeDasharray}
          ></path>
        </g>
        <text
          x={x + 26}
          y={y + height + 10}
          className="text"
          fontSize={12}
          dy={12 * 0.35 + 4}
          pointerEvents="none"
        >
          {text}
        </text>
      </>
    )
  }
)

export default NodeQuantifier
