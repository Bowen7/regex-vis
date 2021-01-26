import produce from "immer"
import { Node } from "@/types"
import visit from "../visit"
import { replaceFromLists } from "./replace"
function remove(nodes: Node[], selectedNodes: Node[]) {
  if (selectedNodes.length === 0) {
    return
  }

  visit(nodes, selectedNodes[0].id, (_, nodeList, path) => {
    removeFromList(nodeList, selectedNodes)
    while (path.length !== 0) {
      const { node, nodeList } = path.pop() as { node: Node; nodeList: Node[] }
      if (node?.children && node.children.length === 0) {
        removeFromList(nodeList, [node])
      }
      if (node?.branches) {
        node.branches = node.branches.filter(branch => branch.length > 0)
        if (node.branches.length === 1) {
          replaceFromLists(nodeList, [node], node.branches[0])
        }
        return
      }
    }
  })
}

function removeFromList(nodeList: Node[], nodes: Node[]) {
  const index = nodeList.findIndex(({ id }) => id === nodes[0].id)
  if (index === -1) {
    return
  }
  nodeList.splice(index, nodes.length)
}

export default (nodes: Node[], selectedNodes: Node[]) =>
  produce(nodes, draft => remove(draft, selectedNodes))
