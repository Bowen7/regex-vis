import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import visit, { getNodesByIds } from "@/parser/visit"
import { replaceFromLists } from "./replace"
type InsertDirection = "prev" | "next" | "branch"

function insert(
  nodes: AST.Node[],
  selectedNodes: AST.Node[],
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
      if (selectedNodes.length === 1 && selectedNodes[0].type === "choice") {
        selectedNodes[0].branches.push([node])
      } else {
        const choiceNode = genChoiceNode()
        choiceNode.branches = [[node], selectedNodes]

        replaceFromLists(nodeList, selectedNodes, [choiceNode])
      }
    }
  })
}

function genNode(): AST.CharacterNode {
  return {
    id: nanoid(),
    type: "character",
    kind: "string",
    value: "",
    quantifier: null,
  }
}

function genChoiceNode(): AST.ChoiceNode {
  return {
    id: nanoid(),
    type: "choice",
    branches: [],
  }
}

const insertNode = (
  nodes: AST.Node[],
  selectedIds: string[],
  direction: InsertDirection
) =>
  produce(nodes, (draft) =>
    insert(draft, getNodesByIds(draft, selectedIds), direction)
  )

export default insertNode
