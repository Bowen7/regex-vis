import { atom } from 'jotai'
import { astAtom, redoStack, undoStack } from './atoms'
import { clearSelectedAtom } from './select'

export const undoAtom = atom(null, (get, set) => {
  if (undoStack.length > 0) {
    const ast = undoStack.pop()!
    redoStack.push(get(astAtom))
    set(clearSelectedAtom)
    set(astAtom, ast)
  }
})

export const redoAtom = atom(null, (get, set) => {
  if (redoStack.length > 0) {
    const ast = redoStack.pop()!
    undoStack.push(get(astAtom))
    set(clearSelectedAtom)
    set(astAtom, ast)
  }
})
