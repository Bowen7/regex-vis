import React, { useState, useContext, useEffect } from "react"
import { Input, Spacer, Button } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import { charactersOptions } from "./helper"
import { Character, StringCharacter } from "@/types"
import VisContext from "../../../context"
import { ActionTypes } from "@/reducers/vis"
type Prop = {
  character: Character
}
const Characters: React.FC<Prop> = ({ character }) => {
  const { dispatch } = useContext(VisContext)
  const [edited, setEdited] = useState(false)
  const [stringValue, setStringValue] = useState("")

  useEffect(() => {
    if (!edited) {
      switch (character.type) {
        case "string": {
          setStringValue(character.value)
          break
        }
      }
    }
  }, [character, edited])

  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== stringValue) {
      setEdited(true)
    }
    setStringValue(e.target.value)
  }

  const handleApply = () => {
    let val!: StringCharacter
    switch (character.type) {
      case "string": {
        val = { ...character, value: stringValue }
        break
      }
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
          onChange={() => {}}
        />
        <Spacer y={0.5} />
        {character.type === "string" && (
          <>
            <Input
              size="small"
              value={stringValue}
              onChange={handleStringValueChange}
            />
            <Spacer inline />
            <Button auto size="small" onClick={handleApply}>
              Apply
            </Button>
          </>
        )}
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
