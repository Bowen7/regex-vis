export type Regex = {
  id: string
  type: "regex"
  body: Node[]
  flags: Flag[]
  literal: boolean
  escapeBackslash: boolean
}

export type RegexError = {
  type: "error"
  message: string
}

export type Flag = "d" | "g" | "i" | "m" | "s" | "u" | "y"

export type Quantifier =
  | {
      kind: "?"
      min: 0
      max: 1
      greedy: boolean
    }
  | {
      kind: "*"
      min: 0
      max: typeof Infinity
      greedy: boolean
    }
  | {
      kind: "+"
      min: 1
      max: typeof Infinity
      greedy: boolean
    }
  | {
      kind: "custom"
      min: number
      max: number
      greedy: boolean
    }

export interface NodeBase {
  id: string
  type: string
}

export interface StringCharacterNode extends NodeBase {
  type: "character"
  kind: "string"
  value: string
  quantifier: Quantifier | null
}

export type Range = {
  from: string
  to: string
}
export interface RangesCharacterNode extends NodeBase {
  type: "character"
  kind: "ranges"
  ranges: Range[]
  negate: boolean
  quantifier: Quantifier | null
}

export interface ClassCharacterNode extends NodeBase {
  type: "character"
  kind: "class"
  value: string
  quantifier: Quantifier | null
}

export type RangesCharacter = {
  kind: "ranges"
  ranges: Range[]
  negate: boolean
}

export type CharacterNode =
  | StringCharacterNode
  | RangesCharacterNode
  | ClassCharacterNode

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"

export type Group =
  | {
      kind: "nonCapturing"
    }
  | { kind: "namedCapturing" | "capturing"; name: string; index: number }

export interface NonCapturingGroupNode extends NodeBase {
  type: "group"
  kind: "nonCapturing"
  children: Node[]
  quantifier: Quantifier | null
}

export interface NamedCapturingGroupNode extends NodeBase {
  type: "group"
  kind: "namedCapturing"
  children: Node[]
  name: string
  index: number
  quantifier: Quantifier | null
}

export interface CapturingGroupNode extends NodeBase {
  type: "group"
  kind: "capturing"
  children: Node[]
  name: string
  index: number
  quantifier: Quantifier | null
}

export type GroupNode =
  | NonCapturingGroupNode
  | NamedCapturingGroupNode
  | CapturingGroupNode

export interface ChoiceNode extends NodeBase {
  type: "choice"
  branches: Node[][]
}

export interface BeginningBoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  kind: "beginning"
}
export interface EndBoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  kind: "end"
}

export interface WordBoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  kind: "word"
  negate: boolean
}

export type LookAround = { kind: "lookahead" | "lookbehind"; negate: boolean }
export interface LookAroundAssertionNode extends NodeBase {
  type: "lookAroundAssertion"
  kind: "lookahead" | "lookbehind"
  negate: boolean
  children: Node[]
}

export type AssertionNode =
  | BeginningBoundaryAssertionNode
  | EndBoundaryAssertionNode
  | WordBoundaryAssertionNode
  | LookAroundAssertionNode

export interface BackReferenceNode extends NodeBase {
  type: "backReference"
  ref: string
}

export type Content =
  | { kind: "string" | "class"; value: string }
  | { kind: "ranges"; ranges: Range[]; negate: boolean }
  | { kind: "backReference"; ref: string }
  | { kind: "beginningAssertion" | "endAssertion" }
  | { kind: "wordBoundaryAssertion"; negate: boolean }

export interface RootNode extends NodeBase {
  type: "root"
}

export type Node =
  | CharacterNode
  | GroupNode
  | ChoiceNode
  | RootNode
  | AssertionNode
  | BackReferenceNode

export type ParentNode =
  | Regex
  | GroupNode
  | ChoiceNode
  | LookAroundAssertionNode
