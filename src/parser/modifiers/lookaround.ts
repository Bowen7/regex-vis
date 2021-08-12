import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import { getNodeById, getNodesByIds } from "../visit"
import { replaceFromLists } from "./replace"

export const updateLookAroundAssertion = (
  ast: AST.Regex,
  selectedIds: string[],
  kind: "lookahead" | "lookbehind",
  negate: boolean
) => {
  let nextSelectedIds: string[] = selectedIds
  const nextAst = produce(ast, (draft) => {
    const { node, nodeList, index } = getNodeById(draft, selectedIds[0])
    if (node.type === "lookAroundAssertion") {
      const { id, type, children } = node
      const lookAroundAssertionNode: AST.LookAroundAssertionNode = {
        id,
        type,
        children,
        kind,
        negate,
      }
      nodeList[index] = lookAroundAssertionNode
    }
  })

  return { nextAst, nextSelectedIds }
}

export const lookAroundAssertionIt = (
  ast: AST.Regex,
  selectedIds: string[],
  kind: "lookahead" | "lookbehind"
) => {
  const id = nanoid()
  const nextSelectedIds: string[] = [id]
  const nextAst = produce(ast, (draft) => {
    const { nodes, nodeList } = getNodesByIds(draft, selectedIds)
    const lookAroundAssertionNode: AST.LookAroundAssertionNode = {
      id,
      type: "lookAroundAssertion",
      kind,
      negate: false,
      children: nodes,
    }
    replaceFromLists(nodeList, nodes, [lookAroundAssertionNode])
  })
  return { nextAst, nextSelectedIds }
}

export const unLookAroundAssertion = (
  ast: AST.Regex,
  selectedIds: string[]
) => {
  let nextSelectedIds: string[] = selectedIds
  const nextAst = produce(ast, (draft) => {
    const { node, nodeList } = getNodeById(draft, selectedIds[0])
    if (node.type === "lookAroundAssertion") {
      const { children } = node
      replaceFromLists(nodeList, [node], children)
      nextSelectedIds = children.map(({ id }) => id)
    }
  })

  return { nextAst, nextSelectedIds }
}
