import React from "react"
import { parse, AST } from "@/parser"
import Container from "@/modules/graph/container"
const r = "^abc|\\d123[1-34-6]\\2"
console.log(parse("[1231]"))
const ast = parse(r) as AST.Regex
const Playground: React.FC<{}> = () => {
  return (
    <>
      <Container ast={ast} />
    </>
  )
}
export default Playground
