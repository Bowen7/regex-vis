export type Regex = {
  type: "regex"
  body: Node[]
  flags: Flag[]
}

export type RegexError = {
  type: "error"
  message: string
}

export type FlagShortKind = "d" | "g" | "i" | "m" | "s" | "u" | "y"
export type FlagKind =
  | "hasIndices"
  | "global"
  | "ignoreCase"
  | "multiline"
  | "dotAll"
  | "unicode"
  | "sticky"
export type Flag = {
  kind:
    | "hasIndices"
    | "global"
    | "ignoreCase"
    | "multiline"
    | "dotAll"
    | "unicode"
    | "sticky"
}

export type Quantifier = {
  kind: "?" | "*" | "+" | "custom"
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

export type CharacterNode =
  | StringCharacterNode
  | RangesCharacterNode
  | ClassCharacterNode

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"

export type Group =
  | {
      kind: "nonCapturing"
    }
  | { kind: "namedCapturing" | "capturing"; name: string }

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
  quantifier: Quantifier | null
}

export interface CapturingGroupNode extends NodeBase {
  type: "group"
  kind: "capturing"
  children: Node[]
  name: string
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
  name: string
}

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
