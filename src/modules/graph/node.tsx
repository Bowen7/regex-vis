import React, { useMemo } from "react"
import { NODE_BORDER_RADIUS } from "@/constants/graph"
import { Node } from "@/types"
import NodeText from "./text"
import NodeQuantifier from "./quantifier"
import NodeName from "./name"
type Props = {
  node: Node
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  onClick?: (node: Node) => void
}

const RailNode: React.FC<Props> = React.memo((props) => {
  console.log("render")
  let { x, y, width, height, selected, node } = props
  const { type } = node

  const rectAttrs = useMemo<React.SVGProps<SVGRectElement>>(() => {
    const attrs: React.SVGProps<SVGRectElement> = {
      rx: NODE_BORDER_RADIUS,
      ry: NODE_BORDER_RADIUS,
    }
    switch (node.type) {
      case "lookaroundAssertion":
      case "group":
        if (node.val.kind === "nonCapturing") {
          attrs.strokeDasharray = "4,4"
        }
        break
      case "choice":
        attrs.strokeDasharray = "4,4"
        break
      case "root":
        attrs.rx = width
        attrs.ry = height
        break
      default:
        break
    }
    return attrs
  }, [node, width, height])

  const fillClassName = selected ? "selected-fill" : "transparent-fill"

  const strokeClassName = useMemo<string>(() => {
    switch (type) {
      case "choice":
        return "none-stroke"
      case "group":
        return "second-stroke"
      default:
        return "stroke"
    }
  }, [type])

  const className = fillClassName + " " + strokeClassName

  const center = {
    x: x + width / 2,
    y: y + height / 2,
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
          className={className}
          {...rectAttrs}
        ></rect>
        <NodeQuantifier
          node={node}
          selected={selected}
          x={x}
          y={y}
          width={width}
          height={height}
        />
        <NodeText node={node} x={x} y={y} />
        <NodeName center={center} node={node} y={y} />
      </g>
    </g>
  )
})

export default RailNode
