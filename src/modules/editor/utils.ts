import { AST, gen } from "@/parser"

export type NodesInfo = {
  id: string
  expression: string
  group: AST.Group | null
  lookAround: { kind: "lookahead" | "lookbehind"; negate: boolean } | null
  content: AST.Content | null
  hasQuantifier: boolean
  quantifier: AST.Quantifier | null
}

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  lookAround: null,
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
    return { kind: node.kind, name: node.name, index: node.index }
  }
  return { kind: node.kind }
}

const getContentInfo = (nodes: AST.Node[]): AST.Content | null => {
  if (nodes.length === 1) {
    const node = nodes[0]
    switch (node.type) {
      case "character":
        if (node.kind === "ranges") {
          return { kind: node.kind, ranges: node.ranges, negate: node.negate }
        }
        return { kind: node.kind, value: node.value }
      case "backReference":
        return { kind: "backReference", ref: node.ref }
      case "boundaryAssertion":
        if (node.kind === "word") {
          return { kind: "wordBoundaryAssertion", negate: node.negate }
        } else if (node.kind === "beginning") {
          return { kind: "beginningAssertion" }
        } else {
          return { kind: "endAssertion" }
        }
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
  return { hasQuantifier: false, quantifier: null }
}

const getLookAroundInfo = (
  nodes: AST.Node[]
): { kind: "lookahead" | "lookbehind"; negate: boolean } | null => {
  if (nodes.length === 1) {
    const node = nodes[0]
    if (node.type === "lookAroundAssertion") {
      const { kind, negate } = node
      return { kind, negate }
    }
  }
  return null
}

const getId = (nodes: AST.Node[]): string => {
  if (nodes.length === 1) {
    return nodes[0].id
  }
  return ""
}

export function getInfoFromNodes(
  nodes: AST.Node[],
  isLiteral = false
): NodesInfo {
  const expression = gen(nodes, isLiteral)
  const group = getGroupInfo(nodes)
  const content = getContentInfo(nodes)
  const quantifierInfo = getQuantifierInfo(nodes)
  const lookAround = getLookAroundInfo(nodes)
  const id = getId(nodes)
  return { id, expression, group, content, lookAround, ...quantifierInfo }
}
