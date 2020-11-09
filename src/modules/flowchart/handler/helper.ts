import { NodeMap, Node } from "@types"
export function checkConcatenationHead(nodeMap: NodeMap, id: number) {
  const node = nodeMap.get(id) as Node
  const prev = node.prev as number
  const prevNode = nodeMap.get(prev) as Node
  if (prevNode.type === "lookaroundAssertion" || prevNode.type === "group") {
    return prevNode.head === id
  }
  if (prevNode.type === "choice") {
    return prevNode.branches.includes(id)
  }
  return false
}
export function checkConcatenationTail(nodeMap: NodeMap, id: number) {
  const node = nodeMap.get(id) as Node
  const next = node.next as number
  const nextNode = nodeMap.get(next) as Node

  if (["lookaroundAssertion", "group", "choice"].includes(nextNode.type)) {
    return nextNode.prev !== id
  }
  return false
}
