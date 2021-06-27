import {
  Node,
  ChoiceNode,
  GroupNode,
  Quantifier,
  CharacterNode,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@/types"

function gen(nodes: Node[]) {
  const isSingleNode = judgeSingleNode(nodes)
  return nodes
    .map((node) => {
      let regex = ""
      switch (node.type) {
        case "choice":
          regex = genChoice(node) as string
          if (!isSingleNode) {
            regex = `(${regex})`
          }
          break
        case "group":
          regex += genGroup(node)
          break
        case "character":
          regex += genCharacter(node)
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
  return nodes.filter((node) => node.type !== "root").length === 1
}

function genChoice(node: ChoiceNode) {
  const { branches } = node
  return branches!
    .map((branch) => {
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

function prefix(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function genCharacter(node: CharacterNode) {
  const { val } = node
  switch (val.type) {
    case "ranges":
      const { negate } = val
      let str = ""
      val.value.forEach(({ from, to }) => {
        if (from !== to) {
          str += from + "-" + to
        } else {
          str += from
        }
      })
      return (negate ? "[^" : "[") + str + "]"
    case "string":
      return prefix(val.value)
    case "class":
      return val.value
    default:
      return ""
  }
}

function genQuantifier(node: Node) {
  const { quantifier } = node as { quantifier: Quantifier }
  const { min, max, greedy } = quantifier as Quantifier
  let result = ""
  if (min === 0 && max === Infinity) {
    result = "*"
  } else if (min === 1 && max === Infinity) {
    result = "+"
  } else if (min === 0 && max === 1) {
    result = "?"
  } else if (min === max) {
    result = "{" + min + "}"
  } else if (max === Infinity) {
    result = "{" + min + ",}"
  } else {
    result = "{" + min + "-" + max + "}"
  }
  return result + (greedy ? "" : "?")
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
