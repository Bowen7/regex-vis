import React from "react"
import { GeistProvider, CssBaseline } from "@geist-ui/react"
import Traverse from "./traverse"
import SvgContainer from "./svg-container"
import parser from "@/parser"
import { RenderNode } from "@/types"
const traverse = new Traverse(true)
type Props = {
  regex: string
  selected?: boolean
  mode: "dark" | "light"
}

const MinimumRailroad: React.FC<Props> = ({
  regex,
  selected = false,
  mode,
}) => {
  const rootRenderNode = traverse.render(parser.parse(regex))

  const selectedIds = selected
    ? rootRenderNode.children
        .filter((child) => child.type === "node")
        .map((child) => (child as RenderNode).id)
    : []
  return (
    <GeistProvider themeType={mode}>
      <CssBaseline />
      <SvgContainer
        rootRenderNode={rootRenderNode}
        selectedIds={selectedIds}
        minimum={true}
      />
    </GeistProvider>
  )
}

export default MinimumRailroad
