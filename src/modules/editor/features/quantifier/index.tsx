import React, { useState, useEffect, useRef } from "react"
import { Select, Spacer, Radio } from "@geist-ui/react"
import Cell from "@/components/cell"
import RangeInput from "@/components/range-input"
import { Quantifier } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: Quantifier | null
}

const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const quantifierRef = useRef<Quantifier | null>(quantifier)
  const [kind, setKind] = useState("non")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [minPlaceholder, setMinPlaceholder] = useState("")
  const [maxPlaceholder, setMaxPlaceholder] = useState("")
  const [, dispatch] = useMainReducer()
  useEffect(() => {
    quantifierRef.current = quantifier
    if (!quantifier) {
      setKind("non")
      return
    }
    if (quantifier.kind === "custom") {
      const { min, max } = quantifier
      setMin(min + "")
      setMax(max + "")
    }
    setKind(quantifier.kind)
  }, [quantifier])

  const handleChange = (value: string | string[]) => {
    const greedy = quantifier?.greedy || false
    let nextQuantifier: Quantifier | null = null
    switch (value) {
      case "?":
        nextQuantifier = { kind: "?", min: 0, max: 1, greedy }
        break
      case "*":
        nextQuantifier = { kind: "*", min: 0, max: Infinity, greedy }
        break
      case "+":
        nextQuantifier = { kind: "+", min: 1, max: Infinity, greedy }
        break
      default:
        break
    }
    if (["non", "*", "?", "+"].includes(value as string)) {
      return dispatch({
        type: MainActionTypes.UPDATE_QUANTIFIER,
        payload: nextQuantifier,
      })
    } else {
      setKind(value as string)
    }
  }

  const validateCustomRange = (min: string, max: string): string | null => {
    if (min === "" && max === "") {
      return "At least one input is not empty"
    }

    const minNumber = Number(min)
    const maxNumber = Number(max)
    if (
      isNaN(minNumber) ||
      isNaN(maxNumber) ||
      minNumber < 0 ||
      maxNumber < 0
    ) {
      return "Only positive numbers can be entered"
    }

    if (min && max && minNumber > maxNumber) {
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
    const greedy = quantifier?.greedy || false
    dispatch({
      type: MainActionTypes.UPDATE_QUANTIFIER,
      payload: { kind: "custom", min: Number(min), max: Number(max), greedy },
    })
  }

  const handleGreedyChange = (value: string | number) => {
    let greedy = true
    if (value === "non-greedy") {
      greedy = false
    }
    dispatch({
      type: MainActionTypes.UPDATE_QUANTIFIER,
      payload: { ...(quantifierRef.current as Quantifier), greedy },
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
                controlled={false}
                onChange={handleCustomRangeChange}
                validate={validateCustomRange}
              />
            </>
          )}
        </Cell.Item>
        {kind !== "non" && (
          <Cell.Item label="greedy">
            <div className="greedy">
              <Radio.Group
                useRow
                size="mini"
                value={quantifier?.greedy ? "greedy" : "non-greedy"}
                onChange={handleGreedyChange}
              >
                <Radio value="greedy">greedy</Radio>
                <Radio value="non-greedy">non-greedy</Radio>
              </Radio.Group>
            </div>
          </Cell.Item>
        )}
      </Cell>
      <style jsx>{`
        .greedy :global(.name) {
          font-weight: normal;
        }
      `}</style>
    </>
  )
}

export default QuantifierItem
