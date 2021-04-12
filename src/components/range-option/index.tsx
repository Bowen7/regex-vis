import React, { useState, useRef, useMemo } from "react"
import { useClickAway, useTheme } from "@geist-ui/react"
import { Trash2 } from "@geist-ui/react-icons"
import { Range } from "@/types"
import RangeInput from "./input"
import { RangeError } from "./utils"
type Prop = {
  range: Range
  onChange: (range: Range) => void
}
type Option = {
  label: string
  value: string
}
const RangeOption: React.FC<Prop> = ({ range, onChange }) => {
  const { from, to } = range
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const fromRef = useRef<string>(from)
  const toRef = useRef<string>(to)

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

  const handleInputChange = (key: "from" | "to", value: string) => {
    if (key === "from") {
      fromRef.current = value
    } else {
      toRef.current = value
    }
    let isOutOfOrder = false
    try {
      new RegExp(`[${fromRef.current}-${toRef.current}]`)
    } catch (error) {
      isOutOfOrder = true
    }
    if (isOutOfOrder) {
      return setError("The range out of order in character class")
    }
    setError(null)
    onChange({ from: fromRef.current, to: toRef.current })
  }

  const handleError = (error: RangeError) => {
    let err: null | string = null
    switch (error) {
      case RangeError.EMPTY_INPUT:
        err = "The range input can't be empty"
        break
      case RangeError.INVALID_RANGE:
        err = "Invalid range input"
        break
    }
    setError(err)
  }

  return (
    <>
      <div ref={wrapRef} className="range-option" onClick={handleWrapperClick}>
        <RangeInput
          value={from}
          onChange={(value: string) => handleInputChange("from", value)}
          onError={handleError}
        />
        {" - "}
        <RangeInput
          value={to}
          onChange={(value: string) => handleInputChange("to", value)}
          onError={handleError}
        />
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
