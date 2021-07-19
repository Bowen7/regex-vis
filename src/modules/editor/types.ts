import { AST } from "@/parser"
export type NodesInfo = {
  id: string
  expression: string
  group: AST.Group | { kind: "nonGroup" } | null
  character: AST.Character | null
  quantifier: AST.Quantifier | null | undefined
}
