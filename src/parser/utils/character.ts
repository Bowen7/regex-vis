import produce from "immer"
import { Character, Node, CharacterNode } from "@/types"
import { getNodeById } from "../visit"
function updateCharacterNode(node: CharacterNode, value: Character) {
  node.value = value
}
export default (nodes: Node[], id: string, val: Character) =>
  produce(nodes, (draft) => {
    const node = getNodeById(draft, id) as CharacterNode
    updateCharacterNode(node, val)
  })
