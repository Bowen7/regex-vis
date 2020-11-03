export type Char = {
  type: "simple" | "escaped"
  value: string
  text: string
}
export type CharRange = {
  from: Char
  to: Char
  text: string
}
export type CharCollection = {
  type: "collection"
  body: (CharRange | Char)[]
  text: string
}

export type Pos = {
  x: number
  y: number
}

export type Quantifier = {
  min: number
  max: number
} | null

export type BasicNode = {
  type: "basic"
  id: number
  body: CharCollection | Char
  prev: number
  next: number
  quantifier: Quantifier
}

// (xx)
export type GroupNode = {
  type: "group"
  id: number
  head: number
  prev: number
  next: number
  quantifier: Quantifier
}

// a|b
export type ChoiceNode = {
  type: "choice"
  id: number
  branches: number[]
  prev: number
  next: number
  quantifier: null
}
// export type

export type RootNode = {
  id: number
  type: "root"
  prev: null | number
  next: null | number
  text: string
  quantifier: Quantifier
}

export type Node = BasicNode | GroupNode | ChoiceNode | RootNode

export type NodeType = "basic" | "root" | "choice" | "group"

export type BodyNode = BasicNode | GroupNode | ChoiceNode

export type NodeMap = Map<number, Node>
