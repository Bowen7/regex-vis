import { RootNode, Node } from "@/types"
type Handler = (node: Node) => void | boolean
function traverse(root: RootNode, handler: Handler) {
  traverseChain(root, handler)
}
function traverseChain(start: Node, handler: Handler) {
  let cur: Node | null = start
  while (cur !== null) {
    traverseNode(cur, handler)
    cur = cur.next
  }
}
function traverseNode(node: Node, handler: Handler) {
  handler(node)
  switch (node.type) {
    case "group":
    case "lookaroundAssertion":
      traverseChain(node.chain as Node, handler)
      break
    case "choice": {
      const chains = node.chains
      for (let i = 0; i < chains.length; i++) {
        traverseChain(chains[i] as Node, handler)
      }
      break
    }

    default:
      break
  }
}
export default traverse
