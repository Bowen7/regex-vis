import React, { useState } from "react"
import { Checkbox, Select } from "@geist-ui/react"
import Cell from "@/components/cell"
import { quantifierOptions } from "./helper"
const Quantifier: React.FC<{}> = () => {
  const [times, setTimes] = useState("non")
  return (
    <>
      <Cell label="Quantifier">
        <Cell.Item label="times">
          <Select
            value={times}
            onChange={(value) => setTimes(value as string)}
            getPopupContainer={() => document.getElementById("editor-content")}
            disableMatchWidth
          >
            {quantifierOptions.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                <span>{label}</span>
              </Select.Option>
            ))}
          </Select>
        </Cell.Item>
        <Cell.Item label="greedy">
          <Checkbox initialChecked={true}>Greedy</Checkbox>
        </Cell.Item>
      </Cell>
    </>
  )
}

export default Quantifier
