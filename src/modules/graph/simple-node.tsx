import React, { useState, useEffect, useCallback } from "react"
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
  selected: boolean
  onLayout: (index: number, layout: [number, number]) => void
  children: React.ReactNode
}

const SimpleNode = ({ index, x, y, node, onLayout, children }: Props) => {
  const [layout, setLayout] = useState<[number, number]>([0, 0])

  const handleTextLayout = useCallback(
    ([textWidth, textHeight]: [number, number]) => {
      const width = Math.max(
        textWidth + 2 * GRAPH_NODE_PADDING_HORIZONTAL,
        GRAPH_NODE_MIN_WIDTH
      )
      const height = textHeight + 2 * GRAPH_NODE_PADDING_VERTICAL
      setLayout([width, height])
      onLayout(index, [width, height])
    },
    [index, onLayout]
  )

  return (
    <g>
      {children}
      <g transform={`translate(${x},${y})`}>
        <rect
          width={layout[0]}
          height={layout[1]}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          fill="transparent"
          className="stroke"
        />
        <TextNode
          centerX={layout[0] / 2}
          node={node}
          onLayout={handleTextLayout}
        />
      </g>
    </g>
  )
}
export default SimpleNode
