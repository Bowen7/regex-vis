import React, { useEffect } from "react"
import ChevronsRight from "@geist-ui/icons/chevronsRight"
import ChevronsLeft from "@geist-ui/icons/chevronsLeft"
import { Tabs, useTheme, Button } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useAtom, useSetAtom, useAtomValue } from "jotai"
import { useCurrentState } from "@/utils/hooks"
import EditTab from "./edit-tab"
import LegendTab from "./legend-tab"
import TestTab from "./test-tab"
import { useEvent, useUpdateEffect } from "react-use"
import {
  undoAtom,
  redoAtom,
  removeAtom,
  selectedIdsAtom,
  editorCollapsedAtom,
} from "@/atom"

export type Tab = "legend" | "edit" | "test"
type Props = { defaultTab: Tab }
const Editor = ({ defaultTab }: Props) => {
  const selectedIds = useAtomValue(selectedIdsAtom)
  const [editorCollapsed, setEditorCollapsed] = useAtom(editorCollapsedAtom)
  const remove = useSetAtom(removeAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)

  const [tabValue, setTabValue, tabValueRef] = useCurrentState<Tab>(defaultTab)

  const { palette } = useTheme()

  const { t } = useTranslation()

  useUpdateEffect(() => {
    setTabValue(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    if (selectedIds.length > 0 && tabValueRef.current !== "edit") {
      setTabValue("edit")
    }
    if (selectedIds.length === 0 && tabValueRef.current === "edit") {
      setTabValue("legend")
    }
  }, [selectedIds, tabValueRef, setTabValue])

  const editDisabled = selectedIds.length === 0

  useEvent("keydown", (e: Event) => {
    const event = e as KeyboardEvent
    const { key } = event
    if (key === "Backspace" || key === "Delete") {
      e.preventDefault()
      return remove()
    }
    const metaKey = event.ctrlKey || event.metaKey
    if (metaKey && event.shiftKey && key === "z") {
      e.preventDefault()
      return redo()
    }
    if (metaKey && key === "z") {
      e.preventDefault()
      return undo()
    }
  })

  const collapseEditor = () => setEditorCollapsed(true)

  const unCollapseEditor = () => setEditorCollapsed(false)

  const containerClassName =
    "container" + (editorCollapsed ? " collapsed-container" : "")
  return (
    <>
      <div id="editor-container" className={containerClassName}>
        <Tabs
          value={tabValue}
          onChange={(value: string) => setTabValue(value as Tab)}
          hideDivider
        >
          <div className="content" id="editor-content">
            <Tabs.Item value="legend" label={t("Legends")}>
              <LegendTab />
            </Tabs.Item>
            <Tabs.Item value="edit" label={t("Edit")} disabled={editDisabled}>
              <EditTab />
            </Tabs.Item>
            <Tabs.Item value="test" label={t("Test")}>
              <TestTab />
            </Tabs.Item>
          </div>
        </Tabs>
        <footer onClick={collapseEditor}>
          <ChevronsRight color={palette.secondary} size={20} />
        </footer>
      </div>
      {editorCollapsed && (
        <span className="uncollapse-btn">
          <Button
            iconRight={<ChevronsLeft />}
            auto
            shadow
            onClick={unCollapseEditor}
          />
        </span>
      )}
      <style jsx>{`
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
      `}</style>
    </>
  )
}

export default Editor
