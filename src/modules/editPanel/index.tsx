import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Fieldset } from "@geist-ui/react"
import { Node } from "@types"
import InsertItem, { InsertDirection } from "./insertItem"
import InfoItem from "./infoItem"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection) => void
  onRemove?: () => void
  onGroup: (type: string, name: string) => void
}
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  margin: 24px 0;
`
const Content = styled.div`
  width: 800px;
`
const EditPanel: React.FC<Props> = props => {
  const { nodes, onInsert, onRemove, onGroup } = props

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
        <Fieldset.Group value="info">
          <Fieldset value="info" label="Information">
            <InfoItem nodes={nodes} onGroup={onGroup} />
          </Fieldset>
          <Fieldset value="insert" label="Insert Node">
            <InsertItem onInert={handleInsert} />
          </Fieldset>
        </Fieldset.Group>
      </Content>
    )
  }
  return (
    <Wrapper>
      {nodes.length > -1 ? (
        renderTabs()
      ) : (
        <p>You can select nodes on this diagram</p>
      )}
    </Wrapper>
  )
}

export default EditPanel
