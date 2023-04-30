import { memo, useState } from "react"
import { Atom, Provider } from "jotai"
import { AST } from "@/parser"
import { sizeMapAtom, isPrimaryGraphAtom } from "@/atom"
import SVGContainer from "./container"
type Props = {
  ast: AST.Regex
}

const ASTGraph = memo(({ ast }: Props) => {
  return <SVGContainer ast={ast} />
})
ASTGraph.displayName = "ASTGraph"
export default ASTGraph
