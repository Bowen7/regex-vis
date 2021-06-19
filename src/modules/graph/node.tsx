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
          attrs.strokeDasharray = "5,5"
        }
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

  const fill = useMemo<string>(() => {
    if (["lookaroundAssertion", "group", "choice"].includes(type)) {
      return "transparent-fill"
    }
    return "fill"
  }, [type])

  const stroke = useMemo<string>(() => {
    if (type === "choice") {
      return selected ? "virtual-stroke" : "none-stroke"
    }
    return selected ? "selected-stroke" : "stroke"
  }, [type, selected])

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
          className={stroke + " " + fill}
          {...rectAttrs}
        ></rect>
        <NodeText center={center} selected={selected} node={node} />
        <NodeName center={center} selected={selected} node={node} y={y} />
        <NodeQuantifier
          node={node}
          selected={selected}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      </g>
    </g>
  )
})

export default RailNode
