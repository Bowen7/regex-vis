import React from "react"
import { Atom, Provider } from "jotai"
import { sizeMapAtom, isPrimaryGraphAtom } from "@/atom"
import ASTGraph from "./ast-graph"
import { parse } from "@/parser"
type Props = {
  regex: string
}
const initialValues: (readonly [Atom<unknown>, unknown])[] = [
  [sizeMapAtom, new Map()],
  [isPrimaryGraphAtom, false],
]

const SimpleGraph = React.memo(({ regex }: Props) => {
  const ast = parse(regex)
  if (ast.type === "error") {
    return null
  }
  return (
    <Provider initialValues={initialValues}>
      <ASTGraph ast={ast} />
    </Provider>
  )
})

export default SimpleGraph
