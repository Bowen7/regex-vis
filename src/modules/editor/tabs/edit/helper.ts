import { AST, gen } from "@/parser"
import { NodesInfo } from "../../types"

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  character: null,
  quantifier: undefined,
  id: "",
})

const getGroupInfo = (
  nodes: AST.Node[]
): AST.Group | { kind: "nonGroup" } | null => {
  if (nodes.length !== 1) {
    return { kind: "nonGroup" }
  }
  const node = nodes[0]
  if (node.type !== "group") {
    return { kind: "nonGroup" }
  }
  if (node.kind === "namedCapturing" || node.kind === "capturing") {
    return { kind: node.kind, name: node.name }
  }
  return { kind: node.kind }
}

const getCharacterInfo = (nodes: AST.Node[]): AST.Character | null => {
  if (nodes.length === 1 && nodes[0].type === "character") {
    const node = nodes[0]
    if (node.kind === "ranges") {
      return {
        kind: "ranges",
        ranges: node.ranges,
        negate: node.negate,
      }
    }
    return { kind: node.kind, value: node.value }
  }
  return null
}

const getQuantifierInfo = (
  nodes: AST.Node[]
): AST.Quantifier | null | undefined => {
  if (nodes.length === 1) {
    const node = nodes[0]
    if (node.type === "character" || node.type === "group") {
      return node.quantifier
    }
    return undefined
  }
  return undefined
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
  const character = getCharacterInfo(nodes)
  const quantifier = getQuantifierInfo(nodes)
  const id = getId(nodes)
  return { id, expression, group, character, quantifier }
}
