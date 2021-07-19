import React from "react"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { parse } from "@/parser"
import { RenderNode } from "./types"
type Props = {
  regex: string
  selected?: boolean
}

const MinimumGraph: React.FC<Props> = ({ regex, selected = false }) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  const rootRenderNode = renderEngine.render(ast, true)

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
