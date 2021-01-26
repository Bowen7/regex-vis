import { Node } from '@/types'
import visit from '../visit'
export function replaceFromLists(
  nodeList: Node[],
  oldNodes: Node[],
  newNodes: Node[]
) {
  const start = oldNodes[0]
  const startIndex = nodeList.indexOf(start)
  nodeList.splice(startIndex, oldNodes.length, ...newNodes)
}

export function replace(nodes: Node[], oldNodes: Node[], newNodes: Node[]) {
  visit(nodes, oldNodes[0]?.id, (_, nodeList) => {
    replaceFromLists(nodeList, oldNodes, newNodes)
  })
}
