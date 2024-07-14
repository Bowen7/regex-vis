import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEvent, useUpdateEffect } from 'react-use'
import clsx from 'clsx'
import EditTab from './edit-tab'
import LegendTab from './legend-tab'
import TestTab from './test-tab'
import { useCurrentState } from '@/utils/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  redoAtom,
  removeAtom,
  selectedIdsAtom,
  undoAtom,
} from '@/atom'
import { ScrollArea } from '@/components/ui/scroll-area'

export type Tab = 'legend' | 'edit' | 'test'
interface Props {
  defaultTab: Tab
  collapsed: boolean
}
function Editor({ defaultTab, collapsed }: Props) {
  const selectedIds = useAtomValue(selectedIdsAtom)
  const remove = useSetAtom(removeAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)

  const [tabValue, setTabValue, tabValueRef] = useCurrentState<Tab>(defaultTab)

  // const { palette } = useTheme()

  const { t } = useTranslation()

  useUpdateEffect(() => {
    setTabValue(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    if (selectedIds.length > 0 && tabValueRef.current !== 'edit') {
      setTabValue('edit')
    }
    if (selectedIds.length === 0 && tabValueRef.current === 'edit') {
      setTabValue('legend')
    }
  }, [selectedIds, tabValueRef, setTabValue])

  const editDisabled = selectedIds.length === 0

  useEvent('keydown', (e: Event) => {
    const event = e as KeyboardEvent
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
    <>
      <Tabs
        value={tabValue}
        onValueChange={(value: string) => setTabValue(value as Tab)}
        className={clsx('flex flex-col h-[calc(100vh-64px)] py-4 border-l transition-width', collapsed ? 'w-[0px]' : 'w-[300px]')}
      >
        <TabsList className="grid grid-cols-3 mx-4">
          <TabsTrigger value="legend">{t('Legends')}</TabsTrigger>
          <TabsTrigger value="edit" disabled={editDisabled}>{t('Edit')}</TabsTrigger>
          <TabsTrigger value="test">{t('Test')}</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <div className="w-[300px] p-4">
            <TabsContent value="legend">
              <LegendTab />
            </TabsContent>
            <TabsContent value="edit">
              <EditTab />
            </TabsContent>
            <TabsContent value="test">
              <TestTab />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
      {/* <style jsx>
        {`
        .container {
          position: fixed;
          top: 64px;
          right: 0;
          height: calc(100% - 64px);
          width: 275px;
          border-left: 1px solid ${palette.accents_2};
          transition: transform 0.3s ease-out;
        }
        .collapsed-container {
          transform: translateX(275px);
        }

        footer {
          height: 45px;
          text-align: center;
          line-height: 45px;
          border-top: 2px solid ${palette.accents_1};
          cursor: pointer;
        }
        footer :global(svg) {
          vertical-align: middle;
        }

        .uncollapse-btn :global(button) {
          position: fixed;
          right: 24px;
          bottom: 24px;
        }
        .uncollapse-btn :global(svg) {
          width: 20px;
          height: 20px;
        }
        .container > :global(.tabs) {
          height: calc(100% - 45px);
        }
        .container > :global(.tabs > .content) {
          height: calc(100% - 45px);
        }
        .content {
          position: relative;
          height: calc(100%);
          overflow-y: auto;
        }
        .container > :global(.tabs > header) {
          padding: 0 12px;
        }
        .container > :global(.tabs > header .highlight) {
          display: none;
        }
        .container :global(.tabs > header .tab) {
          width: 33.3%;
          margin: 0;
          justify-content: center;
          height: 45px;
        }
      `}
      </style> */}
    </>
  )
}

export default Editor
