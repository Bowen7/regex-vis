import React, { useMemo } from "react"
import { Spacer, Select, Code } from "@geist-ui/core"
import { useSetAtom } from "jotai"
import { useTranslation } from "react-i18next"
import Input from "@/components/input"
import Cell from "@/components/cell"
import { characterClassTextMap, CharacterClassKey } from "@/parser"
import { updateContentAtom } from "@/atom"

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (const key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

const xhhRegex = /^\\x[0-9a-fA-F]{2}$/
const uhhhhRegex = /^\\u[0-9a-fA-F]{4}$/

type Props = {
  value: string
}
const ClassCharacter: React.FC<Props> = ({ value }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)

  const classKind = useMemo(() => {
    if (xhhRegex.test(value)) {
      return "\\xhh"
    } else if (uhhhhRegex.test(value)) {
      return "\\uhhhh"
    }
    return value
  }, [value])

  const handleSelectChange = (value: string | string[]) => {
    value = value as string
    if (value === "\\xhh") {
      value = "\\x00"
    } else if (value === "\\uhhhh") {
      value = "\\u0000"
    }
    updateContent({
      kind: "class",
      value,
    })
  }

  const handleInputChange = (value: string) =>
    updateContent({
      kind: "class",
      value: value,
    })
  return (
    <Cell.Item label={t("Class")}>
      <Select
        value={classKind}
        onChange={handleSelectChange}
        getPopupContainer={() => document.getElementById("editor-content")}
        disableMatchWidth
      >
        {classOptions.map(({ value, text }) => (
          <Select.Option value={value} key={value}>
            <div>
              <Code>{value}</Code>
              <Spacer w={0.5} inline />
              {t(text)}
            </div>
          </Select.Option>
        ))}
      </Select>
      <Spacer h={1} />
      {classKind === "\\xhh" && (
        <Input
          value={value}
          validation={xhhRegex}
          onChange={handleInputChange}
        />
      )}
      {classKind === "\\uhhhh" && (
        <Input
          value={value}
          validation={uhhhhRegex}
          onChange={handleInputChange}
        />
      )}
    </Cell.Item>
  )
}

export default ClassCharacter
