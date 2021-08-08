import produce, { original } from "immer"
import {
  AST,
  removeIt,
  insertIt,
  updateGroup,
  groupIt,
  updateQuantifier,
  updateLookAroundAssertion,
  lookAroundAssertionIt,
  unLookAroundAssertion,
  updateContent,
  updateFlags,
  visitTree,
} from "@/parser"
import { atom, setAtomValue } from "./helper"
export { useAtomValue, setAtomValue } from "./helper"

export const astAtom = atom<AST.Regex>({
  type: "regex",
  body: [],
  flags: [],
  withSlash: true,
})
export const selectedIdsAtom = atom<string[]>([])
export const groupNamesAtom = atom<string[]>([])
export const undoStackAtom = atom<AST.Regex[]>([])
export const redoStackAtom = atom<AST.Regex[]>([])
export const editorCollapsedAtom = atom<boolean>(false)

const refreshGroupIndex = (ast: AST.Regex) => {
  let groupIndex = 0
  const groupNames: string[] = []
  const nextAst = produce(ast, (draft) => {
    visitTree(draft, (node: AST.Node) => {
      if (
        node.type === "group" &&
        (node.kind === "capturing" || node.kind === "namedCapturing")
      ) {
        const index = ++groupIndex
        node.index = index
        if (node.kind === "capturing") {
          node.name = index.toString()
          groupNames.push(index.toString())
        } else {
          groupNames.push(node.name)
        }
      }
    })
  })
  return { groupNames, nextAst }
}

export const setGroupNames = setAtomValue(groupNamesAtom)
const _setAst = setAtomValue(astAtom)
export const setAst = (ast: AST.Regex, shouldRefreshGroupIndex = false) => {
  if (shouldRefreshGroupIndex) {
    const { nextAst, groupNames } = refreshGroupIndex(ast)
    _setAst(nextAst)
    setGroupNames(groupNames)
    return
  }
  _setAst(ast)
}
export const setSelectedIds = setAtomValue(selectedIdsAtom)
export const setUndoStack = setAtomValue(undoStackAtom)
export const setRedoStack = setAtomValue(redoStackAtom)
export const setEditorCollapsed = setAtomValue(editorCollapsedAtom)

const setAstWithUndo = (ast: AST.Regex, shouldRefreshGroupIndex = false) => {
  const nextUndoStack = produce(undoStackAtom.current, (draft) => {
    draft.push(astAtom.current)
  })
  setUndoStack(nextUndoStack)
  setAst(ast, shouldRefreshGroupIndex)
}

export const dispatchInsert = (direction: "prev" | "next" | "branch") => {
  const nextAst = insertIt(astAtom.current, selectedIdsAtom.current, direction)
  setAstWithUndo(nextAst)
}

export const dispatchRemove = () =>
  setAstWithUndo(removeIt(astAtom.current, selectedIdsAtom.current), true)

export const dispatchUpdateGroup = (group: AST.Group | null) => {
  const { nextAst, nextSelectedIds } = updateGroup(
    astAtom.current,
    selectedIdsAtom.current,
    group
  )
  setAstWithUndo(nextAst, true)
  setSelectedIds(nextSelectedIds)
}

export const dispatchGroupIt = (group: AST.Group) => {
  const { nextAst, nextSelectedIds } = groupIt(
    astAtom.current,
    selectedIdsAtom.current,
    group
  )
  setAstWithUndo(nextAst, true)
  setSelectedIds(nextSelectedIds)
}

export const dispatchSetAst = (ast: AST.Regex) => {
  setAstWithUndo(ast, true)
  setSelectedIds([])
}

export const dispatchUndo = () => {
  console.log(123)
  if (undoStackAtom.current.length > 0) {
    let nextAst: AST.Regex
    const nextUndoStack = produce(undoStackAtom.current, (draft) => {
      nextAst = original(draft.pop())!
    })
    const nextRedoStack = produce(redoStackAtom.current, (draft) => {
      draft.push(astAtom.current)
    })
    setAst(nextAst!, true)
    setUndoStack(nextUndoStack)
    setRedoStack(nextRedoStack)
    setSelectedIds([])
  }
}

export const dispatchRedo = () => {
  if (redoStackAtom.current.length > 0) {
    let nextAst: AST.Regex
    const nextUndoStack = produce(undoStackAtom.current, (draft) => {
      draft.push(astAtom.current)
    })
    const nextRedoStack = produce(redoStackAtom.current, (draft) => {
      nextAst = original(draft.pop())!
    })
    setAst(nextAst!, true)
    setUndoStack(nextUndoStack)
    setRedoStack(nextRedoStack)
    setSelectedIds([])
  }
}

export const dispatchSelectNodes = (nextSelectedIds: string | string[]) => {
  if (
    !Array.isArray(nextSelectedIds) &&
    selectedIdsAtom.current.length === 1 &&
    selectedIdsAtom.current[0] === nextSelectedIds
  ) {
    return setSelectedIds([])
  }
  if (!Array.isArray(nextSelectedIds)) {
    nextSelectedIds = [nextSelectedIds]
  }
  setSelectedIds(nextSelectedIds)
}

export const dispatchUpdateContent = (content: AST.Content) => {
  if (selectedIdsAtom.current.length !== 1) {
    return
  }
  const id = selectedIdsAtom.current[0]
  const { nextAst, nextSelectedIds } = updateContent(
    astAtom.current,
    id,
    content
  )
  setAstWithUndo(nextAst)
  setSelectedIds(nextSelectedIds)
}

export const dispatchCollapseEditor = (collapsed: boolean) =>
  setEditorCollapsed(collapsed)

export const dispatchUpdateQuantifier = (quantifier: AST.Quantifier | null) => {
  if (selectedIdsAtom.current.length !== 1) {
    return
  }
  const { nextAst, nextSelectedIds } = updateQuantifier(
    astAtom.current,
    selectedIdsAtom.current[0],
    quantifier
  )
  setAstWithUndo(nextAst)
  setSelectedIds(nextSelectedIds)
}

export const dispatchLookAroundIt = (kind: "lookahead" | "lookbehind") => {
  const { nextAst, nextSelectedIds } = lookAroundAssertionIt(
    astAtom.current,
    selectedIdsAtom.current,
    kind
  )
  setAstWithUndo(nextAst)
  setSelectedIds(nextSelectedIds)
}

export const dispatchUpdateLookAround = (
  lookAround: {
    kind: "lookahead" | "lookbehind"
    negate: boolean
  } | null
) => {
  let nextAst: AST.Regex
  let nextSelectedIds: string[]
  if (lookAround) {
    const { kind, negate } = lookAround
    ;({ nextAst, nextSelectedIds } = updateLookAroundAssertion(
      astAtom.current,
      selectedIdsAtom.current,
      kind,
      negate
    ))
  } else {
    ;({ nextAst, nextSelectedIds } = unLookAroundAssertion(
      astAtom.current,
      selectedIdsAtom.current
    ))
  }
  setAstWithUndo(nextAst)
  setSelectedIds(nextSelectedIds)
}

export const dispatchUpdateFlags = (flags: string[]) => {
  const nextAst = updateFlags(astAtom.current, flags)
  setAstWithUndo(nextAst)
}
