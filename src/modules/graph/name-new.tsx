import React, { useState, useEffect, useMemo, useCallback } from "react"
import { AST, getQuantifierText } from "@/parser"
import {
  GRAPH_QUANTIFIER_ICON_WIDTH,
  GRAPH_QUANTIFIER_ICON_HEIGHT,
  GRAPH_QUANTIFIER_TEXT_FONTSIZE,
} from "@/constants"
type Props = {
  x: number
  y: number
  quantifier: AST.Quantifier
  onLayout: (layout: [number, number]) => void
}

export const NameNode = React.memo((props: Props) => {
  const { x, y, quantifier, onLayout } = props

  const text = getQuantifierText(quantifier)
  const strokeDasharray = quantifier.greedy ? "" : "3,3"
  const transform = `translate(${x} ${y})`
  return (
    <g transform={transform}>
      <g fill="none" className="thin-stroke" transform={transform}>
        <path d="M18 1l3 3-3 3"></path>
        <path d="M6 15l-3-3 3-3"></path>
        <path
          d="M3 9V7a3 3 0 0 13-3h14"
          strokeDasharray={strokeDasharray}
        ></path>
        <path
          d="M21 7v2a3 3 0 0 1-3 3H3"
          strokeDasharray={strokeDasharray}
        ></path>
      </g>
      <text
        className="text"
        fontSize={GRAPH_QUANTIFIER_TEXT_FONTSIZE}
        pointerEvents="none"
      >
        {text}
      </text>
    </g>
  )
})
