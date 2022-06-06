import React, { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { GRAPH_NAME_TEXT_FONTSIZE, GRAPH_NAME_HEIGHT } from "@/constants"
type Props = {
  centerX: number
  y: number
  name: string
  onLayout: (layout: [number, number]) => void
}

const NameNode = React.memo((props: Props) => {
  const { centerX, y, name, onLayout } = props
  const { t } = useTranslation()
  const textRef = useRef<SVGTextElement>(null!)

  const text = t(name)

  useEffect(() => {
    const { width } = textRef.current.getBoundingClientRect()
    const layout: [number, number] = [width, GRAPH_NAME_HEIGHT]
    onLayout(layout)
  }, [text, onLayout])

  return (
    <text
      ref={textRef}
      className="text"
      fontSize={GRAPH_NAME_TEXT_FONTSIZE}
      pointerEvents="none"
      x={centerX}
      y={y}
      dy={0.25 * GRAPH_NAME_TEXT_FONTSIZE}
      textAnchor="middle"
    >
      {text}
    </text>
  )
})

NameNode.displayName = "NameNode"

export { NameNode }
