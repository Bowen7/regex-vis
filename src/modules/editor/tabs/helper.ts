import { Node, SingleNode } from "@/types"
import parser from "@/parser"
export type NodesInfo = {
  expression: string
  groupType: string
  groupName: string
  characterKind: string
}

export const genInitialNodesInfo = (): NodesInfo => ({
  expression: "",
  groupType: "nonGroup",
  groupName: "",
  characterKind: "",
})
function getGroupType(node: Node) {
  if (node.type === "group") {
    return node.val.kind
  }
  return "nonGroup"
}

function getGroupName(node: Node) {
  if (node.type === "group" && node.val.kind === "namedCapturing") {
    return node.val.name as string
  }
  return ""
}

function getCharacterKind(node: SingleNode) {
  const { val } = node
  return val.kind
}

export function getInfoFromNodes(nodes: Node[]): NodesInfo {
  const info = genInitialNodesInfo()
  info.expression = parser.gen(nodes)

  if (nodes.length === 1) {
    info.groupType = getGroupType(nodes[0])
    info.groupName = getGroupName(nodes[0])
  }

  if (nodes.length === 1 && nodes[0].type === "single") {
    info.characterKind = getCharacterKind(nodes[0])
  }
  return info
}
