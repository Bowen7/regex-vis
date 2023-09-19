import { atom } from "jotai"
import { insertAroundSelected } from "@/parser"
import { selectedIdsAtom, astAtom } from "./atoms"
import { validUndoAtom } from "./utils"

export const insertAtom = atom(
  null,
  (get, set, direction: "prev" | "next" | "branch") => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      insertAroundSelected(draft, selectedIds, direction)
      set(validUndoAtom, draft)
    })
  }
)
