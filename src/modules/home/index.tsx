import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme } from "@geist-ui/react"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import RegexInput from "./regex-input"
import { useMainReducer, MainActionTypes } from "@/redux"

const Home: React.FC<{}> = () => {
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const regex = params.get("r")

  const [{ editorCollapsed, ast }, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const style = editorCollapsed || regex === null ? { width: "100%" } : {}

  const handleChange = (nextRegex: string) => {
    console.log(123)
    if (regex === nextRegex) {
      return
    }
    const nextParams = new URLSearchParams()
    nextParams.append("r", nextRegex)
    history.push({ search: nextParams.toString() })
  }

  const handleFlagsChange = (flags: string[]) =>
    dispatch({ type: MainActionTypes.UPDATE_FLAGS, payload: flags })

  return (
    <>
      <div className="wrapper" style={style}>
        {regex !== null && (
          <div className="graph">
            <div className="content">
              <Graph regex={regex} onChange={handleChange} />
            </div>
          </div>
        )}
        <RegexInput
          regex={regex}
          flags={ast.flags}
          onChange={handleChange}
          onFlagsChange={handleFlagsChange}
        />
      </div>
      {regex !== null && <Editor />}
      <style jsx>{`
        .wrapper {
          width: calc(100% - 275px);
          height: calc(100vh - 72px);
          background: ${palette.accents_1};
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: width 0.3s ease-out;
        }
        ::-webkit-scrollbar {
          display: none;
        }

        .graph {
          flex: 1;
          display: flex;
          overflow: auto;
          border-bottom: 1px solid ${palette.accents_2};
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
