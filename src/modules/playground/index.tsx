import React from "react"
import { parse, AST } from "@/parser"
import ASTGraph from "@/modules/graph/ast-graph"
const r = "[a-z]"
const ast = parse(r) as AST.Regex

const Playground: React.FC<{}> = () => {
  return (
    <>
      <ASTGraph ast={ast} />
    </>
  )
}
export default Playground
