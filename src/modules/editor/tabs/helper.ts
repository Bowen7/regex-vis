import { Node } from "@/types"
import parser from "@/parser"
export type NodesInfo = {
  expression: string
  groupType: string
  groupName: string
}
function getGroupType(nodes: Node[]) {
  if (nodes.length === 1 && nodes[0].type === "group") {
    const node = nodes[0]
    return node.kind
  }
  return "nonGroup"
}

function getGroupName(nodes: Node[]) {
  if (
    nodes.length === 1 &&
    nodes[0].type === "group" &&
    nodes[0].kind === "namedCapturing"
  ) {
    return nodes[0].rawName as string
  }
  return ""
}

export function getInfoFromNodes(nodes: Node[]): NodesInfo {
  const start = nodes[0]
  const end = nodes[nodes.length - 1]
  const expression = parser.gen(start, end)

  const groupType = getGroupType(nodes)
  const groupName = getGroupName(nodes)
  return { expression, groupType, groupName }
}
