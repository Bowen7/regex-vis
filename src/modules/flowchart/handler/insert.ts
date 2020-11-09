import { NodeMap, BodyNode, Node, SingleNode } from "@types"
import produce from "immer"
import { checkConcatenationHead, checkConcatenationTail } from "./helper"
type InsertDirection = "prev" | "next"
type InsertType = "simple" | "group" | "choice"
function findMaxId(nodeMap: NodeMap) {
  return Math.max(...Array.from(nodeMap.keys()))
}
function _insert(
  nodeMap: NodeMap,
  ids: number[],
  direction: InsertDirection,
  type: InsertType
) {
  if (ids.length === 0) {
    return
  }
  const head = ids[0]
  const tail = ids[ids.length - 1]
  const headNode = nodeMap.get(head) as Node
  const tailNode = nodeMap.get(head) as Node
  let maxId = findMaxId(nodeMap)

  let prev!: number
  let next!: number
  let isConcatenationHead!: boolean
  let isConcatenationTail!: boolean
  if (direction === "prev") {
    prev = headNode.prev as number
    next = head
    isConcatenationHead = checkConcatenationHead(nodeMap, prev)
  } else {
    next = tailNode.next as number
    prev = tail
    isConcatenationTail = checkConcatenationTail(nodeMap, next)
  }
  const prevNode = nodeMap.get(prev) as Node
  const nextNode = nodeMap.get(next) as Node

  const node: SingleNode = {
    id: ++maxId,
    type: "single",
    prev,
    next,
    text: "12",
    content: {
      kind: "simple",
      value: "12",
      text: "12",
    },
  }

  if (direction === "prev") {
    if (isConcatenationHead) {
      if (prevNode.type === "choice") {
        const branches = prevNode.branches
        prevNode.branches = branches.map(branch => {
          return branch === head ? maxId : branch
        })
      }
      if (
        prevNode.type === "group" ||
        prevNode.type === "lookaroundAssertion"
      ) {
        prevNode.head = maxId
      }
    } else {
      prevNode.next = maxId
    }
    nextNode.prev = maxId
  } else {
    if (direction === "next") {
    }
  }
  nodeMap.set(prev, prevNode)
  nodeMap.set(next, nextNode)
  nodeMap.set(maxId, node)
}

const insert = (
  nodeMap: NodeMap,
  ids: number[],
  direction: InsertDirection,
  type: InsertType
) => {
  return produce(nodeMap, draft => {
    _insert(draft, ids, direction, type)
  })
}
export default insert
