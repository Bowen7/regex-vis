import * as AST from "./ast"

function gen(nodes: AST.Node[], withSlash = false, flags: AST.Flag[] = []) {
  const r = nodes
    .map((node) => {
      let regex = ""
      switch (node.type) {
        case "choice":
          regex = genChoice(node)
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
        case "lookAroundAssertion":
          regex += genLookaroundAssertionNode(node)
          break
        case "backReference":
          regex += genBackReference(node)
          break
        default:
          break
      }
      if (node.type === "character" || node.type === "group") {
        regex += genQuantifier(node)
      }
      return regex
    })
    .join("")
  if (withSlash) {
    const f = flags.map((flag) => flag.kind).join("")
    return `/${r}/${f}`
  }
  return r
}

function genChoice(node: AST.ChoiceNode) {
  const { branches } = node
  return branches
    .map((branch) => {
      return gen(branch)
    })
    .join("|")
}

function genGroup(node: AST.GroupNode) {
  const { children } = node
  const content = gen(children)
  switch (node.kind) {
    case "capturing":
      return "(" + content + ")"
    case "namedCapturing":
      return "(?<" + node.name + ">" + content + ")"
    case "nonCapturing":
      return "(?:" + content + ")"

    default:
      break
  }
}

function prefix(value: string) {
  return value.replace(/[|\\{}()[\]^$+*?./]/g, "\\$&")
}

function genCharacter(node: AST.CharacterNode) {
  switch (node.kind) {
    case "ranges":
      const { negate, ranges } = node
      let str = ""
      ranges.forEach(({ from, to }, index) => {
        if (from === "]") {
          from = "\\]"
        }
        if (to === "]") {
          to = "\\]"
        }
        if (!(index === 0 || index === ranges.length - 1)) {
          if (from === "-") {
            from = "\\-"
          }
          if (to === "-") {
            to = "\\-"
          }
        }
        if (from !== to) {
          str += from + "-" + to
        } else {
          str += from
        }
      })
      return (negate ? "[^" : "[") + str + "]"
    case "string":
      return prefix(node.value)
    case "class":
      return node.value
    default:
      return ""
  }
}

function genQuantifier(node: AST.CharacterNode | AST.GroupNode) {
  const { quantifier } = node
  if (!quantifier) {
    return ""
  }
  const { kind, min, max, greedy } = quantifier
  let result = ""

  switch (kind) {
    case "*":
      result = "*"
      break
    case "+":
      result = "+"
      break
    case "?":
      result = "?"
      break
    case "custom":
      if (min === max) {
        result = `{${min}}`
      } else if (max === Infinity) {
        result = `{${min},}`
      } else {
        result = `{${min},${max}}`
      }
      break
    default:
      break
  }
  return result + (greedy ? "" : "?")
}

function genBoundaryAssertionNode(
  node:
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
) {
  switch (node.kind) {
    case "beginning":
      return "^"
    case "end":
      return "$"
    case "word":
      return node.negate ? "\\B" : "\\b"
    default:
      return ""
  }
}

const lookAroundMap = {
  lookahead: ["(?=", "(?!"],
  lookbehind: ["(?<=", "(?<!"],
}

function genLookaroundAssertionNode(node: AST.LookAroundAssertionNode) {
  const { children, kind, negate } = node
  return lookAroundMap[kind][negate ? 1 : 0] + gen(children) + ")"
}

function genBackReference(node: AST.BackReferenceNode) {
  const { name } = node
  return `\\${name}`
}
export default gen
