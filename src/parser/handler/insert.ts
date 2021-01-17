import { RootNode, SingleNode, ChoiceNode, Node, NodeParent } from "@/types"
import { nanoid } from "nanoid"
type InsertDirection = "prev" | "next" | "parallel"
function insert(root: RootNode, nodes: Node[], direction: InsertDirection) {
  if (nodes.length === 0) {
    return
  }
  const start = nodes[0]
  const end = nodes[nodes.length - 1]
  const parent = start.parent
  const newNode = genNode()
  if (direction === "prev") {
    if (start.prev) {
      start.prev.next = newNode
    } else {
      insertHead(newNode, start, parent)
    }
    newNode.prev = start.prev
    newNode.next = start
    newNode.parent = parent
    start.prev = newNode
  } else if (direction === "next") {
    if (end.next) {
      end.next.prev = newNode
    }
    newNode.prev = end
    newNode.next = end.next
    newNode.parent = parent
    end.next = newNode
  } else {
    if (start.prev === null && end.next === null && parent?.type === "choice") {
      parent.chains.push(newNode)
      return
    }

    const choice = genChoiceNode()
    choice.prev = start.prev
    if (start.prev) {
      start.prev.next = choice
    } else {
      insertHead(choice, start, parent)
    }
    choice.next = end.next
    if (end.next) {
      end.next.prev = choice
    }

    choice.parent = parent
    start.prev = null
    end.next = null
    let cur: Node | null = start
    while (cur !== null) {
      cur.parent = choice
      cur = cur.next
    }
    newNode.parent = choice
    choice.chains = [newNode, start]
  }
}

function genNode(): SingleNode {
  return {
    id: nanoid(),
    type: "single",
    prev: null,
    next: null,
    parent: null,
    text: "",
    content: {
      kind: "simple",
      text: "",
    },
  }
}

function genChoiceNode(): ChoiceNode {
  return {
    id: nanoid(),
    type: "choice",
    prev: null,
    next: null,
    parent: null,
    chains: [],
  }
}

export function insertHead(newChain: Node, oldChain: Node, parent: NodeParent) {
  if (!parent) {
    return
  }
  if (parent.type === "choice") {
    const { chains } = parent
    parent.chains = chains.map(chain => (chain === oldChain ? newChain : chain))
  } else {
    parent.chain = newChain
  }
}
export default insert
