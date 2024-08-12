import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { validUndoAtom } from './utils'
import {
  lookAroundAssertionSelected,
  unLookAroundAssertion,
  updateLookAroundAssertion,
} from '@/parser'

export const updateLookAroundAtom = atom(
  null,
  (
    get,
    set,
    lookAround: {
      kind: 'lookahead' | 'lookbehind'
      negate: boolean
    } | null,
  ) => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      if (!lookAround) {
        const nextSelectedIds = unLookAroundAssertion(draft, selectedIds)
        set(selectedIdsAtom, nextSelectedIds)
      } else {
        updateLookAroundAssertion(draft, selectedIds, lookAround)
      }
      set(validUndoAtom, draft)
    })
  },
)

export const lookAroundSelectedAtom = atom(
  null,
  (get, set, kind: 'lookahead' | 'lookbehind') => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      const nextSelectedIds = lookAroundAssertionSelected(
        draft,
        selectedIds,
        kind,
      )
      set(selectedIdsAtom, nextSelectedIds)
      set(validUndoAtom, draft)
    })
  },
)
