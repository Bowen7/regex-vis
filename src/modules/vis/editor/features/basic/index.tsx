import React, { useState, useContext, useEffect, useCallback } from "react"
import { Spacer, Select, Code } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { charactersOptions } from "./helper"
import { CharacterClassKey } from "@/parser/utils/character-class"
import { Character, ClassCharacter } from "@/types"
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

  useEffect(() => {
    switch (character.type) {
      case "string": {
        setString(character.value)
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleTypeChange = (type: string) => {
    let val!: Character
    switch (type) {
      case "string":
        val = { type: "string", value: stringBindings.value }
        break
      case "class":
        val = { type: "class", value: classValue }
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
        {character.type === "class" && (
          <Select
            value={classValue}
            onChange={handleClassValueChange}
            disableMatchWidth
          >
            {classOptions.map(({ value, text }) => (
              <Select.Option value={value} key={value}>
                <div>
                  {value}
                  <Spacer x={0.5} inline />
                  <Code>{text}</Code>
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
