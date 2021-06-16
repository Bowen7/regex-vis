export type Pos = {
  x: number
  y: number
}

export type Quantifier = {
  kind: "?" | "*" | "+" | "custom"
  min: number
  max: number
  greedy: boolean
}

export type StringCharacter = {
  type: "string"
  value: string
}

export type Range = {
  from: string
  to: string
}
export type RangesCharacter = {
  type: "ranges"
  value: Range[]
  negate: boolean
}

export type ClassCharacter = {
  type: "class"
  value: string
}

export type Character = StringCharacter | RangesCharacter | ClassCharacter

export interface NodeBase {
  id: string
  type: string
  quantifier?: Quantifier
  children?: Node[]
  branches?: Node[][]
  val?: any
}

export interface CharacterNode extends NodeBase {
  type: "character"
  val: Character
  text: string
  name?: string
}

export type GroupKind = "capturing" | "nonCapturing" | "namedCapturing"

export type Group =
  | {
      type: "capturing" | "nonCapturing" | "nonGroup"
    }
  | { type: "namedCapturing"; name: string }

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
    kind: "start" | "end" | "word"
    negate?: boolean
  }
  text: string
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
  | CharacterNode
  | GroupNode
  | ChoiceNode
  | RootNode
  | BoundaryAssertionNode
  | LookaroundAssertionNode

export type NodeType =
  | "character"
  | "root"
  | "choice"
  | "group"
  | "edgeAssertion"
  | "lookaroundAssertion"

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

export type NodesInfo = {
  id: string
  expression: string
  group: Group | null
  character: Character | null
  quantifier: Quantifier | null
}
