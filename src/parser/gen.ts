import {
  Chars,
  Node,
  ChoiceNode,
  GroupNode,
  Quantifier,
  SingleNode,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@/types"

function gen(nodes: Node[]) {
  const isSingleNode = judgeSingleNode(nodes)
  return nodes
    .map(node => {
      let regex = ""
      switch (node.type) {
        case "choice":
          regex = genChoice(node) as string
          if (!isSingleNode) {
            regex += `(${regex})`
          }
          break
        case "group":
          regex += genGroup(node)
          break
        case "single":
          regex += genSingle(node)
          break
        case "boundaryAssertion":
          regex += genBoundaryAssertionNode(node)
          break
        case "lookaroundAssertion":
          regex += genLookaroundAssertionNode(node)
          break
        default:
          break
      }
      if (node.quantifier) {
        regex += genQuantifier(node)
      }
      return regex
    })
    .join("")
}

function judgeSingleNode(nodes: Node[]) {
  return nodes.filter(node => node.type !== "root").length === 1
}

function genChoice(node: ChoiceNode) {
  const { branches } = node
  return branches!
    .map(branch => {
      return gen(branch as Node[])
    })
    .join("|")
}

function genGroup(node: GroupNode) {
  const { children, val } = node
  const { kind, name } = val
  const content = gen(children as Node[])
  switch (kind) {
    case "capturing":
      return "(" + content + ")"
    case "namedCapturing":
      return "(?<" + name + ">" + content + ")"
    case "nonCapturing":
      return "(?:" + content + ")"

    default:
      break
  }
}

function genChar(node: Chars, prefix: boolean) {
  if (prefix) {
    return node.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
  return node.text
}

function genSingle(node: SingleNode) {
  const { val } = node
  switch (val.kind) {
    case "ranges":
      const { negate } = val.content
      let str = ""
      val.content.ranges.forEach(range => {
        if (range.from.text !== range.to.text) {
          str += genChar(range.from, false) + "-" + genChar(range.to, false)
        } else {
          str += genChar(range.from, false)
        }
      })
      return (negate ? "[^" : "[") + str + "]"
    case "string":
      return genChar(val.content, true)
    case "special":
      return val.content.raw
    default:
      return ""
  }
}

function genQuantifier(node: Node) {
  const { quantifier } = node as { quantifier: Quantifier }
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
  const { val } = node
  switch (val.kind) {
    case "start":
      return "^"
    case "end":
      return "$"
    case "word":
      return val.negate ? "\\B" : "\\b"
    default:
      return ""
  }
}

const LookaroundMap = {
  lookahead: ["(?=", "(?!"],
  lookbehind: ["(?=<", "(?<!"],
}

function genLookaroundAssertionNode(node: LookaroundAssertionNode) {
  const { children, val } = node
  const { kind, negate } = val
  return LookaroundMap[kind][negate ? 1 : 0] + gen(children as Node[]) + ")"
}

export default gen
