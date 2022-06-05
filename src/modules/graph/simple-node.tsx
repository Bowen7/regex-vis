import React, { useState, useEffect } from "react"
import { AST } from "@/parser"
import {
  GRAPH_NODE_PADDING_VERTICAL,
  GRAPH_NODE_PADDING_HORIZONTAL,
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MIN_WIDTH,
} from "@/constants"
import TextNode from "./text-new"

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
  onLayout: (index: number, layout: [number, number]) => void
  children: React.ReactNode
}

const SimpleNode = ({ index, x, y, node, onLayout, children }: Props) => {
  const [textLayout, setTextLayout] = useState<[number, number]>([0, 0])

  const width = Math.max(
    textLayout[0] + 2 * GRAPH_NODE_PADDING_HORIZONTAL,
    GRAPH_NODE_MIN_WIDTH
  )
  const height = textLayout[1] + 2 * GRAPH_NODE_PADDING_VERTICAL

  // relative to x, y
  const contentX = (width - width) / 2
  const contentY = (height - height) / 2

  useEffect(
    () => onLayout(index, [width, height]),
    [index, width, height, onLayout]
  )

  return (
    <g>
      {children}
      <g transform={`translate(${x},${y})`}>
        <rect
          x={contentX}
          y={contentY}
          width={width}
          height={height}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          fill="transparent"
          className="stroke"
        />
        <TextNode centerX={width / 2} node={node} onLayout={setTextLayout} />
      </g>
    </g>
  )
}
export default SimpleNode
