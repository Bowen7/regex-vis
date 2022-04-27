import * as AST from "./ast"
const digitRegex = /\d+/

const lookAroundMap = {
  lookahead: ["(?=", "(?!"],
  lookbehind: ["(?<=", "(?<!"],
}

class CodeGen {
  ast: AST.Regex | AST.Node[]
  astLiteral = false
  isLiteral = false
  constructor(ast: AST.Regex | AST.Node[], isLiteral = false) {
    this.ast = ast
    this.isLiteral = isLiteral
    if (!Array.isArray(ast)) {
      this.astLiteral = ast.withSlash
    }
  }

  gen() {
    const nodes = Array.isArray(this.ast) ? this.ast : this.ast.body
    const regexBody = this.genNodes(nodes)
    if (this.astLiteral) {
      const f = (this.ast as AST.Regex).flags.map((flag) => flag).join("")
      return `/${regexBody}/${f}`
    }
    return regexBody
  }

  genNodes(nodes: AST.Node[]) {
    return nodes
      .map((node) => {
        let regex = ""
        switch (node.type) {
          case "choice":
            regex = this.genChoice(node)
            break
          case "group":
            regex += this.genGroup(node)
            break
          case "character":
            regex += this.genCharacter(node)
            break
          case "boundaryAssertion":
            regex += this.genBoundaryAssertionNode(node)
            break
          case "lookAroundAssertion":
            regex += this.genLookaroundAssertionNode(node)
            break
          case "backReference":
            regex += this.genBackReference(node)
            break
          default:
            break
        }
        if (node.type === "character" || node.type === "group") {
          regex += this.genQuantifier(node)
        }
        return regex
      })
      .join("")
  }

  genChoice(node: AST.ChoiceNode) {
    const { branches } = node
    return branches
      .map((branch) => {
        return this.genNodes(branch)
      })
      .join("|")
  }

  genGroup(node: AST.GroupNode) {
    const { children } = node
    const content = this.genNodes(children)
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

  prefix(value: string) {
    return value.replace(
      this.isLiteral || this.astLiteral
        ? /[|\\{}()[\]^$+*?./]/g
        : /[|\\{}()[\]^$+*?.]/g,
      "\\$&"
    )
  }

  genCharacter(node: AST.CharacterNode) {
    switch (node.kind) {
      case "ranges":
        const { negate, ranges } = node
        let str = ""
        ranges.forEach(({ from, to }, index) => {
          if (from === "]" || from === "\\") {
            from = "\\" + from
          }
          if (to === "]" || to === "\\") {
            to = "\\" + to
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
        return this.prefix(node.value)
      case "class":
        return node.value
      default:
        return ""
    }
  }

  genQuantifier(node: AST.CharacterNode | AST.GroupNode) {
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

  genBoundaryAssertionNode(
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

  genLookaroundAssertionNode(node: AST.LookAroundAssertionNode) {
    const { children, kind, negate } = node
    return lookAroundMap[kind][negate ? 1 : 0] + this.genNodes(children) + ")"
  }

  genBackReference(node: AST.BackReferenceNode) {
    const { ref } = node
    if (digitRegex.test(ref)) {
      return `\\${ref}`
    }
    return `\\k<${ref}>`
  }
}

const gen = (ast: AST.Regex | AST.Node[], isLiteral = false) => {
  const codeGen = new CodeGen(ast, isLiteral)
  return codeGen.gen()
}

export default gen
