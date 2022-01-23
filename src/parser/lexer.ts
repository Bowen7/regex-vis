import * as AST from "./ast"
type Span = {
  start: number
  end: number
}
export enum TokenType {
  RegexBodyStart,
  RegexBodyEnd,
  Literal,
  GroupStart,
  GraphEnd,
  RangeStart,
  RangeEnd,
  Choice,
}
export type Token = {
  type: TokenType
  span: Span
}
const tokenRegex = /[/()[|]/
const tokenMap = new Map(
  Object.entries({
    "(": TokenType.GroupStart,
    ")": TokenType.GraphEnd,
    "[": TokenType.RangeStart,
    "|": TokenType.Choice,
  })
)
class Lexer {
  regex: string
  index = 0
  constructor(regex: string) {
    this.regex = regex
  }

  public read(): Token {
    const start = this.index
    while (!tokenRegex.test(this.regex[this.index])) {
      this.advance(1)
    }
    if (start !== this.index) {
      return {
        type: TokenType.Literal,
        span: { start, end: this.index },
      }
    }
    const char = this.regex[this.index]
    switch (char) {
      case "/": {
        return this.index === 0
          ? this.token(TokenType.RegexBodyStart)
          : this.token(TokenType.RegexBodyEnd)
      }
      default: {
        return this.token(tokenMap.get(char)!)
      }
    }
  }

  token(type: TokenType, size = 1): Token {
    const span = { start: this.index, end: this.advance(size) }
    return {
      type,
      span,
    }
  }

  public readTarget(target: string): boolean {
    const char = this.regex[this.index]
    if (target === char) {
      this.advance(1)
      return true
    }
    return false
  }

  public readTargets(targets: string[]): string | null {
    const char = this.regex[this.index]
    const index = targets.indexOf(char)
    return index === -1 ? null : targets[index]
  }

  advance(size: number): number {
    return (this.index += size)
  }
}
export default Lexer
