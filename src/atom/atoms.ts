import { atom } from "jotai"
import { atomWithImmer } from "jotai/immer"
import { AST } from "@/parser"
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
  withSlash: true,
})

export const selectedIdsAtom = atom<string[]>([])
export const groupNamesAtom = atom<string[]>([])
export const editorCollapsedAtom = atom<boolean>(false)

export const recordLayoutEnableAtom = atom<boolean>(true)
export const selectEnableAtom = atom<boolean>(true)
