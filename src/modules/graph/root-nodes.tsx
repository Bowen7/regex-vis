import React from 'react'
import MidConnect from './mid-connect'
import { GRAPH_NODE_MARGIN_HORIZONTAL, GRAPH_ROOT_RADIUS } from '@/constants'

interface RootNodeProps {
  cx: number
  cy: number
}
const RootNode = React.memo(({ cx, cy }: RootNodeProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={GRAPH_ROOT_RADIUS}
    className="stroke-foreground/60 fill-transparent"
  />
))
RootNode.displayName = 'RootNode'

interface RootNodesProps {
  x: number
  width: number
  centerY: number
}
const RootNodes = React.memo(({ x, width, centerY }: RootNodesProps) => (
  <>
    <RootNode cx={x + GRAPH_ROOT_RADIUS} cy={centerY} />
    <MidConnect
      start={[x + GRAPH_ROOT_RADIUS * 2, centerY]}
      end={[x + GRAPH_ROOT_RADIUS * 2 + GRAPH_NODE_MARGIN_HORIZONTAL, centerY]}
    />
    <MidConnect
      start={[
        x + width - 2 * GRAPH_ROOT_RADIUS - GRAPH_NODE_MARGIN_HORIZONTAL,
        centerY,
      ]}
      end={[x + width - 2 * GRAPH_ROOT_RADIUS, centerY]}
    />
    <RootNode cx={x + width - GRAPH_ROOT_RADIUS} cy={centerY} />
  </>
))
RootNodes.displayName = 'RootNodes'

export default RootNodes
