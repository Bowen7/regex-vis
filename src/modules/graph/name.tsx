import React, { useLayoutEffect, useRef } from "react"
import { GRAPH_NAME_TEXT_FONTSIZE, GRAPH_NAME_HEIGHT } from "@/constants"
type Props = {
  centerX: number
  y: number
  name: string
  onLayout: (layout: [number, number]) => void
}

const NameNode = React.memo((props: Props) => {
  const { centerX, y, name, onLayout } = props
  const textRef = useRef<SVGTextElement>(null!)

  useLayoutEffect(() => {
    const { width } = textRef.current.getBoundingClientRect()
    const layout: [number, number] = [width, GRAPH_NAME_HEIGHT]
    onLayout(layout)
  }, [name, onLayout])

  return (
    <text
      ref={textRef}
      className="text"
      fontSize={GRAPH_NAME_TEXT_FONTSIZE}
      x={centerX}
      y={y}
      dy={0.75 * GRAPH_NAME_TEXT_FONTSIZE}
      textAnchor="middle"
    >
      {name}
    </text>
  )
})

NameNode.displayName = "NameNode"

export { NameNode }
