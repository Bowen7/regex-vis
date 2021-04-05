import React, { useState, useRef } from "react"
import { useClickAway, useTheme } from "@geist-ui/react"
import { Trash2 } from "@geist-ui/react-icons"
import { Range } from "@/types"
import RangeInput from "./input"
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
  const wrapRef = useRef<HTMLDivElement>(null)

  const { palette } = useTheme()

  useClickAway(wrapRef, () => setFocused(false))
  const handleWrapperClick = () => setFocused(true)

  return (
    <>
      <div ref={wrapRef} className="range-option" onClick={handleWrapperClick}>
        <RangeInput value={from} />
        {" - "}
        <RangeInput value={to} />
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
          width: 85px;
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
          height: 36px;
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
