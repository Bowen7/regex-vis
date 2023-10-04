import { atom } from "jotai"
import { groupSelected, updateGroup, AST } from "@/parser"
import { astAtom, selectedIdsAtom } from "./atoms"
import { refreshValidUndoAtom } from "./utils"

export const updateGroupAtom = atom(
  null,
  (get, set, group: AST.Group | null) => {
    set(astAtom, (draft) => {
      const selectedIds = updateGroup(draft, get(selectedIdsAtom), group)
      set(selectedIdsAtom, selectedIds)
      set(refreshValidUndoAtom, draft)
    })
  }
)

export const groupSelectedAtom = atom(null, (get, set, group: AST.Group) => {
  set(astAtom, (draft) => {
    const selectedIds = groupSelected(draft, get(selectedIdsAtom), group)
    set(selectedIdsAtom, selectedIds)
    set(refreshValidUndoAtom, draft)
  })
})
