import produce from "immer"
import { AST } from "@/parser"
import {
  removeIt,
  insertIt,
  groupIt,
  quantifierIt,
  contentIt,
  visitTree,
} from "@/parser"
type GuideConfig = {
  visible: boolean
  title: string
  content: JSX.Element | string
}
export type InitialStateType = {
  ast: AST.Regex
  selectedIds: string[]
  maxGroupIndex: number
  undoStack: AST.Regex[]
  redoStack: AST.Regex[]
  editorCollapsed: Boolean
  guiderConfig: GuideConfig
}

export const initialState: InitialStateType = {
  ast: { type: "regex", body: [], flags: [] },
  selectedIds: [],
  maxGroupIndex: 0,
  undoStack: [],
  redoStack: [],
  editorCollapsed: false,
  guiderConfig: { visible: false, title: "", content: "" },
}

export enum ActionTypes {
  INSERT,
  REMOVE,
  UPDATE_GROUP,
  SET_AST,
  UNDO,
  REDO,
  SELECT_NODES,
  UPDATE_CONTENT,
  SET_EDITOR_COLLAPSED,
  UPDATE_GUIDE_CONFIG,
  UPDATE_QUANTIFIER,
}

export type Action =
  | {
      type: ActionTypes.INSERT
      payload: { direction: "prev" | "next" | "branch" }
    }
  | { type: ActionTypes.REMOVE }
  | {
      type: ActionTypes.UPDATE_GROUP
      payload: { groupType: AST.GroupKind | "nonGroup"; groupName: string }
    }
  | { type: ActionTypes.SET_AST; payload: { ast: AST.Regex } }
  | { type: ActionTypes.UNDO }
  | { type: ActionTypes.REDO }
  | {
      type: ActionTypes.SELECT_NODES
      payload: { selected: string[] | string }
    }
  | {
      type: ActionTypes.UPDATE_CONTENT
      payload:
        | { kind: "string" | "class"; value: string }
        | { kind: "ranges"; ranges: AST.Range[]; negate: boolean }
        | { kind: "backReference"; ref: string }
    }
  | { type: ActionTypes.SET_EDITOR_COLLAPSED; payload: { collapsed: boolean } }
  | { type: ActionTypes.UPDATE_GUIDE_CONFIG; payload: GuideConfig }
  | { type: ActionTypes.UPDATE_QUANTIFIER; payload: AST.Quantifier | null }

const refreshGroupIndex = (ast: AST.Regex) => {
  let groupIndex = 0
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
        }
      }
    })
  })
  return { maxGroupIndex: groupIndex, nextAst }
}

const setAst = (
  state: InitialStateType,
  nextAst: AST.Regex,
  attachState: Partial<InitialStateType> = {},
  shouldRefreshGroupIndex = false
): InitialStateType => {
  let { undoStack, ast, maxGroupIndex } = state
  if (shouldRefreshGroupIndex) {
    ;({ nextAst, maxGroupIndex } = refreshGroupIndex(nextAst))
  }
  if (!attachState.undoStack) {
    undoStack.push(ast)
  }
  return {
    ...state,
    ast: nextAst,
    maxGroupIndex,
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
      const { groupType, groupName } = action.payload
      const { nextAst, nextSelectedIds } = groupIt(
        ast,
        selectedIds,
        groupType,
        groupName
      )
      return setAst(state, nextAst, { selectedIds: nextSelectedIds }, true)
    }
    case ActionTypes.SET_AST: {
      const { undoStack, ast } = state
      const { ast: nextAst } = action.payload
      undoStack.push(ast)
      return setAst(state, nextAst, { undoStack }, true)
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
      const nextAst = contentIt(ast, id, payload)
      return setAst(state, nextAst)
    }
    case ActionTypes.SET_EDITOR_COLLAPSED: {
      const { collapsed } = action.payload
      return { ...state, editorCollapsed: collapsed }
    }
    case ActionTypes.UPDATE_GUIDE_CONFIG: {
      return { ...state, guiderConfig: action.payload }
    }
    case ActionTypes.UPDATE_QUANTIFIER: {
      const { ast, selectedIds } = state
      const nextAst = quantifierIt(ast, selectedIds[0], action.payload)
      return setAst(state, nextAst)
    }
    default:
      return state
  }
}
