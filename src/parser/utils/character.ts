import produce from "immer"
import { Character, Node } from "@/types"
import { getNodeById } from "../visit"
function updateCharacterNode(node: Node, val: Character) {
  node.val = val
}
export default (nodes: Node[], id: string, val: Character) =>
  produce(nodes, draft => {
    const node = getNodeById(draft, id)
    updateCharacterNode(node, val)
  })
