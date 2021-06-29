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
