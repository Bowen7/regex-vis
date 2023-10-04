import React, { useMemo } from "react"
import { Select } from "@geist-ui/core"
import { useAtomValue, useSetAtom } from "jotai"
import { useTranslation } from "react-i18next"
import Cell from "@/components/cell"
import { updateContentAtom, groupNamesAtom } from "@/atom"

type Props = { reference: string }
const BackRef: React.FC<Props> = ({ reference }) => {
  const { t } = useTranslation()
  const groupNames = useAtomValue(groupNamesAtom)
  const updateContent = useSetAtom(updateContentAtom)

  const options = useMemo(() => {
    if (groupNames.includes(reference)) {
      return groupNames
    }
    return [reference, ...groupNames]
  }, [groupNames, reference])

  const handleChange = (value: string | string[]) =>
    updateContent({ kind: "backReference", ref: value as string })
  return (
    <Cell.Item label={t("Back Reference")}>
      <Select
        placeholder={t("Choose one")}
        value={reference}
        onChange={handleChange}
        getPopupContainer={() => document.getElementById("editor-content")}
        disableMatchWidth
      >
        {options.map((option) => (
          <Select.Option value={option} key={option}>
            {t("Group")} #{option}
          </Select.Option>
        ))}
      </Select>
    </Cell.Item>
  )
}

export default BackRef
