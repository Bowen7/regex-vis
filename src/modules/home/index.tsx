import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ViewVerticalIcon } from '@radix-ui/react-icons'
import { useAtom, useSetAtom, useAtomValue } from 'jotai'
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
  SEARCH_PARAM_REGEX,
  SEARCH_PARAM_TESTS,
  STORAGE_TEST_CASES,
  STORAGE_GRAPH_TIP_VISIBLE
} from '@/constants'
import {
  astAtom,
  clearSelectedAtom,
  updateFlagsAtom,
  selectedIdsAtom
} from '@/atom'
import { useToast } from '@/components/ui/use-toast'
import { Toggle } from '@/components/ui/toggle'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ArrowUpIcon } from "@radix-ui/react-icons"

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorCollapsed, setEditorCollapsed] = useState(false)
  const [ast, setAst] = useAtom(astAtom)
  const selectIds = useAtomValue(selectedIdsAtom)
  const clearSelected = useSetAtom(clearSelectedAtom)
  const updateFlags = useSetAtom(updateFlagsAtom)
  const { t } = useTranslation()
  const { toast } = useToast()
  const [, copy] = useCopyToClipboard()

  const [, setCases] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [''])
  const [graphTipVisible, setGraphTipVisible] = useLocalStorage<boolean>(STORAGE_GRAPH_TIP_VISIBLE, true)
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
    const ast = parse(regex)
    clearSelected()
    if (ast.type === 'regex') {
      setErrorMsg(null)
      setAst(ast)
      shouldGenAst.current = false
    } else {
      setErrorMsg(ast.message)
    }
  }, [regex, setAst, clearSelected])

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

  useEffect(() => {
    if(graphTipVisible && selectIds.length > 0) {
      setGraphTipVisible(false)
    }
  }, [selectIds, graphTipVisible, setGraphTipVisible])

  const handleFlagsChange = (flags: string[]) => updateFlags(flags)

  const handleCopyPermalink = () => {
    const permalink = genPermalink()
    copy(permalink)
    toast({ description: t('Permalink copied.') })
  }

  const graphShow = regex !== '' || (ast.body.length > 0 && !errorMsg)
  return (
    <div
      className="flex-1 flex min-h-0"
    >
      <div className={clsx('flex-1 relative flex flex-col min-w-0 bg-graph-bg', { 'justify-center': !graphShow })}>
        {graphShow && (
            <ScrollArea className="flex-1 min-h-0 h-full relative">
              {graphTipVisible && 
                <div className="absolute bg-graph-bg bottom-0 left-1/2 -translate-x-1/2 z-10 text-sm inline-flex items-center py-1">
                  <ArrowUpIcon className='w-4 h-4 mr-2'/>
                  {t('You can select nodes by dragging or clicking in the graph')}
                </div>
              }
              <div className="flex items-center justify-center p-8 h-full">
                <Graph regex={regex} ast={ast} errorMsg={errorMsg} />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )}
        <RegexInput
          regex={regex}
          literal={literal}
          flags={ast.flags}
          onChange={setRegex}
          onFlagsChange={handleFlagsChange}
          onCopy={handleCopyPermalink}
          className={clsx({ 'border-t': graphShow })}
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
  )
}

export default Home
