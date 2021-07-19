import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import { visitTree, getNodeById, getNodesByIds } from "@/parser/visit"
import { replace } from "./replace"

export function group(
  nodes: AST.Node[],
  selectedIds: string[],
  kind: AST.GroupKind | "nonGroup",
  name?: string
) {
  if (selectedIds.length === 1) {
    const { node, nodeList, index } = getNodeById(nodes, selectedIds[0])
    if (node.type === "group") {
      const { id, quantifier, children, type } = node
      let groupNode: AST.GroupNode
      switch (kind) {
        case "nonGroup":
          return removeGroupWrap(nodes, node)
        case "capturing":
          groupNode = { id, type, kind, name: "", children, quantifier }
          break
        case "nonCapturing":
          groupNode = { id, type, kind, children, quantifier }
          break
        case "namedCapturing":
          groupNode = { id, type, kind, name: name!, children, quantifier }
          break
      }
      nodeList[index] = groupNode
      return selectedIds
    }
  }
  let nextSelectedIds: string[] = selectedIds
  const selectedNodes = getNodesByIds(nodes, selectedIds)
  let groupNode: AST.GroupNode
  const id = nanoid()
  const type = "group"
  const quantifier = null
  const children = selectedNodes
  switch (kind) {
    case "capturing":
      groupNode = { id, type, kind, name: "", children, quantifier }
      break
    case "nonCapturing":
      groupNode = { id, type, kind, children, quantifier }
      break
    case "namedCapturing":
      groupNode = { id, type, kind, name: name!, children, quantifier }
      break
  }
  if (groupNode!) {
    replace(nodes, selectedNodes, [groupNode!])
    return [id]
  }
  return nextSelectedIds
}

function removeGroupWrap(nodes: AST.Node[], selectNode: AST.GroupNode) {
  const { children } = selectNode
  replace(nodes, [selectNode], children!)
  return children.map(({ id }) => id)
}

function refreshGroupName(nodes: AST.Node[]) {
  let groupIndex = 1
  visitTree(nodes, (node: AST.Node) => {
    if (node.type === "group" && node.kind === "capturing") {
      node.name = groupIndex++ + ""
    }
  })
}

const updateGroup = (
  nodes: AST.Node[],
  selectedIds: string[],
  type: AST.GroupKind | "nonGroup",
  name?: string
) => {
  let nextSelectedIds: string[] = []
  const nextNodes = produce(nodes, (draft) => {
    nextSelectedIds = group(draft, selectedIds, type, name)
    refreshGroupName(nodes)
  })

  return { nextNodes, nextSelectedIds }
}
export default updateGroup
