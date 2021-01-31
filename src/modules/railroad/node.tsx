import React, { useMemo } from "react"
import { NODE_BORDER_RADIUS } from "./constants"
import { Node } from "@/types"
const FONT = 16
type Props = {
  node: Node
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  onClick: (node: Node) => void
}
const FlowNode: React.FC<Props> = props => {
  let { x, y, width, height, selected, node } = props
  const { type, val } = node

  const stroke = selected ? "#3291FF" : "#000"

  const rectAttrs = useMemo<React.SVGProps<SVGRectElement>>(() => {
    const attrs: React.SVGProps<SVGRectElement> = {
      fill: "#fff",
      rx: NODE_BORDER_RADIUS,
      ry: NODE_BORDER_RADIUS,
    }
    switch (type) {
      case "lookaroundAssertion":
      case "group":
        attrs.strokeDasharray = "5,5"
        attrs.fill = "transparent"
        break
      case "root":
        attrs.rx = width
        attrs.ry = height
        break
      case "choice":
        if (!selected) {
          attrs.stroke = "none"
        }
        attrs.fill = "transparent"
        break
      default:
        break
    }
    return attrs
  }, [type, width, height, selected])

  const center = {
    x: x + width / 2,
    y: y + height / 2,
  }

  function renderText() {
    if (val?.text) {
      return (
        <text
          x={center.x}
          y={center.y}
          fontSize={FONT}
          dy={FONT * 0.35}
          fill={stroke}
          textAnchor="middle"
        >
          {val.text}
        </text>
      )
    }
  }

  function renderQuantifier() {
    if (node.quantifier) {
      const { min, max, text } = node.quantifier
      let path1 = ""
      let path2 = ""
      let path3 = ""
      if (min === 0) {
        const left = {
          x,
          y: y + height / 2,
        }
        const right = {
          x: x + width,
          y: y + height / 2,
        }
        path1 =
          `M${left.x - 15},${left.y}` +
          `A5 5 0 0 0,${left.x - 10},${left.y - 5}` +
          `L${left.x - 10},${left.y - height / 2 - 5}` +
          `A5 5 0 0 1,${left.x - 5},${left.y - height / 2 - 10}` +
          `L${left.x + width + 5},${left.y - height / 2 - 10}` +
          `A5 5 0 0 1,${left.x + width + 10},${left.y - height / 2 - 5}` +
          `L${left.x + width + 10},${left.y - 5}` +
          `A5 5 0 0 0,${right.x + 15},${right.y}`
      }
      if (max > 1) {
        path2 =
          `M${center.x - 7.5},${y + height}` +
          `A10 10 0 1 0,${center.x + 7.5},${y + height}`
        path3 =
          `M${center.x + 6.5},${y + height + 7}` +
          `L${center.x + 10},${y + height + 10.5}` +
          `L${center.x + 13.5},${y + height + 7}`
      }
      // todo: optimize
      return (
        <>
          {path1 && (
            <path
              d={path1}
              stroke={stroke}
              fill="none"
              pointerEvents="none"
            ></path>
          )}
          {path2 && (
            <path
              d={path2}
              stroke={stroke}
              fill="none"
              pointerEvents="none"
            ></path>
          )}
          {path3 && (
            <path
              d={path3}
              stroke={stroke}
              fill="none"
              pointerEvents="none"
            ></path>
          )}
          {text && (
            <text
              x={center.x}
              y={y + height + 25}
              fill={stroke}
              fontSize={14}
              dy={14 * 0.35}
              textAnchor="middle"
              pointerEvents="none"
            >
              {text}
            </text>
          )}
        </>
      )
    }
  }

  function renderName() {
    if (val?.name) {
      const { namePrefix = "" } = val
      return (
        <text
          x={center.x}
          y={y}
          fontSize={12}
          textAnchor="middle"
          dy={-0.5 * 12}
          fill={stroke}
        >
          {namePrefix + val.name}
        </text>
      )
    }
  }

  function onClick() {
    props.onClick && props.onClick(node)
  }

  return (
    <g>
      <g onClick={onClick}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={stroke}
          {...rectAttrs}
        ></rect>
        {renderText()}
        {renderName()}
      </g>
      {renderQuantifier()}
    </g>
  )
}

export default FlowNode
