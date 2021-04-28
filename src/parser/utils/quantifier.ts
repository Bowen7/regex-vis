import produce from "immer"
import { Node, Quantifier } from "@/types"
import { getNodesByIds } from "../visit"
import { group } from "./group"
export default (
  nodes: Node[],
  selectedIds: string[],
  min: number,
  max: number
) => {
  let nextSelectedIds: string[] = selectedIds
  const nextNodes = produce(nodes, (draft) => {
    let selectedNodes = getNodesByIds(draft, selectedIds)
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
    node.quantifier = { min, max }
  })
  return { nextNodes, nextSelectedIds }
}

export const getQuantifierText = (quantifier: Quantifier) => {
  const { min, max } = quantifier
  let text = ""
  if (max !== Infinity) {
    text += Math.max(0, min - 1)
    if (max !== min) {
      text += " - "
      text += max - 1
    }
    text += " times"
  }
  return text
}
