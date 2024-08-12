import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { refreshValidUndoAtom } from './utils'
import type { AST } from '@/parser'
import { updateContent } from '@/parser'

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
  },
)
