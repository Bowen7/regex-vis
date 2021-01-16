import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Fieldset } from "@geist-ui/react"
import { Node } from "@types"
import InsertTab, { InsertDirection } from "./tabs/insert"
import InfoTab from "./tabs/info"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection) => void
  onRemove?: () => void
  onGroup: (type: string, name: string) => void
}

type Tab = "guide" | "info" | "insert"
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  margin: 24px 0;
`
const Content = styled.div`
  width: 800px;
`

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
  function renderTabs() {
    return (
      <Content>
        <Fieldset.Group
          value={tabValue}
          onChange={(value: string) => setTabValue(value as Tab)}
        >
          <Fieldset value="info" label="Information">
            <InfoTab nodes={nodes} onGroup={onGroup} />
          </Fieldset>
          <Fieldset value="insert" label="Insert Node">
            <InsertTab onInert={handleInsert} />
          </Fieldset>
        </Fieldset.Group>
      </Content>
    )
  }
  return (
    <Wrapper>
      {nodes.length > 0 ? (
        renderTabs()
      ) : (
        <p>You can select nodes on this diagram</p>
      )}
    </Wrapper>
  )
}

export default Editor
