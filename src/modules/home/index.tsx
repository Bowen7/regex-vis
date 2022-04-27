import React, { useEffect, useState, useRef } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useTheme, useToasts } from "@geist-ui/core"
import { nanoid } from "nanoid"
import { parse, gen, AST } from "@/parser"
import { useUpdateEffect } from "react-use"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import RegexInput from "./regex-input"
import {
  editorCollapsedAtom,
  astAtom,
  useAtomValue,
  dispatchUpdateFlags,
  setToastsAtom,
  dispatchSetAst,
  dispatchClearSelected,
} from "@/atom"
const head: AST.RootNode = { id: nanoid(), type: "root" }
const tail: AST.RootNode = { id: nanoid(), type: "root" }

const Home: React.FC<{}> = () => {
  const history = useHistory()
  const location = useLocation()
  const editorCollapsed = useAtomValue(editorCollapsedAtom)
  const ast = useAtomValue(astAtom)
  const { palette } = useTheme()

  const regexRef = useRef("")
  const astRef = useRef(ast)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [regex, setRegex] = useState<string>(
    () => new URLSearchParams(location.search).get("r") || ""
  )
  const [isLiteral, setIsLiteral] = useState(
    () =>
      new URLSearchParams(location.search).get("l") === "1" ||
      localStorage.getItem("isLiteral") === "1"
  )
  const isLiteralRef = useRef(isLiteral)

  const { setToast } = useToasts()
  useEffect(() => {
    if (new URLSearchParams(location.search).get("r") === null) {
      setRegex("")
    }
  }, [location])

  useEffect(() => setToastsAtom.setState(setToast), [setToast])

  useEffect(() => {
    if (isLiteralRef.current === isLiteral && regex === regexRef.current) {
      return
    }
    isLiteralRef.current = isLiteral

    const ast = parse(regex, isLiteral)
    if (ast.type === "regex") {
      setErrorMsg(null)
      const { body } = ast
      const nextAst = { ...ast, body: [head, ...body, tail] }
      astRef.current = nextAst
      dispatchSetAst(nextAst)
    } else {
      dispatchClearSelected()
      setErrorMsg(ast.message)
    }
  }, [regex, isLiteral])

  useEffect(() => {
    // update url search
    const nextParams = new URLSearchParams()
    if (regex !== "") {
      nextParams.append("r", regex)
    }
    if (isLiteral) {
      nextParams.append("l", "1")
      localStorage.setItem("isLiteral", "1")
    } else {
      localStorage.removeItem("isLiteral")
    }
    history.push({ search: nextParams.toString() })
  }, [regex, history, isLiteral])

  useUpdateEffect(() => {
    if (ast !== astRef.current) {
      const nextRegex = gen(ast)
      regexRef.current = nextRegex
      setRegex(nextRegex)
    }
  }, [ast])

  const style = editorCollapsed || regex === null ? { width: "100%" } : {}

  const handleFlagsChange = (flags: string[]) => dispatchUpdateFlags(flags)

  return (
    <>
      <div className="wrapper" style={style}>
        {regex !== "" && (
          <div className="graph">
            <div className="content">
              <Graph regex={regex} ast={ast} errorMsg={errorMsg} />
            </div>
          </div>
        )}
        <RegexInput
          regex={regex}
          isLiteral={isLiteral}
          flags={ast.flags}
          onChange={setRegex}
          onIsLiteralChange={setIsLiteral}
          onFlagsChange={handleFlagsChange}
        />
      </div>
      {regex !== null && <Editor isLiteral={isLiteral} />}
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
