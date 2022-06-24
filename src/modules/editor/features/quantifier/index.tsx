import React, { useState, useEffect, useRef } from "react"
import { Select, Spacer, Checkbox } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { CheckboxEvent } from "@geist-ui/core/dist/checkbox/checkbox"
import { useSetAtom } from "jotai"
import Cell from "@/components/cell"
import RangeInput from "@/components/range-input"
import { AST } from "@/parser"
import { updateQuantifierAtom } from "@/atom"
import { quantifierOptions } from "./helper"
type Props = {
  quantifier: AST.Quantifier | null
}

const QuantifierItem: React.FC<Props> = ({ quantifier }) => {
  const { t } = useTranslation()
  const updateQuantifier = useSetAtom(updateQuantifierAtom)
  const quantifierRef = useRef<AST.Quantifier | null>(quantifier)
  const [kind, setKind] = useState("non")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [minPlaceholder, setMinPlaceholder] = useState("")
  const [maxPlaceholder, setMaxPlaceholder] = useState("")

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
      updateQuantifier(nextQuantifier)
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
    updateQuantifier({
      kind: "custom",
      min: Number(min),
      max: Number(max),
      greedy,
    })
  }

  const handleGreedyChange = (e: CheckboxEvent) => {
    const greedy = e.target.checked
    updateQuantifier({
      ...(quantifierRef.current as AST.Quantifier),
      greedy,
    })
  }
  return (
    <>
      <Cell label={t("Quantifier")}>
        <Cell.Item label={t("times")}>
          <Select
            value={kind}
            onChange={handleChange}
            getPopupContainer={() => document.getElementById("editor-content")}
            disableMatchWidth
          >
            {quantifierOptions.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                <span>{t(label)}</span>
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
              {t("greedy")}
            </Checkbox>
          </Cell.Item>
        )}
      </Cell>
    </>
  )
}

export default QuantifierItem
