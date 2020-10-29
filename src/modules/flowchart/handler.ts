import { NodeMap, BodyNode, Node } from "@types"
class Handler {
  remove() {}
  insert() {}
  select() {}
  h() {
    return {}
  }
}
const _handler = {
  remove(nodeMap: NodeMap, id: number) {
    const node = nodeMap.get(id) as BodyNode
    const { prev, next } = node
    const prevNode = nodeMap.get(prev) as Node
    const nextNode = nodeMap.get(next) as Node
    if (prevNode.type === "choice") {
      const { branches } = prevNode
      // should remove this branch
      if (prev === next) {
        const surviveBranches = branches.filter(branch => branch !== id)
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

          // delete cur node and choice node
          nodeMap.delete(id)
          nodeMap.delete(prev)
        } else {
          prevNode.branches = surviveBranches
          nodeMap.delete(id)
        }
      } else {
        const newBranches = branches.map(branch =>
          branch === id ? next : branch
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
        nodeMap.delete(id)
        nodeMap.delete(group)
      } else {
        nextNode.prev = prev
        prevNode.head = next
        nodeMap.delete(id)
      }
    } else {
      prevNode.next = next
      if (!["choice", "group"].includes(nextNode.type)) {
        nextNode.prev = prev
      }
      nodeMap.delete(id)
    }
  },
  select() {},
}
export default Handler
