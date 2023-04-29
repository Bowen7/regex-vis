import React from "react"
import { AST, getQuantifierText } from "@/parser"
import {
  GRAPH_QUANTIFIER_TEXT_FONTSIZE,
  GRAPH_QUANTIFIER_ICON_FONTSIZE,
} from "@/constants"
import { QUANTIFIER_ICON, NON_GREEDY_QUANTIFIER_ICON } from "./utils"
type Props = {
  centerX: number
  y: number
  quantifier: AST.Quantifier
}

const QuantifierNode = React.memo((props: Props) => {
  const { centerX, y, quantifier } = props

  const text = getQuantifierText(quantifier)
  const icon = quantifier.greedy ? QUANTIFIER_ICON : NON_GREEDY_QUANTIFIER_ICON

  return (
    <text
      className="text"
      fontSize={GRAPH_QUANTIFIER_TEXT_FONTSIZE}
      textAnchor="middle"
      x={centerX}
      y={y}
      dy={1.15 * GRAPH_QUANTIFIER_ICON_FONTSIZE}
    >
      <tspan fontFamily="repeat" fontSize={18}>
        {icon}
      </tspan>
      <tspan
        dy={
          (GRAPH_QUANTIFIER_TEXT_FONTSIZE - GRAPH_QUANTIFIER_ICON_FONTSIZE) / 2
        }
      >
        {" " + text}
      </tspan>
    </text>
  )
})
QuantifierNode.displayName = "QuantifierNode"
export default QuantifierNode
