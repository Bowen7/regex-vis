import React, { useState, useRef, useMemo } from "react"
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
  const [error, setError] = useState<null | string>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const { palette } = useTheme()

  useClickAway(wrapRef, () => setFocused(false))
  const handleWrapperClick = () => setFocused(true)

  const borderColor = useMemo(() => {
    if (error) {
      return palette.error
    }
    if (focused) {
      return palette.success
    }
    return palette.accents_2
  }, [palette, focused, error])

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
      {error && <div className="error-msg">{error}</div>}
      <style jsx>{`
        .range-option {
          position: relative;
          display: inline-block;
          border: 1px solid ${borderColor};
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

        .error-msg {
          color: ${palette.error};
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
