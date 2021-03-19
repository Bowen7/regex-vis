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
      <div className="railroad">
        <div className="content">
          <Railroad
            regex={DEFAULT_REGEX}
            onChange={handleChange}
            onMount={handleMount}
          />
        </div>
      </div>
      <Editor />
      <style jsx>{`
        .railroad {
          width: calc(100% - 250px);
          height: calc(100vh - 144px);
          display: flex;
          overflow: auto;
        }

        .content {
          /* https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container */
          margin: auto;
          padding: 24px;
        }
      `}</style>
    </>
  )
}

export default Home
