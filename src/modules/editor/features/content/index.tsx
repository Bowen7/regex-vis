import React, { useState, useEffect, useCallback } from "react"
import { Spacer, Select, Code, useTheme, ButtonDropdown } from "@geist-ui/react"
import PlusSquare from "@geist-ui/react-icons/plusSquare"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { options } from "./helper"
import { CharacterClassKey } from "@/parser/utils/character-class"
import { Character, ClassCharacter, Range } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { classOptions, labelMap } from "./helper"
type Prop = {
  character: Character
  id: string
}
const Characters: React.FC<Prop> = ({ character, id }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const [setString, stringBindings] = useDebounceInput(
    (value: string) =>
      dispatch({
        type: MainActionTypes.EDIT_CHARACTER,
        payload: {
          val: {
            type: "string",
            value,
          },
        },
      }),
    [dispatch]
  )

  const [classValue, setClassValue] = useState<CharacterClassKey>(".")
  const [ranges, setRanges] = useState<Range[]>([])

  useEffect(() => {
    switch (character.type) {
      case "string":
        if (stringBindings.value !== character.type) {
          setString(character.value)
        }
        break
      case "ranges":
        setRanges(character.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, character])

  const handleTypeChange = (type: string | string[]) => {
    let val!: Character
    switch (type) {
      case "string":
        val = { type: "string", value: stringBindings.value }
        break
      case "class":
        val = { type: "class", value: classValue }
        break
      case "ranges":
        val = { type: "ranges", value: [], negate: false }
        break
      default:
        return
    }
    dispatch({
      type: MainActionTypes.EDIT_CHARACTER,
      payload: {
        val: val as Character,
      },
    })
  }

  const handleClassValueChange = (value: string | string[]) => {
    setClassValue(value as CharacterClassKey)
    const val: ClassCharacter = {
      type: "class",
      value: value as string,
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
      <Cell label="Content">
        <h6>Type</h6>
        <Select
          value={character.type}
          onChange={handleTypeChange}
          disableMatchWidth
        >
          {options.map(({ value, label }) => (
            <Select.Option value={value} key={value}>
              <div>{label}</div>
            </Select.Option>
          ))}
        </Select>
        <Spacer y={0.5} />
        <h6>{labelMap[character.type]}</h6>
        {character.type === "string" && (
          <Input size="small" {...stringBindings} />
        )}

        {character.type === "ranges" && (
          <>
            <ButtonDropdown size="small">
              <ButtonDropdown.Item main>
                Create a empty range
              </ButtonDropdown.Item>
            </ButtonDropdown>
            <Spacer y={0.5} />
            <div className="range-options">
              {ranges.map((range, index) => (
                <RangeOption range={range} key={index} />
              ))}
            </div>
          </>
        )}
        {character.type === "class" && (
          <Select
            value={classValue}
            onChange={handleClassValueChange}
            disableMatchWidth
          >
            {classOptions.map(({ value, text }) => (
              <Select.Option value={value} key={value}>
                <div>
                  <Code>{value}</Code>
                  <Spacer x={0.5} inline />
                  {text}
                </div>
              </Select.Option>
            ))}
          </Select>
        )}
      </Cell>
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

export default Characters
