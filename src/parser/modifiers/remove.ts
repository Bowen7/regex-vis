import produce from "immer"
import * as AST from "../ast"
import { visit, getNodesByIds } from "../visit"
import { replaceFromLists } from "./replace"
function remove(ast: AST.Regex, selectedNodes: AST.Node[]) {
  if (selectedNodes.length === 0) {
    return
  }

  visit(ast, selectedNodes[0].id, (_, nodeList, path) => {
    removeFromList(nodeList, selectedNodes)
    while (path.length !== 0) {
      const { node, nodeList } = path.pop()!
      if (
        (node.type === "group" || node.type === "lookAroundAssertion") &&
        node.children.length === 0
      ) {
        removeFromList(nodeList, [node])
      }
      if (node.type === "choice") {
        node.branches = node.branches.filter((branch) => branch.length > 0)
        if (node.branches.length === 1) {
          replaceFromLists(nodeList, [node], node.branches[0])
        }
        return
      }
    }
  })
}

function removeFromList(nodeList: AST.Node[], nodes: AST.Node[]) {
  const index = nodeList.findIndex(({ id }) => id === nodes[0].id)
  if (index === -1) {
    return
  }
  nodeList.splice(index, nodes.length)
}

const removeIt = (ast: AST.Regex, selectedIds: string[]) =>
  produce(ast, (draft) => remove(draft, getNodesByIds(draft, selectedIds)))

export default removeIt
