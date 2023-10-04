import { atom } from "jotai"
import { updateContent, AST } from "@/parser"
import { astAtom, selectedIdsAtom } from "./atoms"
import { refreshValidUndoAtom } from "./utils"

export const updateContentAtom = atom(
  null,
  (get, set, content: AST.Content) => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      if (selectedIds.length !== 1) {
        return
      }
      const nextSelectedId = updateContent(draft, selectedIds[0], content)
      set(selectedIdsAtom, [nextSelectedId])
      set(refreshValidUndoAtom, draft)
    })
  }
)
