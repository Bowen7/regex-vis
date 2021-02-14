import React, { useState, useEffect, useContext } from "react"
import BookOpen from "@geist-ui/react-icons/bookOpen"
import Edit from "@geist-ui/react-icons/edit"
import { Tabs } from "@geist-ui/react"
import { ActionTypes } from "@/reducers/vis"
import VisContext from "../context"
import EditTab from "./tabs/edit"
import LegendTab from "./tabs/legend"
import { useEventListener } from "../../../utils/hooks"

type Tab = "legend" | "edit"

const Editor: React.FC<{}> = () => {
  const {
    state: { selectedNodes: nodes },
    dispatch,
  } = useContext(VisContext)

  const [tabValue, setTabValue] = useState<Tab>("legend")

  useEffect(() => {
    if (nodes.length === 0) {
      setTabValue("legend")
    } else {
      setTabValue("edit")
    }
  }, [nodes])

  const editDisabled = nodes.length === 0

  const remove = () => dispatch({ type: ActionTypes.REMOVE })
  const undo = () => dispatch({ type: ActionTypes.UNDO })
  const redo = () => dispatch({ type: ActionTypes.REDO })

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
                <BookOpen />
                Legend
              </>
            }
          >
            <LegendTab />
          </Tabs.Item>
          <Tabs.Item
            value="edit"
            label={
              <>
                <Edit />
                Edit
              </>
            }
            disabled={editDisabled}
          >
            <EditTab />
          </Tabs.Item>
        </Tabs>
      </div>
      <style jsx>{`
        .container {
          width: 800px;
          margin: 24px auto;
        }
      `}</style>
    </>
  )
}

export default Editor
