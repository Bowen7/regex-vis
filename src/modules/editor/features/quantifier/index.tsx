import React, { useState, useEffect } from "react"
import { Checkbox, Select } from "@geist-ui/react"
import Cell from "@/components/cell"
import { Quantifier } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: Quantifier
}
const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const [times, setTimes] = useState("non")
  const [, dispatch] = useMainReducer()

  useEffect(() => {
    const { max, min } = quantifier
    if (max === 1 && min === 1) {
      setTimes("non")
    } else if (max === 1 && min === 0) {
      setTimes("?")
    } else if (max === Infinity && min === 0) {
      setTimes("*")
    } else if (max === Infinity && min === 1) {
      setTimes("+")
    }
  }, [quantifier])

  const handleChange = (value: string | string[]) => {
    const quantifier = { max: 1, min: 1 }
    if (value === "?") {
      quantifier.min = 0
    } else if (value === "*") {
      quantifier.min = 0
      quantifier.max = Infinity
    } else if (value === "+") {
      quantifier.max = Infinity
    }
    dispatch({ type: MainActionTypes.UPDATE_QUANTIFIER, payload: quantifier })
  }
  return (
    <>
      <Cell label="Quantifier">
        <Cell.Item label="times">
          <Select
            value={times}
            onChange={handleChange}
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

export default QuantifierItem
