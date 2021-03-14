import React, { useState, useContext, useEffect, useCallback } from "react"
import { Spacer, Select, Code, AutoComplete } from "@geist-ui/react"
import RadioGroup from "@/components/radio-group"
import RangeOption from "@/components/range-option"
import Cell from "@/components/cell"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { charactersOptions } from "./helper"
import { CharacterClassKey } from "@/parser/utils/character-class"
import { Character, ClassCharacter, Range } from "@/types"
import VisContext from "../../../context"
import { ActionTypes } from "@/reducers/vis"
import { classOptions } from "./helper"
type Prop = {
  character: Character
  id: string
}
const Characters: React.FC<Prop> = ({ character, id }) => {
  const { dispatch } = useContext(VisContext)

  const [setString, stringBindings] = useDebounceInput(
    (value: string) =>
      dispatch({
        type: ActionTypes.EDIT_CHARACTER,
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

  const handleTypeChange = (type: string) => {
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
      type: ActionTypes.EDIT_CHARACTER,
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
      type: ActionTypes.EDIT_CHARACTER,
      payload: {
        val,
      },
    })
  }
  return (
    <>
      <Cell label="Characters:">
        <RadioGroup
          value={character.type}
          options={charactersOptions}
          onChange={handleTypeChange}
        />
        <Spacer y={0.5} />
        {character.type === "string" && (
          <Input size="small" {...stringBindings} />
        )}
        {character.type === "ranges" &&
          ranges.map((range, index) => (
            <>
              {index !== 0 && (
                <>
                  <Spacer inline />
                  <span>or</span>
                  <Spacer inline />
                </>
              )}
              <RangeOption range={range} />
            </>
          ))}
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
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
