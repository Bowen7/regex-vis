import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { clearSelectedAtom } from './select'
import { refreshValidUndoAtom } from './utils'
import { removeSelected } from '@/parser'

export const removeAtom = atom(null, (get, set) => {
  set(astAtom, (draft) => {
    const selectedIds = get(selectedIdsAtom)
    removeSelected(draft, selectedIds)
    set(clearSelectedAtom)
    set(refreshValidUndoAtom, draft)
  })
})
