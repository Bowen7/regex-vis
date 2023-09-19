import { atom } from "jotai"
import { removeSelected } from "@/parser"
import { selectedIdsAtom, astAtom } from "./atoms"
import { clearSelectedAtom } from "./select"
import { refreshValidUndoAtom } from "./utils"

export const removeAtom = atom(null, (get, set) => {
  set(astAtom, (draft) => {
    const selectedIds = get(selectedIdsAtom)
    removeSelected(draft, selectedIds)
    set(clearSelectedAtom)
    set(refreshValidUndoAtom, draft)
  })
})
