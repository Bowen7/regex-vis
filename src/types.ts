export type Char = {
  kind: "simple"
  text: string
}
export type CharRange = {
  kind: "range"
  from: Char
  to: Char
  text: string
}
export type SpecialChar = {
  kind: "any"
  text: string
  raw: string
}
export type CharCollection = {
  kind: "collection"
  collections: (CharRange | Char)[]
  negate: boolean
  text: string
}

export type CharContent = Char | CharCollection | SpecialChar

export type Pos = {
  x: number
  y: number
}

export type Quantifier = {
  min: number
  max: number
  text: string
}

export type NodePrev = Node | null
export type Chain = Node
export type NodeParent = GroupNode | ChoiceNode | LookaroundAssertionNode | null
export type NodeQuantifier = SingleNode | GroupNode

export interface NodeBase {
  id: string
  type: string
  prev: Node | null
  next: Node | null
  parent: NodeParent
}

export interface SingleNode extends NodeBase {
  type: "single"
  content: CharContent
  text: string
  name?: string
  quantifier?: Quantifier
}

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"
// (xx)
export interface GroupNode extends NodeBase {
  type: "group"
  chain: Chain
  kind: GroupKind
  rawName?: string
  name?: string
  quantifier?: Quantifier
}

// a|b
export interface ChoiceNode extends NodeBase {
  type: "choice"
  chains: Chain[]
}

export interface BoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  text: string
  kind: "start" | "end" | "word"
  negate?: boolean
}

export interface LookaroundAssertionNode extends NodeBase {
  type: "lookaroundAssertion"
  chain: Chain
  name: string
  kind: "lookahead" | "lookbehind"
  negate: boolean
}

export interface RootNode extends NodeBase {
  type: "root"
  text: string
}

export interface PlaceholderNode extends NodeBase {
  type: "placeholder"
}

export type Node =
  | SingleNode
  | GroupNode
  | ChoiceNode
  | RootNode
  | BoundaryAssertionNode
  | LookaroundAssertionNode
  | PlaceholderNode

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

export type Root = {
  r: RootNode
}
