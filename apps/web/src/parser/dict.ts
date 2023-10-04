import * as AST from "./ast"
import { TokenType } from "./token"
export const token = new Map(
  Object.entries({
    "(": TokenType.GroupStart,
    ")": TokenType.GraphEnd,
    "[": TokenType.RangeStart,
    "|": TokenType.Choice,
  })
)

export const lookAround: Map<string, AST.LookAround> = new Map(
  Object.entries({
    "?=": { kind: "lookahead", negate: false },
    "?!": { kind: "lookahead", negate: true },
    "?<=": { kind: "lookbehind", negate: false },
    "?<!": { kind: "lookbehind", negate: true },
  })
)
