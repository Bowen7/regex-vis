import React, { useState, useContext } from "react"
import { Input, Spacer } from "@geist-ui/react"
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
  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionTypes.EDIT_CHARACTER,
      payload: {
        val: { ...character, value: e.target.value } as StringCharacter,
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
          <Input
            size="small"
            value={character.value}
            onChange={handleStringValueChange}
          />
        )}
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
