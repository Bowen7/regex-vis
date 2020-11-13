import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Tabs } from "@geist-ui/react"
import { Node } from "@types"
import InsertItem, { InsertDirection } from "./insertItem"
import InfoItem from "./infoItem"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection) => void
  onRemove?: () => void
}
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
`
const Content = styled.div`
  width: 500px;
`
const EditPanel: React.FC<Props> = props => {
  const { nodes, onInsert, onRemove } = props

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
        <Tabs initialValue="info" hideDivider>
          <Tabs.Item label="Information" value="info">
            <InfoItem nodes={nodes} />
          </Tabs.Item>
          <Tabs.Item label="Insert Node" value="insert">
            <InsertItem onInert={handleInsert} />
          </Tabs.Item>
        </Tabs>
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

export default EditPanel
