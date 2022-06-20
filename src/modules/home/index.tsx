import React, { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useTheme, useCurrentState, useToasts } from "@geist-ui/core"
import { useAtomValue, useSetAtom, useAtom } from "jotai"
import { parse, gen } from "@/parser"
import { useUpdateEffect } from "react-use"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import {
  editorCollapsedAtom,
  astAtom,
  clearSelectedAtom,
  updateFlagsAtom,
  toastsAtom,
} from "@/atom"
import RegexInput from "./regex-input"

const Home: React.FC<{}> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const editorCollapsed = useAtomValue(editorCollapsedAtom)
  const [ast, setAst] = useAtom(astAtom)
  const clearSelected = useSetAtom(clearSelectedAtom)
  const updateFlags = useSetAtom(updateFlagsAtom)
  const setToasts = useSetAtom(toastsAtom)
  const { palette } = useTheme()
  const toasts = useToasts()

  const shouldGenAst = useRef(true)
  const shouldParseRegex = useRef(true)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [regex, setRegex, regexRef] = useCurrentState<string>(
    () => searchParams.get("r") || ""
  )
  const [isLiteral, setIsLiteral] = useState(
    () =>
      searchParams.get("l") === "1" || localStorage.getItem("isLiteral") === "1"
  )

  useEffect(() => {
    setToasts(toasts)
  }, [toasts, setToasts])

  useEffect(() => {
    if (searchParams.get("r") === null) {
      setRegex("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    if (!shouldParseRegex.current) {
      shouldParseRegex.current = true
      return
    }
    const ast = parse(regex, isLiteral)
    clearSelected()
    if (ast.type === "regex") {
      setErrorMsg(null)
      setAst(ast)
      shouldGenAst.current = false
    } else {
      setErrorMsg(ast.message)
    }
  }, [regex, isLiteral, setAst, clearSelected])

  useEffect(() => {
    // update url search
    const nextParams: { r?: string; l?: string } = {}
    if (regex !== "") {
      nextParams.r = regex
    }
    if (isLiteral) {
      nextParams.l = "1"
      localStorage.setItem("isLiteral", "1")
    } else {
      localStorage.removeItem("isLiteral")
    }
    setSearchParams(nextParams)
  }, [regex, setSearchParams, isLiteral])

  useUpdateEffect(() => {
    if (shouldGenAst.current) {
      const nextRegex = gen(ast)
      if (nextRegex !== regexRef.current) {
        setRegex(nextRegex)
        shouldParseRegex.current = false
      }
    } else {
      shouldGenAst.current = true
    }
  }, [ast])

  const style = editorCollapsed || regex === null ? { width: "100%" } : {}

  const handleFlagsChange = (flags: string[]) => updateFlags(flags)

  const graphShow = regex !== "" || ast.body.length > 0
  return (
    <>
      <div className="wrapper" style={style}>
        {graphShow && (
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
