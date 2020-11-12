import { Node, RootNode } from "@types"
function remove(root: RootNode, nodes: Node[]): RootNode {
  if (nodes.length === 0) {
    return root
  }
  const start = nodes[0]
  const end = nodes[nodes.length - 1]
  const parent = start.parent
  // if start.prev === null, should change its parent.chain/chains
  if (start.prev === null) {
    // parent must not be null. if parent was null, start.prev wound be RootNode
    if (!parent) {
      return root
    }
    // remove the chain
    if (end.next === null) {
      return removeChain(root, start)
    }

    const newChain = end.next
    newChain!.prev = null
    if (parent.type === "choice") {
      parent.chains = parent.chains.filter(chain =>
        chain === start ? newChain : chain
      )
    } else {
      parent.chain = newChain
    }
  } else {
    start.prev.next = end.next
    if (end.next) {
      end.next.prev = start.prev
    }
  }
  return { ...root }
}

function removeChain(root: RootNode, start: Node): RootNode {
  const { parent } = start
  if (!parent) {
    return root
  }
  if (parent.type === "choice") {
    // aliveChain will replace parent
    if (parent.chains.length === 2) {
      const aliveChain = parent.chains.filter(chain => chain !== start)[0]
      let cur = aliveChain
      let aliveChainTail = cur
      while (cur!.next !== null) {
        cur = (cur as Node).next
        aliveChainTail = cur
      }
      aliveChain!.prev = parent!.prev
      parent.prev!.next = aliveChain
      aliveChainTail!.next = parent.next
      parent.next!.prev = aliveChainTail
    } else {
      // remove the chain
      parent.chains = parent.chains.filter(chain => chain !== start)
    }
    return { ...root }
  } else {
    // remove parent
    return remove(root, [parent as Node])
  }
}
export default remove
