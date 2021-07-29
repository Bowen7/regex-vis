import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import { getNodeById, getNodesByIds } from "../visit"
import replaceIt from "./replace"

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
    const nodes = getNodesByIds(draft, selectedIds)
    const lookAroundAssertionNode: AST.LookAroundAssertionNode = {
      id,
      type: "lookAroundAssertion",
      kind,
      negate: false,
      children: nodes,
    }
    replaceIt(draft, nodes, [lookAroundAssertionNode])
  })
  return { nextAst, nextSelectedIds }
}

export const unLookAroundAssertion = (
  ast: AST.Regex,
  selectedIds: string[]
) => {
  let nextSelectedIds: string[] = selectedIds
  const nextAst = produce(ast, (draft) => {
    const { node } = getNodeById(draft, selectedIds[0])
    if (node.type === "lookAroundAssertion") {
      const { children } = node
      replaceIt(draft, [node], children)
      nextSelectedIds = children.map(({ id }) => id)
    }
  })

  return { nextAst, nextSelectedIds }
}
