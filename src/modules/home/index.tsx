import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme, useToasts } from "@geist-ui/react"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import RegexInput from "./regex-input"
import {
  editorCollapsedAtom,
  astAtom,
  useAtomValue,
  dispatchUpdateFlags,
  setToastsAtom,
} from "@/atom"

const Home: React.FC<{}> = () => {
  const history = useHistory()
  const location = useLocation()
  const [regex, setRegex] = useState<string>(
    () => new URLSearchParams(location.search).get("r") || ""
  )

  const [, setToasts] = useToasts()
  useEffect(() => {
    if (new URLSearchParams(location.search).get("r") === null) {
      setRegex("")
    }
  }, [location])
  useEffect(() => setToastsAtom.setState(setToasts), [setToasts])
  useEffect(() => {
    // update url search
    const nextParams = new URLSearchParams()
    if (regex !== "") {
      nextParams.append("r", regex)
    }
    history.push({ search: nextParams.toString() })
  }, [regex, history])

  const editorCollapsed = useAtomValue(editorCollapsedAtom)
  const ast = useAtomValue(astAtom)
  const { palette } = useTheme()

  const style = editorCollapsed || regex === null ? { width: "100%" } : {}

  const handleFlagsChange = (flags: string[]) => dispatchUpdateFlags(flags)

  return (
    <>
      <div className="wrapper" style={style}>
        {regex !== "" && (
          <div className="graph">
            <div className="content">
              <Graph regex={regex} onChange={setRegex} />
            </div>
          </div>
        )}
        <RegexInput
          regex={regex}
          flags={ast.flags}
          onChange={setRegex}
          onFlagsChange={handleFlagsChange}
        />
      </div>
      {regex !== null && <Editor />}
      <style jsx>{`
        .wrapper {
          width: calc(100% - 275px);
          height: calc(100vh - 64px);
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
