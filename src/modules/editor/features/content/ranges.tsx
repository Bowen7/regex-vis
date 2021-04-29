import React, { useState, useEffect } from "react"
import { Spacer, useTheme, ButtonDropdown } from "@geist-ui/react"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import { Range, RangesCharacter } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"

type Prop = {
  ranges: Range[]
}
const Ranges: React.FC<Prop> = ({ ranges }) => {
  const [, dispatch] = useMainReducer()
  const { palette, layout } = useTheme()

  const addRange = (newRanges: Range[]) => {
    const val: RangesCharacter = {
      type: "ranges",
      value: ranges.concat(newRanges),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        val,
      },
    })
  }

  const handleRangeChange = (index: number, range: Range) => {
    // Todo: special action
    const val: RangesCharacter = {
      type: "ranges",
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
        val,
      },
    })
  }

  const handleRemove = (index: number) => {
    const val: RangesCharacter = {
      type: "ranges",
      value: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        val,
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
        <div className="dropdown">
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
              a-z
            </ButtonDropdown.Item>
            <ButtonDropdown.Item
              onClick={() => addRange([{ from: "A", to: "Z" }])}
            >
              A-Z
            </ButtonDropdown.Item>
          </ButtonDropdown>
        </div>
      </Cell.Item>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }

        .range-options > :global(.range-wrapper:not(:first-child)) {
          margin-top: 12px;
        }

        .dropdown :global(.btn-dropdown > button) {
          width: 186px;
          min-width: unset;
          padding: 0;
          height: calc(1.687 * 16pt);
        }

        .dropdown :global(details) {
          border-radius: 0 ${layout.radius} ${layout.radius} 0;
        }

        .dropdown :global(summary) {
          height: calc(1.687 * 16pt);
        }
      `}</style>
    </>
  )
}

export default Ranges
