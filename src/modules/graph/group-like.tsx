import React, { useState, useEffect, useCallback } from "react"
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
  minimum: boolean
  node: AST.Node
  children: React.ReactNode
  onLayout: (index: number, layout: [number, number]) => void
}

const GroupLikeNode = React.memo(
  ({ index, x, y, minimum, node, children, onLayout }: Props) => {
    const { palette } = useTheme()
    const [layout, setLayout] = useState<[number, number]>([0, 0])

    useEffect(() => onLayout(index, layout), [index, layout, onLayout])

    const handleNodesLayout = useCallback(
      (index: number, [width, height]: [number, number]) => {
        setLayout([
          width + 2 * GRAPH_NODE_MARGIN_HORIZONTAL,
          height + 2 * GRAPH_GROUP_NODE_PADDING_VERTICAL,
        ])
      },
      [setLayout]
    )
    if (node.type !== "group" && node.type !== "lookAroundAssertion") {
      return null
    }
    const { id, children: nodeChildren } = node
    const connectY = y + layout[1] / 2
    return (
      <>
        <MidConnect
          start={[x, connectY]}
          end={[x + GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
        />
        {children}
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
          id={id}
          index={0}
          x={x + GRAPH_NODE_MARGIN_HORIZONTAL}
          y={y + GRAPH_GROUP_NODE_PADDING_VERTICAL}
          minimum={minimum}
          nodes={nodeChildren}
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
GroupLikeNode.displayName = "GroupLikeGroup"
export default GroupLikeNode
