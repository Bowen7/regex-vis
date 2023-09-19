import { atom } from "jotai"
import { updateQuantifier, AST } from "@/parser"
import { selectedIdsAtom, astAtom, toastsAtom } from "./atoms"
import { refreshValidUndoAtom } from "./utils"

export const updateQuantifierAtom = atom(
  null,
  (get, set, quantifier: AST.Quantifier | null) => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      if (selectedIds.length === 1) {
        const nextSelectedId = updateQuantifier(
          draft,
          selectedIds[0],
          quantifier
        )
        if (nextSelectedId !== selectedIds[0]) {
          set(selectedIdsAtom, [nextSelectedId])
          const toasts = get(toastsAtom)
          toasts && toasts.setToast({ text: "Group selection automatically" })
        }
      }
      set(refreshValidUndoAtom, draft)
    })
  }
)
