import { Node } from "@types"
export const groupData = [
  {
    value: "nonGroup",
    label: "Non-Group",
    tip: "Non-Group",
  },
  {
    value: "capturing",
    label: "Capturing Group",
    tip: "Capturing Group",
  },
  {
    value: "nonCapturing",
    label: "Non-capturing group",
    tip: "Non-capturing group",
  },
  {
    value: "namedCapturing",
    label: "Named capturing group",
    tip: "Named capturing group",
  },
]

export function getGroupType(nodes: Node[]) {
  if (nodes.length === 1 && nodes[0].type === "group") {
    const node = nodes[0]
    return node.kind
  }
  return "nonGroup"
}

export function getGroupName(nodes: Node[]) {
  if (
    nodes.length === 1 &&
    nodes[0].type === "group" &&
    nodes[0].kind === "namedCapturing"
  ) {
    return nodes[0].rawName as string
  }
  return ""
}
