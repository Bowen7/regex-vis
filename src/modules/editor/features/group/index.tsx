import React, { useEffect } from "react"
import { Select, Spacer } from "@geist-ui/react"
import Guider from "@/components/guider"
import Input from "@/components/input"
import { groupData } from "./helper"
import { AST } from "@/parser"
import Cell from "@/components/cell"
import { useDebounceInput } from "@/utils/hooks"

type GroupSelectProps = {
  group: AST.Group | { kind: "nonGroup" }
  onGroupChange: (groupType: string, groupName: string) => void
}

const GroupSelect: React.FC<GroupSelectProps> = ({ group, onGroupChange }) => {
  const { kind } = group

  const [setName, nameBindings, cancelNameChange] = useDebounceInput(
    (value) => {
      onGroupChange(kind, value)
    },
    [kind]
  )

  useEffect(() => {
    cancelNameChange && cancelNameChange()
    if (group.kind === "namedCapturing") {
      setName(group.name)
    } else {
      setName("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  function onSelectChange(value: string | string[]) {
    onGroupChange(value as string, "name" in group ? group.name : "")
  }

  return (
    <>
      <Cell label="Group">
        <Select
          value={kind}
          onChange={onSelectChange}
          getPopupContainer={() => document.getElementById("editor-content")}
          disableMatchWidth
        >
          {groupData.map(({ value, label, tip }) => (
            <Select.Option value={value} key={value}>
              <span>{label}</span>
              {tip && <Guider size={16} title={label} content={tip} />}
            </Select.Option>
          ))}
        </Select>
        {group.kind === "namedCapturing" && (
          <>
            <Spacer y={0.5} />
            <Input label="The capture group's name" {...nameBindings} />
          </>
        )}
      </Cell>
    </>
  )
}

export default GroupSelect
