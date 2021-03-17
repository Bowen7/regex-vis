import { Node, GroupKind, Character } from "@/types"
import { remove, insert, group, character } from "@/parser/utils"
export type InitialStateType = {
  activeId: string
  nodes: Node[]
  selectedIds: string[]
  undoStack: Node[][]
  redoStack: Node[][]
}

export const initialState: InitialStateType = {
  activeId: "",
  nodes: [],
  selectedIds: [],
  undoStack: [],
  redoStack: [],
}

export enum MainActionTypes {
  SET_ACTIVE_ID,
  INSERT,
  REMOVE,
  GROUP,
  SET_NODES,
  UNDO,
  REDO,
  SELECT_NODES,
  EDIT_CHARACTER,
}

export type Action =
  | {
      type: MainActionTypes.SET_ACTIVE_ID
      payload: { id: string }
    }
  | {
      type: MainActionTypes.INSERT
      payload: { direction: "prev" | "next" | "branch" }
    }
  | { type: MainActionTypes.REMOVE }
  | {
      type: MainActionTypes.GROUP
      payload: { groupType: GroupKind | "nonGroup"; groupName: string }
    }
  | { type: MainActionTypes.SET_NODES; payload: { nodes: Node[] } }
  | { type: MainActionTypes.UNDO }
  | { type: MainActionTypes.REDO }
  | {
      type: MainActionTypes.SELECT_NODES
      payload: { selected: string[] | string }
    }
  | {
      type: MainActionTypes.EDIT_CHARACTER
      payload: { val: Character }
    }

const setNodes = (
  state: InitialStateType,
  nextNodes: Node[],
  attachState: Partial<InitialStateType> = {}
) => {
  const { undoStack, nodes } = state
  undoStack.push(nodes)
  return {
    ...state,
    ...attachState,
    nodes: nextNodes,
    undoStack,
  }
}

export const reducer = (state: InitialStateType, action: Action) => {
  switch (action.type) {
    case MainActionTypes.SET_ACTIVE_ID: {
      const { id } = action.payload
      return { ...state, activeId: id }
    }
    case MainActionTypes.INSERT: {
      const { nodes, selectedIds } = state
      const { direction } = action.payload
      const nextNodes = insert(nodes, selectedIds, direction)
      return setNodes(state, nextNodes)
    }
    case MainActionTypes.REMOVE: {
      const { nodes, selectedIds } = state
      const nextNodes = remove(nodes, selectedIds)
      return setNodes(state, nextNodes, { selectedIds: [] })
    }
    case MainActionTypes.GROUP: {
      const { nodes, selectedIds } = state
      const { groupType, groupName } = action.payload
      const { nextNodes, nextSelectedIds } = group(
        nodes,
        selectedIds,
        groupType,
        groupName
      )
      return setNodes(state, nextNodes, { selectedIds: nextSelectedIds })
    }
    case MainActionTypes.SET_NODES: {
      const { undoStack, nodes } = state
      const { nodes: nextNodes } = action.payload
      undoStack.push(nodes)
      return setNodes(state, nextNodes, { undoStack })
    }
    case MainActionTypes.UNDO: {
      const { undoStack, redoStack, nodes } = state
      if (undoStack.length > 0) {
        const nextNodes = undoStack.pop()
        redoStack.push(nodes)
        return {
          ...state,
          nodes: nextNodes as Node[],
          undoStack,
          redoStack,
        }
      }
      return state
    }
    case MainActionTypes.REDO: {
      const { undoStack, redoStack, nodes } = state
      if (redoStack.length > 0) {
        const nextNodes = redoStack.pop()
        undoStack.push(nodes)
        return {
          ...state,
          nodes: nextNodes as Node[],
          undoStack,
          redoStack,
        }
      }
      return state
    }
    case MainActionTypes.SELECT_NODES: {
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
    case MainActionTypes.EDIT_CHARACTER: {
      const { nodes, selectedIds } = state
      const { val } = action.payload
      const id = selectedIds[0]
      const nextNodes = character(nodes, id, val)
      return setNodes(state, nextNodes)
    }
    default:
      return state
  }
}
