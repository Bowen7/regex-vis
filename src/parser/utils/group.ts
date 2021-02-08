import { nanoid } from "nanoid"
import produce from "immer"
import { Node, GroupNode, GroupKind } from "@/types"
import visit, { visitTree } from "@/parser/visit"
import { replace } from "./replace"

function group(
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
      val: {
        kind: "capturing",
        name: "",
        namePrefix: "Group #",
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
  const { val } = selectedNode
  switch (type) {
    case "nonGroup":
      return removeGroupWrap(nodes, selectedNode)
    case "capturing":
      val.kind = "capturing"
      break
    case "namedCapturing":
      val.kind = "namedCapturing"
      val.name = name
      break
    case "nonCapturing":
      val.kind = "nonCapturing"
      delete val.name
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
    if (node.type === "group" && node.val.kind === "capturing") {
      node.val.name = groupIndex++ + ""
    }
  })
}

export default (
  nodes: Node[],
  selectedNodes: Node[],
  type: GroupKind | "nonGroup",
  name?: string
) => {
  let nextSelectedIds: string[] = []
  let nextSelectedNodes: Node[] = []
  const nextNodes = produce(nodes, draft => {
    nextSelectedIds = group(draft, selectedNodes, type, name)
  })

  if (nextSelectedIds.length > 0) {
    const headId = nextSelectedIds[0]
    visit(nextNodes, headId, (_, nodeList) => {
      const startIndex = nodeList.findIndex(({ id }) => id === headId)
      if (startIndex !== -1) {
        nextSelectedNodes = nodeList.slice(
          startIndex,
          startIndex + nextSelectedIds.length
        )
      }
    })
  }
  return { nextNodes, nextSelectedNodes }
}
