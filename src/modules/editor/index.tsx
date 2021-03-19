import React, { useState, useEffect } from "react"
import BookOpen from "@geist-ui/react-icons/bookOpen"
import Edit from "@geist-ui/react-icons/edit"
import CheckCircle from "@geist-ui/react-icons/checkCircle"
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
          <Tabs.Item
            value="legend"
            label={
              <>
                <Tooltip text="Legends" hideArrow type="secondary">
                  <BookOpen />
                </Tooltip>
              </>
            }
          >
            <LegendTab />
          </Tabs.Item>
          <Tabs.Item
            value="edit"
            label={
              <>
                <Tooltip text="Edit" hideArrow type="secondary">
                  <Edit />
                </Tooltip>
              </>
            }
            disabled={editDisabled}
          >
            <EditTab />
          </Tabs.Item>
          <Tabs.Item
            value="test"
            label={
              <>
                <Tooltip text="Test" hideArrow type="secondary">
                  <CheckCircle />
                </Tooltip>
              </>
            }
          >
            Todo
          </Tabs.Item>
        </Tabs>
      </div>
      <style jsx>{`
        .container {
          position: fixed;
          top: 72px;
          right: 0;
          height: calc(100% - 144px);
          overflow-y: auto;
          width: 250px;
          border: 1px solid ${palette.accents_2};
          border-style: solid none solid solid;
          border-radius: 5px 0 0 5px;
        }
      `}</style>
      <style jsx global>{`
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
