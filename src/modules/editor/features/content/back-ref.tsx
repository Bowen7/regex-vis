import React, { useMemo } from "react"
import { Select } from "@geist-ui/react"
import { useMainReducer, MainActionTypes } from "@/redux"

type Props = { reference: string }
const BackRef: React.FC<Props> = ({ reference }) => {
  const [{ maxGroupIndex }, dispatch] = useMainReducer()

  const options = useMemo(() => {
    const refNum = Number(reference)
    const options = [...new Array(maxGroupIndex)].map((_, index) =>
      (index + 1).toString()
    )
    if (refNum > maxGroupIndex) {
      options.push(reference)
    }
    return options
  }, [maxGroupIndex, reference])

  const handleChange = (value: string | string[]) => {
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload: { kind: "backReference", ref: value as string },
    })
  }
  return (
    <>
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
    </>
  )
}

export default BackRef
