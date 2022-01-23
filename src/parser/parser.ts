import { nanoid } from "nanoid"
import * as AST from "./ast"
import * as patterns from "./patterns"
import Lexer, { TokenType } from "./lexer"

class Parser {
  regex: string
  idGenerator: (size?: number) => string
  flags: AST.Flag[] = []
  message: string = ""
  lexer!: Lexer
  constructor(regex: string | RegExp, idGenerator = nanoid) {
    if (typeof regex !== "string") {
      regex = String(regex)
    }
    this.regex = regex
    this.idGenerator = idGenerator
  }

  public parse(): AST.Regex | AST.RegexError {
    let withSlash = true
    if (this.regex.trim()[0] !== "/") {
      this.regex = `/${this.regex}/`
      withSlash = false
    } else {
      this.regex = this.regex.trim()
    }

    this.lexer = new Lexer(this.regex)

    if (!this.validate()) {
      return { type: "error", message: this.message }
    }

    this.lexer.read()
    const body = this.parseNodes()
    return {
      type: "regex",
      body,
      flags: this.flags,
      withSlash,
    }
  }

  id() {
    return this.idGenerator()
  }

  parseNodes(): AST.Node[] {
    const nodes: AST.Node[] = []
    while (true) {
      const {
        type,
        span: { start, end },
      } = this.lexer.read()
      switch (type) {
        case TokenType.GraphEnd | TokenType.RegexBodyEnd: {
          return nodes
        }
        case TokenType.Literal: {
          const value = this.regex.slice(start, end + 1)
          const quantifier = this.parseQuantifier()
          nodes.push({
            id: this.id(),
            type: "character",
            kind: "string",
            value,
            quantifier,
          })
        }
      }
    }
  }

  parseQuantifier(): AST.Quantifier | null {
    return null
  }

  validate() {
    try {
      let end = this.regex.lastIndexOf("/")
      if (end <= 0) {
        this.message = "Invalid regular expression"
        return false
      }

      for (let i = end + 1; i < this.regex.length; i++) {
        if (!patterns.flag.test(this.regex[i])) {
          this.message = `Invalid regular expression flags '${this.regex[i]}'`
          return false
        }
        this.flags.push(this.regex[i] as AST.Flag)
      }

      new RegExp(this.regex.slice(1, end), this.regex.slice(end + 1))
    } catch (error) {
      if (error instanceof Error) {
        this.message = error.message
      }
      return false
    }
    return true
  }
}
export default Parser
