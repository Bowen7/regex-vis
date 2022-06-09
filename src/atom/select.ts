import { atom } from "jotai"
import { selectedIdsAtom, nodesBoxMap } from "./atoms"

export const selectNodeAtom = atom(null, (get, set, id: string) => {
  set(selectedIdsAtom, [id])
})

export const selectNodesAtom = atom(null, (get, set, ids: string[]) => {
  set(selectedIdsAtom, ids)
})

export const selectNodesByBoxAtom = atom(
  null,
  (get, set, box: { x1: number; y1: number; x2: number; y2: number }) => {
    set(selectNodesAtom, [])
  }
)
