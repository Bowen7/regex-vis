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

export type NodeChildren = Node[]

export interface NodeBase {
  id: string
  type: string
  quantifier?: Quantifier
  children?: Node[]
  branches?: NodeChildren[]
  val?: any
}

export interface SingleNode extends NodeBase {
  type: "single"
  val: {
    content: CharContent
    text: string
    name?: string
  }
}

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"

export interface GroupNode extends NodeBase {
  type: "group"
  val: {
    kind: GroupKind
    name?: string
    namePrefix: "Group #"
  }
}

export interface ChoiceNode extends NodeBase {
  type: "choice"
}

export interface BoundaryAssertionNode extends NodeBase {
  type: "boundaryAssertion"
  val: {
    text: string
    kind: "start" | "end" | "word"
    negate?: boolean
  }
}

export interface LookaroundAssertionNode extends NodeBase {
  type: "lookaroundAssertion"
  val: {
    name: string
    kind: "lookahead" | "lookbehind"
    negate: boolean
  }
}

export interface RootNode extends NodeBase {
  type: "root"
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
