import { NodeMap, BodyNode, Node } from "@types"
import produce from "immer"
function _remove(nodeMap: NodeMap, ids: number[]) {
  if (ids.length === 0) {
    return
  }
  const head = ids[0]
  const tail = ids[ids.length - 1]
  const headNode = nodeMap.get(head) as BodyNode
  const tailNode = nodeMap.get(tail) as BodyNode
  const prev = headNode.prev
  const next = tailNode.next
  const prevNode = nodeMap.get(prev) as Node
  const nextNode = nodeMap.get(next) as Node
  if (prevNode.type === "choice") {
    const { branches } = prevNode
    // should remove this branch
    if (prev === next) {
      const surviveBranches = branches.filter(branch => branch !== head)
      // should convert choice to basic
      if (surviveBranches.length === 1) {
        const surviveBranchHead = surviveBranches[0]
        let surviveBranchTail
        let cur = surviveBranchHead
        while (cur !== prev) {
          surviveBranchTail = cur
          const node = nodeMap.get(cur) as BodyNode
          cur = node.next
        }
        const { prev: choicePrev, next: choiceNext } = prevNode
        const choicePrevNode = nodeMap.get(choicePrev) as Node
        const choiceNextNode = nodeMap.get(choiceNext) as Node
        const surviveBranchHeadNode = nodeMap.get(surviveBranchHead) as Node
        const surviveBranchTailNode = nodeMap.get(
          surviveBranchTail as number
        ) as Node
        choicePrevNode.next = surviveBranchHead
        surviveBranchHeadNode.prev = choicePrev
        surviveBranchTailNode.next = choiceNext
        choiceNextNode.prev = surviveBranchTail as number

        // should delete cur node and choice node
        nodeMap.delete(prev)
      } else {
        prevNode.branches = surviveBranches
      }
    } else {
      const newBranches = branches.map(branch =>
        branch === head ? next : branch
      )
      prevNode.branches = newBranches
      nextNode.prev = prev
    }
  } else if (prevNode.type === "group") {
    // should remove this group
    if (prev === next) {
      const group = prev
      const groupNode = prevNode
      const { prev: groupPrev, next: groupNext } = groupNode
      const groupPrevNode = nodeMap.get(groupPrev) as Node
      const groupNextNode = nodeMap.get(groupNext) as Node
      groupPrevNode.next = groupNext
      groupNextNode.prev = groupPrev
      nodeMap.delete(group)
    } else {
      nextNode.prev = prev
      prevNode.head = next
    }
  } else {
    prevNode.next = next
    if (!["choice", "group"].includes(nextNode.type)) {
      nextNode.prev = prev
    }
  }
  ids.forEach(id => nodeMap.delete(id))
}
const remove = (nodeMap: NodeMap, id: number | number[]) => {
  return produce(nodeMap, draft => {
    if (typeof id === "number") {
      id = [id]
    }
    _remove(draft, id)
  })
}
export default remove
