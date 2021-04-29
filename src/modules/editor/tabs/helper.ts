import { Node, Quantifier } from "@/types"
import parser from "@/parser"
import { NodesInfo, Group, Character } from "@/types"

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  character: null,
  quantifier: null,
  id: "",
})

const getGroupInfo = (nodes: Node[]): Group | null => {
  if (nodes.length !== 1) {
    return { type: "nonGroup" }
  }
  const node = nodes[0]
  const type = node.type === "group" ? node.val.kind : "nonGroup"
  return type === "namedCapturing" ? { type, name: node.val.name } : { type }
}

const getCharacterInfo = (nodes: Node[]): Character | null => {
  if (nodes.length === 1 && nodes[0].type === "character") {
    return nodes[0].val
  }
  return null
}

const getQuantifierInfo = (nodes: Node[]): Quantifier => {
  if (nodes.length === 1 && nodes[0].quantifier) {
    return nodes[0].quantifier
  }
  return { max: 1, min: 1 }
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
  return { id, expression, group, character, quantifier }
}
