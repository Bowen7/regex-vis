import React from "react"
import Traverse from "./traverse"
import SvgContainer from "./svg-container"
import parser from "@/parser"
import { RenderNode } from "@/types"
const traverse = new Traverse(true)
type Props = {
  regex: string
  selected?: boolean
}

const MinimumGraph: React.FC<Props> = ({ regex, selected = false }) => {
  const rootRenderNode = traverse.render(parser.parse(regex))

  const selectedIds = selected
    ? rootRenderNode.children
        .filter(
          (child) => child.type === "node" && child.target.type !== "root"
        )
        .map((child) => (child as RenderNode).id)
    : []
  return (
    <SvgContainer
      rootRenderNode={rootRenderNode}
      selectedIds={selectedIds}
      minimum={true}
    />
  )
}

export default MinimumGraph
