import React from "react"
import { Select, Spacer, Checkbox } from "@geist-ui/react"
import { CheckboxEvent } from "@geist-ui/react/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import { useMainReducer, MainActionTypes } from "@/redux"

type Props = {
  kind: "lookahead" | "lookbehind"
  negate: boolean
}
const LookAround: React.FC<Props> = ({ kind, negate }) => {
  const [, dispatch] = useMainReducer()

  const onSelectChange = (value: string | string[]) =>
    dispatch({
      type: MainActionTypes.UPDATE_LOOKAROUND_ASSERTION,
      payload: {
        kind: value as "lookahead" | "lookbehind",
        negate,
      },
    })
  const handleNegateChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    dispatch({
      type: MainActionTypes.UPDATE_LOOKAROUND_ASSERTION,
      payload: {
        kind: kind,
        negate,
      },
    })
  }
  const handleUnLookAround = () =>
    dispatch({
      type: MainActionTypes.UPDATE_LOOKAROUND_ASSERTION,
      payload: null,
    })

  return (
    <Cell
      label="LookAround"
      rightLabel="UnLookAround"
      onRightLabelClick={handleUnLookAround}
    >
      <Select
        value={kind}
        onChange={onSelectChange}
        getPopupContainer={() => document.getElementById("editor-content")}
        disableMatchWidth
      >
        <Select.Option value="lookahead">Lookahead assertion</Select.Option>
        <Select.Option value="lookbehind">Lookbehind assertion</Select.Option>
      </Select>
      <Spacer y={0.5} />
      <Checkbox checked={negate} onChange={handleNegateChange}>
        negate
      </Checkbox>
    </Cell>
  )
}

export default LookAround
