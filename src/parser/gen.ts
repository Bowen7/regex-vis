import * as AST from "./ast"
const digitRegex = /\d+/

const lookAroundMap = {
  lookahead: ["(?=", "(?!"],
  lookbehind: ["(?<=", "(?<!"],
}

export class CodeGen {
  protected ast: AST.Regex | AST.Node[]
  protected astLiteral = false
  protected isLiteral = false
  protected regex = ""
  constructor(ast: AST.Regex | AST.Node[], isLiteral = false) {
    this.ast = ast
    this.isLiteral = isLiteral
    if (!Array.isArray(ast)) {
      this.astLiteral = ast.withSlash
    }
  }

  gen() {
    const nodes = Array.isArray(this.ast) ? this.ast : this.ast.body
    if (this.astLiteral) {
      this.regex += "/"
    }
    this.genNodes(nodes)
    if (this.astLiteral) {
      this.regex += "/"
      this.genFlags()
    }
    return this.regex
  }

  genFlags() {
    this.regex += (this.ast as AST.Regex).flags.map((flag) => flag).join("")
  }

  genNodes(nodes: AST.Node[]) {
    nodes.forEach((node) => this.genNode(node))
  }

  genNode(node: AST.Node) {
    switch (node.type) {
      case "choice":
        this.genChoice(node)
        break
      case "group":
        this.genGroup(node)
        break
      case "character":
        this.genCharacter(node)
        break
      case "boundaryAssertion":
        this.genBoundaryAssertionNode(node)
        break
      case "lookAroundAssertion":
        this.genLookAroundAssertionNode(node)
        break
      case "backReference":
        this.genBackReference(node)
        break
      default:
        break
    }
    if (node.type === "character" || node.type === "group") {
      this.genQuantifier(node)
    }
  }

  genChoice(node: AST.ChoiceNode) {
    const { branches } = node
    branches.forEach((branch, index) => {
      if (index > 0) {
        this.regex += "|"
      }
      this.genNodes(branch)
    })
  }

  genGroup(node: AST.GroupNode) {
    switch (node.kind) {
      case "capturing":
        this.regex += "("
        break
      case "namedCapturing":
        this.regex += "(?<" + node.name + ">"
        break
      case "nonCapturing":
        this.regex += "(?:"
        break
      default:
        break
    }

    const { children } = node
    this.genNodes(children)

    this.regex += ")"
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
        this.regex += (negate ? "[^" : "[") + str + "]"
        break
      case "string":
        this.regex += this.prefix(node.value)
        break
      case "class":
        this.regex += node.value
        break
      default:
        break
    }
  }

  genQuantifier(node: AST.CharacterNode | AST.GroupNode) {
    const { quantifier } = node
    if (!quantifier) {
      return
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
    this.regex += result + (greedy ? "" : "?")
  }

  genBoundaryAssertionNode(
    node:
      | AST.BeginningBoundaryAssertionNode
      | AST.EndBoundaryAssertionNode
      | AST.WordBoundaryAssertionNode
  ) {
    switch (node.kind) {
      case "beginning":
        this.regex += "^"
        break
      case "end":
        this.regex += "$"
        break
      case "word":
        this.regex += node.negate ? "\\B" : "\\b"
        break
      default:
        break
    }
  }

  genLookAroundAssertionNode(node: AST.LookAroundAssertionNode) {
    const { children, kind, negate } = node
    this.regex += lookAroundMap[kind][negate ? 1 : 0]
    this.genNodes(children)
    this.regex += ")"
  }

  genBackReference(node: AST.BackReferenceNode) {
    const { ref } = node
    if (digitRegex.test(ref)) {
      this.regex += `\\${ref}`
    } else {
      this.regex += `\\k<${ref}>`
    }
  }
}

const gen = (ast: AST.Regex | AST.Node[], isLiteral = false) => {
  const codeGen = new CodeGen(ast, isLiteral)
  return codeGen.gen()
}

export default gen
