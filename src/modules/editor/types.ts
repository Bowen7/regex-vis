import { AST } from "@/parser"

export type NodesInfo = {
  id: string
  expression: string
  group: AST.Group | null
  content: AST.Content | null
  hasQuantifier: boolean
  quantifier: AST.Quantifier | null
}
