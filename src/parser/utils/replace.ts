import * as AST from "../ast"
import visit from "../visit"
export function replaceFromLists(
  nodeList: AST.Node[],
  oldNodes: AST.Node[],
  newNodes: AST.Node[]
) {
  const start = oldNodes[0]
  const startIndex = nodeList.findIndex(({ id }) => id === start.id)
  if (startIndex === -1) {
    return
  }
  nodeList.splice(startIndex, oldNodes.length, ...newNodes)
}

export function replace(
  nodes: AST.Node[],
  oldNodes: AST.Node[],
  newNodes: AST.Node[]
) {
  visit(nodes, oldNodes[0]?.id, (_, nodeList) => {
    replaceFromLists(nodeList, oldNodes, newNodes)
  })
}
