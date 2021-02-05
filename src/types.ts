export type Chars = {
  text: string
}
export type CharRange = {
  from: Chars
  to: Chars
  text: string
}
export type SpecialChar = {
  text: string
  raw: string
}
export type CharRanges = {
  ranges: CharRange[]
  negate: boolean
  text: string
}

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

type SingleNodeVal =
  | {
      kind: "string"
      content: Chars
      text: string
      name?: string
    }
  | {
      kind: "ranges"
      content: CharRanges
      text: string
      name?: string
    }
  | {
      kind: "special"
      content: SpecialChar
      text: string
      name?: string
    }

export interface SingleNode extends NodeBase {
  type: "single"
  val: SingleNodeVal
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

export type Size = {
  width: number
  height: number
  offsetWidth: number
  offsetHeight: number
}

export type Box = {
  x: number
  y: number
  width: number
  height: number
}

export type RenderConnect = {
  type: "connect"
  id: string
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

export type RenderNode = {
  type: "node"
  id: string
  children: (RenderNode | RenderConnect | RenderVirtualNode)[]
  x: number
  y: number
  width: number
  height: number
  target: Node
}

export type RenderVirtualNode = {
  type: "virtual"
  children: (RenderNode | RenderConnect | RenderVirtualNode)[]
  x: number
  y: number
  width: number
  height: number
}
