import { atom } from 'jotai'
import { astAtom, selectedIdsAtom } from './atoms'
import { refreshValidUndoAtom } from './utils'
import type { AST } from '@/parser'
import { updateQuantifier } from '@/parser'
import { toast } from '@/components/ui/use-toast'

export const updateQuantifierAtom = atom(
  null,
  (get, set, quantifier: AST.Quantifier | null) => {
    set(astAtom, (draft) => {
      const selectedIds = get(selectedIdsAtom)
      if (selectedIds.length === 1) {
        const nextSelectedId = updateQuantifier(
          draft,
          selectedIds[0],
          quantifier,
        )
        if (nextSelectedId !== selectedIds[0]) {
          set(selectedIdsAtom, [nextSelectedId])
          toast({
            description: 'Group selection automatically',
          })
        }
      }
      set(refreshValidUndoAtom, draft)
    })
  },
)
