import React from "react"
import styled from "styled-components"
import { Tabs } from "@geist-ui/react"
import { Node } from "@types"
type Props = {
  nodes?: Node[]
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
  return (
    <Wrapper>
      <Content>
        <Tabs initialValue="pattern" hideDivider>
          <Tabs.Item label="Pattern" value="pattern">
            <p>
              HTML
              是我们用来构造网站内容的不同部分并定义它们的意义或目的的语言。
            </p>
          </Tabs.Item>
          <Tabs.Item label="Insert Node" value="insert">
            <p>
              我们可以使用 CSS 这个语言来设计和布局我们的 Web
              内容，以及添加像动画一类的行为。
            </p>
          </Tabs.Item>
        </Tabs>
      </Content>
    </Wrapper>
  )
}

export default EditPanel
