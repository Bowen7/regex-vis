import React, { useMemo } from "react"
import { NODE_BORDER_RADIUS } from "./constants"
import { AST } from "@/parser"
import NodeText from "./text"
import NodeQuantifier from "./quantifier"
import NodeName from "./name"
type Props = {
  node: AST.Node
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  onClick?: (node: AST.Node) => void
}

const RailNode: React.FC<Props> = React.memo((props) => {
  let { x, y, width, height, selected, node } = props
  const { type } = node

  const rectAttrs = useMemo<React.SVGProps<SVGRectElement>>(() => {
    const attrs: React.SVGProps<SVGRectElement> = {
      rx: NODE_BORDER_RADIUS,
      ry: NODE_BORDER_RADIUS,
    }
    switch (node.type) {
      case "lookAroundAssertion":
      case "group":
        if (node.kind === "nonCapturing") {
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
      case "lookAroundAssertion":
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
        <NodeQuantifier node={node} x={x} y={y} width={width} height={height} />
        <NodeText node={node} x={x} y={y} width={width} />
        <NodeName center={center} node={node} y={y} />
      </g>
    </g>
  )
})

export default RailNode
