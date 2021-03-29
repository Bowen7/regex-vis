import React, { useState, useRef } from "react"
import {
  AutoComplete,
  Spacer,
  useClickAway,
  useTheme,
  Code,
} from "@geist-ui/react"
import { Trash2 } from "@geist-ui/react-icons"
import { Range } from "@/types"
import { fromRecommendedOptions, toRecommendedOptions } from "./options"
type Prop = {
  range: Range
}
type Option = {
  label: string
  value: string
}
const RangeOption: React.FC<Prop> = ({ range }) => {
  const { from, to } = range
  const [focused, setFocused] = useState(false)
  const [fromOptions, setFromOptions] = useState<Option[]>([])
  const [toOptions, setToOptions] = useState<Option[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)

  const { palette } = useTheme()

  useClickAway(wrapRef, () => setFocused(false))
  const handleWrapperClick = () => setFocused(true)

  const makeOption = (label: string, value: string) => (
    <AutoComplete.Option value={value}>
      <span>Recommended: </span>
      <Code>label</Code>
    </AutoComplete.Option>
  )

  const searchHandler = (type: "from" | "to", currentValue: string) => {
    if (currentValue === "") {
      if (type === "from") {
        setFromOptions(fromRecommendedOptions)
      } else {
        setToOptions(toRecommendedOptions)
      }
    }
  }

  return (
    <>
      <div ref={wrapRef} className="range-option" onClick={handleWrapperClick}>
        <AutoComplete
          value={from}
          size="small"
          options={fromOptions}
          disableFreeSolo
          onSearch={(value: string) => searchHandler("from", value)}
        />
        {" - "}
        <AutoComplete
          value={to}
          size="small"
          options={toOptions}
          disableFreeSolo
          onSearch={(value: string) => searchHandler("to", value)}
        />
        {focused && (
          <span className="operations">
            <Trash2 size={18} color="#333" />
          </span>
        )}
      </div>
      <style jsx>{`
        .range-option {
          position: relative;
          display: inline-block;
          border: 1px solid
            ${focused ? palette.successLight : palette.accents_2};
          border-radius: 5px;
        }
        .range-option :global(.auto-complete) {
          display: inline-block;
          width: 75px;
        }

        .range-option :global(.input-wrapper) {
          border: none;
        }
        .range-option :global(input) {
          text-align: center;
        }

        .operations {
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(100%, 0);
          display: flex;
          align-items: center;
          height: 32px;
          padding: 0 12px;
        }

        .operations :global(svg) {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
export default RangeOption
