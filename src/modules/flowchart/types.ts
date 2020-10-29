import { Quantifier, Pos } from "@types"
export type Box = {
  x: number
  y: number
  width: number
  height: number
}
export type Size = {
  width: number
  height: number
}

export type RenderNode = {
  id: number
  x: number
  y: number
  width: number
  height: number
  text: string
  type: "root" | "group" | "basic"
  quantifier?: Quantifier
}

export type RenderConnect = {
  type: "combine" | "split" | "straight"
  start: Pos
  end: Pos
}
