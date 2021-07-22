import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import { getNodeById, getNodesByIds } from "../visit"
import replaceIt from "./replace"

export function group(
  ast: AST.Regex,
  selectedIds: string[],
  kind: AST.GroupKind | "nonGroup",
  name?: string
) {
  if (selectedIds.length === 1) {
    const { node, nodeList, index } = getNodeById(ast, selectedIds[0])
    if (node.type === "group") {
      const { id, quantifier, children, type } = node
      let groupNode: AST.GroupNode
      switch (kind) {
        case "nonGroup":
          return removeGroupWrap(ast, node)
        case "capturing":
          groupNode = {
            id,
            type,
            kind,
            name: "",
            index: 0,
            children,
            quantifier,
          }
          break
        case "nonCapturing":
          groupNode = { id, type, kind, children, quantifier }
          break
        case "namedCapturing":
          groupNode = {
            id,
            type,
            kind,
            name: name!,
            index: 0,
            children,
            quantifier,
          }
          break
      }
      nodeList[index] = groupNode
      return selectedIds
    }
  }
  let nextSelectedIds: string[] = selectedIds
  const selectedNodes = getNodesByIds(ast, selectedIds)
  let groupNode: AST.GroupNode
  const id = nanoid()
  const type = "group"
  const quantifier = null
  const children = selectedNodes
  switch (kind) {
    case "capturing":
      groupNode = { id, type, kind, name: "", index: 0, children, quantifier }
      break
    case "nonCapturing":
      groupNode = { id, type, kind, children, quantifier }
      break
    case "namedCapturing":
      groupNode = {
        id,
        type,
        kind,
        name: name!,
        index: 0,
        children,
        quantifier,
      }
      break
  }
  if (groupNode!) {
    replaceIt(ast, selectedNodes, [groupNode!])
    return [id]
  }
  return nextSelectedIds
}

function removeGroupWrap(ast: AST.Regex, selectNode: AST.GroupNode) {
  const { children } = selectNode
  replaceIt(ast, [selectNode], children!)
  return children.map(({ id }) => id)
}

const groupIt = (
  ast: AST.Regex,
  selectedIds: string[],
  type: AST.GroupKind | "nonGroup",
  name?: string
) => {
  let nextSelectedIds: string[] = []
  const nextAst = produce(ast, (draft) => {
    nextSelectedIds = group(draft, selectedIds, type, name)
  })

  return { nextAst, nextSelectedIds }
}
export default groupIt
