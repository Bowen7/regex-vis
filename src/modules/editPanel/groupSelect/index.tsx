import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Tooltip, Input, Select, Spacer } from "@geist-ui/react"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import { Node } from "@types"
import { groupData, getGroupType, getGroupName } from "./helper"
type GroupSelectProps = {
  nodes: Node[]
}

const StyledQuestionCircle = styled(QuestionCircle)`
  vertical-align: middle;
  margin-left: 5px;
`
const GroupSelect: React.FC<GroupSelectProps> = props => {
  const { nodes } = props
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
  function onSelectChange(value: string | string[]) {
    setGroupType(value as string)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  function onTipClick(e: React.MouseEvent) {
    e.preventDefault()
  }
  return (
    <>
      <Select value={groupType} onChange={onSelectChange} disableMatchWidth>
        {groupData.map(({ value, label, tip }) => (
          <Select.Option value={value} key={value}>
            <span>{label}</span>
            {tip && (
              <Tooltip
                text={tip}
                placement="right"
                portalClassName="max-z-index"
              >
                <StyledQuestionCircle
                  size={16}
                  onClick={onTipClick}
                  cursor="pointer"
                />
              </Tooltip>
            )}
          </Select.Option>
        ))}
      </Select>
      {groupType === "namedCapturing" && (
        <>
          <Spacer x={1} inline />
          <Input
            label="The capture group's name"
            value={name}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
          />
        </>
      )}
    </>
  )
}

export default GroupSelect
