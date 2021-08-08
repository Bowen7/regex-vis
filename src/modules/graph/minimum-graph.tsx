import React from "react"
import { nanoid } from "nanoid"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { parse, AST } from "@/parser"
type Props = {
  regex: string
  selected?: boolean
  withRoot?: boolean
}

const head: AST.RootNode = { id: nanoid(), type: "root" }
const tail: AST.RootNode = { id: nanoid(), type: "root" }
const MinimumGraph: React.FC<Props> = ({ regex, withRoot = false }) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  if (withRoot) {
    ast.body.unshift(head)
    ast.body.push(tail)
  }
  const renderInfo = renderEngine.render(ast, true)
  return <SvgContainer {...renderInfo} selectedIds={[]} minimum={true} />
}

export default MinimumGraph
