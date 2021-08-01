import { nanoid } from "nanoid"
import * as AST from "./ast"
import * as patterns from "./patterns"

const lookAroundDict: {
  "?=": AST.LookAround
  "?!": AST.LookAround
  "?<=": AST.LookAround
  "?<!": AST.LookAround
} = {
  "?=": { kind: "lookahead", negate: false },
  "?!": { kind: "lookahead", negate: true },
  "?<=": { kind: "lookbehind", negate: false },
  "?<!": { kind: "lookbehind", negate: true },
}

class Lexer {
  regex: string
  message: string = ""
  index = 0
  ast: AST.Regex = { type: "regex", body: [], flags: [], withSlash: true }
  parent!:
    | AST.Regex
    | AST.ChoiceNode
    | AST.GroupNode
    | AST.LookAroundAssertionNode
    | AST.RangesCharacterNode
  prev: AST.Regex | AST.Node | null = null
  groupIndex = 1
  escaped = false
  flagSet: Set<AST.Flag> = new Set()
  idGenerator: (size?: number) => string
  constructor(regex: string, idGenerator = nanoid) {
    this.regex = regex.trim()
    this.idGenerator = idGenerator
  }

  public parse(): AST.Regex | AST.RegexError {
    if (!this.validate()) {
      return { type: "error", message: this.message }
    }
    this.onRegex()
    return this.ast
  }

  public validate() {
    if (this.regex[0] !== "/") {
      this.regex = `/${this.regex}/`
      this.ast.withSlash = false
    }
    try {
      let end = this.regex.lastIndexOf("/")
      // TODO: /\/ /\\/
      if (end <= 0) {
        this.message = "Invalid regular expression"
        return false
      }

      for (let i = end + 1; i < this.regex.length; i++) {
        if (!patterns.flag.test(this.regex[i])) {
          this.message = `Invalid regular expression flags '${this.regex[i]}'`
          return false
        }
        this.flagSet.add(this.regex[i] as AST.Flag)
      }

      new RegExp(this.regex.slice(1, end), this.regex.slice(end + 1))
    } catch (error) {
      this.message = error.message
      return false
    }
    return true
  }

  id() {
    return this.idGenerator()
  }

  private advance(step = 1) {
    if (this.index === this.regex.length - 1) {
      return false
    }
    this.index += step
    return true
  }

  private cur(advance = 0) {
    return this.regex[this.index + advance]
  }

  private onEscape() {
    const cur = this.cur()
    this.escaped = false
    switch (cur) {
      case "d":
      case "D":
      case "w":
      case "W":
      case "s":
      case "S":
      case "t":
      case "r":
      case "n":
      case "v":
      case "f":
      case "0":
        this.appendChild({
          id: this.id(),
          type: "character",
          kind: "class",
          value: `\\${cur}`,
          quantifier: null,
        })
        break
      case "b":
      case "B":
        this.appendChild({
          id: this.id(),
          type: "boundaryAssertion",
          kind: "word",
          negate: cur === "b" ? false : true,
        })
        break
      // \cX
      case "c": {
        const matches = this.eat(patterns.cX, 1)
        if (matches) {
          const X = matches[1]
          this.appendChild({
            id: this.id(),
            type: "character",
            kind: "class",
            value: `\\c${X}`,
            quantifier: null,
          })
          this.advance(1)
        } else {
          this.onStringCharacter()
        }
        break
      }
      // \xhh
      case "x": {
        const matches = this.eat(patterns.xhh, 1)
        if (matches) {
          const hh = matches[0]
          this.appendChild({
            id: this.id(),
            type: "character",
            kind: "class",
            value: `\\x${hh}`,
            quantifier: null,
          })
          this.advance(2)
        } else {
          this.onStringCharacter()
        }
        break
      }
      // \uhhhh
      case "u": {
        const matches = this.eat(patterns.uhhhh, 1)
        if (matches) {
          const hhhh = matches[1]
          this.appendChild({
            id: this.id(),
            type: "character",
            kind: "class",
            value: `\\u${hhhh}`,
            quantifier: null,
          })
          this.advance(4)
        } else {
          this.onStringCharacter()
        }
        break
      }
      case "k": {
        const matches = this.eat(patterns.namedBackRef, 1)
        if (matches) {
          const ref = matches[1]
          this.appendChild({
            id: this.id(),
            type: "backReference",
            ref,
          })
          this.advance(2 + ref.length)
        } else {
          this.onStringCharacter()
        }
        break
      }
      default: {
        // back reference
        const matches = this.eat(patterns.digit)
        if (matches) {
          const groupName = matches[0]
          this.appendChild({
            id: this.id(),
            type: "backReference",
            ref: groupName,
          })
          this.advance(groupName.length - 1)
          break
        }
        this.onStringCharacter()
        break
      }
    }
  }

