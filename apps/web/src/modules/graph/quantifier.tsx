import React from "react"
import { AST } from "@/parser"
import InfinityIcon from "@geist-ui/icons/infinity"
import { GRAPH_ICON_SIZE } from "@/constants"
import { getQuantifierText } from "./utils"
type Props = {
  quantifier: AST.Quantifier
}

const QuantifierNode = React.memo((props: Props) => {
  const { quantifier } = props

  const hasInfinity = quantifier.max === Infinity
  const text = getQuantifierText(quantifier)

  return (
    <div className="text quantifier">
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        shapeRendering="geometricPrecision"
        viewBox="0 0 24 24"
        height={GRAPH_ICON_SIZE}
        width={GRAPH_ICON_SIZE}
      >
        <path d="M17 1l4 4-4 4"></path>
        <path
          d="M3 11V9a4 4 0 014-4h14M21 13v2a4 4 0 01-4 4H3"
          strokeDasharray={quantifier.greedy ? "" : "4, 4"}
        ></path>
        <path d="M7 23l-4-4 4-4"></path>
      </svg>
      <span>{text}</span>
      {hasInfinity && <InfinityIcon size={GRAPH_ICON_SIZE} />}
    </div>
  )
})
QuantifierNode.displayName = "QuantifierNode"
export default QuantifierNode
