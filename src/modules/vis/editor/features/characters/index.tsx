import React, { useState, useContext, useEffect, useCallback } from "react"
import { Spacer, Button } from "@geist-ui/react"
import debounce from "lodash/debounce"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import Input from "@/components/input"
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
  const [stringValue, setStringValue] = useState("")

  useEffect(() => {
    switch (character.type) {
      case "string": {
        setStringValue(character.value)
        break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStringValue(e.target.value)
    debouncedEditStringValue(e.target.value)
  }

  const debouncedEditStringValue = useCallback(
    debounce((value: string) => {
      console.log(123)
      dispatch({
        type: ActionTypes.EDIT_CHARACTER,
        payload: {
          val: {
            type: "string",
            value,
          },
        },
      })
    }, 500),
    [dispatch]
  )
  return (
    <>
      <Cell label="Characters:">
        <RadioGroup
          value={character.type}
          options={charactersOptions}
          onChange={() => {}}
        />
        <Spacer y={0.5} />
        {character.type === "string" && (
          <Input
            size="small"
            value={stringValue}
            onChange={handleStringValueChange}
          />
        )}
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
