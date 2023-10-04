import { atom } from "jotai"
import { atomWithImmer } from "jotai/immer"
import { useToasts } from "@geist-ui/core"
import { AST } from "@/parser"
import { NodeSize } from "@/modules/graph/measure"
export const undoStack: AST.Regex[] = []
export const redoStack: AST.Regex[] = []
export const nodesBoxMap: Map<
  string,
  { x1: number; y1: number; x2: number; y2: number }[]
> = new Map()

export const astAtom = atomWithImmer<AST.Regex>({
  id: "",
  type: "regex",
  body: [],
  flags: [],
  literal: false,
  escapeBackslash: false,
})

export const selectedIdsAtom = atom<string[]>([])
export const groupNamesAtom = atom<string[]>([])
export const editorCollapsedAtom = atom<boolean>(false)

export const toastsAtom = atom<ReturnType<typeof useToasts> | null>(null)

export const sizeMapAtom = atom<Map<AST.Node | AST.Node[], NodeSize>>(new Map())
export const isPrimaryGraphAtom = atom<boolean>(true)
