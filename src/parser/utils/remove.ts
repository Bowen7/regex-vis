import { Node, RootNode } from "@/types"
function remove(root: RootNode, nodes: Node[]) {
  // if (nodes.length === 0) {
  //   return
  // }
  // const start = nodes[0]
  // const end = nodes[nodes.length - 1]
  // const parent = start.parent
  // // if start.prev === null, should change its parent.chain/chains
  // if (start.prev === null) {
  //   // parent must not be null. if parent was null, start.prev wound be RootNode
  //   if (!parent) {
  //     return
  //   }
  //   // remove the chain
  //   if (end.next === null) {
  //     removeChain(root, start)
  //     return
  //   }
  //   const newChain = end.next
  //   newChain!.prev = null
  //   if (parent.type === "choice") {
  //     parent.chains = parent.chains.filter(chain =>
  //       chain === start ? newChain : chain
  //     )
  //   } else {
  //     parent.chain = newChain
  //   }
  // } else {
  //   start.prev.next = end.next
  //   if (end.next) {
  //     end.next.prev = start.prev
  //   }
  // }
}

function removeChain(root: RootNode, start: Node) {
  // const { parent } = start
  // if (!parent) {
  //   return
  // }
  // if (parent.type === "choice") {
  //   // aliveChain will replace parent
  //   if (parent.chains.length === 2) {
  //     const aliveChain = parent.chains.filter(chain => chain !== start)[0]
  //     let aliveChainTail = getChainTail(aliveChain as Node)
  //     let cur: Node | null = aliveChain
  //     cur = aliveChain
  //     while (cur !== aliveChainTail!.next) {
  //       cur!.parent = parent.parent
  //       cur = cur!.next
  //     }
  //     aliveChain.prev = parent!.prev
  //     parent.prev && (parent.prev.next = aliveChain)
  //     aliveChainTail.next = parent.next
  //     parent.next && (parent.next.prev = aliveChainTail)
  //   } else {
  //     // remove the chain
  //     parent.chains = parent.chains.filter(chain => chain !== start)
  //   }
  //   return
  // } else {
  //   // remove parent
  //   remove(root, [parent as Node])
  // }
}
export default remove
