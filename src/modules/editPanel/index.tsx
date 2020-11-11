import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Tabs, Radio, Button } from "@geist-ui/react"
import { Node } from "@types"
import parser from "@parser"
import InsertItem, { InsertDirection, InsertType } from "./insertItem"
import PatternItem from "./patternItem"
import { insert } from "../flowchart/handler"
type Props = {
  nodes: Node[]
  onInsert?: (direction: InsertDirection, type: InsertType) => void
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
  const { nodes, onInsert } = props
  const [regex, setRegex] = useState<string>("")
  const [isRoot, setIsRoot] = useState<boolean>(false)
  useEffect(() => {
    if (nodes.length === 1) {
      const node = nodes[0]
      if (node.type === "root") {
        setIsRoot(true)
        return
      }
    }
    setIsRoot(false)
    if (nodes.length > 0) {
      const start = nodes[0]
      const end = nodes[nodes.length - 1]
      setRegex(parser.gen(start, end))
    }
  }, [nodes])
  function handleInsert(direction: InsertDirection, type: InsertType) {
    onInsert && onInsert(direction, type)
  }
  function renderTabs() {
    return (
      <Content>
        <Tabs initialValue="pattern" hideDivider>
          <Tabs.Item label="Pattern" value="pattern" disabled={isRoot}>
            <PatternItem regex={regex} />
          </Tabs.Item>
          <Tabs.Item label="Insert Node" value="insert">
            <InsertItem onInert={handleInsert} />
          </Tabs.Item>
          <Tabs.Item label="Replace Node" value="replace">
            <p>
              我们可以使用 CSS 这个语言来设计和布局我们的 Web
              内容，以及添加像动画一类的行为。
            </p>
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
