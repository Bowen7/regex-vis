import React, { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useTheme, useToasts, useClipboard } from "@geist-ui/core"
import { useAtomValue, useSetAtom, useAtom } from "jotai"
import { parse, gen } from "@/parser"
import { useUpdateEffect, useLocalStorage, useEffectOnce } from "react-use"
import { useTranslation } from "react-i18next"
import Graph from "@/modules/graph"
import Editor, { Tab } from "@/modules/editor"
import { useCurrentState } from "@/utils/hooks"
import { genPermalink } from "@/utils/helpers"
import {
  STORAGE_ESCAPE_BACKSLASH,
  STORAGE_TEST_CASES,
  SEARCH_PARAM_REGEX,
  SEARCH_PARAM_TESTS,
  SEARCH_PARAM_ESCAPE_BACKSLASH,
} from "@/constants"
import {
  editorCollapsedAtom,
  astAtom,
  clearSelectedAtom,
  updateFlagsAtom,
  toastsAtom,
} from "@/atom"
import RegexInput from "./regex-input"

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const editorCollapsed = useAtomValue(editorCollapsedAtom)
  const [ast, setAst] = useAtom(astAtom)
  const clearSelected = useSetAtom(clearSelectedAtom)
  const updateFlags = useSetAtom(updateFlagsAtom)
  const setToasts = useSetAtom(toastsAtom)
  const { palette, type: themeType } = useTheme()
  const { t } = useTranslation()
  const toasts = useToasts()
  const { copy } = useClipboard()

  const [escapeBackslash, setEscapeBackslash] = useLocalStorage(
    STORAGE_ESCAPE_BACKSLASH,
    false
  )
  const [, setCases] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [""])
  const shouldGenAst = useRef(true)
  const shouldParseRegex = useRef(true)

  const [editorDefaultTab, setEditorDefaultTab] = useState<Tab>("legend")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [regex, setRegex, regexRef] = useCurrentState<string>(
    () => searchParams.get(SEARCH_PARAM_REGEX) || ""
  )

  const { literal } = ast

  useEffect(() => {
    setToasts(toasts)
  }, [toasts, setToasts])

  useEffect(() => {
    if (searchParams.get(SEARCH_PARAM_REGEX) === null) {
      setRegex("")
    }
  }, [searchParams, setRegex])

  useEffectOnce(() => {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (searchParams.get(SEARCH_PARAM_ESCAPE_BACKSLASH) === "1") {
      setEscapeBackslash(true)
    }
    nextSearchParams.delete(SEARCH_PARAM_ESCAPE_BACKSLASH)

    if (searchParams.get(SEARCH_PARAM_TESTS)) {
      try {
        const cases = JSON.parse(searchParams.get(SEARCH_PARAM_TESTS) || "")
        if (Array.isArray(cases) && cases.length > 0) {
          setEditorDefaultTab("test")
          setCases(cases)
        }
      } catch (error) {
        console.log(error)
      }
      nextSearchParams.delete(SEARCH_PARAM_TESTS)
    }
    setSearchParams(nextSearchParams)
  })

  useEffect(() => {
    if (!shouldParseRegex.current) {
      shouldParseRegex.current = true
      return
    }
    const ast = parse(regex, { escapeBackslash })
    clearSelected()
    if (ast.type === "regex") {
      setErrorMsg(null)
      setAst(ast)
      shouldGenAst.current = false
    } else {
      setErrorMsg(ast.message)
    }
  }, [regex, escapeBackslash, setAst, clearSelected])

  useEffect(() => {
    // update url search
    const nextParams: { r?: string } = {}
    if (regex !== "") {
      nextParams.r = regex
    }
    setSearchParams(nextParams)
  }, [regex, setSearchParams])

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

  const handleEscapeBackslashChange = (escapeBackslash: boolean) =>
    setEscapeBackslash(escapeBackslash)

  const handleCopyPermalink = () => {
    const permalink = genPermalink(escapeBackslash!)
    copy(permalink)
    toasts.setToast({ text: t("Permalink copied.") })
  }

  const graphShow = regex !== "" || (ast.body.length > 0 && !errorMsg)
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
          literal={literal}
          escapeBackslash={escapeBackslash!}
          flags={ast.flags}
          onChange={setRegex}
          onFlagsChange={handleFlagsChange}
          onEscapeBackslashChange={handleEscapeBackslashChange}
          onCopy={handleCopyPermalink}
        />
      </div>
      {regex !== null && <Editor defaultTab={editorDefaultTab} />}
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
        .graph {
          flex: 1;
          display: flex;
          overflow: auto;
          border-bottom: 1px solid ${palette.accents_2};
        }
        .graph ::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 7px;
          height: 6px;
        }
        .graph ::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background-color: ${themeType === "light"
            ? "rgba(0 ,0 ,0 , 0.5)"
            : "rgba(255, 255, 255, 0.25)"};
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
