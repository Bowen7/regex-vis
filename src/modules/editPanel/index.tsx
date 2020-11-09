import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Tabs, Radio, Button } from "@geist-ui/react"
import { Node, NodeMap } from "@types"
import parser from "@parser"
import InsertItem, { InsertDirection, InsertType } from "./insertItem"
import PatternItem from "./patternItem"
import { insert } from "../flowchart/handler"
type Props = {
  ids: number[]
  nodeMap: NodeMap
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
  const { ids, nodeMap, onInsert } = props
  const [regex, setRegex] = useState<string>("")
  const [isRoot, setIsRoot] = useState<boolean>(false)
  useEffect(() => {
    if (ids.length === 1) {
      const id = ids[0]
      const node = nodeMap.get(id) as Node
      if (node.type === "root") {
        setIsRoot(true)
        return
      }
    }
    setIsRoot(false)
    setRegex(parser.gen(nodeMap, ids))
  }, [ids, nodeMap])
  function handleInsert(direction: InsertDirection, type: InsertType) {
    onInsert && onInsert(direction, type)
  }
  function renderTabs() {
    return (
      <Content>
        <Tabs initialValue="insert" hideDivider>
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
      {ids.length > 0 ? (
        renderTabs()
      ) : (
        <p>You can select nodes on this diagram</p>
      )}
    </Wrapper>
  )
}

export default EditPanel
