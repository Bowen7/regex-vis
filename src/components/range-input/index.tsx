import React, { useState, useRef, useMemo } from "react"
import { useClickAway, useTheme } from "@geist-ui/react"
import { Trash2 } from "@geist-ui/react-icons"
import SingleInput from "./single-input"
type Prop = {
  start: string
  end: string
  removable?: boolean
  width?: number
  onChange: (start: string, end: string) => void
  onRemove?: () => void
  validate?: () => null | string
}
const RangeOption: React.FC<Prop> = ({
  start,
  end,
  removable = true,
  width = 186,
  onChange,
  onRemove,
  validate,
}) => {
  const { palette } = useTheme()

  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const wrapRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<string>(start)
  const endRef = useRef<string>(end)

  const borderColor = useMemo(() => {
    if (error) {
      return palette.error
    }
    if (focused) {
      return palette.success
    }
    return palette.accents_2
  }, [palette, focused, error])

  useClickAway(wrapRef, () => setFocused(false))
  const handleWrapperClick = () => setFocused(true)

  const handleInputChange = (key: "start" | "end", value: string) => {
    if (key === "start") {
      startRef.current = value
    } else {
      endRef.current = value
    }
    const error = (validate && validate()) || null
    setError(error)
    if (error === null) {
      onChange(startRef.current, endRef.current)
    }
  }
  return (
    <>
      <div
        ref={wrapRef}
        className="range-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="range-content"
          onClick={handleWrapperClick}
          style={{ width }}
        >
          <SingleInput
            value={start}
            onChange={(value: string) => handleInputChange("start", value)}
          />
          {" - "}
          <SingleInput
            value={end}
            onChange={(value: string) => handleInputChange("end", value)}
          />
        </div>
        {removable && (focused || hovered) && (
          <span className="operations">
            <Trash2 size={18} color={palette.accents_6} onClick={onRemove} />
          </span>
        )}
      </div>
      {error && <div className="error-msg">{error}</div>}
      <style jsx>{`
        .range-wrapper {
          display: flex;
          align-items: center;
        }
        .range-content {
          display: flex;
          align-items: center;
          border: 1px solid ${borderColor};
          border-radius: 5px;
        }

        .range-content :global(.input-wrapper) {
          border: none;
        }
        .range-content :global(input) {
          text-align: center;
        }

        .operations {
          display: inline-block;
          padding: 0 12px;
        }
        .operations > :global(svg) {
          vertical-align: middle;
        }

        .error-msg {
          color: ${palette.error};
        }
      `}</style>
    </>
  )
}
export default RangeOption
