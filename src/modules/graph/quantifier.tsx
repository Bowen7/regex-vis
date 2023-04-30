import React from "react"
import { AST } from "@/parser"
import {
  GRAPH_QUANTIFIER_TEXT_FONTSIZE,
  GRAPH_QUANTIFIER_ICON_FONTSIZE,
  ICON_FONT_FAMILY,
} from "@/constants"
import {
  QUANTIFIER_ICON,
  NON_GREEDY_QUANTIFIER_ICON,
  INFINITY_ICON,
  getQuantifierText,
} from "./utils"
type Props = {
  centerX: number
  y: number
  quantifier: AST.Quantifier
}

const QuantifierNode = React.memo((props: Props) => {
  const { centerX, y, quantifier } = props

  const hasInfinity = quantifier.max === Infinity
  const text = getQuantifierText(quantifier, false)
  const icon = quantifier.greedy ? QUANTIFIER_ICON : NON_GREEDY_QUANTIFIER_ICON

  return (
    <text
      className="text"
      fontSize={GRAPH_QUANTIFIER_TEXT_FONTSIZE}
      textAnchor="middle"
      x={centerX}
      y={y}
      dy={1.15 * GRAPH_QUANTIFIER_ICON_FONTSIZE}
      fontFamily={ICON_FONT_FAMILY}
    >
      <tspan fontSize={18}>{icon}</tspan>
      <tspan
        dy={
          (GRAPH_QUANTIFIER_TEXT_FONTSIZE - GRAPH_QUANTIFIER_ICON_FONTSIZE) / 2
        }
      >
        {" " + text}
      </tspan>
      {hasInfinity && (
        <tspan
          dy={
            (GRAPH_QUANTIFIER_TEXT_FONTSIZE - GRAPH_QUANTIFIER_ICON_FONTSIZE) /
              2 +
            3.5
          }
        >
          {INFINITY_ICON}
        </tspan>
      )}
    </text>
  )
})
QuantifierNode.displayName = "QuantifierNode"
export default QuantifierNode
