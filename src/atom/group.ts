import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { refreshValidUndoAtom } from './utils'
import type { AST } from '@/parser'
import { groupSelected, updateGroup } from '@/parser'

export const updateGroupAtom = atom(
  null,
  (get, set, group: AST.Group | null) => {
    set(astAtom, (draft) => {
      const selectedIds = updateGroup(draft, get(selectedIdsAtom), group)
      set(selectedIdsAtom, selectedIds)
      set(refreshValidUndoAtom, draft)
    })
  },
)

export const groupSelectedAtom = atom(null, (get, set, group: AST.Group) => {
  set(astAtom, (draft) => {
    const selectedIds = groupSelected(draft, get(selectedIdsAtom), group)
    set(selectedIdsAtom, selectedIds)
    set(refreshValidUndoAtom, draft)
  })
})
