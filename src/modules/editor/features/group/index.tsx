import React, { useEffect } from "react"
import { Input, Select, Spacer } from "@geist-ui/react"
import Guider from "@/components/guider"
import { groupData } from "./helper"
import { Group } from "@/types"
import Cell from "@/components/cell"
import { useDebounceInput } from "@/utils/hooks"
import { injectInput } from "@/utils/hoc"

const InjectedInput = injectInput<React.ComponentProps<typeof Input>>(Input)

type GroupSelectProps = {
  group: Group
  onGroupChange: (groupType: string, groupName: string) => void
}

const GroupSelect: React.FC<GroupSelectProps> = ({ group, onGroupChange }) => {
  const { type } = group

  const [setName, nameBindings, cancelNameChange] = useDebounceInput(
    (value) => {
      onGroupChange(type, value)
    },
    [type]
  )

  useEffect(() => {
    cancelNameChange && cancelNameChange()
    if (group.type === "namedCapturing") {
      setName(group.name)
    } else {
      setName("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  function onSelectChange(value: string | string[]) {
    onGroupChange(value as string, "name" in group ? group.name : "")
  }

  return (
    <>
      <Cell label="Group">
        <Select value={type} onChange={onSelectChange} disableMatchWidth>
          {groupData.map(({ value, label, tip }) => (
            <Select.Option value={value} key={value}>
              <span>{label}</span>
              {tip && <Guider size={16} title={label} content={tip} />}
            </Select.Option>
          ))}
        </Select>
        {group.type === "namedCapturing" && (
          <>
            <Spacer x={1} inline />
            <InjectedInput label="The capture group's name" {...nameBindings} />
          </>
        )}
      </Cell>
    </>
  )
}

export default GroupSelect
