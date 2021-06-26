import React from "react"
import { Node } from "@/types"
import { getQuantifierText } from "@/parser/utils/quantifier"
import renderEngine from "@/modules/graph/rendering-engine"
import {
  QUANTIFIER_ICON_HEIGHT,
  QUANTIFIER_ICON_MARGIN_RIGHT,
  QUANTIFIER_ICON_WIDTH,
  QUANTIFIER_TEXT_FONTSIZE,
  QUANTIFIER_ICON_MARGIN_VERTICAL,
} from "@/constants/graph"
type QuantifierProps = {
  node: Node
  x: number
  y: number
  width: number
  height: number
}
const dx = QUANTIFIER_ICON_WIDTH + QUANTIFIER_ICON_MARGIN_RIGHT
const dy =
  QUANTIFIER_TEXT_FONTSIZE +
  (QUANTIFIER_ICON_HEIGHT +
    QUANTIFIER_ICON_MARGIN_VERTICAL -
    QUANTIFIER_TEXT_FONTSIZE) /
    2
const NodeQuantifier: React.FC<QuantifierProps> = React.memo(
  ({ node, x, y, width, height }) => {
    if (!node.quantifier) {
      return null
    }
    const text = getQuantifierText(node.quantifier)
    const { width: textWidth } = renderEngine.measureText(
      text,
      QUANTIFIER_TEXT_FONTSIZE
    )

    const deltaX =
      (width -
        textWidth -
        QUANTIFIER_ICON_WIDTH -
        QUANTIFIER_ICON_MARGIN_VERTICAL) /
      2
    const translateX = deltaX + x

    const strokeDasharray = node.quantifier.greedy ? "" : "3,3"
    const transform = `translate(${translateX} ${
      y + height + QUANTIFIER_ICON_MARGIN_VERTICAL
    })`
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
          x={x}
          y={y + height}
          className="text"
          fontSize={QUANTIFIER_TEXT_FONTSIZE}
          dx={dx + deltaX}
          dy={dy}
          pointerEvents="none"
        >
          {text}
        </text>
      </>
    )
  }
)

export default NodeQuantifier
