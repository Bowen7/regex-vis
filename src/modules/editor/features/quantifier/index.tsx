import React, { useState, useEffect } from "react"
import { Checkbox, Select } from "@geist-ui/react"
import Cell from "@/components/cell"
import { Quantifier } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: Quantifier | null
}
const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const [times, setTimes] = useState("non")
  const [, dispatch] = useMainReducer()

  useEffect(() => {
    if (!quantifier) {
      setTimes("non")
      return
    }
    if (quantifier.kind === "custom") {
    } else {
      const { kind } = quantifier
      setTimes(kind)
    }
  }, [quantifier])

  const handleChange = (value: string | string[]) => {
    let quantifier: Quantifier | null = null
    switch (value) {
      case "?":
        quantifier = { kind: "?", min: 0, max: 1 }
        break
      case "*":
        quantifier = { kind: "*", min: 0, max: Infinity }
        break
      case "+":
        quantifier = { kind: "+", min: 1, max: Infinity }
        break

      default:
        break
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
