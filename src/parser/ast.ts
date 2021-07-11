export type Regex = {
  type: "regex"
  body: Node[]
  flags: Flag[]
}

export type RegexError = {
  type: "error"
  message: string
}

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

export type Node =
  | CharacterNode
  | GroupNode
  | ChoiceNode
  | RootNode
  | BoundaryAssertionNode
  | LookaroundAssertionNode

export type Quantifier = {
  kind: "?" | "*" | "+" | "custom"
  min: number
  max: number
  greedy: boolean
}

export type StringCharacter = {
  kind: "string"
  value: string
}

export type Range = {
  from: string
  to: string
}
export type RangesCharacter = {
  kind: "ranges"
  value: Range[]
  negate: boolean
}

export type ClassCharacter = {
  kind: "class"
  value: string
}

export type Character = StringCharacter | RangesCharacter | ClassCharacter

export interface NodeBase {
  id: string
  type: string
  quantifier?: Quantifier
  children?: Node[]
  branches?: Node[][]
  value?: any
}

export interface CharacterNode extends NodeBase {
  type: "character"
  value: Character
}

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"

export type Group =
  | {
      kind: "nonCapturing" | "nonGroup"
    }
  | { kind: "namedCapturing" | "capturing"; name: string }

export interface GroupNode extends NodeBase {
  type: "group"
  value: Group
}

export interface ChoiceNode extends NodeBase {
  type: "choice"
}

export interface BoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  value:
    | { kind: "start" | "end" }
    | {
        kind: "word"
        negate?: boolean
      }
}

export interface LookaroundAssertionNode extends NodeBase {
  type: "lookaroundAssertion"
  value: {
    kind: "lookahead" | "lookbehind"
    negate: boolean
  }
}

export interface RootNode extends NodeBase {
  type: "root"
}

export type NodeType =
  | "character"
  | "root"
  | "choice"
  | "group"
  | "edgeAssertion"
  | "lookaroundAssertion"
