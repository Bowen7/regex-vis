import React, { useMemo } from "react"
import {
  FLOW_NODE_BORDER_RADIUS,
  FLOW_GROUP_PADDING_HORIZONTAL,
} from "./consts"
import { NodeType, Quantifier } from "@types"
const FONT = 16
type Props = {
  text: string
  id: number
  type: NodeType
  quantifier: Quantifier | null
  x: number
  y: number
  width: number
  height: number
  selected: boolean
}
const FlowNode: React.FC<Props> = props => {
  let { x, y, width, height, text, type, quantifier, selected } = props
  const rectAttrs = useMemo<React.SVGProps<SVGRectElement>>(() => {
    const attrs: React.SVGProps<SVGRectElement> = {
      fill: "#fff",
      stroke: "#000",
      rx: FLOW_NODE_BORDER_RADIUS,
      ry: FLOW_NODE_BORDER_RADIUS,
    }
    switch (type) {
      case "group":
        attrs.strokeDasharray = "5,5"
        attrs.fill = "transparent"
        break
      case "root":
        attrs.rx = width
        attrs.ry = height
        break
      case "choice":
        attrs.fill = "none"
        break
      default:
        break
    }
    if (selected) {
      attrs.stroke = "#50E3C2"
    }
    return attrs
  }, [type, selected, width, height])

  if (type === "group") {
    x -= FLOW_GROUP_PADDING_HORIZONTAL
    width += FLOW_GROUP_PADDING_HORIZONTAL * 2
  }

  const center = {
    x: x + width / 2,
    y: y + height / 2,
  }

  const renderQuantifier = () => {
    if (quantifier) {
      const { min, max } = quantifier
      if (min === 0) {
        const left = {
          x,
          y: y + height / 2,
        }
        const right = {
          x: x + width,
          y: y + height / 2,
        }
        const path =
          `M${left.x - 15},${left.y}` +
          `A5 5 0 0 0,${left.x - 10},${left.y - 5}` +
          `L${left.x - 10},${left.y - height / 2 - 5}` +
          `A5 5 0 0 1,${left.x - 5},${left.y - height / 2 - 10}` +
          `L${left.x + width + 5},${left.y - height / 2 - 10}` +
          `A5 5 0 0 1,${left.x + width + 10},${left.y - height / 2 - 5}` +
          `L${left.x + width + 10},${left.y - 5}` +
          `A5 5 0 0 0,${right.x + 15},${right.y}`
        return <path d={path} stroke="#000" fill="none"></path>
      }
      if (max > 1) {
        let text = ""
        if (max !== Infinity) {
          text += Math.max(0, min - 1)
          if (max !== min) {
            text += " - "
            text += max - 1
          }
          text += " 次"
        }
        const path1 =
          `M${center.x - 7.5},${y + height}` +
          `A10 10 0 1 0,${center.x + 7.5},${y + height}`
        const path2 =
          `M${center.x + 6.5},${y + height + 7}` +
          `L${center.x + 10},${y + height + 10.5}` +
          `L${center.x + 13.5},${y + height + 7}`

        return (
          <>
            <path d={path1} stroke="#000" fill="none"></path>
            <path d={path2} stroke="#000" fill="none"></path>
            {text && (
              <text
                x={center.x}
                y={y + height + 25}
                fontSize={14}
                dy={14 * 0.35}
                textAnchor="middle"
              ></text>
            )}
          </>
        )
      }
    }
    return null
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={FLOW_NODE_BORDER_RADIUS}
        ry={FLOW_NODE_BORDER_RADIUS}
        {...rectAttrs}
      ></rect>
      {text && (
        <text
          x={center.x}
          y={center.y}
          fontSize={FONT}
          dy={FONT * 0.35}
          textAnchor="middle"
        >
          {text}
        </text>
      )}
      {renderQuantifier()}
    </g>
  )
}

export default FlowNode
