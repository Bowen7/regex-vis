import React, { useCallback } from "react"
import Railroad from "@/modules/railroad"
import Editor from "@/modules/editor"
import { Node } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+(a|b)/`

const Home: React.FC<{}> = () => {
  const handleChange = useCallback((regex: string) => console.log(regex), [])
  const [, dispatch] = useMainReducer()

  const handleMount = useCallback(
    (id: string, nodes: Node[]) =>
      dispatch({
        type: MainActionTypes.SET_ACTIVE_CHART,
        payload: { id, nodes, selectedIds: [] },
      }),
    [dispatch]
  )

  return (
    <>
      <Railroad
        regex={DEFAULT_REGEX}
        onChange={handleChange}
        onMount={handleMount}
      />
      <Editor />
    </>
  )
}

export default Home
