import React, { useState, useEffect } from "react"
import { AST } from "@/parser"
import {
  GRAPH_NODE_PADDING_VERTICAL,
  GRAPH_NODE_PADDING_HORIZONTAL,
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MIN_WIDTH,
} from "@/constants"
import Text from "./text-new"

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
}
const SimpleNode: React.FC<Props> = React.memo(
  ({ index, x, y, node, onLayout }) => {
    const [layout, setLayout] = useState<[number, number]>([0, 0])

    const width = Math.max(
      layout[0] + 2 * GRAPH_NODE_PADDING_HORIZONTAL,
      GRAPH_NODE_MIN_WIDTH
    )
    const height = layout[1] + 2 * GRAPH_NODE_PADDING_VERTICAL

    useEffect(() => {
      onLayout(index, [width, height])
      // return () => onLayout(index, [-1, -1])
    }, [index, width, height, onLayout])

    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          width={width}
          height={height}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          fill="transparent"
          className="stroke"
        />
        <Text x={width / 2} y={height / 2} node={node} onLayout={setLayout} />
      </g>
    )
  }
)

export default SimpleNode
