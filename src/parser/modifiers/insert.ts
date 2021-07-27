import { nanoid } from "nanoid"
import produce from "immer"
import * as AST from "../ast"
import { getNodeById } from "../visit"
import { replaceFromLists } from "./replace"
type InsertDirection = "prev" | "next" | "branch"

function insert(
  ast: AST.Regex,
  selectedIds: string[],
  direction: InsertDirection
) {
  if (selectedIds.length === 0) {
    return
  }
  const node = genNode()
  const startId = selectedIds[0]
  const { nodeList, index, parent } = getNodeById(ast, startId)

  if (direction === "prev") {
    nodeList.splice(index, 0, node)
  } else if (direction === "next") {
    nodeList.splice(index + selectedIds.length, 0, node)
  } else {
    const selectedNodes = nodeList.slice(index, index + selectedIds.length)
    if (selectedNodes.length === 0 && selectedNodes[0].type === "choice") {
      selectedNodes[0].branches.push([node])
    } else {
      const nodeListWithoutRoot = nodeList.filter(
        (node) => node.type !== "root"
      )
      if (
        nodeListWithoutRoot.length === selectedNodes.length &&
        startId === nodeListWithoutRoot[0].id
      ) {
        if (parent.type === "choice") {
          parent.branches.push([node])
        } else {
          const choiceNode = genChoiceNode()
          choiceNode.branches = [[node], selectedNodes]
          replaceFromLists(nodeList, selectedNodes, [choiceNode])
        }
      } else {
        const groupNode = genGroupNode()
        const choiceNode = genChoiceNode()
        choiceNode.branches = [[node], selectedNodes]
        groupNode.children = [choiceNode]
        replaceFromLists(nodeList, selectedNodes, [groupNode])
      }
    }
  }
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

function genGroupNode(): AST.GroupNode {
  return {
    id: nanoid(),
    type: "group",
    kind: "nonCapturing",
    children: [],
    quantifier: null,
  }
}

const insertIt = (
  ast: AST.Regex,
  selectedIds: string[],
  direction: InsertDirection
) => produce(ast, (draft) => insert(draft, selectedIds, direction))

export default insertIt
