import React, { useCallback } from "react"
import { useTheme } from "@geist-ui/react"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import { useMainReducer } from "@/redux"
const DEFAULT_REGEX = `/^([a-zA-Z_])*?@[a-zA-Z](\\.[a-zA-Z-]{0,10})?(a|b)x(?=yyy)\\1/`
// const DEFAULT_REGEX = `/x(?=aaa)/`

const Home: React.FC<{}> = () => {
  const handleChange = useCallback((regex: string) => console.log(regex), [])
  const [{ editorCollapsed }] = useMainReducer()
  const { palette } = useTheme()

  const style = editorCollapsed ? { width: "100%" } : {}

  return (
    <>
      <div className="graph" style={style}>
        <div className="content">
          <Graph regex={DEFAULT_REGEX} onChange={handleChange} />
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
