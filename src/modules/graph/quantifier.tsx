import React from "react"
import { Node } from "@/types"
import { getQuantifierText } from "@/parser/utils/quantifier"
type QuantifierProps = {
  node: Node
  selected: boolean
  x: number
  y: number
  width: number
  height: number
}

const NodeQuantifier: React.FC<QuantifierProps> = React.memo(
  ({ node, selected, x, y, width, height }) => {
    if (!node.quantifier) {
      return null
    }
    const pathClassName = selected ? "selected-stroke" : "second-stroke"
    const textClassName = selected ? "selected-text" : "text"
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    const paths = []
    const { val } = node
    const { min, max } = node.quantifier
    const text = getQuantifierText(node.quantifier)

    const strokeDasharray = node.quantifier.greedy ? "" : "3,3"

    if (min === 0) {
      let offsetY = 0
      if ("name" in node || val?.name) {
        offsetY = 10
      }

      const d =
        `M-15,0` +
        `A5 5 0 0 0,-10,-5` +
        `L-10,${-height / 2 - 5 - offsetY}` +
        `A5 5 0 0 1,-5,${-height / 2 - 10 - offsetY}` +
        `L${width + 5},${-height / 2 - 10 - offsetY}` +
        `A5 5 0 0 1,${width + 10},${-height / 2 - 5 - offsetY}` +
        `L${width + 10},-5` +
        `A5 5 0 0 0,${width + 15},0`

      paths.push({
        d,
        id: node.id + "-q-0",
        transform: `translate(${x} ${y + height / 2})`,
      })
    }

    if (max > 1) {
      const offsetY = 0
      const d =
        `M0,0` +
        `A7.5 7.5 0 0 0,-7.5,7.5` +
        `L-7.5,${height / 2 + 5 + offsetY}` +
        `A5 5 0 0 0,-2.5,${height / 2 + 10 + offsetY}` +
        `L${width + 5},${height / 2 + 10 + offsetY}` +
        `A5 5 0 0 0,${width + 7.5},${height / 2 + 7.5 + offsetY}` +
        `L${width + 7.5},7.5` +
        `A7.5 7.5 0 0 0,${width},0`

      paths.push({
        d,
        id: node.id + "-q-1",
        transform: `translate(${x} ${y + height / 2})`,
      })
    }
    // todo: optimize
    return (
      <>
        {paths.map(({ d, id, transform }) => (
          <path
            d={d}
            key={id}
            className={pathClassName}
            transform={transform}
            fill="transparent"
            strokeDasharray={strokeDasharray}
          ></path>
        ))}
        {text && (
          <text
            x={center.x}
            y={y + height + 20}
            className={textClassName}
            fontSize={12}
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
)

export default NodeQuantifier
