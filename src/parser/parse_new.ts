import { nanoid } from "nanoid"
import * as AST from "./ast"

class Parser {
  regex: string
  message: string = ""
  index = 0
  groupStack = []
  ast: AST.Regex = { type: "regex", body: [], flags: [] }
  parent!: AST.Regex | AST.Node
  prev!: AST.Node
  groupIndex = 1
  constructor(regex: string) {
    this.regex = regex.trim()
  }

  public parse(): AST.Regex | AST.RegexError {
    if (!this.validate()) {
      return { type: "error", message: this.message }
    }
    this.onRegex()
    return this.ast
  }

  public validate() {
    try {
      const start = this.regex.indexOf("/")
      let end = -1

      if (start !== 0) {
        this.message = "Invalid regular expression"
        return false
      }

      for (let i = start + 1; i < this.regex.length; i++) {
        if (this.regex[i] === "/") {
          end = i
          break
        }
      }

      if (end === -1) {
        this.message = "Invalid regular expression"
        return false
      }

      for (let i = end + 1; i < this.regex.length; i++) {
        if (!/[gimsuy]/.test(this.regex[i])) {
          this.message = "Invalid regular expression flags"
          return false
        }
      }

      new RegExp(this.regex.slice(start + 1, end), this.regex.slice(end + 1))
    } catch (error) {
      this.message = error.message
      return false
    }
    return true
  }

  private advance(step = 1) {
    if (this.index === this.regex.length - 1) {
      return false
    }
    this.index += step
    return true
  }

  private consume(endPoint: string) {
    do {
      switch (this.regex[this.index]) {
        case endPoint:
          return
        case "{":
          break
        case "(":
          this.onGroup()
          break
        default:
          break
      }
    } while (this.advance())
  }

  private appendChild(node: AST.Node) {
    if (this.parent.type === "regex") {
      this.parent.body.push(node)
      return
    }
    if (this.parent.children) {
      this.parent.children.push(node)
    }
    if (this.parent.branches) {
      const { branches } = this.parent
      branches[branches.length - 1].push(node)
    }
  }

  private onRegex() {
    this.parent = this.ast
    this.onRegexBody()
    this.onFlags()
  }

  private onRegexBody() {
    this.advance()
    this.consume("/")
  }

  private onFlags() {
    for (let i = 0; i < this.regex.length; i++) {
      const f = this.regex[i]
      switch (f) {
        case "d":
          this.ast.flags.push({ kind: "hasIndices" })
          break
        case "g":
          this.ast.flags.push({ kind: "global" })
          break
        case "i":
          this.ast.flags.push({ kind: "ignoreCase" })
          break
        case "m":
          this.ast.flags.push({ kind: "multiline" })
          break
        case "s":
          this.ast.flags.push({ kind: "dotAll" })
          break
        case "u":
          this.ast.flags.push({ kind: "unicode" })
          break
        case "y":
          this.ast.flags.push({ kind: "sticky" })
          break

        default:
          break
      }
    }
  }

  private eat(startPoint: string, endPoint: string = ""): string | boolean {
    if (!endPoint) {
      return new RegExp(`^${startPoint}`).test(this.regex[this.index])
    }
    const match = this.regex
      .slice(this.index)
      .match(new RegExp(`^${startPoint}(.*)${endPoint}`))

    if (match) {
      return match[1]
    }
    return false
  }

  private onGroup() {
    this.advance()

    let group: AST.Group
    if (this.eat("\\?:")) {
      this.advance(2)
      group = { kind: "nonCapturing" }
    } else {
      const name = this.eat("\\?<", ">")
      if (name) {
        this.advance((name as string).length + 3)
        group = { kind: "namedCapturing", name: name as string }
      }
    }

    if (!group!) {
      group = { kind: "capturing", name: this.groupIndex++ + "" }
    }
    const groupNode: AST.GroupNode = {
      id: nanoid(),
      type: "group",
      children: [],
      value: group!,
    }

    this.appendChild(groupNode)
  }
}

const parse = (regex: string) => {
  const parser = new Parser(regex)
  return parser.parse()
}

export default parse
