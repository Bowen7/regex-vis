import React, { useState, useEffect } from "react"
import { Checkbox, Select, Spacer } from "@geist-ui/react"
import Cell from "@/components/cell"
import RangeInput from "@/components/range-input"
import { Quantifier } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: Quantifier | null
}

const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const [kind, setKind] = useState("non")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [minPlaceholder, setMinPlaceholder] = useState("")
  const [maxPlaceholder, setMaxPlaceholder] = useState("")
  const [, dispatch] = useMainReducer()

  useEffect(() => {
    if (!quantifier) {
      setKind("non")
      return
    }
    if (quantifier.kind === "custom") {
      const { min, max } = quantifier
      setMin(min + "")
      setMax(max + "")
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

  const validateCustomRange = (min: string, max: string): string | null => {
    if (min === "" && max === "") {
      return "At least one input is not empty"
    }

    const minNumber = Number(min)
    const maxNumber = Number(max)
    if (isNaN(minNumber) || isNaN(maxNumber)) {
      return "Only numbers can be entered"
    }

    if (!min && !max && minNumber > maxNumber) {
      return "Numbers out of order in the quantifier"
    }
    return null
  }

  const handleCustomRangeChange = (min: string, max: string) => {
    if (min === "") {
      setMinPlaceholder("0")
      min = "0"
    }
    if (max === "") {
      setMaxPlaceholder("Infinity")
      max = "Infinity"
    }
    dispatch({
      type: MainActionTypes.UPDATE_QUANTIFIER,
      payload: { kind: "custom", min: Number(min), max: Number(max) },
    })
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
          {kind === "custom" && (
            <>
              <Spacer y={0.5} />
              <RangeInput
                start={min}
                end={max}
                startPlaceholder={minPlaceholder}
                endPlaceholder={maxPlaceholder}
                onChange={handleCustomRangeChange}
                validate={validateCustomRange}
              />
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
