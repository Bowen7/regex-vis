import React, { useCallback } from "react"
import { useTheme } from "@geist-ui/react"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import { Node } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
const DEFAULT_REGEX = `/([a-zA-Z0-9_-])*@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+(a|b)/`
// const DEFAULT_REGEX = `/x(?=aaa)/`

const Home: React.FC<{}> = () => {
  const handleChange = useCallback((regex: string) => console.log(regex), [])
  const [{ editorCollapsed }, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const handleMount = useCallback(
    (id: string, nodes: Node[]) =>
      dispatch({
        type: MainActionTypes.SET_ACTIVE_CHART,
        payload: { id, nodes, selectedIds: [] },
      }),
    [dispatch]
  )

  const style = editorCollapsed ? { width: "100%" } : {}

  return (
    <>
      <div className="graph" style={style}>
        <div className="content">
          <Graph
            regex={DEFAULT_REGEX}
            onChange={handleChange}
            onMount={handleMount}
          />
        </div>
      </div>
      <Editor />
      <style jsx>{`
        .graph {
          width: calc(100% - 275px);
          height: calc(100vh - 72px);
          background: ${palette.accents_1};
          display: flex;
          overflow: auto;
          transition: width 0.3s ease-out;
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
