import React from "react"
import { parse, AST } from "@/parser"
import Container from "@/modules/graph/container"
const r = "[a-z]"
const ast = parse(r) as AST.Regex

const Playground: React.FC<{}> = () => {
  return (
    <>
      <Container ast={ast} />
    </>
  )
}
export default Playground
