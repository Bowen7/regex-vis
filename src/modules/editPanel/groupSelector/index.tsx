import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Tooltip, Input, Button, Radio } from "@geist-ui/react"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import { Node } from "@types"
import { groupData, getGroupType, getGroupName } from "./helper"
const Wrapper = styled.div`
  text-align: center;
  margin-top: 24px;
`
type GroupSelectorProps = {
  nodes: Node[]
  onApply?: (type: string, name: string) => void
}

const GroupSelector: React.FC<GroupSelectorProps> = props => {
  const { nodes, onApply } = props
  const [groupType, setGroupType] = useState<string>("")
  const [name, setName] = useState<string>("")
  useEffect(() => {
    setGroupType(getGroupType(nodes))
    setName(getGroupName(nodes))
  }, [nodes])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation()
    setName(e.target.value)
  }
  function onRadioChange(value: React.ReactText) {
    setGroupType(value as string)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  function onTipClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
  }
  function handleApply() {
    onApply && onApply(groupType, name)
  }
  return (
    <>
      <Radio.Group
        value={groupType}
        useRow
        size="small"
        onChange={onRadioChange}
      >
        {groupData.map(item => (
          <Radio key={item.value} value={item.value}>
            <span>{item.label}</span>
            {item.tip && (
              <Tooltip text={item.tip}>
                <QuestionCircle
                  size={18}
                  onClick={onTipClick}
                  cursor="pointer"
                />
              </Tooltip>
            )}
          </Radio>
        ))}
      </Radio.Group>
      {groupType === "namedCapturing" && (
        <Wrapper>
          <Input
            label="The capture group's name"
            value={name}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
          />
        </Wrapper>
      )}
      <Wrapper>
        <Button onClick={handleApply}>Apply</Button>
      </Wrapper>
    </>
  )
}

export default GroupSelector
