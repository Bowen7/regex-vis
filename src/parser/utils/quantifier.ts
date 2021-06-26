import produce from "immer"
import { Node, Quantifier } from "@/types"
import { getNodesByIds } from "../visit"
import { group } from "./group"
export default (
  nodes: Node[],
  selectedIds: string[],
  quantifier: Quantifier | null
) => {
  let nextSelectedIds: string[] = selectedIds
  const nextNodes = produce(nodes, (draft) => {
    let selectedNodes = getNodesByIds(draft, selectedIds)
    if (!quantifier) {
      const node = selectedNodes[0]
      delete node.quantifier
      return
    }

    if (selectedNodes.length === 1) {
      const node = selectedNodes[0]
      if (
        node.type === "character" &&
        node.val.type === "string" &&
        node.val.value.length > 1
      ) {
        nextSelectedIds = group(draft, selectedNodes, "capturing", "")
        selectedNodes = getNodesByIds(draft, nextSelectedIds)
      }
    } else if (selectedNodes.length > 1) {
      nextSelectedIds = group(draft, selectedNodes, "capturing", "")
      selectedNodes = getNodesByIds(draft, nextSelectedIds)
    }

    const node = selectedNodes[0]
    node.quantifier = quantifier
  })
  return { nextNodes, nextSelectedIds }
}

export const getQuantifierText = (quantifier: Quantifier): string => {
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
