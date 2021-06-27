import { nanoid } from "nanoid"
import produce from "immer"
import { Node, GroupNode, GroupKind } from "@/types"
import { visitTree, getNodesByIds } from "@/parser/visit"
import { replace } from "./replace"

export function group(
  nodes: Node[],
  selectedNodes: Node[],
  type: GroupKind | "nonGroup",
  name?: string
) {
  let nextSelectedIds: string[] = []
  if (selectedNodes.length === 1 && selectedNodes[0].type === "group") {
    nextSelectedIds = changeGroupType(nodes, selectedNodes[0], type, name)
  } else {
    const groupNode: GroupNode = {
      id: nanoid(),
      type: "group",
      value: {
        kind: "capturing",
        name: "",
      },
      children: selectedNodes,
    }

    replace(nodes, selectedNodes, [groupNode])
    nextSelectedIds = changeGroupType(nodes, groupNode, type, name)
  }
  refreshGroupName(nodes)
  return nextSelectedIds
}

function changeGroupType(
  nodes: Node[],
  selectedNode: GroupNode,
  type: GroupKind | "nonGroup",
  name?: string
) {
  switch (type) {
    case "nonGroup":
      return removeGroupWrap(nodes, selectedNode)
    case "capturing":
      selectedNode.value = {
        kind: "capturing",
        name: "",
      }
      break
    case "namedCapturing":
      selectedNode.value = {
        kind: "namedCapturing",
        name: name as string,
      }
      break
    case "nonCapturing":
      selectedNode.value = {
        kind: "nonCapturing",
      }
      break
    default:
      return []
  }
  return [selectedNode.id]
}

function removeGroupWrap(nodes: Node[], selectNode: GroupNode) {
  const { children } = selectNode
  replace(nodes, [selectNode], children!)
  return children!.map(({ id }) => id)
}

function refreshGroupName(nodes: Node[]) {
  let groupIndex = 1
  visitTree(nodes, (node: Node) => {
    if (node.type === "group" && node.value.kind === "capturing") {
      node.value.name = groupIndex++ + ""
    }
  })
}

export default (
  nodes: Node[],
  selectedIds: string[],
  type: GroupKind | "nonGroup",
  name?: string
) => {
  let nextSelectedIds: string[] = []
  const nextNodes = produce(nodes, (draft) => {
    const selectedNodes = getNodesByIds(draft, selectedIds)
    nextSelectedIds = group(draft, selectedNodes, type, name)
  })

  return { nextNodes, nextSelectedIds }
}
