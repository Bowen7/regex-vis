import { atom } from 'jotai'
import { astAtom } from './atoms'
import { pushUndoAtom } from './utils'
import { updateFlags } from '@/parser'

export const updateFlagsAtom = atom(null, (get, set, flags: string[]) => {
  set(astAtom, (draft) => {
    updateFlags(draft, flags)
    set(pushUndoAtom)
  })
})
