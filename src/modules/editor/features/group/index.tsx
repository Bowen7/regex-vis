import React, { useEffect } from "react"
import { Select, Spacer } from "@geist-ui/react"
import Input from "@/components/input"
import { AST } from "@/parser"
import Cell from "@/components/cell"
import { useDebounceInput } from "@/utils/hooks"
import { useMainReducer, MainActionTypes } from "@/redux"

type GroupSelectProps = {
  group: AST.Group
}
export const groupOptions = [
  {
    value: "capturing",
    label: "Capturing Group",
  },
  {
    value: "nonCapturing",
    label: "Non-capturing group",
  },
  {
    value: "namedCapturing",
    label: "Named capturing group",
  },
]

const GroupSelect: React.FC<GroupSelectProps> = ({ group }) => {
  const { kind } = group
  const [, dispatch] = useMainReducer()

  const handleGroupChange = (kind: AST.GroupKind, name = "") => {
    let payload: AST.Group
    switch (kind) {
      case "capturing":
        payload = { kind, name: "", index: 0 }
        break
      case "namedCapturing":
        if (!name) {
          name = "name"
        }
        payload = { kind, name, index: 0 }
        break
      case "nonCapturing":
        payload = { kind: "nonCapturing" }
        break
    }
    dispatch({
      type: MainActionTypes.UPDATE_GROUP,
      payload,
    })
  }

  const [setName, nameBindings, cancelNameChange] = useDebounceInput(
    (value) => handleGroupChange(kind, value),
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

  const onSelectChange = (value: string | string[]) =>
    handleGroupChange(value as AST.GroupKind)

  const handleUnGroup = () =>
    dispatch({
      type: MainActionTypes.UPDATE_GROUP,
      payload: null,
    })

  return (
    <>
      <Cell
        label="Group"
        rightLabel="UnGroup"
        onRightLabelClick={handleUnGroup}
      >
        <Select
          value={kind}
          onChange={onSelectChange}
          getPopupContainer={() => document.getElementById("editor-content")}
          disableMatchWidth
        >
          {groupOptions.map(({ value, label }) => (
            <Select.Option value={value} key={value}>
              <span>{label}</span>
            </Select.Option>
          ))}
        </Select>
        {group.kind === "namedCapturing" && (
          <>
            <Spacer y={0.5} />
            <Input label="Group's name" {...nameBindings} />
          </>
        )}
      </Cell>
    </>
  )
}

export default GroupSelect