  private consume(endPoint: string) {
    do {
      if (this.escaped) {
        this.onEscape()
      } else {
        const cur = this.cur()
        switch (cur) {
          case endPoint:
            return
          case "{":
          case "?":
          case "*":
          case "+":
            this.consumeQuantifier()
            break
          case "(":
            this.onGroup()
            break
          case "|":
            this.onChoice()
            break
          case ".":
            this.appendChild({
              id: this.id(),
              type: "character",
              kind: "class",
              value: ".",
              quantifier: null,
            })
            break
          case "\\":
            this.escaped = true
            break
          case "^":
          case "$":
            this.appendChild({
              id: this.id(),
              type: "boundaryAssertion",
              kind: cur === "^" ? "beginning" : "end",
            })
            break
          case "[":
            this.onRanges()
            break
          default:
            this.onStringCharacter()
            break
        }
      }
    } while (this.advance())
  }

  private onChoice() {
    if (this.parent.type === "choice") {
      this.parent.branches.push([])
      return
    }
    if (this.parent.type === "character") {
      return
    }
    const branch =
      this.parent.type === "regex" ? this.parent.body : this.parent.children

    const choiceNode: AST.ChoiceNode = {
      id: this.id(),
      type: "choice",
      branches: [branch, []],
    }

    if (this.parent.type === "regex") {
      this.parent.body = [choiceNode]
    } else {
      this.parent.children = [choiceNode]
    }
    this.parent = choiceNode
    this.prev = null
  }

  private onStringCharacter() {
    if (
      this.prev &&
      this.prev.type === "character" &&
      this.prev.kind === "string" &&
      !this.prev.quantifier
    ) {
      this.prev.value += this.cur()
    } else {
      const node: AST.StringCharacterNode = {
        id: this.id(),
        type: "character",
        kind: "string",
        value: this.cur(),
        quantifier: null,
      }
      this.appendChild(node)
    }
  }

  private consumeQuantifier() {
    let quantifier: AST.Quantifier
    switch (this.cur()) {
      case "?":
        quantifier = { kind: "?", min: 0, max: 1, greedy: true }
        break
      case "*":
        quantifier = { kind: "*", min: 0, max: Infinity, greedy: true }
        break
      case "+":
        quantifier = { kind: "+", min: 1, max: Infinity, greedy: true }
        break
      case "{":
        const minMatches = this.eat(patterns.digit, 1)
        if (!minMatches) {
          break
        }
        const min = minMatches[1]
        if (this.cur(min.length + 1) === "}") {
          quantifier = {
            kind: "custom",
            min: parseInt(min),
            max: parseInt(min),
            greedy: true,
          }
          this.advance(min.length + 1)
          break
        }

        const commaMatches = this.eat(patterns.comma, min.length + 1)
        if (commaMatches) {
          if (this.cur(min.length + 2) === "}") {
            quantifier = {
              kind: "custom",
              min: parseInt(min),
              max: Infinity,
              greedy: true,
            }
            this.advance(min.length + 2)
            break
          }
        }

        const maxMatches = this.eat(patterns.digit, min.length + 2)
        if (!maxMatches) {
          break
        }
        const max = maxMatches[1]
        if (this.cur(min.length + max.length + 2) === "}") {
          quantifier = {
            kind: "custom",
            min: parseInt(min),
            max: parseInt(max),
            greedy: true,
          }
          this.advance(min.length + max.length + 2)
        }
        break
      default:
        break
    }

    if (quantifier! && this.cur(1) === "?") {
      quantifier!.greedy = false
      this.advance()
    }

    if (quantifier!) {
      if (
        this.prev &&
        (this.prev.type === "character" || this.prev.type === "group")
      ) {
        if (this.prev.type === "character" && this.prev.kind === "string") {
          const value = this.prev.value
          if (value.length > 1) {
            const node: AST.StringCharacterNode = {
              id: this.id(),
              type: "character",
              kind: "string",
              value: value.slice(-1),
              quantifier: null,
            }
            this.prev.value = value.slice(0, value.length - 1)
            this.appendChild(node)
          }
        }
        this.prev.quantifier = quantifier!
        this.prev = null
      } else {
        // TODO: error handling
      }
      return true
    } else {
      this.onStringCharacter()
    }
    return false
  }

  private appendChild(node: AST.Node) {
    this.prev = node
    const parent = this.parent
    if (parent.type === "regex") {
      parent.body.push(node)
      return
    }
    if (parent.type === "group" || parent.type === "lookAroundAssertion") {
      parent.children.push(node)
    }
    if (parent.type === "choice") {
      const { branches } = parent
      branches[branches.length - 1].push(node)
    }
  }

