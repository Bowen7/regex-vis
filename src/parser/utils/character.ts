import produce from "immer"
import * as AST from "../ast"
import { getNodeById } from "../visit"
const updateCharacterNode = (
  nodes: AST.Node[],
  id: string,
  character: AST.Character
) =>
  produce(nodes, (draft) => {
    const { node, nodeList, index } = getNodeById(draft, id)
    console.log(node, Array.from(nodeList), index)
    const { type, quantifier } = node as AST.CharacterNode
    if (character.kind === "ranges") {
      const { kind, negate, ranges } = character
      nodeList[index] = {
        id,
        type,
        kind,
        negate,
        ranges,
        quantifier,
      }
    } else {
      const { kind, value } = character
      nodeList[index] = { id, type, kind, value, quantifier }
    }
  })

export default updateCharacterNode
