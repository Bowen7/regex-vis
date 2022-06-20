import { atom } from "jotai"
import { removeSelected } from "@/parser"
import { selectedIdsAtom, astAtom } from "./atoms"
import { refreshValidUndoAtom } from "./utils"

export const removeAtom = atom(null, (get, set) => {
  set(astAtom, (draft) => {
    const selectedIds = get(selectedIdsAtom)
    removeSelected(draft, selectedIds)
    set(refreshValidUndoAtom, draft)
  })
})
