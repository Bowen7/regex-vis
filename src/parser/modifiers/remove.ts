import produce from "immer"
import * as AST from "../ast"
import { replaceFromLists } from "./replace"

type Path = { node: AST.Node; nodeList: AST.Node[] }
function visit(
  ast: AST.Regex | AST.Node[],
  id: string,
  paths: Path[] = [],
  callback: () => void
): true | void {
  const nodes = Array.isArray(ast) ? ast : ast.body
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.id === id) {
      paths.push({ node, nodeList: nodes })
      callback()
      return true
    }

    if (
      node.type === "choice" ||
      node.type === "group" ||
      node.type === "lookAroundAssertion"
    ) {
      paths.push({ nodeList: nodes, node })
      if (node.type === "choice") {
        const branches = node.branches
        for (let i = 0; i < branches.length; i++) {
          if (visit(branches[i], id, paths, callback)) {
            return true
          }
        }
      } else {
        if (visit(node.children, id, paths, callback)) {
          return true
        }
      }
      paths.pop()
    }
  }
}

function remove(ast: AST.Regex, selectedIds: string[]) {
  if (selectedIds.length === 0) {
    return
  }

  const paths: Path[] = []
  visit(ast, selectedIds[0], paths, () => {
    const { nodeList } = paths.pop()!
    removeFromList(nodeList, selectedIds)
    while (paths.length !== 0) {
      const { node, nodeList } = paths.pop()!
      if (
        (node.type === "group" || node.type === "lookAroundAssertion") &&
        node.children.length === 0
      ) {
        removeFromList(nodeList, [node.id])
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

function removeFromList(nodeList: AST.Node[], ids: string[]) {
  const index = nodeList.findIndex(({ id }) => id === ids[0])
  if (index === -1) {
    return
  }
  nodeList.splice(index, ids.length)
}

const removeIt = (ast: AST.Regex, selectedIds: string[]) =>
  produce(ast, (draft) => remove(draft, selectedIds))

export default removeIt
