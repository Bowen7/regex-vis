import { AST } from "@/parser"

export type Content =
  | { kind: "string" | "class"; value: string }
  | { kind: "ranges"; ranges: AST.Range[]; negate: boolean }
  | { kind: "backRef"; name: string }

export type NodesInfo = {
  id: string
  expression: string
  group: AST.Group | null
  content: Content | null
  hasQuantifier: boolean
  quantifier: AST.Quantifier | null
}
