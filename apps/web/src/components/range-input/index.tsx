import React, { useState, useRef, useMemo } from "react"
import { useClickAway, useTheme } from "@geist-ui/core"
import Trash2 from "@geist-ui/icons/trash2"
import Input from "../input"
type Prop = {
  start: string
  end: string
  startPlaceholder?: string
  endPlaceholder?: string
  width?: number
  removable?: boolean
  controlled?: boolean
  onChange: (start: string, end: string) => void
  onRemove?: () => void
  validate?: (start: string, end: string) => null | string
}
const RangeOption: React.FC<Prop> = ({
  start,
  end,
  startPlaceholder = "",
  endPlaceholder = "",
  width = 186,
  removable = false,
  controlled = true,
  onChange,
  onRemove,
  validate,
}) => {
  const { palette } = useTheme()

  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const [defaultStart] = useState(start)
  const [defaultEnd] = useState(end)

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
    const error =
      (validate && validate(startRef.current, endRef.current)) || null
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
          <Input
            value={controlled ? start : defaultStart}
            placeholder={startPlaceholder}
            onChange={(value: string) => handleInputChange("start", value)}
          />
          <span>{" - "}</span>
          <Input
            value={controlled ? end : defaultEnd}
            placeholder={endPlaceholder}
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
