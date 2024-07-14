import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ViewVerticalIcon } from '@radix-ui/react-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffectOnce, useLocalStorage, useUpdateEffect } from 'react-use'
import { useCopyToClipboard } from 'usehooks-ts'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import RegexInput from './regex-input'
import { gen, parse } from '@/parser'
import Graph from '@/modules/graph'
import type { Tab } from '@/modules/editor'
import Editor from '@/modules/editor'
import { useCurrentState } from '@/utils/hooks'
import { genPermalink } from '@/utils/helpers'
import {
  SEARCH_PARAM_ESCAPE_BACKSLASH,
  SEARCH_PARAM_REGEX,
  SEARCH_PARAM_TESTS,
  STORAGE_ESCAPE_BACKSLASH,
  STORAGE_TEST_CASES,
} from '@/constants'
import {
  astAtom,
  clearSelectedAtom,
  updateFlagsAtom,
} from '@/atom'
import { useToast } from '@/components/ui/use-toast'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Toggle } from '@/components/ui/toggle'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorCollapsed, setEditorCollapsed] = useState(false)
  const [ast, setAst] = useAtom(astAtom)
  const clearSelected = useSetAtom(clearSelectedAtom)
  const updateFlags = useSetAtom(updateFlagsAtom)
  // const { palette, type: themeType } = useTheme()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [, copy] = useCopyToClipboard()

  const [escapeBackslash, setEscapeBackslash] = useLocalStorage(
    STORAGE_ESCAPE_BACKSLASH,
    false,
  )
  const [, setCases] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [''])
  const shouldGenAst = useRef(true)
  const shouldParseRegex = useRef(true)

  const [editorDefaultTab, setEditorDefaultTab] = useState<Tab>('legend')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [regex, setRegex, regexRef] = useCurrentState<string>(
    () => searchParams.get(SEARCH_PARAM_REGEX) || '',
  )

  const { literal } = ast

  useEffect(() => {
    if (searchParams.get(SEARCH_PARAM_REGEX) === null) {
      setRegex('')
    }
  }, [searchParams, setRegex])

  useEffectOnce(() => {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (searchParams.get(SEARCH_PARAM_ESCAPE_BACKSLASH) === '1') {
      setEscapeBackslash(true)
    }
    nextSearchParams.delete(SEARCH_PARAM_ESCAPE_BACKSLASH)

    if (searchParams.get(SEARCH_PARAM_TESTS)) {
      try {
        const cases = JSON.parse(searchParams.get(SEARCH_PARAM_TESTS) || '')
        if (Array.isArray(cases) && cases.length > 0) {
          setEditorDefaultTab('test')
          setCases(cases)
        }
      } catch (error) {
        console.error(error)
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
    if (ast.type === 'regex') {
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
    if (regex !== '') {
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

  const handleFlagsChange = (flags: string[]) => updateFlags(flags)

  const handleEscapeBackslashChange = (escapeBackslash: boolean) =>
    setEscapeBackslash(escapeBackslash)

  const handleCopyPermalink = () => {
    const permalink = genPermalink(escapeBackslash!)
    copy(permalink)
    toast({ description: t('Permalink copied.') })
  }

  const graphShow = regex !== '' || (ast.body.length > 0 && !errorMsg)
  return (
    <>
      <div
        className="flex-1 flex"
      >
        <div className={clsx('flex-1 relative flex flex-col', { 'items-center': !graphShow })}>
          {graphShow && (
            <div className="flex-1">
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
          <Toggle
            size="sm"
            className="absolute top-2 right-2"
            pressed={!editorCollapsed}
            onPressedChange={(pressed: boolean) => setEditorCollapsed(!pressed)}
          >
            <ViewVerticalIcon />
          </Toggle>
        </div>
        {regex !== null && <Editor defaultTab={editorDefaultTab} collapsed={editorCollapsed} />}
      </div>
      {/* <style jsx>
        {`
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
          background-color: ${themeType === 'light'
            ? 'rgba(0 ,0 ,0 , 0.5)'
            : 'rgba(255, 255, 255, 0.25)'};
        }
        .content {
          https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
          margin: auto;
          padding: 24px;
        }
      `}
      </style> */}
    </>
  )
}

export default Home
