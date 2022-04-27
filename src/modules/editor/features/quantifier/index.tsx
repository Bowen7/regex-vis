import React, { useState, useEffect, useRef } from "react"
import { Select, Spacer, Checkbox, useToasts } from "@geist-ui/core"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import Cell from "@/components/cell"
import RangeInput from "@/components/range-input"
import { AST } from "@/parser"
import { dispatchUpdateQuantifier } from "@/atom"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: AST.Quantifier | null
  node: AST.Node
}

const QuantifierItem: React.FC<Props> = ({ quantifier, node }) => {
  const quantifierRef = useRef<AST.Quantifier | null>(quantifier)
  const [kind, setKind] = useState("non")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [minPlaceholder, setMinPlaceholder] = useState("")
  const [maxPlaceholder, setMaxPlaceholder] = useState("")
  const { setToast } = useToasts()

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
    if (
      node.type === "character" &&
      node.kind === "string" &&
      node.value.length > 1 &&
      value !== "non"
    ) {
      setToast({ text: "Group selection automatically" })
    }
    const greedy = quantifier?.greedy || true
    let nextQuantifier: AST.Quantifier | null = null
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
      dispatchUpdateQuantifier(nextQuantifier)
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
    dispatchUpdateQuantifier({
      kind: "custom",
      min: Number(min),
      max: Number(max),
      greedy,
    })
  }

  const handleGreedyChange = (e: CheckboxEvent) => {
    const greedy = e.target.checked
    dispatchUpdateQuantifier({
      ...(quantifierRef.current as AST.Quantifier),
      greedy,
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
              <Spacer h={0.5} />
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
            <Checkbox
              checked={quantifier?.greedy}
              onChange={handleGreedyChange}
            >
              greedy
            </Checkbox>
          </Cell.Item>
        )}
      </Cell>
    </>
  )
}

export default QuantifierItem
