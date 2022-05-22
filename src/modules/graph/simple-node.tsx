import React, { useMemo, useEffect } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import { measureText } from "./utils-new"
const FONT_SIZE = 16
const PADDING_VERTICAL = 4
const PADDING_HORIZONTAL = 10
const BORDER_RADIUS = 5
type Props = {
  index: number
  x: number
  y: number
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
  onLayout: (index: number, width: number, height: number) => void
}
const SimpleNode: React.FC<Props> = React.memo(
  ({ index, x, y, node, onLayout }) => {
    const { palette } = useTheme()
    // TODO
    const text = "single node"
    const [textWidth, textHeight] = useMemo(() => measureText(text), [text])

    const width = textWidth + 2 * PADDING_HORIZONTAL
    const height = textHeight + 2 * PADDING_VERTICAL

    useEffect(() => {
      onLayout(index, width, height)
      return () => onLayout(index, -1, -1)
    }, [index, width, height, onLayout])
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={BORDER_RADIUS}
          ry={BORDER_RADIUS}
          stroke={palette.accents_6}
          fill={"transparent"}
          strokeWidth={1.5}
        />
        <text
          x={x}
          y={y}
          fontSize={FONT_SIZE}
          dx={PADDING_HORIZONTAL + textWidth / 2}
          dy={PADDING_VERTICAL + FONT_SIZE}
          fill={palette.foreground}
          textAnchor="middle"
        >
          {text}
        </text>
      </g>
    )
  }
)

export default SimpleNode
