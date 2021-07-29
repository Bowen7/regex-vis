import produce from "immer"
import * as AST from "../ast"
import { getNodeById } from "../visit"
const updateQuantifier = (
  ast: AST.Regex,
  selectedId: string,
  quantifier: AST.Quantifier | null
) =>
  produce(ast, (draft) => {
    const { node } = getNodeById(draft, selectedId)
    if (node.type === "character" || node.type === "group") {
      node.quantifier = quantifier
    }
  })

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
