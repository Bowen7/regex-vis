import { Node } from "@types"
export const groupData = [
  {
    value: "nonGroup",
    label: "Non-Group",
  },
  {
    value: "capturing",
    label: "Capturing Group",
    tip: "(x): Matches x and remembers the match",
  },
  {
    value: "nonCapturing",
    label: "Non-capturing group",
    tip: `(?:x): Matches "x" but does not remember the match`,
  },
  {
    value: "namedCapturing",
    label: "Named capturing group",
    tip: `(?<Name>x): Matches "x" and stores it on the groups property of the returned matches under the name specified by <Name>`,
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
