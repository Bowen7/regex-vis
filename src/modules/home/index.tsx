import React, { useReducer } from "react"
import { initialState, homeReducer } from "@/reducers/home"
import HomeContainer from "./container"

import HomeContext from "./context"

const HomeProvider: React.FC<{}> = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState)
  return (
    <HomeContext.Provider value={{ state, dispatch }}>
      <HomeContainer />
    </HomeContext.Provider>
  )
}

export default HomeProvider
