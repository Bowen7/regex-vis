import React, { useMemo } from "react"
import { Select } from "@geist-ui/react"
import Cell from "@/components/cell"
import { useMainReducer, MainActionTypes } from "@/redux"

type Props = { reference: string }
const BackRef: React.FC<Props> = ({ reference }) => {
  const [{ groupNames }, dispatch] = useMainReducer()

  const options = useMemo(() => {
    if (groupNames.includes(reference)) {
      return groupNames
    }
    return [reference, ...groupNames]
  }, [groupNames, reference])

  const handleChange = (value: string | string[]) => {
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload: { kind: "backReference", ref: value as string },
    })
  }
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
