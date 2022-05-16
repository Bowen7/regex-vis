import React, { useMemo, useEffect } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import { measureText } from "./utils-new"
const FONT = 16
type Props = {
  x: number
  y: number
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
  onLayout: (id: string, width: number, height: number) => void
}
const SimpleNode: React.FC<Props> = React.memo(({ x, y, node, onLayout }) => {
  const { palette } = useTheme()
  // TODO
  const text = "single node"
  const [width, height] = useMemo(() => measureText(text), [text])
  useEffect(
    () => onLayout(node.id, width, height),
    [node.id, width, height, onLayout]
  )
  return (
    <g>
      <rect x={x} y={y} stroke={palette.accents_6} strokeWidth={1.5}></rect>
      <text
        x={x}
        y={y}
        fontSize={FONT}
        dx={width / 2}
        dy={FONT}
        fill={palette.foreground}
        textAnchor="middle"
      >
        {text}
      </text>
    </g>
  )
})

export default SimpleNode
