import React, { useState, useEffect } from "react"
import { Spacer, useTheme, ButtonDropdown, Input } from "@geist-ui/react"
import RangeOption from "@/components/range-option"
import { Range, RangesCharacter } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"

type Prop = {
  ranges: Range[]
}
const Ranges: React.FC<Prop> = ({ ranges }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const addRange = () => {
    const val: RangesCharacter = {
      type: "ranges",
      value: [...ranges, { from: "", to: "" }],
      negate: false,
    }
    dispatch({
      type: MainActionTypes.EDIT_CHARACTER,
      payload: {
        val,
      },
    })
  }
  return (
    <>
      <div className="range-options">
        {ranges.map((range, index) => (
          <RangeOption range={range} key={index} />
        ))}
      </div>
      <Spacer />
      <ButtonDropdown size="small">
        <ButtonDropdown.Item main onClick={addRange}>
          Create A Empty Range
        </ButtonDropdown.Item>
      </ButtonDropdown>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
        .range-options > :global(.range-option:not(:last-child)) {
          margin-bottom: 12px;
        }
      `}</style>
    </>
  )
}

export default Ranges
