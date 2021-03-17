import { useContext } from "react"
import { default as MainProvider, Context } from "./provider"
import { MainActionTypes } from "./reducer"

export const useMainReducer = () => useContext(Context)

export { MainProvider, MainActionTypes }
