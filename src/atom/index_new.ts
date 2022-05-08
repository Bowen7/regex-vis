import { atom } from "jotai"
import { atomWithImmer } from "jotai/immer"
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
  visit,
  makeChoiceValid,
} from "@/parser"

const undoStack: AST.Regex[] = []
const redoStack: AST.Regex[] = []

export const astAtom = atomWithImmer<AST.Regex>({
  id: "",
  type: "regex",
  body: [],
  flags: [],
  withSlash: true,
})
export const selectedIdsAtom = atom<string[]>([])
export const groupNamesAtom = atom<string[]>([])
export const editorCollapsedAtom = atom<boolean>(false)
export const toastsAtom = atomWithImmer<string[]>([])

const refreshGroupAtom = atom(null, (get, set) => {
  let groupIndex = 0
  const groupNames: string[] = []
  set(astAtom, (draft) => {
    visit(draft, (node: AST.Node) => {
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
  set(groupNamesAtom, groupNames)
})

export const clearSelectedAtom = atom(null, (get, set) => {
  set(selectedIdsAtom, [])
})

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

export const selectNodesAtom = atom(null, (get, set, ids: string[]) => {
  const selectedIds = get(selectedIdsAtom)
  if (
    ids.length === 1 &&
    selectedIds.length === 1 &&
    selectedIds[0] === ids[0]
  ) {
    set(selectedIdsAtom, [])
    return
  }
  set(selectedIdsAtom, ids)
})

export const setAstAtom = atom(
  null,
  (
    get,
    set,
    {
      ast,
      shouldRefreshGroupIndex = false,
    }: { ast: AST.Regex; shouldRefreshGroupIndex?: boolean }
  ) => {
    if (shouldRefreshGroupIndex) {
      set(refreshGroupAtom)
      return
    }
    set(astAtom, ast)
  }
)

const setAstWithUndoAtom = atom(
  null,
  (
    get,
    set,
    {
      ast,
      shouldRefreshGroupIndex = false,
    }: { ast: AST.Regex; shouldRefreshGroupIndex?: boolean }
  ) => {
    undoStack.push(get(astAtom))
    const nextAst = makeChoiceValid(ast)
    if (nextAst !== ast) {
      ast = nextAst
      set(toastsAtom, (draft) => draft.push("Group automatically"))
    }
    set(setAstAtom, { ast, shouldRefreshGroupIndex })
  }
)

export const updateContentAtom = atom(
  null,
  (get, set, content: AST.Content) => {
    const selectedIds = get(selectedIdsAtom)
    if (selectedIds.length !== 1) {
      return
    }
    const id = selectedIds[0]
    const { nextAst, nextSelectedIds } = updateContent(
      get(astAtom),
      id,
      content
    )
    set(setAstWithUndoAtom, { ast: nextAst })
    set(selectedIdsAtom, nextSelectedIds)
  }
)

export const updateQuantifierAtom = atom(
  null,
  (get, set, quantifier: AST.Quantifier | null) => {
    const selectedIds = get(selectedIdsAtom)
    if (selectedIds.length !== 1) {
      return
    }
    const { nextAst, nextSelectedIds } = updateQuantifier(
      get(astAtom),
      selectedIds[0],
      quantifier
    )
    set(setAstWithUndoAtom, { ast: nextAst })
    set(selectedIdsAtom, nextSelectedIds)
  }
)

export const lookAroundItAtom = atom(
  null,
  (get, set, kind: "lookahead" | "lookbehind") => {
    const { nextAst, nextSelectedIds } = lookAroundAssertionIt(
      get(astAtom),
      get(selectedIdsAtom),
      kind
    )
    set(setAstWithUndoAtom, { ast: nextAst })
    set(selectedIdsAtom, nextSelectedIds)
  }
)

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
    let nextAst: AST.Regex
    let nextSelectedIds: string[]
    const ast = get(astAtom)
    const selectedIds = get(selectedIdsAtom)
    if (lookAround) {
      const { kind, negate } = lookAround
      ;({ nextAst, nextSelectedIds } = updateLookAroundAssertion(
        ast,
        selectedIds,
        kind,
        negate
      ))
    } else {
      ;({ nextAst, nextSelectedIds } = unLookAroundAssertion(ast, selectedIds))
    }
    set(setAstWithUndoAtom, { ast: nextAst })
    set(selectedIdsAtom, nextSelectedIds)
  }
)

export const updateFlagsAtom = atom(null, (get, set, flags: string[]) => {
  const nextAst = updateFlags(get(astAtom), flags)
  set(setAstWithUndoAtom, { ast: nextAst })
})

export const insertAtom = atom(
  null,
  (get, set, direction: "prev" | "next" | "branch") => {
    const nextAst = insertIt(get(astAtom), get(selectedIdsAtom), direction)
    set(setAstWithUndoAtom, { ast: nextAst })
  }
)

export const dispatchRemove = atom(null, (get, set) => {
  const selectedIds = get(selectedIdsAtom)
  set(clearSelectedAtom)
  set(setAstWithUndoAtom, {
    ast: removeIt(get(astAtom), selectedIds),
    shouldRefreshGroupIndex: true,
  })
})

export const dispatchUpdateGroup = atom(
  null,
  (get, set, group: AST.Group | null) => {
    const { nextAst, nextSelectedIds } = updateGroup(
      get(astAtom),
      get(selectedIdsAtom),
      group
    )
    set(setAstWithUndoAtom, {
      ast: nextAst,
      shouldRefreshGroupIndex: true,
    })
    set(selectedIdsAtom, nextSelectedIds)
  }
)

export const dispatchGroupIt = atom(null, (get, set, group: AST.Group) => {
  const { nextAst, nextSelectedIds } = groupIt(
    get(astAtom),
    get(selectedIdsAtom),
    group
  )
  set(setAstWithUndoAtom, {
    ast: nextAst,
    shouldRefreshGroupIndex: true,
  })
  set(selectedIdsAtom, nextSelectedIds)
})
