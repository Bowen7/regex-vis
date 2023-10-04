import { atom } from "jotai"
import {
  updateLookAroundAssertion,
  lookAroundAssertionSelected,
  unLookAroundAssertion,
} from "@/parser"
import { selectedIdsAtom, astAtom } from "./atoms"
import { validUndoAtom } from "./utils"

export const updateLookAroundAtom = atom(
  null,
  (
    get,
    set,
    lookAround: {
      kind: "lookahead" | "lookbehind"
      negate: boolean
    } | null
  ) => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      if (!lookAround) {
        const nextSelecetedIds = unLookAroundAssertion(draft, selectedIds)
        set(selectedIdsAtom, nextSelecetedIds)
      } else {
        updateLookAroundAssertion(draft, selectedIds, lookAround)
      }
      set(validUndoAtom, draft)
    })
  }
)

export const lookAroundSelectedAtom = atom(
  null,
  (get, set, kind: "lookahead" | "lookbehind") => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      const nextSelectedIds = lookAroundAssertionSelected(
        draft,
        selectedIds,
        kind
      )
      set(selectedIdsAtom, nextSelectedIds)
      set(validUndoAtom, draft)
    })
  }
)
