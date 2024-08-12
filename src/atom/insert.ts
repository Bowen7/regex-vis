import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { validUndoAtom } from './utils'
import { insertAroundSelected } from '@/parser'

export const insertAtom = atom(
  null,
  (get, set, direction: 'prev' | 'next' | 'branch') => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      insertAroundSelected(draft, selectedIds, direction)
      set(validUndoAtom, draft)
    })
  },
)
