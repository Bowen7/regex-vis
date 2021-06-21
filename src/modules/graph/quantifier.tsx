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
  ({ node, x, y, width, height, selected }) => {
    if (!node.quantifier) {
      return null
    }
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    const paths: React.SVGProps<SVGPathElement>[] = []
    const { val } = node
    const { min, max } = node.quantifier
    const text = getQuantifierText(node.quantifier)

    const strokeDasharray = node.quantifier.greedy ? "" : "3,3"
    const transform = `translate(${x} ${y + height / 2})`

    if (min === 0) {
      let offsetY = 0
      if ("name" in node || val?.name) {
        offsetY = 10
      }

      const d =
        `M-15,0` +
        `A5 10 0 0 0,-10,-10` +
        `L-10,${-height / 2 - 5 - offsetY}` +
        `A5 5 0 0 1,-5,${-height / 2 - 10 - offsetY}` +
        `L${width + 5},${-height / 2 - 10 - offsetY}` +
        `A5 5 0 0 1,${width + 10},${-height / 2 - 5 - offsetY}` +
        `L${width + 10},-10` +
        `A5 10 0 0 0,${width + 15},0`

      const selectedD =
        d +
        `L${width},0L${width},${-height / 2 + 5}` +
        `A5 5 0 0 0,${width - 5},${-height / 2}` +
        `L5,${-height / 2}` +
        `A5 5 0 0 0,0,${-height / 2 + 5}` +
        `L0,0Z`

      paths.push({
        d,
        key: node.id + "-q-0",
        transform,
        strokeDasharray,
        className: "second-stroke transparent-fill",
      })

      paths.push({
        d: selectedD,
        key: node.id + "-q-1",
        transform,
        stroke: "transparent",
        className: selected ? "selected-fill" : "transparent-fill",
      })
    }

    if (max > 1) {
      const d =
        `M0,0` +
        `A7.5 10 0 0 0,-7.5,10` +
        `L-7.5,${height / 2 + 5}` +
        `A5 5 0 0 0,-2.5,${height / 2 + 10}` +
        `L${width + 5},${height / 2 + 10}` +
        `A5 5 0 0 0,${width + 7.5},${height / 2 + 7.5}` +
        `L${width + 7.5},10` +
        `A7.5 10 0 0 0,${width},0`

      const selectedD =
        d +
        `L${width},${height / 2 - 5}` +
        `A5 5 0 0 1,${width - 5},${height / 2}` +
        `L5,${height / 2}` +
        `A5 5 0 0 1,0,${height / 2 - 5}Z`

      paths.push({
        d,
        key: node.id + "-q-2",
        transform,
        strokeDasharray,
        className: "second-stroke transparent-fill",
      })

      paths.push({
        d: selectedD,
        key: node.id + "-q-3",
        transform,
        stroke: "transparent",
        className: selected ? "selected-fill" : "transparent-fill",
      })
    }
    // todo: optimize
    return (
      <>
        {paths.map((attrs) => (
          <path {...attrs}></path>
        ))}
        {text && (
          <text
            x={center.x}
            y={y + height + 20}
            className="text"
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
