export type Char = {
  kind: "simple"
  value: string
  text: string
}
export type CharRange = {
  kind: "range"
  from: Char
  to: Char
  text: string
}
export type CharAny = {
  kind: "any"
  text: "any character"
  raw: "."
}
export type CharCollection = {
  kind: "collection"
  collections: (CharRange | Char)[]
  negate: boolean
  text: string
}

export type CharContent = Char | CharCollection | CharAny

export type Pos = {
  x: number
  y: number
}

export type Quantifier = {
  min: number
  max: number
  text: string
}

export type SingleNode = {
  type: "single"
  id: number
  content: CharContent
  prev: number
  next: number
  text: string
  name?: string
  quantifier?: Quantifier
}

// (xx)
export type GroupNode = {
  type: "group"
  id: number
  head: number
  prev: number
  next: number
  quantifier?: Quantifier
  name: string | null
}

// a|b
export type ChoiceNode = {
  type: "choice"
  id: number
  branches: number[]
  prev: number
  next: number
}

export type BoundaryAssertionNode = {
  type: "boundaryAssertion"
  id: number
  kind: "start" | "end" | "word"
  negate?: boolean
  text: string
  prev: number
  next: number
}

export type LookaroundAssertionNode = {
  type: "lookaroundAssertion"
  id: number
  kind: "lookahead" | "lookbehind"
  negate: boolean
  prev: number
  next: number
  name: string
  head: number
}

export type RootNode = {
  id: number
  type: "root"
  prev: null | number
  next: null | number
  text: string
}

export type Node =
  | SingleNode
  | GroupNode
  | ChoiceNode
  | RootNode
  | BoundaryAssertionNode
  | LookaroundAssertionNode

export type NodeType =
  | "single"
  | "root"
  | "choice"
  | "group"
  | "edgeAssertion"
  | "lookaroundAssertion"

export type BodyNode =
  | SingleNode
  | GroupNode
  | ChoiceNode
  | BoundaryAssertionNode
  | LookaroundAssertionNode

export type NodeMap = Map<number, Node>
