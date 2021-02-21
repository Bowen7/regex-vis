import { Node } from "@/types"
import parser from "@/parser"
import { NodesInfo, Group, Character } from "../types"

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  group: null,
  character: null,
})

function getGroupInfo(nodes: Node[]): Group | null {
  if (nodes.length !== 1) {
    return null
  }
  const node = nodes[0]
  const type = node.type === "group" ? node.val.kind : "nonGroup"
  return type === "namedCapturing" ? { type, name: node.val.name } : { type }
}

function getCharacterInfo(nodes: Node[]): Character | null {
  if (nodes.length === 1 && nodes[0].type === "single") {
    const node = nodes[0]
    const { val } = node
    switch (val.kind) {
      case "string":
        return {
          type: val.kind,
          value: val.text,
        }
      case "ranges":
        return { type: val.kind }
      case "special":
        return { type: val.kind }
      default:
        return null
    }
  }
  return null
}

export function getInfoFromNodes(nodes: Node[]): NodesInfo {
  const expression = parser.gen(nodes)
  const group = getGroupInfo(nodes)
  const character = getCharacterInfo(nodes)
  return { expression, group, character }
}
