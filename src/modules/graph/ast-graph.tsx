import { memo, useState } from "react"
import { Atom, Provider } from "jotai"
import { AST } from "@/parser"
import { sizeMapAtom, isPrimaryGraphAtom } from "@/atom"
import SVGContainer from "./container"
type Props = {
  ast: AST.Regex
  isPrimaryGraph?: boolean
}

const ASTGraph = memo(({ ast, isPrimaryGraph = false }: Props) => {
  const [initialValues] = useState<(readonly [Atom<unknown>, unknown])[]>(
    () => [
      [sizeMapAtom, new Map()],
      [isPrimaryGraphAtom, isPrimaryGraph],
    ]
  )
  return (
    <Provider initialValues={initialValues}>
      <SVGContainer ast={ast} />
    </Provider>
  )
})
ASTGraph.displayName = "ASTGraph"
export default ASTGraph
