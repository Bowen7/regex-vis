import React, { useMemo } from "react"
import { Select } from "@geist-ui/core"
import { useAtomValue, useSetAtom } from "jotai"
import Cell from "@/components/cell"
import { updateContentAtom, groupNamesAtom } from "@/atom"

type Props = { reference: string }
const BackRef: React.FC<Props> = ({ reference }) => {
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
    <Cell.Item label="Back Reference">
      <Select
        placeholder="Choose one"
        value={reference}
        onChange={handleChange}
        getPopupContainer={() => document.getElementById("editor-content")}
        disableMatchWidth
      >
        {options.map((option) => (
          <Select.Option value={option} key={option}>
            Group #{option}
          </Select.Option>
        ))}
      </Select>
    </Cell.Item>
  )
}

export default BackRef
