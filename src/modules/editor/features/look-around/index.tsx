import React from "react"
import { Select, Spacer, Checkbox } from "@geist-ui/core"
import { useSetAtom } from "jotai"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import { updateLookAroundAtom } from "@/atom"

type Props = {
  kind: "lookahead" | "lookbehind"
  negate: boolean
}
const LookAround: React.FC<Props> = ({ kind, negate }) => {
  const updateLookAround = useSetAtom(updateLookAroundAtom)
  const onSelectChange = (value: string | string[]) =>
    updateLookAround({
      kind: value as "lookahead" | "lookbehind",
      negate,
    })
  const handleNegateChange = (e: CheckboxEvent) => {
    const negate = e.target.checked
    updateLookAround({
      kind: kind,
      negate,
    })
  }
  const handleUnLookAround = () => updateLookAround(null)

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
      <Spacer h={0.5} />
      <Checkbox checked={negate} onChange={handleNegateChange}>
        negate
      </Checkbox>
    </Cell>
  )
}

export default LookAround
