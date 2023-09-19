import React from "react"
import { Select, Spacer } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useSetAtom } from "jotai"
import Input from "@/components/input"
import { AST } from "@/parser"
import Cell from "@/components/cell"
import { updateGroupAtom } from "@/atom"

type GroupSelectProps = {
  group: AST.Group
}
export const groupOptions = [
  {
    value: "capturing",
    label: "Capturing group",
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
  const { t } = useTranslation()
  const updateGroup = useSetAtom(updateGroupAtom)
  const { kind } = group

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
    updateGroup(payload)
  }

  const handleGroupNameChange = (value: string) =>
    handleGroupChange(kind, value)

  const onSelectChange = (value: string | string[]) =>
    handleGroupChange(value as AST.GroupKind)

  const handleUnGroup = () => updateGroup(null)

  return (
    <>
      <Cell
        label={t("Group")}
        rightLabel={t("UnGroup")}
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
              <span>{t(label)}</span>
            </Select.Option>
          ))}
        </Select>
        {group.kind === "namedCapturing" && (
          <>
            <Spacer h={0.5} />
            <Input
              label="Group's name"
              value={group.name}
              onChange={handleGroupNameChange}
            />
          </>
        )}
      </Cell>
    </>
  )
}

export default GroupSelect
