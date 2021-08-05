import React, { useState, useEffect } from "react"
import ChevronsRight from "@geist-ui/react-icons/chevronsRight"
import ChevronsLeft from "@geist-ui/react-icons/chevronsLeft"
import { Tabs, useTheme, Button } from "@geist-ui/react"
import { useMainReducer, MainActionTypes } from "@/redux/"
import EditTab from "./edit-tab"
import LegendTab from "./legend-tab"
import TestTab from "./test-tab"
import { useEventListener } from "@/utils/hooks"

type Tab = "legend" | "edit" | "test"
const Editor: React.FC<{}> = () => {
  const [{ selectedIds, editorCollapsed }, dispatch] = useMainReducer()

  const [tabValue, setTabValue] = useState<Tab>("legend")

  const { palette } = useTheme()

  useEffect(() => {
    if (selectedIds.length === 0) {
      setTabValue("legend")
    } else {
      setTabValue("edit")
    }
  }, [selectedIds])

  const editDisabled = selectedIds.length === 0

  const remove = () => dispatch({ type: MainActionTypes.REMOVE })
  const undo = () => dispatch({ type: MainActionTypes.UNDO })
  const redo = () => dispatch({ type: MainActionTypes.REDO })

  useEventListener("keydown", (e: Event) => {
    const event = e as KeyboardEvent
    const { key } = event
    if (key === "Backspace") {
      return remove()
    }
    const metaKey = event.ctrlKey || event.metaKey
    if (metaKey && event.shiftKey && key === "z") {
      return redo()
    }
    if (metaKey && key === "z") {
      return undo()
    }
  })

  const collapseEditor = () =>
    dispatch({
      type: MainActionTypes.SET_EDITOR_COLLAPSED,
      payload: { collapsed: true },
    })

  const unCollapseEditor = () =>
    dispatch({
      type: MainActionTypes.SET_EDITOR_COLLAPSED,
      payload: { collapsed: false },
    })

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
            <Tabs.Item value="legend" label="Legends">
              <LegendTab />
            </Tabs.Item>
            <Tabs.Item value="edit" label="Edit" disabled={editDisabled}>
              <EditTab />
            </Tabs.Item>
            <Tabs.Item value="test" label="Test">
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
        .container :global(.tabs > header > .tab) {
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
