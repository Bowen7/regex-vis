import React, { useState, useEffect } from "react"
import { Checkbox, Select, AutoComplete, Spacer } from "@geist-ui/react"
import Cell from "@/components/cell"
import RangeInput from "@/components/range-input"
import { Quantifier } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: Quantifier | null
}
const maxOptions = [{ label: "Infinity", value: "Infinity" }]
const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const [kind, setKind] = useState("non")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [, dispatch] = useMainReducer()

  useEffect(() => {
    if (!quantifier) {
      setKind("non")
      return
    }
    if (quantifier.kind === "custom") {
    } else {
      const { kind } = quantifier
      setKind(kind)
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
    if (["non", "*", "?", "+"].includes(value as string)) {
      return dispatch({
        type: MainActionTypes.UPDATE_QUANTIFIER,
        payload: quantifier,
      })
    }
    setKind(value as string)
  }
  return (
    <>
      <Cell label="Quantifier">
        <Cell.Item label="times">
          <Select
            value={kind}
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
          {kind !== "custom" && (
            <>
              <Spacer y={0.5} />
              <RangeInput start="1" end="1" onChange={() => {}} />
            </>
          )}
        </Cell.Item>
        <Cell.Item label="greedy">
          <Checkbox initialChecked={true}>Greedy</Checkbox>
        </Cell.Item>
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default QuantifierItem
