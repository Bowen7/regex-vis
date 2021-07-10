import { Node, Quantifier } from "@/types"
import parser from "@/parser"
import { NodesInfo, Group, Character } from "@/types"

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  character: null,
  quantifier: null,
  showQuantifier: false,
  id: "",
})

const getGroupInfo = (nodes: Node[]): Group => {
  if (nodes.length !== 1) {
    return { kind: "nonGroup" }
  }
  const node = nodes[0]
  if (node.type !== "group") {
    return { kind: "nonGroup" }
  }
  const kind = node.value.kind
  if (node.value.kind === "namedCapturing" || node.value.kind === "capturing") {
    return { kind, name: node.value.name }
  }
  return { kind } as Group
}

const getCharacterInfo = (nodes: Node[]): Character | null => {
  if (nodes.length === 1 && nodes[0].type === "character") {
    return nodes[0].value
  }
  return null
}

const getQuantifierInfo = (
  nodes: Node[]
): { quantifier: Quantifier | null; showQuantifier: boolean } => {
  let quantifier = null
  let showQuantifier = false
  if (nodes.length === 1 && nodes[0].quantifier) {
    quantifier = nodes[0].quantifier
  }
  if (nodes.length === 1 && !["choice", "root"].includes(nodes[0].type)) {
    showQuantifier = true
  }
  return { quantifier, showQuantifier }
}

const getId = (nodes: Node[]): string => {
  if (nodes.length === 1) {
    return nodes[0].id
  }
  return ""
}

export function getInfoFromNodes(nodes: Node[]): NodesInfo {
  const expression = parser.gen(nodes)
  const group = getGroupInfo(nodes)
  const character = getCharacterInfo(nodes)
  const quantifier = getQuantifierInfo(nodes)
  const id = getId(nodes)
  return { id, expression, group, character, ...quantifier }
}
