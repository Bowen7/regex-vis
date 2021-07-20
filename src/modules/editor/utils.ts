import { AST, gen } from "@/parser"
import { NodesInfo, Content } from "./types"

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  content: null,
  hasQuantifier: false,
  quantifier: null,
  id: "",
})

const getGroupInfo = (nodes: AST.Node[]): AST.Group | null => {
  if (nodes.length !== 1) {
    return null
  }
  const node = nodes[0]
  if (node.type !== "group") {
    return null
  }
  if (node.kind === "namedCapturing" || node.kind === "capturing") {
    return { kind: node.kind, name: node.name }
  }
  return { kind: node.kind }
}

const getContentInfo = (nodes: AST.Node[]): Content | null => {
  if (nodes.length === 1) {
    const node = nodes[0]
    if (node.type === "character") {
      switch (node.kind) {
        case "string":
        case "class":
          return { kind: node.kind, value: node.value }
        case "ranges":
          return { kind: node.kind, ranges: node.ranges, negate: node.negate }
      }
    }
    if (node.type === "backReference") {
      return { kind: "backRef", name: node.name }
    }
  }
  return null
}

const getQuantifierInfo = (
  nodes: AST.Node[]
): { hasQuantifier: boolean; quantifier: AST.Quantifier | null } => {
  if (nodes.length === 1) {
    const node = nodes[0]
    if (node.type === "character" || node.type === "group") {
      return { hasQuantifier: true, quantifier: node.quantifier }
    }
  }
  return { hasQuantifier: true, quantifier: null }
}

const getId = (nodes: AST.Node[]): string => {
  if (nodes.length === 1) {
    return nodes[0].id
  }
  return ""
}

export function getInfoFromNodes(nodes: AST.Node[]): NodesInfo {
  const expression = gen(nodes)
  const group = getGroupInfo(nodes)
  const content = getContentInfo(nodes)
  const quantifierInfo = getQuantifierInfo(nodes)
  const id = getId(nodes)
  return { id, expression, group, content, ...quantifierInfo }
}
