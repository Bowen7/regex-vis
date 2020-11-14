import { Node, PlaceholderNode, Chain } from "@types"
export function getChainTail(chain: Chain) {
  let tail!: Node
  let cur: Node | null = chain
  while (cur !== null) {
    tail = cur
    cur = cur.next
  }
  return tail
}

export function genPlaceholderNode(): PlaceholderNode {
  return {
    type: "placeholder",
    prev: null,
    next: null,
    parent: null,
    id: "0",
  }
}

export function mapChain(chain: Chain, callback: (node: Node) => void) {
  let cur: Node | null = chain
  while (cur !== null) {
    callback(cur)
    cur = cur.next
  }
}
