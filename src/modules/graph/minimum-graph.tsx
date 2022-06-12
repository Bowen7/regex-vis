import React from "react"
import { nanoid } from "nanoid"
import renderEngine from "./rendering-engine"
import SvgContainer from "./container"
import { parse, AST } from "@/parser"
type Props = {
  regex: string
  selected?: boolean
}

const MinimumGraph = React.memo(({ regex, selected = false }: Props) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  return <SvgContainer ast={ast} selectedIds={[]} minimum={true} />
})

export default MinimumGraph
