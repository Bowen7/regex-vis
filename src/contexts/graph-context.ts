import React from "react"

export const GraphContext = React.createContext<{
  recordLayoutEnable: boolean
  selectedIds: string[]
}>({
  recordLayoutEnable: false,
  selectedIds: [],
})
