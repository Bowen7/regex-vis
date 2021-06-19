import React, { useState, useEffect } from "react"
import { Spacer, Select, Code, useTheme } from "@geist-ui/react"
import Input from "@/components/input"
import Cell from "@/components/cell"
import { useDebounceInput } from "@/utils/hooks"
import { options } from "./helper"
import { CharacterClassKey } from "@/parser/utils/character-class"
import { Character, ClassCharacter } from "@/types"
import { useMainReducer, MainActionTypes } from "@/redux"
import { classOptions, labelMap } from "./helper"
import Ranges from "./ranges"

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
        type: MainActionTypes.UPDATE_CHARACTER,
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
      case "string":
        if (stringBindings.value !== character.type) {
          setString(character.value)
        }
        break
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
      type: MainActionTypes.UPDATE_CHARACTER,
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
      type: MainActionTypes.UPDATE_CHARACTER,
      payload: {
        val,
      },
    })
  }
  return (
    <>
      <Cell label="Content">
        <Cell.Item label="Type">
          <Select
            value={character.type}
            onChange={handleTypeChange}
            getPopupContainer={() => document.getElementById("editor-content")}
            disableMatchWidth
          >
            {options.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                <div>{label}</div>
              </Select.Option>
            ))}
          </Select>
        </Cell.Item>

        <Cell.Item label={labelMap[character.type]}>
          {character.type === "string" && (
            <Input size="small" {...stringBindings} />
          )}

          {character.type === "ranges" && <Ranges ranges={character.value} />}
          {character.type === "class" && (
            <Select
              value={classValue}
              onChange={handleClassValueChange}
              getPopupContainer={() =>
                document.getElementById("editor-content")
              }
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
        </Cell.Item>
      </Cell>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
      `}</style>
    </>
  )
}

export default Characters
