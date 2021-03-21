import React, { useState, useRef } from "react"
import { AutoComplete, Spacer, useClickAway, useTheme } from "@geist-ui/react"
import { CheckInCircle, Trash2 } from "@geist-ui/react-icons"
import { Range } from "@/types"
type Prop = {
  range: Range
}
const RangeOption: React.FC<Prop> = ({ range }) => {
  const { from, to } = range
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useClickAway(wrapRef, () => setFocused(false))
  const handleWrapperClick = () => setFocused(true)

  const theme = useTheme()
  console.log(theme)
  return (
    <>
      <div ref={wrapRef} className="wrapper" onClick={handleWrapperClick}>
        <AutoComplete value={from} size="small" />
        {" - "}
        <AutoComplete value={to} size="small" />
        {focused && (
          <span className="operations">
            <CheckInCircle size={18} color="#333" />
            <Spacer inline x={0.5} />
            <Trash2 size={18} color="#333" />
          </span>
        )}
      </div>
      <style jsx>{`
        .wrapper {
          position: relative;
          display: inline-block;
          border: 1px solid ${focused ? "#0070F3" : "rgb(234, 234, 234)"};
          border-radius: 5px;
        }
        .wrapper :global(.auto-complete) {
          display: inline-block;
          width: 75px;
        }

        .wrapper :global(.input-wrapper) {
          border: none;
        }
        .wrapper :global(input) {
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
