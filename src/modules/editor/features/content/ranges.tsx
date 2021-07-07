import React from "react"
import { useTheme, ButtonDropdown } from "@geist-ui/react"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import { Range, RangesCharacter } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"

type Prop = {
  ranges: Range[]
}
const Ranges: React.FC<Prop> = ({ ranges }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const addRange = (newRanges: Range[]) => {
    const val: RangesCharacter = {
      kind: "ranges",
      value: ranges.concat(newRanges),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        value: val,
      },
    })
  }

  const handleRangeChange = (index: number, range: Range) => {
    // Todo: special action
    const val: RangesCharacter = {
      kind: "ranges",
      value: ranges.map((_range, _index) => {
        if (_index === index) {
          return range
        }
        return _range
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        value: val,
      },
    })
  }

  const handleRemove = (index: number) => {
    const val: RangesCharacter = {
      kind: "ranges",
      value: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        value: val,
      },
    })
  }
  return (
    <>
      <div className="range-options">
        {ranges.map((range, index) => (
          <RangeOption
            range={range}
            key={index}
            onChange={(range: Range) => handleRangeChange(index, range)}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
      <Cell.Item label="Create">
        <ButtonDropdown size="small">
          <ButtonDropdown.Item
            main
            onClick={() => addRange([{ from: "", to: "" }])}
          >
            A Hyphen Range
          </ButtonDropdown.Item>
          <ButtonDropdown.Item
            onClick={() => addRange([{ from: "a", to: "z" }])}
          >
            a - z
          </ButtonDropdown.Item>
          <ButtonDropdown.Item
            onClick={() => addRange([{ from: "A", to: "Z" }])}
          >
            A - Z
          </ButtonDropdown.Item>
        </ButtonDropdown>
      </Cell.Item>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }

        .range-options > :global(.range-wrapper:not(:first-child)) {
          margin-top: 12px;
        }
      `}</style>
    </>
  )
}

export default Ranges
