import React, { useState, useEffect } from "react"
import ChevronsRight from "@geist-ui/react-icons/chevronsRight"
import { Tabs, useTheme, Tooltip } from "@geist-ui/react"
import { useMainReducer, MainActionTypes } from "@/redux/"
import EditTab from "./tabs/edit"
import LegendTab from "./tabs/legend"
import { useEventListener } from "@/utils/hooks"

type Tab = "legend" | "edit" | "test"

const Editor: React.FC<{}> = () => {
  const [{ selectedIds }, dispatch] = useMainReducer()

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
    if (metaKey && key === "z") {
      return undo()
    }
    if (metaKey && event.shiftKey && key === "z") {
      return redo()
    }
  })
  return (
    <>
      <div className="container">
        <Tabs
          value={tabValue}
          onChange={(value: string) => setTabValue(value as Tab)}
          hideDivider
        >
          <Tabs.Item value="legend" label="Legends">
            <LegendTab />
          </Tabs.Item>
          <Tabs.Item value="edit" label="Edit" disabled={editDisabled}>
            <EditTab />
          </Tabs.Item>
          <Tabs.Item value="test" label="Test">
            Todo
          </Tabs.Item>
        </Tabs>
        <footer>
          <ChevronsRight />
        </footer>
      </div>
      <style jsx>{`
        .container {
          position: fixed;
          top: 72px;
          right: 0;
          height: calc(100% - 72px);
          overflow-y: auto;
          width: 250px;
          border-left: 1px solid ${palette.accents_2};
        }
        footer {
          height: 45px;
          text-align: center;
          line-height: 45px;
          border-top: 2px solid ${palette.accents_1};
        }
        footer :global(svg) {
          vertical-align: middle;
        }

        .container :global(.tabs) {
          height: calc(100% - 45px);
        }
        .container :global(.content) {
          height: calc(100% - 45px);
          overflow: auto;
        }
        .container :global(header) {
          padding: 0 12px;
        }
        .container :global(.tab) {
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
