import React, { useState, useEffect } from "react"
import { useUnmount } from "react-use"
import { AST } from "@/parser"
import {
  GRAPH_NODE_PADDING_VERTICAL,
  GRAPH_NODE_PADDING_HORIZONTAL,
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MIN_WIDTH,
} from "@/constants"
import TextNode from "./text-new"
import QuantifierNode from "./quantifier-new"
import MidConnect from "./mid-connect"

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
    const [textLayout, setTextLayout] = useState<[number, number]>([0, 0])
    const [quantifierLayout, setQuantifierLayout] = useState<[number, number]>([
      0, 0,
    ])
    const [nameLayout, setNameLayout] = useState<[number, number]>([0, 0])

    const contentWidth = Math.max(
      textLayout[0] + 2 * GRAPH_NODE_PADDING_HORIZONTAL,
      GRAPH_NODE_MIN_WIDTH
    )
    const contentHeight = textLayout[1] + 2 * GRAPH_NODE_PADDING_VERTICAL

    const width = Math.max(contentWidth, quantifierLayout[0], nameLayout[0])
    const height =
      contentHeight + 2 * Math.max(quantifierLayout[1], nameLayout[1])

    // relative to x, y
    const contentX = (width - contentWidth) / 2
    const contentY = (height - contentHeight) / 2

    const quantifier = node.type === "character" ? node.quantifier : null

    useEffect(
      () => onLayout(index, [contentWidth, contentHeight]),
      [index, contentWidth, contentHeight, onLayout]
    )

    useUnmount(() => onLayout(index, [-1, -1]))

    return (
      <g transform={`translate(${x},${y})`}>
        {contentX !== 0 && (
          <MidConnect
            start={[0, height / 2]}
            end={[(width - contentWidth) / 2, height / 2]}
          />
        )}
        <rect
          x={contentX}
          y={contentY}
          width={contentWidth}
          height={contentHeight}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          fill="transparent"
          className="stroke"
        />
        <TextNode centerX={width / 2} node={node} onLayout={setTextLayout} />
        {quantifier && (
          <QuantifierNode
            quantifier={quantifier}
            x={0}
            y={contentHeight}
            onLayout={setQuantifierLayout}
          />
        )}
        {contentX !== 0 && (
          <MidConnect
            start={[width / 2 + contentWidth / 2, height / 2]}
            end={[width, height / 2]}
          />
        )}
      </g>
    )
  }
)

export default SimpleNode
