import React from "react"
import { useTheme, ButtonDropdown } from "@geist-ui/react"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import { useMainReducer, MainActionTypes } from "@/redux"

type Prop = {
  ranges: AST.Range[]
}
const Ranges: React.FC<Prop> = ({ ranges }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const addRange = (newRanges: AST.Range[]) => {
    const payload: AST.RangesCharacter = {
      kind: "ranges",
      ranges: ranges.concat(newRanges),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload,
    })
  }

  const handleRangeChange = (index: number, range: AST.Range) => {
    // Todo: special action
    const payload: AST.RangesCharacter = {
      kind: "ranges",
      ranges: ranges.map((_range, _index) => {
        if (_index === index) {
          return range
        }
        return _range
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload,
    })
  }

  const handleRemove = (index: number) => {
    const payload: AST.RangesCharacter = {
      kind: "ranges",
      ranges: ranges.filter((_, _index) => {
        return index !== _index
      }),
      negate: false,
    }
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload,
    })
  }
  return (
    <Cell.Item label="Ranges">
      <div className="range-options">
        {ranges.map((range, index) => (
          <RangeOption
            range={range}
            key={index}
            onChange={(range: AST.Range) => handleRangeChange(index, range)}
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
            A Empty Range
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
    </Cell.Item>
  )
}

export default Ranges
