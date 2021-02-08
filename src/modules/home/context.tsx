import { createContext, Dispatch } from "react"
import { InitialStateType, initialState, Action } from "@/reducers/home"
const HomeContext = createContext<{
  state: InitialStateType
  dispatch: Dispatch<Action>
}>({ state: initialState, dispatch: () => null })
export default HomeContext
