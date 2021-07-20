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
  target: AST.Node
}

export type RenderVirtualNode = {
  type: "virtual"
  children: (RenderNode | RenderConnect | RenderVirtualNode)[]
  x: number
  y: number
  width: number
  height: number
}
