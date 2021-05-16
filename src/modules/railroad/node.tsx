import React, { useMemo } from "react"
import { GeistUIThemesPalette } from "@geist-ui/react/dist/themes/presets"
import { NODE_BORDER_RADIUS } from "@/constants/railroad"
import { getQuantifierText } from "@/parser/utils/quantifier"
import { Node } from "@/types"
const FONT = 16
type Props = {
  node: Node
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  palette: GeistUIThemesPalette
  onClick?: (node: Node) => void
}
const RailNode: React.FC<Props> = React.memo((props) => {
  console.log("render")
  let { x, y, width, height, selected, node, palette } = props
  const { type, val } = node

  const stroke = selected ? palette.success : palette.foreground

  const rectAttrs = useMemo<React.SVGProps<SVGRectElement>>(() => {
    const attrs: React.SVGProps<SVGRectElement> = {
      fill: palette.background,
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
        } else {
          attrs.stroke = "rgba(50, 145, 255, 0.5)"
        }
        attrs.fill = "transparent"
        break
      default:
        break
    }
    return attrs
  }, [type, width, height, selected, palette])

  const center = {
    x: x + width / 2,
    y: y + height / 2,
  }

  function renderText() {
    if ("text" in node || val?.text) {
      const text = "text" in node ? node.text : val.text
      return (
        <text
          x={center.x}
          y={center.y}
          fontSize={FONT}
          dy={FONT * 0.35}
          fill={stroke}
          textAnchor="middle"
        >
          {text}
        </text>
      )
    }
  }

  function renderQuantifier() {
    const paths = []
    if (node.quantifier) {
      const { min, max } = node.quantifier
      const text = getQuantifierText(node.quantifier)
      if (min === 0) {
        let offsetY = 0
        if ("name" in node || val?.name) {
          offsetY = 10
        }

        const left = {
          x,
          y: y + height / 2,
        }
        const right = {
          x: x + width,
          y: y + height / 2,
        }
        const d =
          `M${left.x},${left.y}` +
          `L${left.x - 15},${left.y}` +
          `A5 5 0 0 0,${left.x - 10},${left.y - 5}` +
          `L${left.x - 10},${left.y - height / 2 - 5 - offsetY}` +
          `A5 5 0 0 1,${left.x - 5},${left.y - height / 2 - 10 - offsetY}` +
          `L${left.x + width + 5},${left.y - height / 2 - 10 - offsetY}` +
          `A5 5 0 0 1,${left.x + width + 10},${
            left.y - height / 2 - 5 - offsetY
          }` +
          `L${left.x + width + 10},${left.y - 5}` +
          `A5 5 0 0 0,${right.x + 15},${right.y}` +
          `L${right.x},${right.y}`
        paths.push({ d, id: node.id + "-q-0" })
      }
      if (max > 1) {
        const d =
          `M${center.x - 7.5},${y + height}` +
          `A10 10 0 1 0,${center.x + 7.5},${y + height}` +
          `M${center.x + 6.5},${y + height + 7}` +
          `L${center.x + 10},${y + height + 10.5}` +
          `L${center.x + 13.5},${y + height + 7}`

        paths.push({ d, id: node.id + "-q-1" })
      }

      if (min === 0 && selected) {
      }
      // todo: optimize
      return (
        <>
          {paths.map(({ d, id }) => (
            <path d={d} key={id} stroke={stroke} fill="transparent"></path>
          ))}
          {text && (
            <text
              x={center.x}
              y={y + height + 27.5}
              fill={stroke}
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
  }

  function renderName() {
    if ("name" in node || val?.name) {
      const name = "name" in node ? node.name : val.name
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
          {namePrefix + name}
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
        {renderQuantifier()}
      </g>
    </g>
  )
})

export default RailNode
