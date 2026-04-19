import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import { useUpdateEffect } from 'react-use'
import { useEventListener } from 'usehooks-ts'
import clsx from 'clsx'
import EditTab from './edit-tab'
import LegendTab from './legend-tab'
import TestTab from './test-tab'
import ExecutorPanel from '@/components/executor-panel'
import PerformancePanel from '@/components/performance-panel'
import LibraryPanel from '@/components/library-panel'
import { useCurrentState } from '@/utils/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  redoAtom,
  removeAtom,
  selectedIdsAtom,
  undoAtom,
  highlightNodeIdAtom,
  stringPositionAtom,
  astAtom,
} from '@/atom'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { AST } from '@/parser'

export type Tab = 'legend' | 'edit' | 'test' | 'executor' | 'performance' | 'library'
type Props = {
  defaultTab: Tab
  collapsed: boolean
  onLoadRegex: (regex: string, flags: string[]) => void
}
function Editor({ defaultTab, collapsed, onLoadRegex }: Props) {
  const selectedIds = useAtomValue(selectedIdsAtom)
  const ast = useAtomValue(astAtom)
  const remove = useSetAtom(removeAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  const setHighlightNodeId = useSetAtom(highlightNodeIdAtom)
  const setStringPosition = useSetAtom(stringPositionAtom)

  const [tabValue, setTabValue, tabValueRef] = useCurrentState<Tab>(defaultTab)

  const { t } = useTranslation()

  const handleNodeHighlight = useCallback((nodeId: string | null) => {
    setHighlightNodeId(nodeId)
  }, [setHighlightNodeId])

  const handleStringPosition = useCallback((position: number) => {
    setStringPosition(position)
  }, [setStringPosition])

  useUpdateEffect(() => {
    setTabValue(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    if (selectedIds.length > 0 && tabValueRef.current !== 'edit') {
      setTabValue('edit')
    }
  }, [selectedIds, tabValueRef, setTabValue])

  const editDisabled = selectedIds.length === 0

  useEventListener('keydown', (e: Event) => {
    const event = e as KeyboardEvent
    const tagName = (event.target as HTMLElement)?.tagName
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      return
    }
    const { key } = event
    if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault()
      return remove()
    }
    const metaKey = event.ctrlKey || event.metaKey
    if (metaKey && event.shiftKey && key === 'z') {
      e.preventDefault()
      return redo()
    }
    if (metaKey && key === 'z') {
      e.preventDefault()
      return undo()
    }
  })

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value: string) => setTabValue(value as Tab)}
      className={clsx('flex flex-col h-[calc(100vh-64px)] py-4 border-l transition-width', collapsed ? 'w-[0px]' : 'w-[305px]')}
    >
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <ScrollArea className="w-full">
            <TabsList className="flex flex-wrap justify-start mx-4 mb-6 gap-1 min-w-max">
              <TabsTrigger value="legend" className="text-xs px-2 py-1">{t('Legends')}</TabsTrigger>
              <TabsTrigger
                value="edit"
                disabled={editDisabled}
                asChild={editDisabled}
                className={
                  clsx({ 'cursor-not-allowed': editDisabled }, '!pointer-events-auto text-xs px-2 py-1')
                }
              >
                {editDisabled
                  ? (
                      <TooltipTrigger>
                        {t('Edit')}
                      </TooltipTrigger>
                    )
                  : t('Edit')}
              </TabsTrigger>
              <TabsTrigger value="test" className="text-xs px-2 py-1">{t('Test')}</TabsTrigger>
              <TabsTrigger value="executor" className="text-xs px-2 py-1">{t('Step Executor')}</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs px-2 py-1">{t('Performance')}</TabsTrigger>
              <TabsTrigger value="library" className="text-xs px-2 py-1">{t('Library')}</TabsTrigger>
            </TabsList>
          </ScrollArea>
          <ScrollArea className="flex-1">
            <div className="w-[305px] p-4 pt-0">
              <TabsContent value="legend">
                <LegendTab />
              </TabsContent>
              <TabsContent value="edit">
                <EditTab />
              </TabsContent>
              <TabsContent value="test">
                <TestTab />
              </TabsContent>
              <TabsContent value="executor">
                <ExecutorPanel
                  ast={ast}
                  onNodeHighlight={handleNodeHighlight}
                  onStringPosition={handleStringPosition}
                />
              </TabsContent>
              <TabsContent value="performance">
                <PerformancePanel
                  ast={ast}
                  onNodeHighlight={handleNodeHighlight}
                />
              </TabsContent>
              <TabsContent value="library">
                <LibraryPanel onLoadRegex={onLoadRegex} />
              </TabsContent>
            </div>
          </ScrollArea>
          <TooltipContent>
            <p>{t('You have to select nodes first')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Tabs>
  )
}

export default Editor
