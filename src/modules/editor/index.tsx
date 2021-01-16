import React, { useState, useEffect } from "react"
import { Fieldset } from "@geist-ui/react"
import { Node } from "@types"
import InsertTab, { InsertDirection } from "./tabs/insert"
import InfoTab from "./tabs/info"
import GuideTab from "./tabs/guide"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection) => void
  onRemove?: () => void
  onGroup: (type: string, name: string) => void
}

type Tab = "guide" | "info" | "insert"

const Editor: React.FC<Props> = props => {
  const { nodes, onInsert, onRemove, onGroup } = props

  const [tabValue, setTabValue] = useState<Tab>("guide")

  if (nodes.length === 0 && tabValue !== "guide") {
    setTabValue("guide")
  }

  useEventListener("keydown", (e: Event) => {
    const { key } = e as KeyboardEvent
    if (key === "Backspace") {
      onRemove && onRemove()
    }
  })
  function handleInsert(direction: InsertDirection) {
    onInsert && onInsert(direction)
  }
  return (
    <>
      <div className="container">
        <Fieldset.Group
          value={tabValue}
          onChange={(value: string) => setTabValue(value as Tab)}
        >
          <Fieldset value="guide" label="Guide">
            <GuideTab />
          </Fieldset>
          <Fieldset value="info" label="Information">
            <InfoTab nodes={nodes} onGroup={onGroup} />
          </Fieldset>
          <Fieldset value="insert" label="Insert Node">
            <InsertTab onInert={handleInsert} />
          </Fieldset>
        </Fieldset.Group>
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
