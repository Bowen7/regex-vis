export type Char = {
  type: "simple" | "escaped"
  value: String
  text: string
}

export type CharCollection = {
  type: "collection"
  from: Char
  to: Char
  text: string
}

export type Pos = {
  x: number
  y: number
}

export type BasicNode = {
  type: "basic"
  id: number
  body: CharCollection | Char
  prev: number | RootNode
  next: number | RootNode
}

// (xx)
export type GroupNode = {
  type: "group"
  id: number
  head: number
  prev: number | RootNode
  next: number | RootNode
}

// a|b
export type ChoiceNode = {
  type: "choice"
  id: number
  branches: number[]
  prev: number | RootNode
  next: number | RootNode
}
// export type

export type RootNode = {
  id: StartId | EndId
  type: "root"
  prev: null | number | RootNode
  next: null | number | RootNode
  text: string
}

export type Node = BasicNode | GroupNode | ChoiceNode | RootNode

export type DragEvent = {
  id: number
  deltaX: number
  deltaY: number
}

type StartId = -1
type EndId = -2
export const startId = -1
export const endId = -2
