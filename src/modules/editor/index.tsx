import React, { useState, useEffect } from "react"
import { Tabs } from "@geist-ui/react"
import { Node } from "@types"
import EditTab, { InsertDirection } from "./tabs/edit"
import GuideTab from "./tabs/guide"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection) => void
  onRemove?: () => void
  onGroup: (type: string, name: string) => void
}

type Tab = "guide" | "edit"

const Editor: React.FC<Props> = props => {
  const { nodes, onInsert = () => {}, onRemove, onGroup } = props

  const [tabValue, setTabValue] = useState<Tab>("guide")

  useEffect(() => {
    if (nodes.length === 0) {
      setTabValue("guide")
    } else {
      setTabValue("edit")
    }
  }, [nodes])
  const editDisabled = nodes.length === 0

  useEventListener("keydown", (e: Event) => {
    const { key } = e as KeyboardEvent
    if (key === "Backspace") {
      onRemove && onRemove()
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
          <Tabs.Item value="guide" label="Guide">
            <GuideTab />
          </Tabs.Item>
          <Tabs.Item value="edit" label="Selected" disabled={editDisabled}>
            <EditTab nodes={nodes} onGroup={onGroup} onInert={onInsert} />
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
