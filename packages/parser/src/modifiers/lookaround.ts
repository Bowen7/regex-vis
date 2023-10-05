import { nanoid } from "nanoid"
import * as AST from "../ast"
import { getNodeById, getNodesByIds } from "../visit"
import { replaceFromLists } from "./replace"

export const updateLookAroundAssertion = (
  ast: AST.Regex,
  selectedIds: string[],
  lookAround: {
    kind: "lookahead" | "lookbehind"
    negate: boolean
  }
) => {
  const { node, nodeList, index } = getNodeById(ast, selectedIds[0])
  if (node.type === "lookAroundAssertion") {
    const { id, type, children } = node
    const { kind, negate } = lookAround
    const lookAroundAssertionNode: AST.LookAroundAssertionNode = {
      id,
      type,
      children,
      kind,
      negate,
    }
    nodeList[index] = lookAroundAssertionNode
  }
}

export const lookAroundAssertionSelected = (
  ast: AST.Regex,
  selectedIds: string[],
  kind: "lookahead" | "lookbehind"
) => {
  const id = nanoid()
  const { nodes, nodeList } = getNodesByIds(ast, selectedIds)
  const lookAroundAssertionNode: AST.LookAroundAssertionNode = {
    id,
    type: "lookAroundAssertion",
    kind,
    negate: false,
    children: nodes,
  }
  replaceFromLists(nodeList, nodes, [lookAroundAssertionNode])
  return [id]
}

export const unLookAroundAssertion = (
  ast: AST.Regex,
  selectedIds: string[]
) => {
  let nextSelectedIds: string[] = selectedIds
  const { node, nodeList } = getNodeById(ast, selectedIds[0])
  if (node.type === "lookAroundAssertion") {
    const { children } = node
    replaceFromLists(nodeList, [node], children)
    nextSelectedIds = children.map(({ id }) => id)
  }

  return nextSelectedIds
}
