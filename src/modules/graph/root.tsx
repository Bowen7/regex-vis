import React, { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { GRAPH_ROOT_RADIUS } from "@/constants"
type Props = {
  index: number
  x: number
  y: number
  selected: boolean
  onLayout: (index: number, layout: [number, number]) => void
}

const RootNode = React.memo((props: Props) => {
  const { index, x, y, onLayout } = props
  const { i18n } = useTranslation()
  useLayoutEffect(
    () => onLayout(index, [GRAPH_ROOT_RADIUS, GRAPH_ROOT_RADIUS]),
    [index, onLayout, i18n.language]
  )
  return (
    <rect
      x={x}
      y={y}
      width={GRAPH_ROOT_RADIUS}
      height={GRAPH_ROOT_RADIUS}
      rx={GRAPH_ROOT_RADIUS}
      ry={GRAPH_ROOT_RADIUS}
      className="stroke transparent-fill"
    />
  )
})

RootNode.displayName = "RootNode"

export default RootNode
