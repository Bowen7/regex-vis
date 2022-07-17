import React, { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useTheme, useToasts, useClipboard } from "@geist-ui/core"
import { useAtomValue, useSetAtom, useAtom } from "jotai"
import { parse, gen } from "@/parser"
import { useUpdateEffect, useLocalStorage, useEffectOnce } from "react-use"
import { useTranslation } from "react-i18next"
import Graph from "@/modules/graph"
import Editor from "@/modules/editor"
import { useCurrentState } from "@/utils/hooks"
import { genPermalink } from "@/utils/helpers"
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
  const { t } = useTranslation()
  const toasts = useToasts()
  const { copy } = useClipboard()

  const [escapeBackslash, setEscapeBackslash] = useLocalStorage(
    "escape-backslash",
    false
  )
  const [, setCases] = useLocalStorage<string[]>("test-case", [""])
  const shouldGenAst = useRef(true)
  const shouldParseRegex = useRef(true)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [regex, setRegex, regexRef] = useCurrentState<string>(
    () => searchParams.get("r") || ""
  )

  const { literal } = ast

  useEffect(() => {
    setToasts(toasts)
  }, [toasts, setToasts])

  useEffect(() => {
    if (searchParams.get("r") === null) {
      setRegex("")
    }
  }, [searchParams, setRegex])

  useEffectOnce(() => {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (searchParams.get("e") === "1") {
      nextSearchParams.delete("e")
      setEscapeBackslash(true)
    }

    if (searchParams.get("t")) {
      try {
        const cases = JSON.parse(searchParams.get("t") || "")
        setCases(cases)
      } catch (error) {
        console.log(error)
      }
      nextSearchParams.delete("t")
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
