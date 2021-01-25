import { nanoid } from "nanoid"
import { Node, GroupNode, RootNode, GroupKind } from "@/types"
import { insertHead } from "./insert"
function group(
  root: RootNode,
  nodes: Node[],
  type: GroupKind | "nonGroup",
  name?: string
) {
  // if (nodes.length === 1 && nodes[0].type === "group") {
  //   changeGroupType(nodes[0], type, name)
  // } else {
  //   const head = nodes[0]
  //   const tail = nodes[nodes.length - 1]
  //   const node: GroupNode = {
  //     id: nanoid(),
  //     type: "group",
  //     prev: head.prev,
  //     next: tail.next,
  //     kind: "capturing",
  //     parent: head.parent,
  //     chain: head,
  //   }
  //   head.prev = null
  //   tail.next = null
  //   mapChain(head, item => {
  //     item.parent = node
  //   })
  //   if (node.prev) {
  //     node.prev.next = node
  //   } else {
  //     insertHead(node, node, node.parent)
  //   }
  //   node.next && (node.next.prev = node)
  //   changeGroupType(node, type, name)
  // }
  // refreshGroupName(root)
}
function changeGroupType(
  node: GroupNode,
  type: GroupKind | "nonGroup",
  name?: string
) {
  // switch (type) {
  //   case "nonGroup":
  //     removeGroupWrap(node)
  //     break
  //   case "capturing":
  //     node.kind = "capturing"
  //     break
  //   case "namedCapturing":
  //     node.kind = "namedCapturing"
  //     node.rawName = name
  //     node.name = "Group #" + name
  //     break
  //   case "nonCapturing":
  //     node.kind = "nonCapturing"
  //     delete node.name
  //     delete node.rawName
  //     break
  //   default:
  //     break
  // }
}

function removeGroupWrap(node: GroupNode) {
  // const { chain, parent } = node
  // const tail = getChainTail(chain)
  // mapChain(chain, node => {
  //   node.parent = parent
  // })
  // node.prev!.next = chain
  // chain.prev = node.prev
  // node.next!.prev = tail
  // tail.next = node.next
}

function refreshGroupName(root: RootNode) {
  // let groupIndex = 1
  // traverse(root, (node: Node) => {
  //   if (node.type === "group" && node.kind === "capturing") {
  //     node.name = "Group #" + groupIndex
  //     node.rawName = (groupIndex++).toString()
  //   }
  // })
}
export default group
