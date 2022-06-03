import React, { useState, useEffect, useCallback } from "react"
import { useUnmount } from "react-use"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import {
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MARGIN_HORIZONTAL,
  GRAPH_GROUP_NODE_PADDING_VERTICAL,
} from "@/constants"
import Nodes from "./nodes"
import MidConnect from "./mid-connect"
type Props = {
  index: number
  x: number
  y: number
  node: AST.GroupNode | AST.LookAroundAssertionNode
  onLayout: (index: number, layout: [number, number]) => void
}

const GroupLikeNode: React.FC<Props> = React.memo(
  ({ index, x, y, node, onLayout }) => {
    const { palette } = useTheme()
    const [layout, setLayout] = useState<[number, number]>([0, 0])

    useEffect(() => onLayout(index, layout), [index, layout, onLayout])

    useUnmount(() => onLayout(index, [-1, -1]))

    const { children } = node

    const handleNodesLayout = useCallback(
      (index: number, [width, height]) => {
        setLayout([
          width + 2 * GRAPH_NODE_MARGIN_HORIZONTAL,
          height + 2 * GRAPH_GROUP_NODE_PADDING_VERTICAL,
        ])
      },
      [setLayout]
    )
    const connectY = y + layout[1] / 2
    return (
      <>
        <MidConnect
          start={[x, connectY]}
          end={[x + GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
        />
        <rect
          x={x}
          y={y}
          width={layout[0]}
          height={layout[1]}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          stroke={palette.accents_3}
          fill={"transparent"}
          strokeWidth={1.5}
        ></rect>
        <Nodes
          index={0}
          x={x + GRAPH_NODE_MARGIN_HORIZONTAL}
          y={y + GRAPH_GROUP_NODE_PADDING_VERTICAL}
          nodes={children}
          onLayout={handleNodesLayout}
        ></Nodes>
        <MidConnect
          start={[x + layout[0] - GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
          end={[x + layout[0], connectY]}
        />
      </>
    )
  }
)
export default GroupLikeNode