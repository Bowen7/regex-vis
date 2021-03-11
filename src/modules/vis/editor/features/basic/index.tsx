import React, { useState, useContext, useEffect, useCallback } from "react"
import { Spacer, Button } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import Input from "@/components/input"
import { useDebounceInput } from "@/utils/hooks"
import { charactersOptions } from "./helper"
import { Character, StringCharacter } from "@/types"
import VisContext from "../../../context"
import { ActionTypes } from "@/reducers/vis"
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
        val = { type: "class", value: "." }
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
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
