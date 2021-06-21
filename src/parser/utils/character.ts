import produce from "immer"
import { Character, Node, CharacterNode } from "@/types"
import { getNodeById } from "../visit"
import { characterClassTextMap, CharacterClassKey } from "./character-class"
function updateCharacterNode(node: CharacterNode, val: Character) {
  node.val = val
  switch (val.type) {
    case "string":
      node.texts = [val.value]
      break
    case "class":
      node.texts = [characterClassTextMap[val.value as CharacterClassKey]]
      break
    case "ranges":
      node.texts = val.value
        .filter((range) => range.from && range.to)
        .map((range) =>
          range.from === range.to ? range.from : range.from + "-" + range.to
        )
      break
  }
}
export default (nodes: Node[], id: string, val: Character) =>
  produce(nodes, (draft) => {
    const node = getNodeById(draft, id) as CharacterNode
    updateCharacterNode(node, val)
  })