  private onRegex() {
    this.parent = this.ast
    this.prev = this.ast
    this.onRegexBody()
    this.onFlags()
  }

  private onRegexBody() {
    this.advance()
    this.consume("/")
  }

  private onFlags() {
    this.flagSet.forEach((flag) => {
      this.ast.flags.push(flag)
    })
  }

  private eat(pattern: RegExp, advance = 0) {
    return this.regex.slice(this.index + advance).match(pattern)
  }

  private onRanges() {
    this.advance()

    const parent = this.parent
    const node: AST.RangesCharacterNode = {
      id: this.id(),
      type: "character",
      kind: "ranges",
      ranges: [],
      negate: false,
      quantifier: null,
    }
    if (this.cur() === "^") {
      node.negate = true
      this.advance()
    }
    this.parent = node
    this.consumeRanges()
    this.parent = parent
    this.appendChild(node)
  }

  private consumeRanges() {
    let from = ""
    let hyphen = false

    const onRange = (range: string) => {
      if (!from) {
        from = range
      } else if (!hyphen) {
        this.appendRange(from)
        from = range
      } else {
        this.appendRange(from, range)
        from = ""
        hyphen = false
      }
    }

    do {
      const cur = this.cur()
      if (this.escaped) {
        this.escaped = false
        switch (cur) {
          case "d":
          case "D":
          case "w":
          case "W":
          case "s":
          case "S":
          case "t":
          case "r":
          case "n":
          case "v":
          case "f":
          case "0":
          case "b":
            onRange(`\\${cur}`)
            break
          // \cX
          case "c": {
            const matches = this.eat(patterns.cX, 1)
            if (matches) {
              const X = matches[1]
              onRange(`\\c${X}`)
              this.advance(1)
            } else {
              onRange("c")
            }
            break
          }
          // \xhh
          case "x": {
            const matches = this.eat(patterns.xhh, 1)
            if (matches) {
              const hh = matches[1]
              onRange(`\\x${hh}`)
              this.advance(2)
            } else {
              onRange("x")
            }
            break
          }
          // \uhhhh
          case "u": {
            const matches = this.eat(patterns.uhhhh, 1)
            if (matches) {
              const hhhh = matches[1]
              onRange(`\\u${hhhh}`)
              this.advance(4)
            } else {
              onRange("u")
            }
            break
          }
          default:
            onRange(cur)
            break
        }
      } else {
        if (cur === "]") {
          break
        }
        switch (cur) {
          case "\\":
            this.escaped = true
            break
          case "-":
            if (!from) {
              if (this.cur(1) === "-") {
                from = cur
              } else {
                this.appendRange(cur)
              }
            } else if (hyphen) {
              onRange("-")
            } else {
              hyphen = true
            }
            break
          default:
            onRange(cur)
            break
        }
      }
    } while (this.advance())
    if (from) {
      this.appendRange(from)
    }
    if (hyphen) {
      this.appendRange("-")
    }
  }

  private appendRange(from: string, to?: string) {
    to = to || from
    if (this.parent.type === "character") {
      this.parent.ranges.push({ from, to })
    }
  }

  // group or lookAroundAssertion
  private onGroup() {
    this.advance()
    this.prev = null

    let node: AST.GroupNode | AST.LookAroundAssertionNode
    let group: AST.Group
    if (this.cur() === "?") {
      const matches = this.eat(patterns.lookAround)
      if (matches) {
        const lookAround = matches[1]
        node = {
          id: this.id(),
          type: "lookAroundAssertion",
          ...lookAroundDict[lookAround as keyof typeof lookAroundDict],
          children: [],
        }
        this.advance(lookAround.length)
      } else {
        if (this.eat(patterns.nonCapturing)) {
          this.advance(2)
          group = { kind: "nonCapturing" }
        }
      }
    }

    if (!node! && !group!) {
      const matches = this.eat(patterns.namedCapturing)
      if (matches) {
        const name = matches[1]
        this.advance(name.length + 3)
        group = {
          kind: "namedCapturing",
          name: name,
          index: this.groupIndex++,
        }
      }
    }

    if (!node! && !group!) {
      const index = this.groupIndex++
      group = { kind: "capturing", name: index.toString(), index }
    }

    if (group!) {
      node = {
        id: this.id(),
        type: "group",
        children: [],
        ...group!,
        quantifier: null,
      }
    }

    const parent = this.parent
    this.parent = node!
    this.consume(")")
    this.parent = parent

    this.appendChild(node!)
  }
}

const parse = (
  regex: string | RegExp,
  idGenerator?: (size?: number) => string
) => {
  if (typeof regex !== "string") {
    regex = String(regex)
  }
  const lexer = new Lexer(regex, idGenerator)
  return lexer.parse()
}

export default parse
