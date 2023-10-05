import { nanoid } from "nanoid"
import * as AST from "../ast"
import { getNodesByIds } from "../visit"
import { replaceFromLists } from "./replace"
type InsertDirection = "prev" | "next" | "branch"

const genNode = (): AST.CharacterNode => {
  return {
    id: nanoid(),
    type: "character",
    kind: "string",
    value: "",
    quantifier: null,
  }
}

const genChoiceNode = (): AST.ChoiceNode => {
  return {
    id: nanoid(),
    type: "choice",
    branches: [],
  }
}

export const insertAroundSelected = (
  ast: AST.Regex,
  selectedIds: string[],
  direction: InsertDirection
) => {
  if (selectedIds.length === 0) {
    return
  }
  const newNode = genNode()
  const { nodes, nodeList, index, parent } = getNodesByIds(ast, selectedIds)

  if (direction === "prev") {
    nodeList.splice(index, 0, newNode)
  } else if (direction === "next") {
    nodeList.splice(index + selectedIds.length, 0, newNode)
  } else {
    if (nodes.length === 1 && nodes[0].type === "choice") {
      nodes[0].branches.push([newNode])
    } else if (nodeList.length === nodes.length && parent.type === "choice") {
      parent.branches.push([newNode])
    } else {
      const choiceNode = genChoiceNode()
      choiceNode.branches = [nodes, [newNode]]
      replaceFromLists(nodeList, nodes, [choiceNode])
    }
  }
}
