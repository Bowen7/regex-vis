import React from "react"
import { Tooltip, Input, Select, Spacer } from "@geist-ui/react"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import { groupData } from "./helper"
import { Group } from "@/types"
import Cell from "@/components/cell"
type GroupSelectProps = {
  group: Group
  onGroupChange: (groupType: string, groupName: string) => void
}

const GroupSelect: React.FC<GroupSelectProps> = ({ group, onGroupChange }) => {
  const { type } = group
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation()
    onGroupChange(type, e.target.value)
  }

  function onSelectChange(value: string | string[]) {
    onGroupChange(value as string, "name" in group ? group.name : "")
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  function onTipClick(e: React.MouseEvent) {
    e.preventDefault()
  }

  return (
    <>
      <Cell label="Group:">
        <Select value={type} onChange={onSelectChange} disableMatchWidth>
          {groupData.map(({ value, label, tip }) => (
            <Select.Option value={value} key={value}>
              <span>{label}</span>
              {tip && (
                <Tooltip
                  text={tip}
                  placement="right"
                  portalClassName="max-z-index"
                >
                  <span className="question-circle">
                    <QuestionCircle
                      size={16}
                      onClick={onTipClick}
                      cursor="pointer"
                    />
                  </span>
                </Tooltip>
              )}
            </Select.Option>
          ))}
        </Select>
        {group.type === "namedCapturing" && (
          <>
            <Spacer x={1} inline />
            <Input
              label="The capture group's name"
              value={group.name}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
            />
          </>
        )}
      </Cell>
      <style jsx>{`
        .question-circle > :global(svg) {
          vertical-align: middle;
          margin-left: 5px;
        }
      `}</style>
    </>
  )
}

export default GroupSelect
