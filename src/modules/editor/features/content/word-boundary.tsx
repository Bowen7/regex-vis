import React from "react"
import { Checkbox } from "@geist-ui/react"
import { CheckboxEvent } from "@geist-ui/react/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import { useMainReducer, MainActionTypes } from "@/redux"

type Props = {
  negate: boolean
}
const SimpleString: React.FC<Props> = ({ negate }) => {
  const [, dispatch] = useMainReducer()

  const handleChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload: {
        kind: "wordBoundaryAssertion",
        negate,
      },
    })
  }

  return (
    <Cell.Item label="Negate">
      <Checkbox checked={negate} onChange={handleChange}>
        negate
      </Checkbox>
    </Cell.Item>
  )
}

export default SimpleString
