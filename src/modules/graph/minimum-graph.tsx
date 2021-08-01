import React from "react"
import { nanoid } from "nanoid"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { parse, AST } from "@/parser"
import { RenderNode } from "./types"
type Props = {
  regex: string
  selected?: boolean
  withRoot?: boolean
}

const head: AST.RootNode = { id: nanoid(), type: "root" }
const tail: AST.RootNode = { id: nanoid(), type: "root" }
const MinimumGraph: React.FC<Props> = ({
  regex,
  selected = false,
  withRoot = false,
}) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  if (withRoot) {
    ast.body.unshift(head)
    ast.body.push(tail)
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
