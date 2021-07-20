import React, { createContext, Dispatch, useReducer } from "react"
import { InitialStateType, initialState, Action, reducer } from "./reducer"

export const Context = createContext<[InitialStateType, Dispatch<Action>]>([
  initialState,
  () => null,
])

const Provider: React.FC = ({ children }) => {
  const contextValue = useReducer(reducer, initialState)
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default Provider
