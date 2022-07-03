import * as dict from "./dict"
import * as patterns from "./patterns"
import { Token, TokenType } from "./token"

class Lexer {
  regex: string
  index = 0
  literal = false
  escapeBackslash = false
  constructor(regex: string) {
    this.regex = regex
  }

  get normalCharacterPattern() {
    return this.literal
      ? patterns.normalCharacterInLiteral
      : patterns.normalCharacter
  }

  get characterClassPattern() {
    return this.escapeBackslash
      ? patterns.allowEscapedBackslashCharacterClass
      : patterns.characterClass
  }

  get wordBoundaryPattern() {
    return this.escapeBackslash
      ? patterns.withEscapedBackslashWordBoundary
      : patterns.wordBoundary
  }

  get curRegex() {
    return this.regex.slice(this.index)
  }

  public read(): Token {
    const normalCharacters = this.readNormalCharacters()
    if (normalCharacters) {
      return normalCharacters
    }
    const char = this.regex[this.index]
    switch (char) {
      case "/": {
        return this.index === 0
          ? this.token(TokenType.RegexBodyStart)
          : this.token(TokenType.RegexBodyEnd)
      }
      case "\\": {
        return this.readBackslash()
      }
      case ".": {
        return this.token(TokenType.CharacterClass)
      }
      case "^":
      case "$": {
        return this.token(TokenType.Assertion)
      }
      default: {
        return this.token(dict.token.get(char)!)
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

  readBackslash(range = false): Token {
    const start = this.index
    const matches = this.readByRegex(this.characterClassPattern)
    if (matches) {
      return {
        type: TokenType.CharacterClass,
        span: { start, end: this.index },
      }
    }
    if (range) {
      if (this.escapeBackslash && this.curRegex[1] === "\\b") {
        return {
          type: TokenType.CharacterClass,
          span: { start, end: this.advance(3) },
        }
      }
      if (!this.escapeBackslash && this.curRegex[1] === "b") {
        return {
          type: TokenType.CharacterClass,
          span: { start, end: this.advance(2) },
        }
      }
      if (this.curRegex[1] === "\\b") {
      }
    } else {
      if (this.readByRegex(this.wordBoundaryPattern)) {
        return {
          type: TokenType.Assertion,
          span: { start, end: this.index },
        }
      }
      if (this.readByRegex(patterns.backReference)) {
        return {
          type: TokenType.BackReference,
          span: { start, end: this.index },
        }
      }
    }
    return {
      type: TokenType.EscapedChar,
      span: { start, end: this.advance(2) },
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
    if (index !== -1) {
      this.advance(1)
      return targets[index]
    }
    return null
  }

  public readByRegex(r: RegExp) {
    const matches = this.regex.slice(this.index).match(r)
    if (matches) {
      this.advance(matches[0].length)
    }
    return matches
  }

  readNormalCharacters(): Token | null {
    const start = this.index
    const curRegex = this.curRegex
    const matches = curRegex.match(this.normalCharacterPattern)
    if (matches && matches.index) {
      this.advance(matches.index)
      if (start !== this.index) {
        return {
          type: TokenType.NormalCharacter,
          span: { start, end: this.index },
        }
      }
    }
    return null
  }

  public readRange(): Token {
    const start = this.index
    if (this.readTarget("]")) {
      return { type: TokenType.RangeEnd, span: { start, end: this.index } }
    }
    if (this.curRegex[0] === "\\") {
      return this.readBackslash(true)
    }
    return {
      type: TokenType.NormalCharacter,
      span: { start, end: this.advance(1) },
    }
  }

  advance(size: number): number {
    return (this.index += size)
  }
}
export default Lexer
