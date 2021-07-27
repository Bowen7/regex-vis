import React, { useEffect } from "react"
import { Select, Spacer } from "@geist-ui/react"
import Input from "@/components/input"
import { groupData } from "./helper"
import { AST } from "@/parser"
import Cell from "@/components/cell"
import { useDebounceInput } from "@/utils/hooks"
import { useMainReducer, MainActionTypes } from "@/redux"

type GroupSelectProps = {
  group: AST.Group | { kind: "nonGroup" }
}

const GroupSelect: React.FC<GroupSelectProps> = ({ group }) => {
  const { kind } = group
  const [, dispatch] = useMainReducer()

  const handleGroupChange = (kind: AST.GroupKind | "nonGroup", name = "") => {
    let payload: AST.Group | null = null
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
    handleGroupChange(value as AST.GroupKind | "nonGroup")

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
