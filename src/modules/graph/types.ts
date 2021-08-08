import { AST } from "@/parser"
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
  kind: "combine" | "split" | "straight"
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
  id: string
  x: number
  y: number
  width: number
  height: number
  target: AST.Node
}

export type LayoutNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
}
export type LayoutChildren = LayoutNode[]
