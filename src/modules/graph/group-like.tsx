import React, { useRef, useEffect, useCallback, useLayoutEffect } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import {
  GRAPH_NODE_BORDER_RADIUS,
  GRAPH_NODE_MARGIN_HORIZONTAL,
  GRAPH_GROUP_NODE_PADDING_VERTICAL,
  GRAPH_NODE_MIN_HEIGHT,
  GRAPH_NODE_MIN_WIDTH,
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
  selected: boolean
  selectedIds: string[]
  onLayout: (index: number, layout: [number, number]) => void
}

const GroupLikeNode = React.memo(
  ({ index, x, y, minimum, node, selectedIds, children, onLayout }: Props) => {
    const { palette } = useTheme()
    const layout = useRef<[number, number]>([0, 0])

    useLayoutEffect(() => {
      if (node.type === "group" || node.type === "lookAroundAssertion") {
        layout.current = [GRAPH_NODE_MIN_WIDTH, GRAPH_NODE_MIN_HEIGHT]
        onLayout(index, layout.current)
      }
    }, [index, node, onLayout])

    const handleNodesLayout = useCallback(
      (_: number, [width, height]: [number, number]) => {
        layout.current = [
          width + 2 * GRAPH_NODE_MARGIN_HORIZONTAL,
          height + 2 * GRAPH_GROUP_NODE_PADDING_VERTICAL,
        ]
        onLayout(index, layout.current)
      },
      [index, onLayout]
    )
    if (node.type !== "group" && node.type !== "lookAroundAssertion") {
      return null
    }

    const { id, children: nodeChildren } = node
    const connectY = y + layout.current[1] / 2
    return (
      <>
        {nodeChildren.length > 0 && (
          <>
            <MidConnect
              start={[x, connectY]}
              end={[x + GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
            />
            <MidConnect
              start={[
                x + layout.current[0] - GRAPH_NODE_MARGIN_HORIZONTAL,
                connectY,
              ]}
              end={[x + layout.current[0], connectY]}
            />
          </>
        )}
        {children}
        <rect
          x={x}
          y={y}
          width={layout.current[0]}
          height={layout.current[1]}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          stroke={palette.accents_3}
          fill="transparent"
          strokeWidth={1.5}
        />
        <Nodes
          id={id}
          index={0}
          x={x + GRAPH_NODE_MARGIN_HORIZONTAL}
          y={y + GRAPH_GROUP_NODE_PADDING_VERTICAL}
          minimum={minimum}
          nodes={nodeChildren}
          selectedIds={selectedIds}
          onLayout={handleNodesLayout}
        />
        <rect
          x={x}
          y={y}
          width={layout.current[0]}
          height={layout.current[1]}
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
          stroke={palette.accents_3}
          fill="transparent"
          strokeWidth={1.5}
        />
      </>
    )
  }
)
GroupLikeNode.displayName = "GroupLikeGroup"
export default GroupLikeNode
