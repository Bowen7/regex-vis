import { Pos, Node } from "@/types"

export type Size = {
  width: number
  height: number
  offsetWidth: number
  offsetHeight: number
}

export type RenderNode = {
  x: number
  y: number
  width: number
  height: number
  node: Node
}

export type RenderConnect = {
  id: string
  type: "combine" | "split"
  start: Pos
  end: Pos
}
