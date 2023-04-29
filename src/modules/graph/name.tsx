import React from "react"
import { GRAPH_NAME_TEXT_FONTSIZE } from "@/constants"
type Props = {
  centerX: number
  y: number
  name: string
}

const NameNode = React.memo((props: Props) => {
  const { centerX, y, name } = props

  return (
    <text
      className="text"
      fontSize={GRAPH_NAME_TEXT_FONTSIZE}
      x={centerX}
      y={y}
      dy={-0.5 * GRAPH_NAME_TEXT_FONTSIZE}
      textAnchor="middle"
    >
      {name}
    </text>
  )
})

NameNode.displayName = "NameNode"

export { NameNode }
