import {
  Node,
  ChoiceNode,
  GroupNode,
  Char,
  Quantifier,
  SingleNode,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@/types"
import { hasQuantifier } from "../utils"

function gen(start: Node, end: Node | null = null) {
  let reStr = ""
  const isSingleChoice = judgeSingleChoice(start, end)
  let cur: Node | null = start
  while (cur !== null && cur !== end?.next) {
    switch (cur.type) {
      case "choice":
        const r = genChoice(cur)
        if (isSingleChoice) {
          reStr = r
        } else {
          reStr += `(${r})`
        }
        break
      case "group":
        reStr += genGroup(cur)
        break
      case "single":
        reStr += genSingle(cur)
        break
      case "boundaryAssertion":
        reStr += genBoundaryAssertionNode(cur)
        break
      case "lookaroundAssertion":
        reStr += genLookaroundAssertionNode(cur)
        break
      default:
        break
    }
    if (hasQuantifier(cur) && cur.quantifier) {
      reStr += genQuantifier(cur)
    }
    cur = cur.next
  }
  return reStr
}
function judgeSingleChoice(start: Node, end: Node | null) {
  let cur: Node | null = start
  let flag = false
  while (cur !== null && cur !== end?.next) {
    if (cur.type !== "root") {
      if (flag) {
        return false
      }
      flag = true
    }
    cur = cur.next
  }
}
function genChoice(node: ChoiceNode) {
  const { chains } = node
  const chainsRes: string[] = []
  chains.forEach(chain => {
    chainsRes.push(gen(chain as Node))
  })
  return chainsRes.join("|")
}

function genGroup(node: GroupNode) {
  const { chain, kind, rawName } = node
  const content = gen(chain)
  switch (kind) {
    case "capturing":
      return "(" + content + ")"
    case "namedCapturing":
      return "(?<" + rawName + ">" + content + ")"
    case "nonCapturing":
      return "(?:" + content + ")"

    default:
      break
  }
}
function genChar(node: Char, prefix: boolean) {
  if (prefix) {
    return node.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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
function genLookaroundAssertionNode(node: LookaroundAssertionNode) {
  const { chain, kind, negate } = node
  return LookaroundMap[kind][negate ? 1 : 0] + gen(chain as Node) + ")"
}
export default gen
