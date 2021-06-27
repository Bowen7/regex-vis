import { nanoid } from "nanoid"
import produce from "immer"
import { CharacterNode, ChoiceNode, Node } from "@/types"
import visit, { getNodesByIds } from "@/parser/visit"
import { replaceFromLists } from "./replace"
type InsertDirection = "prev" | "next" | "branch"
function insert(
  nodes: Node[],
  selectedNodes: Node[],
  direction: InsertDirection
) {
  if (selectedNodes.length === 0) {
    return
  }
  const start = selectedNodes[0]
  visit(nodes, start.id, (_, nodeList) => {
    const startIndex = nodeList.findIndex(({ id }) => id === start.id)
    if (startIndex === -1) {
      return
    }
    const endIndex = startIndex + selectedNodes.length - 1

    const node = genNode()
    if (direction === "prev") {
      nodeList.splice(startIndex, 0, node)
    } else if (direction === "next") {
      nodeList.splice(endIndex + 1, 0, node)
    } else {
      if (selectedNodes.length === 1 && selectedNodes[0].branches) {
        selectedNodes[0].branches.push([node])
      } else {
        const choiceNode = genChoiceNode()
        choiceNode.branches = [[node], selectedNodes]

        replaceFromLists(nodeList, selectedNodes, [choiceNode])
      }
    }
  })
}

function genNode(): CharacterNode {
  return {
    id: nanoid(),
    type: "character",
    value: {
      kind: "string",
      value: "",
    },
  }
}

function genChoiceNode(): ChoiceNode {
  return {
    id: nanoid(),
    type: "choice",
    branches: [],
  }
}

export default (
  nodes: Node[],
  selectedIds: string[],
  direction: InsertDirection
) =>
  produce(nodes, (draft) =>
    insert(draft, getNodesByIds(draft, selectedIds), direction)
  )
