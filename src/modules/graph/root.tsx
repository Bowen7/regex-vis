import React, { useEffect } from "react"
import { GRAPH_ROOT_RADIUS } from "@/constants"
type Props = {
  index: number
  x: number
  y: number
  selected: boolean
  onLayout: (index: number, layout: [number, number]) => void
}

const RootNode = (props: Props) => {
  const { index, x, y, onLayout } = props
  useEffect(
    () => onLayout(index, [GRAPH_ROOT_RADIUS, GRAPH_ROOT_RADIUS]),
    [index, onLayout]
  )

  return (
    <rect
      x={x}
      y={y}
      width={GRAPH_ROOT_RADIUS}
      height={GRAPH_ROOT_RADIUS}
      rx={GRAPH_ROOT_RADIUS}
      ry={GRAPH_ROOT_RADIUS}
      className="stroke"
    />
  )
}

export default RootNode
