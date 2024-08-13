export type Regex = {
  id: string
  type: 'regex'
  body: Node[]
  flags: Flag[]
  literal: boolean
  escapeBackslash: boolean
}

export type RegexError = {
  type: 'error'
  message: string
}

export type Flag = 'd' | 'g' | 'i' | 'm' | 's' | 'u' | 'y'

export type Quantifier =
  | {
    kind: '?'
    min: 0
    max: 1
    greedy: boolean
  }
  | {
    kind: '*'
    min: 0
    max: typeof Infinity
    greedy: boolean
  }
  | {
    kind: '+'
    min: 1
    max: typeof Infinity
    greedy: boolean
  }
  | {
    kind: 'custom'
    min: number
    max: number
    greedy: boolean
  }

export type NodeBase = {
  id: string
  type: string
}

export type StringCharacterNode = {
  type: 'character'
  kind: 'string'
  value: string
  quantifier: Quantifier | null
} & NodeBase

export type Range = {
  id: string
  from: string
  to: string
}
export type RangesCharacterNode = {
  type: 'character'
  kind: 'ranges'
  ranges: Range[]
  negate: boolean
  quantifier: Quantifier | null
} & NodeBase

export type ClassCharacterNode = {
  type: 'character'
  kind: 'class'
  value: string
  quantifier: Quantifier | null
} & NodeBase

export type RangesCharacter = {
  kind: 'ranges'
  ranges: Range[]
  negate: boolean
}

export type CharacterNode =
  | StringCharacterNode
  | RangesCharacterNode
  | ClassCharacterNode

export type GroupKind = 'capturing' | 'nonCapturing' | 'namedCapturing'

export type Group =
  | {
    kind: 'nonCapturing'
  }
  | { kind: 'namedCapturing' | 'capturing', name: string, index: number }

export type NonCapturingGroupNode = {
  type: 'group'
  kind: 'nonCapturing'
  children: Node[]
  quantifier: Quantifier | null
} & NodeBase

export type NamedCapturingGroupNode = {
  type: 'group'
  kind: 'namedCapturing'
  children: Node[]
  name: string
  index: number
  quantifier: Quantifier | null
} & NodeBase

export type CapturingGroupNode = {
  type: 'group'
  kind: 'capturing'
  children: Node[]
  name: string
  index: number
  quantifier: Quantifier | null
} & NodeBase

export type GroupNode =
  | NonCapturingGroupNode
  | NamedCapturingGroupNode
  | CapturingGroupNode

export type ChoiceNode = {
  type: 'choice'
  branches: Node[][]
} & NodeBase

export type BeginningBoundaryAssertionNode = {
  type: 'boundaryAssertion'
  kind: 'beginning'
} & NodeBase
export type EndBoundaryAssertionNode = {
  type: 'boundaryAssertion'
  kind: 'end'
} & NodeBase

export type WordBoundaryAssertionNode = {
  type: 'boundaryAssertion'
  kind: 'word'
  negate: boolean
} & NodeBase

export type LookAround = {
  kind: 'lookahead' | 'lookbehind'
  negate: boolean
}
export type LookAroundAssertionNode = {
  type: 'lookAroundAssertion'
  kind: 'lookahead' | 'lookbehind'
  negate: boolean
  children: Node[]
} & NodeBase

export type AssertionNode =
  | BeginningBoundaryAssertionNode
  | EndBoundaryAssertionNode
  | WordBoundaryAssertionNode
  | LookAroundAssertionNode

export type BackReferenceNode = {
  type: 'backReference'
  ref: string
  quantifier: Quantifier | null
} & NodeBase

export type Content =
  | { kind: 'string' | 'class', value: string }
  | { kind: 'ranges', ranges: Range[], negate: boolean }
  | { kind: 'backReference', ref: string }
  | { kind: 'beginningAssertion' | 'endAssertion' }
  | { kind: 'wordBoundaryAssertion', negate: boolean }

export type RootNode = {
  type: 'root'
} & NodeBase

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
