import produce from "immer"
import { nanoid } from "nanoid"
import * as AST from "../ast"
import { replaceFromLists } from "./replace"
import { getNodeById } from "../visit"
const updateQuantifier = (
  ast: AST.Regex,
  selectedId: string,
  quantifier: AST.Quantifier | null
) => {
  let nextSelectedIds = [selectedId]
  const nextAst = produce(ast, (draft) => {
    const { node, nodeList } = getNodeById(draft, selectedId)
    if (
      node.type === "character" &&
      node.kind === "string" &&
      node.value.length > 1
    ) {
      const groupNode: AST.GroupNode = {
        id: nanoid(),
        type: "group",
        kind: "nonCapturing",
        children: [node],
        quantifier,
      }
      nextSelectedIds = [groupNode.id]
      replaceFromLists(nodeList, [node], [groupNode])
    } else if (node.type === "character" || node.type === "group") {
      node.quantifier = quantifier
    }
  })
  return { nextAst, nextSelectedIds }
}

export default updateQuantifier

export const getQuantifierText = (quantifier: AST.Quantifier): string => {
  let { min, max } = quantifier
  let minText = `${min}`
  let maxText = `${max}`
  if (min === max) {
    return minText
  }
  if (max === Infinity) {
    maxText = "∞"
  }
  return minText + " - " + maxText
}
