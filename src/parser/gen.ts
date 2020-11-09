import {
  Node,
  ChoiceNode,
  GroupNode,
  NodeMap,
  Char,
  Quantifier,
  BodyNode,
  SingleNode,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@types"
import { hasQuantifier } from "../utils"

function gen(nodeMap: NodeMap, ids: number[]) {
  if (ids.length === 0) {
    return ""
  }
  let reStr = ""
  const isSingleChoice = judgeSingleChoice(nodeMap, ids)
  ids.forEach(id => {
    const node = nodeMap.get(id) as Node
    switch (node.type) {
      case "choice":
        const r = genChoice(nodeMap, node)
        if (isSingleChoice) {
          reStr = r
        } else {
          reStr += `(${r})`
        }
        break
      case "group":
        reStr += genGroup(nodeMap, node)
        break
      case "single":
        reStr += genSingle(node)
        break
      case "boundaryAssertion":
        reStr += genBoundaryAssertionNode(node)
        break
      case "lookaroundAssertion":
        reStr += genLookaroundAssertionNode(nodeMap, node)
        break
      default:
        break
    }
    if (hasQuantifier(node) && node.quantifier) {
      reStr += genQuantifier(node as GroupNode | SingleNode)
    }
  })
  return reStr
}
function judgeSingleChoice(nodeMap: NodeMap, ids: number[]) {
  let flag = false
  return !ids.some(id => {
    const node = nodeMap.get(id) as Node
    if (["root"].includes(node.type)) {
      return false
    } else if (node.type === "choice") {
      if (flag) {
        return true
      }
      flag = true
      return false
    } else {
      return true
    }
  })
}
function genChoice(nodeMap: NodeMap, node: ChoiceNode) {
  const { branches, id } = node
  const branchRes: string[] = []
  branches.forEach(branch => {
    const ids = []
    let cur = branch
    while (cur !== id) {
      ids.push(cur)
      const node = nodeMap.get(cur) as BodyNode
      cur = node.next
    }
    branchRes.push(gen(nodeMap, ids))
  })
  return branchRes.join("|")
}
function genGroup(nodeMap: NodeMap, node: GroupNode) {
  const { head, id } = node
  let cur = head
  const ids = []
  while (cur !== id) {
    ids.push(cur)
    const node = nodeMap.get(cur) as BodyNode
    cur = node.next
  }
  return "(" + gen(nodeMap, ids) + ")"
}
function genChar(node: Char, prefix: boolean) {
  if (prefix) {
    node.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
  return node.text
}
function genSingle(node: SingleNode) {
  const { content } = node
  switch (content.kind) {
    case "collection":
      const { negate } = content
      let str = ""
      content.collections.forEach(collection => {
        if (collection.kind === "range") {
          str +=
            genChar(collection.from, false) +
            "-" +
            genChar(collection.to, false)
        } else {
          str += genChar(collection, false)
        }
      })
      return (negate ? "[^" : "[") + str + "]"
    case "simple":
      return genChar(content, true)
    case "any":
      return content.raw
    default:
      return ""
  }
}
function genQuantifier(node: GroupNode | SingleNode) {
  const { quantifier } = node
  const { min, max } = quantifier as Quantifier
  if (min === 0 && max === Infinity) {
    return "*"
  } else if (min === 1 && max === Infinity) {
    return "+"
  } else if (min === 0 && max === 1) {
    return "?"
  } else if (min === max) {
    return "{" + min + "}"
  } else if (max === Infinity) {
    return "{" + min + ",}"
  } else {
    return "{" + min + "-" + max + "}"
  }
}
function genBoundaryAssertionNode(node: BoundaryAssertionNode) {
  switch (node.kind) {
    case "start":
      return "^"
    case "end":
      return "$"
    case "word":
      return node.negate ? "\\B" : "\\b"
    default:
      return ""
  }
}
const LookaroundMap = {
  lookahead: ["(?=", "(?!"],
  lookbehind: ["(?=<", "(?<!"],
}
function genLookaroundAssertionNode(
  nodeMap: NodeMap,
  node: LookaroundAssertionNode
) {
  const { head, id, kind, negate } = node
  let cur = head
  const ids = []
  while (cur !== id) {
    ids.push(cur)
    const node = nodeMap.get(cur) as BodyNode
    cur = node.next
  }
  return LookaroundMap[kind][negate ? 1 : 0] + gen(nodeMap, ids) + ")"
}
export default gen
