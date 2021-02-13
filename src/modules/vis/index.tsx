import React, { useReducer, useMemo } from "react"
import { genInitialState, visReducer } from "@/reducers/vis"
import Container from "./container"

import VisContext from "./context"
type Prop = {
  defaultRegex: string
}
const Vis: React.FC<Prop> = ({ defaultRegex }) => {
  const initialState = useMemo(() => genInitialState(defaultRegex), [
    defaultRegex,
  ])
  const [state, dispatch] = useReducer(visReducer, initialState)
  return (
    <VisContext.Provider value={{ state, dispatch }}>
      <Container />
    </VisContext.Provider>
  )
}

export default Vis
