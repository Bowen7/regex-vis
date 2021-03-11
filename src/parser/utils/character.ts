import produce from "immer"
import { Character, Node, CharacterNode } from "@/types"
import { getNodeById } from "../visit"
import { characterClassTextMap, CharacterClassKey } from "./character-class"
function updateCharacterNode(node: CharacterNode, val: Character) {
  node.val = val
  switch (val.type) {
    case "string":
      node.text = val.value
      break
    case "class":
      node.text = characterClassTextMap[val.value as CharacterClassKey]
  }
}
export default (nodes: Node[], id: string, val: Character) =>
  produce(nodes, draft => {
    const node = getNodeById(draft, id) as CharacterNode
    updateCharacterNode(node, val)
  })
