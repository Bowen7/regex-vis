export type Char = {
  type: "simple" | "escaped"
  value: String
}

export type CharCollection = {
  from: Char
  to: Char
}

export type Pos = {
  x: number
  y: number
}

export type BasicNode = {
  type: "basic"
  prev: number[]
  next: number[]
  body: CharCollection | Char
  id: number
  origin: Pos
  width: number
  height: number
}

export type GroupNode = {
  type: "group"
  prev: number[]
  next: number[]
  node: BasicNode[]
  id: number
  origin: Pos
  width: number
  height: number
}

export type Node = BasicNode | GroupNode

export type DragEvent = {
  id: number
  deltaX: number
  deltaY: number
}
