import React from "react"
import SvgContainer from "./container"
import { parse } from "@/parser"
type Props = {
  regex: string
}

const SimpleGraph = React.memo(({ regex }: Props) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  return <SvgContainer ast={ast} withRoot={false} />
})

export default SimpleGraph
