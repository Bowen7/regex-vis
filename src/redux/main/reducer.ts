import produce from "immer"
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
export type InitialStateType = {
  ast: AST.Regex
  selectedIds: string[]
  groupNames: string[]
  undoStack: AST.Regex[]
  redoStack: AST.Regex[]
  editorCollapsed: Boolean
}

export const initialState: InitialStateType = {
  ast: { type: "regex", body: [], flags: [], withSlash: true },
  selectedIds: [],
  groupNames: [],
  undoStack: [],
  redoStack: [],
  editorCollapsed: false,
}

export enum ActionTypes {
  INSERT,
  REMOVE,
  UPDATE_GROUP,
  WRAP_GROUP,
  SET_AST,
  UNDO,
  REDO,
  SELECT_NODES,
  UPDATE_CONTENT,
  SET_EDITOR_COLLAPSED,
  UPDATE_QUANTIFIER,
  WRAP_LOOKAROUND_ASSERTION,
  UPDATE_LOOKAROUND_ASSERTION,
  UPDATE_FLAGS,
}

export type Action =
  | {
      type: ActionTypes.INSERT
      payload: { direction: "prev" | "next" | "branch" }
    }
  | { type: ActionTypes.REMOVE }
  | {
      type: ActionTypes.UPDATE_GROUP
      payload: AST.Group | null
    }
  | {
      type: ActionTypes.WRAP_GROUP
      payload: AST.Group
    }
  | { type: ActionTypes.SET_AST; payload: AST.Regex }
  | { type: ActionTypes.UNDO }
  | { type: ActionTypes.REDO }
  | {
      type: ActionTypes.SELECT_NODES
      payload: { selected: string[] | string }
    }
  | {
      type: ActionTypes.UPDATE_CONTENT
      payload: AST.Content
    }
  | { type: ActionTypes.SET_EDITOR_COLLAPSED; payload: { collapsed: boolean } }
  | { type: ActionTypes.UPDATE_QUANTIFIER; payload: AST.Quantifier | null }
  | {
      type: ActionTypes.WRAP_LOOKAROUND_ASSERTION
      payload: "lookahead" | "lookbehind"
    }
  | {
      type: ActionTypes.UPDATE_LOOKAROUND_ASSERTION
      payload: { kind: "lookahead" | "lookbehind"; negate: boolean } | null
    }
  | {
      type: ActionTypes.UPDATE_FLAGS
      payload: string[]
    }

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

const setAst = (
  state: InitialStateType,
  nextAst: AST.Regex,
  attachState: Partial<InitialStateType> = {},
  shouldRefreshGroupIndex = false
): InitialStateType => {
  let { undoStack, ast, groupNames } = state
  if (shouldRefreshGroupIndex) {
    ;({ nextAst, groupNames } = refreshGroupIndex(nextAst))
  }
  if (!attachState.undoStack) {
    undoStack.push(ast)
  }
  return {
    ...state,
    ast: nextAst,
    groupNames,
    undoStack,
    ...attachState,
  }
}

export const reducer = (state: InitialStateType, action: Action) => {
  switch (action.type) {
    case ActionTypes.INSERT: {
      const { ast, selectedIds } = state
      const { direction } = action.payload
      const nextAst = insertIt(ast, selectedIds, direction)
      return setAst(state, nextAst)
    }
    case ActionTypes.REMOVE: {
      const { ast, selectedIds } = state
      const nextAst = removeIt(ast, selectedIds)
      return setAst(state, nextAst, { selectedIds: [] }, true)
    }
    case ActionTypes.UPDATE_GROUP: {
      const { ast, selectedIds } = state
      const { nextAst, nextSelectedIds } = updateGroup(
        ast,
        selectedIds,
        action.payload
      )
      return setAst(state, nextAst, { selectedIds: nextSelectedIds }, true)
    }
    case ActionTypes.WRAP_GROUP: {
      const { ast, selectedIds } = state
      const { nextAst, nextSelectedIds } = groupIt(
        ast,
        selectedIds,
        action.payload
      )
      return setAst(state, nextAst, { selectedIds: nextSelectedIds }, true)
    }
    case ActionTypes.SET_AST: {
      const { undoStack, ast } = state
      const nextAst = action.payload
      undoStack.push(ast)
      return setAst(state, nextAst, { undoStack, selectedIds: [] }, true)
    }
    case ActionTypes.UNDO: {
      let { undoStack, redoStack, ast } = state
      if (undoStack.length > 0) {
        let nextAst = undoStack.pop()!
        redoStack.push(ast)

        return setAst(state, nextAst, { undoStack, redoStack }, true)
      }
      return state
    }
    case ActionTypes.REDO: {
      const { undoStack, redoStack, ast } = state
      if (redoStack.length > 0) {
        const nextAst = redoStack.pop()!
        undoStack.push(ast)
        return setAst(state, nextAst, { undoStack, redoStack }, true)
      }
      return state
    }
    case ActionTypes.SELECT_NODES: {
      const { selectedIds } = state
      let { selected: nextSelected } = action.payload

      if (
        !Array.isArray(nextSelected) &&
        selectedIds.length === 1 &&
        selectedIds[0] === nextSelected
      ) {
        return {
          ...state,
          selectedIds: [],
        }
      }
      if (!Array.isArray(nextSelected)) {
        nextSelected = [nextSelected]
      }
      return {
        ...state,
        selectedIds: nextSelected,
      }
    }
    case ActionTypes.UPDATE_CONTENT: {
      const { ast, selectedIds } = state
      const payload = action.payload
      const id = selectedIds[0]
      const { nextAst, nextSelectedIds } = updateContent(ast, id, payload)
      return setAst(state, nextAst, { selectedIds: nextSelectedIds })
    }
    case ActionTypes.SET_EDITOR_COLLAPSED: {
      const { collapsed } = action.payload
      return { ...state, editorCollapsed: collapsed }
    }
    case ActionTypes.UPDATE_QUANTIFIER: {
      const { ast, selectedIds } = state
      const { nextAst, nextSelectedIds } = updateQuantifier(
        ast,
        selectedIds[0],
        action.payload
      )
      return setAst(state, nextAst, { selectedIds: nextSelectedIds })
    }
    case ActionTypes.WRAP_LOOKAROUND_ASSERTION: {
      const { ast, selectedIds } = state
      const { nextAst, nextSelectedIds } = lookAroundAssertionIt(
        ast,
        selectedIds,
        action.payload
      )
      return setAst(state, nextAst, { selectedIds: nextSelectedIds })
    }
    case ActionTypes.UPDATE_LOOKAROUND_ASSERTION: {
      const { ast, selectedIds } = state
      const { payload } = action
      if (payload) {
        const { kind, negate } = payload
        const { nextAst, nextSelectedIds } = updateLookAroundAssertion(
          ast,
          selectedIds,
          kind,
          negate
        )
        return setAst(state, nextAst, { selectedIds: nextSelectedIds })
      } else {
        const { nextAst, nextSelectedIds } = unLookAroundAssertion(
          ast,
          selectedIds
        )
        return setAst(state, nextAst, { selectedIds: nextSelectedIds })
      }
    }
    case ActionTypes.UPDATE_FLAGS: {
      const { ast } = state
      const { payload } = action
      const nextAst = updateFlags(ast, payload)
      return setAst(state, nextAst)
    }
    default:
      return state
  }
}
